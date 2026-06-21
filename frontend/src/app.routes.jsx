import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Home from "./features/interview/pages/Home"
import Interview from "./features/interview/pages/Interview"
import ResumeDashboard from "./features/resume/pages/ResumeDashboard"
import ResumeViewer from "./features/resume/pages/ResumeViewer"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path:"/",
        element:<Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/resumes",
        element: <Protected><ResumeDashboard /></Protected>
    },
    {
        path: "/resume/:resumeId",
        element: <Protected><ResumeViewer /></Protected>
    }
])