import { createContext, useState } from "react";


export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setreports] = useState([])

    return (
        <InterviewContext.Provider value={{ loading, report, setLoading, setReport, reports, setreports }}>
            {children}
        </InterviewContext.Provider>
    )
}