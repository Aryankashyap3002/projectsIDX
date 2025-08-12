import { useNavigate } from 'react-router-dom';
import { useCreateProject } from "../hooks/apis/mutation/useCreateProject";
import { Button } from '@/components/ui/button';
import { useGetProjectsStore } from '@/store/getProjectsStore';
import { useAuth } from '@/hooks/context/useAuth'; 
import { useEffect, useState } from 'react';
import './CreateProject.css';
import { ProjectTypeCard } from '@/components/atoms/ProjectCard/ProjectTypeCard';
import { projectTypesArray } from '@/utils/projectTyprUtils';
import { ProjectCreateModal } from '@/components/molecules/ProjectCreateModal/ProjectCreateModal';

export function CreateProject() {
    const { isPending, createProjectMutation } = useCreateProject();
    const { projects, setProjects } = useGetProjectsStore();
    const { auth } = useAuth(); 
    const [projectList, setProjectList] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [projectType, setProjectType] = useState("react"); 
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    // Update these to use auth data
    const isSignedIn = !!auth?.user; // Check if user exists
    const userName = auth?.user?.username || "Guest";
    const userAvatar = auth?.user?.avatar;

    const projectTypes = projectTypesArray;

    async function handleClick() {
        if (!showForm) {
            setShowForm(true);
            return;
        }
        
        try {
            const response = await createProjectMutation({ type: projectType });
            console.log(response.data);
            navigate(`/project/${response?.data}`)
        } catch (error) {
            console.log(error);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!projectName.trim()) {
            alert("Please enter a project name");
            return;
        }

        try {
            const response = await createProjectMutation({ 
                name: projectName, 
                type: projectType 
            });
            console.log("Created project:", { name: projectName, type: projectType }, response.data);
            navigate(`/project/${response?.data}`);
        } catch (error) {
            console.log(error);
        }
    }

    function handleCancel() {
        setShowForm(false);
        setProjectName("");
        setProjectType("react");
    }

    function handleUserProfileClick() {
        if (isSignedIn) {
            // Handle signed-in user actions (profile dropdown, etc.)
            console.log("User profile clicked - show dropdown or profile page");
        } else {
            // Redirect to signin page
            navigate('/auth/signin');
        }
    }

    function getUserInitial() {
        return userName ? userName.charAt(0).toUpperCase() : 'U';
    }

    useEffect(() => {
        setProjects();
        // Log user data for debugging
        console.log("User is: ", auth?.user);
    }, [auth]);

    function handleProjects() {
        console.log(projects.data);
        setProjectList(projects.data);
    }

    function getProjectTypeDisplayName(type) {
        const typeObj = projectTypes.find(pt => pt.type === type);
        return typeObj ? typeObj.title : type;
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
                    <h2 className="loading-title">
                        {projectName ? 
                            `Creating "${projectName}" (${getProjectTypeDisplayName(projectType)})...` : 
                            `Creating ${getProjectTypeDisplayName(projectType)} project...`
                        }
                    </h2>
                </div>
            </div>
        )
    }

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <div className="top-nav">
                    <div className="nav-content">
                        <div className="logo-section">
                            <h2 className="logo-text">ProjectHub</h2>
                        </div>
                        
                        <div className="user-profile-section">
                            <button 
                                onClick={handleUserProfileClick}
                                className="user-avatar-btn"
                                title={isSignedIn ? `Signed in as ${userName}` : 'Sign in'}
                            >
                                <div className={`user-avatar ${isSignedIn ? 'signed-in' : 'guest'}`}>
                                    {isSignedIn && userAvatar ? (
                                        <img 
                                            src={userAvatar} 
                                            alt={`${userName}'s avatar`}
                                            className="user-avatar-img"
                                            onError={(e) => {
                                                // Fallback to initials if image fails to load
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    {isSignedIn && !userAvatar ? (
                                        <span className="user-initial">{getUserInitial()}</span>
                                    ) : null}
                                    {isSignedIn && userAvatar ? (
                                        <span className="user-initial" style={{display: 'none'}}>{getUserInitial()}</span>
                                    ) : null}
                                    {!isSignedIn ? (
                                        <svg className="guest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    ) : null}
                                </div>
                                {!isSignedIn && (
                                    <span className="signin-text">Sign In</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

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
                    
                    {!showForm ? (
                        <Button
                            onClick={handleClick}
                            className="create-project-btn"
                        >
                            <svg className="btn-icon" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New Project
                        </Button>
                    ) : (
                        <div className="project-form-container">
                            <form onSubmit={handleFormSubmit} className="project-form">
                                {/* Project Type Selection */}
                                <div className="form-section">
                                    <label className="form-label">Choose Project Type</label>
                                    <div className="project-types-grid">
                                        {projectTypes.map((type) => (
                                            <ProjectTypeCard
                                                key={type.type}
                                                type={type.type}
                                                title={type.title}
                                                description={type.description}
                                                icon={type.icon}
                                                selected={projectType === type.type}
                                                onSelect={() => setProjectType(type.type)} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Project Name Input */}
                                <div className="form-section">
                                    <label className="form-label">Project Name</label>
                                    <div className="form-input-group">
                                        <input
                                            type="text"
                                            placeholder="Enter project name"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="project-name-input"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Form Buttons */}
                                <div className="form-buttons">
                                    <button 
                                        type="button" 
                                        onClick={handleCancel}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="submit-btn"
                                        disabled={!projectName.trim()}
                                    >
                                        <svg className="btn-icon" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create {getProjectTypeDisplayName(projectType)} Project
                                    </button>
                                </div>
                            </form>
                            
                            {/* Quick Create Option */}
                            <div className="quick-create-option">
                                <span className="divider-text">or</span>
                                <button 
                                    onClick={handleClick}
                                    className="quick-create-btn"
                                >
                                    Quick Create {getProjectTypeDisplayName(projectType)} (Auto-generated name)
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Projects List */}
                {projectList && (
                    <ProjectCreateModal projectList={projectList} />               
                )}
            </div>
        </div>
    );
}