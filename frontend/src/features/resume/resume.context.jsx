import { createContext, useState } from "react";

export const ResumeContext = createContext()

export const ResumeProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [resume, setResume] = useState(null)
    const [resumes, setResumes] = useState([])

    return (
        <ResumeContext.Provider value={{ loading, setLoading, resume, setResume, resumes, setResumes }}>
            {children}
        </ResumeContext.Provider>
    )
}
