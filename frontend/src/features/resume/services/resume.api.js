import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const generateResume = async ({ jobDescription, selfDescription, resume }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    if (selfDescription) {
        formData.append("selfDescription", selfDescription)
    }
    formData.append("resume", resume)

    const response = await api.post("/api/resume/generate", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export const getResumeById = async ({ resumeId }) => {
    const response = await api.get(`/api/resume/${resumeId}`)
    return response.data
}

export const getAllResumes = async () => {
    const response = await api.get("/api/resume")
    return response.data
}

export const updateResume = async ({ resumeId, resumeData }) => {
    const response = await api.put(`/api/resume/${resumeId}`, { resumeData })
    return response.data
}

export const getResumePdfDownloadUrl = (resumeId) => {
    return `http://localhost:3000/api/resume/${resumeId}/pdf`
}

export const getResumePdfBlob = async (resumeId) => {
    const response = await api.get(`/api/resume/${resumeId}/pdf`, {
        responseType: "blob"
    })
    return response.data
}
