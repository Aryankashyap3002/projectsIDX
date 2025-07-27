import './EditorButton.css'

export default function EditorButton ({ fileName, path, isActive, handleClickDelete, handleFileNameClick }) {

    return (
        <button
            className={"editor-button"}
            style={{
                borderTop: isActive ? '3px solid #628dd1' : '1px solid gray',
            }}
        >
            
            <span 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <p
                    onClick={() => handleFileNameClick(path, fileName)}
                >
                    {fileName} 
                </p>
                <div 
                    style={{
                        fontSize: '15px',
                        paddingLeft: '5px'
                    }}
                    onClick={() => handleClickDelete(fileName)}
                >
                    X
                </div>
            </span>
        </button>
    )
}