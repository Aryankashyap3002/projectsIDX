import { useNavigate } from 'react-router-dom';
import { useCreateProject } from "../hooks/apis/mutation/useCreateProject";
import { Button } from '@/components/ui/button';
import { useGetProjectsStore } from '@/store/getProjectsStore';
import { useEffect, useState } from 'react';
import './CreateProject.css';

export function CreateProject() {
    const { isPending, createProjectMutation } = useCreateProject();
    const { projects, setProjects } = useGetProjectsStore();
    const [projectList, setProjectList] = useState(null);
    const navigate = useNavigate();

    async function handleClick() {
        try {
            const response = await createProjectMutation();
            console.log(response.data);
            navigate(`/project/${response?.data}`)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setProjects();
    }, []);

    function handleProjects() {
        console.log(projects.data);
        setProjectList(projects.data);
    }

    function handleOpenExistingProject(projectId) {
        navigate(`/project/${projectId}`)
    }

    if (isPending) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-dots">
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                    </div>
                    <h2 className="loading-title">Loading...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="main-container">
            <div className="content-wrapper">
                {/* Header Section */}
                <div className="header-section">
                    <h1 className="main-title">Project Manager</h1>
                    <p className="subtitle">Create new projects or view existing ones</p>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <Button
                        onClick={handleProjects}
                        variant="outline"
                        className="get-projects-btn"
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Get Projects
                    </Button>
                    
                    <Button
                        onClick={handleClick}
                        className="create-project-btn"
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Project
                    </Button>
                </div>

                {/* Projects List */}
                {projectList && (
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
                                            key={index}
                                            className="project-item"
                                            onClick={() => handleOpenExistingProject(project)}
                                        >
                                            <div className="project-item-content">
                                                <div className="project-item-left">
                                                    <div className="project-indicator"></div>
                                                    <span className="project-name">
                                                        {project}
                                                    </span>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="empty-state-title">No projects found</p>
                                    <p className="empty-state-subtitle">Create your first project to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}