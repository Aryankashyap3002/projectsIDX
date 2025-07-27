import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css'
import { useEffect, useRef } from 'react';
import { AttachAddon } from '@xterm/addon-attach';
import { useTerminalSocketStore } from '@/store/terminalSocketStore';

export const BrowserTerminal = () => {
    const terminalRef = useRef(null);
    const socketRef = useRef(null);

    const { terminalSocket } = useTerminalSocketStore();


    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#0c1017',
                foreground: '#f8f8f9',
                cursor: '#f8f8f9',
                cursorAccent: '282a37',
                red: 'ff5544',
                green: '#50fa7c',
                yellow: '#f1fa8c',
                cyan: '#8be9fd'
            },
            fontSize: 16,
            fontFamily: "JetBrains Mono",
            convertEol: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current); 
        fitAddon.fit();

        if(terminalSocket) {
            terminalSocket.onopen = () => {
                const attachAddon = new AttachAddon(terminalSocket);
                term.loadAddon(attachAddon);
                socketRef.current = terminalSocket;
            }
        }
        

        return () => {
            term.dispose();
        }

    }, [terminalSocket]);

         

    return (
        <div
            ref={terminalRef}
            style={{
                height: "20vh",
                outline: 'none',
                border: 'none',
                overflow: 'auto'
            }}
        >

        </div>
    )
}