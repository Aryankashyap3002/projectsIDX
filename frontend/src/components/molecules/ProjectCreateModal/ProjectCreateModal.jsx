import { useNavigate } from "react-router-dom"

export function ProjectCreateModal({ projectList }) {
    const navigate = useNavigate();

    function handleOpenExistingProject(projectId) {
        navigate(`/project/${projectId}`);
    }

    // Helper function to get the correct display name for project type
    function getProjectTypeDisplayName(type) {
        switch(type) {
            case "react":
                return "React";
            case "next":
                return "Next.js";
            default:
                return type || "React"; // fallback to React if type is undefined
        }
    }

    return (
        <div className="projects-container">
            <div className="projects-header">
                <h3 className="projects-title">
                    <svg className="projects-title-icon" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Your Projects ({projectList.length})
                </h3>
            </div>
            
            <div className="projects-content">
                {projectList.length > 0 ? (
                    <div className="projects-grid">
                        {projectList.map((project, index) => (
                            <div
                                key={project.id || index}
                                className="project-item"
                                onClick={() => handleOpenExistingProject(project.id)}
                            >
                                <div className="project-item-content">
                                    <div className="project-item-left">
                                        <div className={`project-indicator ${project.type || 'react'}`}></div>
                                        <div className="project-info">
                                            <span className="project-name">
                                                {project.name}
                                            </span>
                                            <span className="project-type-badge">
                                                {getProjectTypeDisplayName(project.type)} {/* ✅ Fixed: Now shows correct type */}
                                            </span>
                                        </div>
                                    </div>
                                    <svg className="project-arrow" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <svg className="empty-state-icon" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="empty-state-title">No projects found</p>
                        <p className="empty-state-subtitle">Create your first project to get started</p>
                    </div>
                )}
            </div>
        </div>
    )
}