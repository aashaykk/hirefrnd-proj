import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { setLoading, setReport, loading, report, reports, setreports } = context

    const generateReport = async ({ jobDescription, selfDescription, resume }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resume })
            setReport(response.interviewReport)
            return response
        } catch (error) {
            console.error("Error generating report:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async ({ interviewId }) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById({ interviewId })
            setReport(response.interviewReport)
            return response
        } catch (error) {
            console.error("Error fetching report by ID:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getAllReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setreports(response.interviewReports)
            return response
        } catch (error) {
            console.error("Error fetching all reports:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        generateReport,
        getReportById,
        getAllReports,
        loading,
        report,
        reports
    }
}