import { useActiveFileTabStore } from "@/store/activeFileTabStote";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { extensionToLanguage } from "@/utils/extensionToLanguageMapper";
import { useEditorSocketStore } from "@/store/editorSocketStore";

export default function EditorComponent() {
    const [isThemeReady, setIsThemeReady] = useState(false);
    const timerIdRef = useRef(null);
    const editorRef = useRef(null);

    const { editorSocket } = useEditorSocketStore();
    const { activeFileTab } = useActiveFileTabStore();

    // Memoize the blue theme to prevent recreation on every render
    const blueTheme = useMemo(() => ({
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '87CEEB', fontStyle: 'italic' },
            { token: 'keyword', foreground: '4169E1', fontStyle: 'bold' },
            { token: 'string', foreground: '6495ED' },
            { token: 'number', foreground: '00BFFF' },
            { token: 'type', foreground: '1E90FF' },
            { token: 'function', foreground: '0080FF' },
            { token: 'variable', foreground: 'B0E0E6' },
            { token: 'constant', foreground: '4682B4' },
            { token: 'operator', foreground: '00CED1' },
            { token: 'delimiter', foreground: '5F9EA0' },
        ],
        colors: {
            'editor.background': '#001133',
            'editor.foreground': '#E6F3FF',
            'editorLineNumber.foreground': '#4682B4',
            'editorLineNumber.activeForeground': '#87CEEB',
            'editor.selectionBackground': '#003366',
            'editor.selectionHighlightBackground': '#002244',
            'editorCursor.foreground': '#00BFFF',
            'editor.findMatchBackground': '#0066CC',
            'editor.findMatchHighlightBackground': '#004499',
            'editorWidget.background': '#002244',
            'editorWidget.border': '#4682B4',
            'editorHoverWidget.background': '#002244',
            'editorHoverWidget.border': '#4682B4',
            'editorSuggestWidget.background': '#002244',
            'editorSuggestWidget.border': '#4682B4',
            'scrollbar.shadow': '#001122',
            'scrollbarSlider.background': '#336699',
            'scrollbarSlider.hoverBackground': '#4682B4',
            'scrollbarSlider.activeBackground': '#5F9EA0',
        }
    }), []);

    // Memoize language calculation
    const language = useMemo(() => {
        if (activeFileTab?.extension) {
            return extensionToLanguage[activeFileTab.extension];
        }
        return undefined;
    }, [activeFileTab?.extension]);

    // Memoize editor value
    const editorValue = useMemo(() => {
        return activeFileTab?.value || "Project Playground";
    }, [activeFileTab?.value]);

    // Optimized handleEditorMount with useCallback
    const handleEditorMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        
        // Define and set theme immediately
        monaco.editor.defineTheme('blue-theme', blueTheme);
        monaco.editor.setTheme('blue-theme');
        
        setIsThemeReady(true);

        // Optimize editor settings for performance
        editor.updateOptions({
            fontSize: 14,
            lineHeight: 20,
            minimap: { enabled: false }, // Disable minimap for better performance
            scrollBeyondLastLine: false,
            renderWhitespace: 'none',
            renderControlCharacters: false,
            disableLayerHinting: false,
            automaticLayout: true,
        });
    }, [blueTheme]);

    // Optimized handleChange with useCallback
    const handleChange = useCallback((value) => {
        if (timerIdRef.current != null) {
            clearTimeout(timerIdRef.current);
        }

        timerIdRef.current = setTimeout(() => {
            if (editorSocket && activeFileTab?.path) {
                editorSocket.emit("writeFile", {
                    data: value,
                    pathToFileOrFolder: activeFileTab.path,
                });
            }
        }, 1000); // Reduced from 2000ms to 1000ms for better responsiveness
    }, [editorSocket, activeFileTab?.path]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerIdRef.current) {
                clearTimeout(timerIdRef.current);
            }
        };
    }, []);

    // Early return with loading state
    if (!isThemeReady && !activeFileTab) {
        return (
            <div className="h-full w-full bg-slate-900 flex items-center justify-center">
                <div className="text-slate-400">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                width="100%"
                language={language}
                onMount={handleEditorMount}
                value={editorValue}
                onChange={handleChange}
                loading={
                    <div className="h-full w-full bg-slate-900 flex items-center justify-center">
                        <div className="text-slate-400">Loading editor...</div>
                    </div>
                }
                options={{
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    theme: 'blue-theme'
                }}
            />
        </div>
    );
}