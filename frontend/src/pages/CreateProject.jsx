import { useNavigate } from 'react-router-dom';
import { useCreateProject } from "../hooks/apis/mutation/useCreateProject";
import { Button } from '@/components/ui/button';
import { useGetProjectsStore } from '@/store/getProjectsStore';
import { useEffect, useState } from 'react';

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

    function handleOpenExistingProject (projectId) {
        navigate(`/project/${projectId}`)
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <h2 className="text-xl font-medium text-gray-700 mt-4 text-center">Loading...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Manager</h1>
                    <p className="text-lg text-gray-600">Create new projects or view existing ones</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Button
                        onClick={handleProjects}
                        variant="outline"
                        className="w-full sm:w-auto min-w-[200px] h-12 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Get Projects
                    </Button>
                    
                    <Button
                        onClick={handleClick}
                        className="w-full sm:w-auto min-w-[200px] h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Project
                    </Button>
                </div>

                {/* Projects List */}
                {projectList && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Your Projects ({projectList.length})
                            </h3>
                        </div>
                        
                        <div className="p-6">
                            {projectList.length > 0 ? (
                                <div className="grid gap-3">
                                    {projectList.map((project, index) => (
                                        <div
                                            key={index}
                                            className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                                                    <span 
                                                        className="text-gray-900 font-medium group-hover:text-blue-900 transition-colors"
                                                        onClick={handleOpenExistingProject(project)}
                                                    >
                                                        {project}
                                                    </span>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">No projects found</p>
                                    <p className="text-gray-400 text-sm mt-1">Create your first project to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}