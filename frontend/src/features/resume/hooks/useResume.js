import { useContext } from "react"
import { ResumeContext } from "../resume.context"
import {
    generateResume as apiGenerateResume,
    getResumeById as apiGetResumeById,
    getAllResumes as apiGetAllResumes,
    updateResume as apiUpdateResume,
    getResumePdfBlob as apiGetResumePdfBlob
} from "../services/resume.api"

export const useResume = () => {
    const context = useContext(ResumeContext)
    if (!context) {
        throw new Error("useResume must be used within a ResumeProvider")
    }

    const { loading, setLoading, resume, setResume, resumes, setResumes } = context

    const generateResume = async ({ jobDescription, selfDescription, resume: resumeFile }) => {
        setLoading(true)
        try {
            const data = await apiGenerateResume({ jobDescription, selfDescription, resume: resumeFile })
            setResume(data.resume)
            return data
        } catch (error) {
            console.error("Error generating resume:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getResumeById = async ({ resumeId }) => {
        setLoading(true)
        try {
            const data = await apiGetResumeById({ resumeId })
            setResume(data.resume)
            return data
        } catch (error) {
            console.error("Error fetching resume:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getAllResumes = async () => {
        setLoading(true)
        try {
            const data = await apiGetAllResumes()
            setResumes(data.resumes)
            return data
        } catch (error) {
            console.error("Error fetching all resumes:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const updateResume = async ({ resumeId, resumeData }) => {
        setLoading(true)
        try {
            const data = await apiUpdateResume({ resumeId, resumeData })
            setResume(data.resume)
            return data
        } catch (error) {
            console.error("Error updating resume:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getResumePdfBlob = async ({ resumeId }) => {
        try {
            const blob = await apiGetResumePdfBlob(resumeId)
            return blob
        } catch (error) {
            console.error("Error fetching PDF blob:", error)
            throw error
        }
    }

    return {
        loading,
        resume,
        resumes,
        generateResume,
        getResumeById,
        getAllResumes,
        updateResume,
        getResumePdfBlob
    }
}
