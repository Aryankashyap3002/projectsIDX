import { usePortStore } from "@/store/portStore";
import { useEffect, useRef } from "react";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { Input } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
// import { RotateCcw } from 'lucide-react';

export const Browser = ({ projectId }) => {
    const { port } = usePortStore();
    const { editorSocket } = useEditorSocketStore();

    const browserRef = useRef(null);

    useEffect(() => {
    if(!port && editorSocket) {
        const timer = setTimeout(() => {
            console.log("Port not found, fetching after delay");
            editorSocket.emit("getPort", { containerName: projectId});
        }, 100);

        return () => clearTimeout(timer);
    }
}, [port, editorSocket, projectId]);

    if(!port) {
        return <>
            Loading...
        </>
    }

    function handleRefresh() {
        if(browserRef.current) {
            const oldAddr = browserRef.current.src;
            browserRef.current.src = oldAddr;
        }
    }

    return (
        <div
            style={{
                backgroundColor: "#22212b"
            }}
        >
            <Input
                style={{
                    width: "100%",
                    height: "30px",
                    color: "white",
                    fontFamily: "Fira Code",
                    backgroundColor: "#282a35"
                }}
                prefix={<ReloadOutlined onClick={handleRefresh}/>}
                defaultValue={`http://localhost:${port}`}

                
            />

            <iframe 
                ref={browserRef}
                src={`http://localhost:${port}`} 
                style={{
                    width: "100%",
                    height: "95vh",
                    border: "none"
                }}
            >

            </iframe>
        </div>
    )
}