import { Route, Routes } from "react-router-dom";
import { CreateProject } from "./pages/CreateProject";
import ProjectPlayGround from "./pages/ProjectPlayGround";

export default function Router () {
    return (
        <Routes>
            <Route path="/" element={<CreateProject />} />
            <Route path='/project/:projectId' element={<ProjectPlayGround />} />
        </Routes>
    )
}