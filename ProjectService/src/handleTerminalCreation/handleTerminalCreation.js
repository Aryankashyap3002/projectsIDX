export const handleTerminalCreation = (container, ws) => {
    container.exec({
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: 'sandbox',
    }, (err, exec) => {
        if(err) {
            console.log("Error while creating exec", err);
            return;
        }

        exec.start({
            hijack: true,
        }, (err, stream) => {
            if(err) {
                console.log("Error while starting exec", err);
                return; // Added return here
            }

            processStreamOutput(stream, ws);

            ws.on('message', (data) => {
                stream.write(data);
            });
        })
    })
}

function processStreamOutput(stream, ws) {
    let nextDataType = null;
    let nextDataLength = null;
    let buffer = Buffer.from("");

    function processStreamData(data) { // Fixed typo: was "processStreamOutput"
        if(data) {
            buffer = Buffer.concat([buffer, data]); // Fixed typo: was "concate"
        }

        if(!nextDataType) {
            if(buffer.length >= 8) {
                const header = bufferSlicer(8);
                nextDataType = header.readUInt32BE(0);
                nextDataLength = header.readUInt32BE(4);

                processStreamData();
            }
        } else {
            if(buffer.length >= nextDataLength) {
                const content = bufferSlicer(nextDataLength);
                ws.send(content);
                nextDataLength = null;
                nextDataType = null;
                processStreamData()
            }
        }
    }

    function bufferSlicer(end) {
        const output = buffer.slice(0, end);
        buffer = Buffer.from(buffer.slice(end, buffer.length));
        return output;
    }

    stream.on("data", processStreamData); 
}