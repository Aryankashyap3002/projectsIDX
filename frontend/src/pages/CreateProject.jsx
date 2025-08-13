import { useNavigate } from 'react-router-dom';
import { useCreateProject } from "../hooks/apis/mutation/useCreateProject";
import { Button } from '@/components/ui/button';
import { useGetProjectsStore } from '@/store/getProjectsStore';
import { useAuth } from '@/hooks/context/useAuth'; 
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import './CreateProject.css';
import { ProjectTypeCard } from '@/components/atoms/ProjectCard/ProjectTypeCard';
import { projectTypesArray } from '@/utils/projectTyprUtils';
import { ProjectCreateModal } from '@/components/molecules/ProjectCreateModal/ProjectCreateModal';
import { useCreateProject2 } from '@/hooks/apis/mutation/useCreateProject2';

export function CreateProject() {
    const { isPending, createProjectMutation } = useCreateProject();
    const { createProjectMutationUser } = useCreateProject2();
    const [ projectDetail , setProjectDetail]  = useState([]);
    const { 
        projects, 
        isLoading: isLoadingProjects,
        setProjects, // Your existing method - now uses user service by default
    } = useGetProjectsStore();
    const { auth, logout } = useAuth(); 
    const [projectName, setProjectName] = useState("");
    const [projectType, setProjectType] = useState("react"); 
    const [showForm, setShowForm] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showProjectsModal, setShowProjectsModal] = useState(false);
    const navigate = useNavigate();

    // Update these to use auth data
    const isSignedIn = !!auth?.user && !auth?.isLoading;
    const isLoading = auth?.isLoading;
    const userName = auth?.user?.username || "Guest";
    const userAvatar = auth?.user?.avatar;
    const userEmail = auth?.user?.email;

    const projectTypes = projectTypesArray;

    // Authentication guard function with better UX
    const requireAuth = (actionName = 'perform this action') => {
        if (isLoading) {
            toast.info('Please wait while we check your authentication status...');
            return false;
        }
        
        if (!isSignedIn) {
            toast.error(`Please sign in to ${actionName}`, {
                action: {
                    label: 'Sign In',
                    onClick: () => navigate('/auth/signin')
                }
            });
            setTimeout(() => navigate('/auth/signin'), 1500);
            return false;
        }
        return true;
    };

    async function handleClick() {
        // Check authentication before proceeding
        if (!requireAuth('create a project')) return;

        if (!showForm) {
            setShowForm(true);
            return;
        }
        
        try {
            // Generate a default name if none provided
            const defaultName = `${projectType}-project-${Date.now()}`;
            const response = await createProjectMutation({ 
                name: defaultName,
                type: projectType 
            });
            
            console.log('Project created:', response);
            const projectId = response?.data?._id || response?.data?.id || response?.data;
            
            if (projectId) {
                navigate(`/project/${projectId}`);
            } else {
                console.error('No project ID returned:', response);
                toast.error('Project created but navigation failed. Check your projects list.');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            // Error handling is done in the hook
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Check authentication before proceeding
        if (!requireAuth('create a project')) return;

        if (!projectName.trim()) {
            toast.error("Please enter a project name");
            return;
        }

        try {
            const response = await createProjectMutation({ 
                name: projectName.trim(), 
                type: projectType 
            });
            
            console.log("Created project:", { name: projectName, type: projectType }, response);
            const projectId = response?.data?._id || response?.data?.id || response?.data;
            
            if (projectId) {
                console.log("Token is: ", auth.token);
                createProjectMutationUser({
                    name: projectName.trim(), 
                    type: projectType,
                    projectId: projectId,
                    token: auth.token,
                })
                navigate(`/project/${projectId}`);
            } else {
                console.error('No project ID returned:', response);
                toast.error('Project created but navigation failed. Check your projects list.');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            // Error handling is done in the hook
        }
    }

    function handleCancel() {
        setShowForm(false);
        setProjectName("");
        setProjectType("react");
    }

    function handleUserProfileClick() {
        if (isSignedIn) {
            setShowUserDropdown(!showUserDropdown);
        } else {
            navigate('/auth/signin');
        }
    }

    function handleLogout() {
        logout();
        // clearProjects(); // Clear projects on logout
        setShowUserDropdown(false);
        toast.success('Successfully signed out');
        // Optionally redirect to home or signin page
        // navigate('/');
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (showUserDropdown && !event.target.closest('.user-profile-section')) {
                setShowUserDropdown(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserDropdown]);

    function getUserInitial() {
        return userName ? userName.charAt(0).toUpperCase() : 'U';
    }

    // Clear projects when user logs out
    useEffect(() => {
        if (!isSignedIn && !isLoading) {
            // clearProjects();
        }
    }, [isSignedIn, isLoading]);

    useEffect(() => {
        console.log("Project details: ", projects);
    }, []);

    async function handleProjects() {
        // Check authentication before proceeding
        if (!requireAuth('view your projects')) return;

        try {
            console.log('Loading user projects...');
            console.log("Auth token is: ", auth.token);
            const result = await setProjects({
                token: auth.token
            }); // Now fetches from user service by default
            setProjectDetail(result?.data);
            console.log('Projects loaded:', result?.data);
            
            
            if (result?.data?.length > 0) {
                setShowProjectsModal(true);
            } else {
                toast.info('No projects found. Create your first project!');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            toast.error('Failed to load projects. Please try again.');
        }
    }

    // Handle project selection from modal
    async function handleProjectSelect() {
        try {
            // Navigate to project using the MongoDB _id (since everything is in one service now)
            const result = await setProjects({
                token: auth.token
            }); // Now fetches from user service by default
            console.log('Projects loaded:', result);
            console.log("project details", result);
            navigate(`/project/${result.projectId}`);
            setShowProjectsModal(false);
        } catch (error) {
            console.error('Error accessing project:', error);
            toast.error('Failed to access project. Please try again.');
        }
    }

    function getProjectTypeDisplayName(type) {
        const typeObj = projectTypes.find(pt => pt.type === type);
        return typeObj ? typeObj.title : type;
    }

    // Show loading state while checking auth
    if (isLoading) {
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
        );
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
                            <div className="user-profile-wrapper">
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

                                {/* User Dropdown Menu */}
                                {isSignedIn && showUserDropdown && (
                                    <div className="user-dropdown">
                                        <div className="user-dropdown-header">
                                            <div className="user-dropdown-avatar">
                                                {userAvatar ? (
                                                    <img src={userAvatar} alt={userName} />
                                                ) : (
                                                    <span>{getUserInitial()}</span>
                                                )}
                                            </div>
                                            <div className="user-dropdown-info">
                                                <div className="user-dropdown-name">{userName}</div>
                                                <div className="user-dropdown-email">{userEmail}</div>
                                            </div>
                                        </div>
                                        <div className="user-dropdown-divider"></div>
                                        <div className="user-dropdown-actions">
                                            <button className="user-dropdown-item">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile
                                            </button>
                                            <button className="user-dropdown-item">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Settings
                                            </button>
                                            <button 
                                                onClick={handleLogout}
                                                className="user-dropdown-item logout-item"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div className="header-section">
                    <h1 className="main-title">Project Manager</h1>
                    <p className="subtitle">Create new projects or view existing ones</p>
                </div>

                {/* Authentication Notice for Guests */}
                {!isSignedIn && (
                    <div className="auth-notice">
                        <div className="auth-notice-content">
                            <svg className="auth-notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0h-2m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="auth-notice-text">
                                <h3>Sign in Required</h3>
                                <p>Please sign in to create projects or view your existing projects.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/auth/signin')}
                                className="auth-notice-btn"
                            >
                                Sign In Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <Button
                        onClick={handleProjects}
                        variant="outline"
                        className={`get-projects-btn ${!isSignedIn ? 'disabled-btn' : ''}`}
                        disabled={!isSignedIn || isLoadingProjects}
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {isLoadingProjects ? 'Loading...' : 'Get Projects'}
                    </Button>
                    
                    {!showForm ? (
                        <Button
                            onClick={handleClick}
                            className={`create-project-btn ${!isSignedIn ? 'disabled-btn' : ''}`}
                            disabled={!isSignedIn}
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

                {/* Projects Modal */}
                {showProjectsModal && isSignedIn && projects?.data && (
                    <ProjectCreateModal 
                        projectList={projectDetail} 
                        onProjectSelect={handleProjectSelect}
                        onClose={() => setShowProjectsModal(false)}
                    />               
                )}
            </div>
        </div>
    );
}