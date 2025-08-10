import './ProjectTypeCard.css'

export function ProjectTypeCard({ type, title, description, icon, selected, onSelect }) {
    return (
        <div 
            className={`project-type-card ${selected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="card-icon">
                {icon}
            </div>
            <div className="card-content">
                <h4 className="card-title">{title}</h4>
                <p className="card-description">{description}</p>
            </div>
            <div className="card-selector">
                <div className={`radio-button ${selected ? 'checked' : ''}`}>
                    {selected && <div className="radio-dot"></div>}
                </div>
            </div>
        </div>
    );
}