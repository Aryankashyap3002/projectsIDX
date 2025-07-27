import { useActiveFileTabStore } from "@/store/activeFileTabStote";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { extensionToLanguage } from "@/utils/extensionToLanguageMapper";
import { useEditorSocketStore } from "@/store/editorSocketStore";

export default function EditorComponent () {

    const [editorTheme, setEditorTheme] = useState({
        theme: null
    });

    

    const timerIdRef = useRef(null);

    const { editorSocket, setEditorSocket } = useEditorSocketStore();

    const [language , setLanguage] = useState();

    const { activeFileTab } = useActiveFileTabStore();

    async function downloadTheme () {
        const response = await fetch('/Monokai.json');
        const data = await response .json();
        console.log(data);
        setEditorTheme({ ...editorTheme, theme: data});
    }

    function handleEditorMount (editor, monaco) {
        monaco.editor.defineTheme('monokai', editorTheme.theme);
        monaco.editor.setTheme('monokai');
    }

    useEffect(() => {
        if (activeFileTab?.extension) {
            const mappedLanguage = extensionToLanguage[activeFileTab.extension];
            console.log('Extension:', activeFileTab.extension, 'Mapped to language:', mappedLanguage);
            setLanguage(mappedLanguage);
        }
    }, [activeFileTab]);

    function handleChange (value) {
        if(timerIdRef.current != null) {
            clearTimeout(timerIdRef.current);
        }

        timerIdRef.current = setTimeout(() => {
            const editorContent = value;
            console.log(editorContent);
            console.log("write file executed")
            editorSocket.emit("writeFile", {
                data: editorContent,
                pathToFileOrFolder: activeFileTab.path,
            });
            
        }, 2000);
        
    }

    useEffect(() => {
        downloadTheme();
        
    }, []);

    return (
        <div>
           {    editorTheme.theme &&
                <Editor
                    height="100vh"
                    width="100%"
                    language={language}
                    onMount={handleEditorMount}
                    value={activeFileTab?.value ? activeFileTab.value : "Project Playground"}
                    onChange={handleChange}
                />
            }
        </div>
    )
}