const pdfParse = require("pdf-parse")
const Resume = require("../models/resume.model.js")
const {
    generateTailoredResumeData,
    renderResumeHtml,
    generatePdfFromHtml
} = require("../services/resume.service.js")

/**
 * Parses uploaded PDF, generates tailored resume, renders PDF, and stores in Database
 */
async function generateResumeController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" })
        }
        if (!req.body.jobDescription) {
            return res.status(400).json({ message: "Job description is required" })
        }

        const { jobDescription, selfDescription } = req.body

        // Extract text from uploaded PDF using the workspace's specific PDFParse
        let resumeText = ""
        try {
            const parsedPdf = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = parsedPdf.text || parsedPdf
        } catch (parseErr) {
            console.error("PDF Parsing error:", parseErr)
            return res.status(400).json({ message: "Failed to parse PDF resume file. Ensure it is a valid PDF." })
        }

        // Call AI service to generate tailored JSON
        const tailoredResumeData = await generateTailoredResumeData({
            resumeText,
            selfDescription,
            jobDescription
        })

        // Render HTML and generate initial PDF buffer via Puppeteer
        const htmlContent = renderResumeHtml(tailoredResumeData)
        const pdfBuffer = await generatePdfFromHtml(htmlContent)

        // Save in Database
        const newResume = await Resume.create({
            user: req.user.id,
            jobDescription,
            selfDescription,
            resumeData: tailoredResumeData,
            pdfBuffer
        })

        // Remove the pdfBuffer from response to minimize payload
        const responseData = newResume.toObject()
        delete responseData.pdfBuffer

        res.status(201).json({
            message: "Tailored resume generated successfully",
            resume: responseData
        })
    } catch (err) {
        console.error("Generate resume controller error:", err)
        res.status(500).json({ message: err.message || "Failed to generate tailored resume" })
    }
}

/**
 * Updates resume fields, regenerates PDF, and updates DB
 */
async function updateResumeController(req, res) {
    try {
        const { resumeId } = req.params
        const { resumeData } = req.body

        if (!resumeData) {
            return res.status(400).json({ message: "Resume data is required for updates" })
        }

        const resume = await Resume.findOne({ _id: resumeId, user: req.user.id })
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        // Update details
        resume.resumeData = resumeData

        // Re-generate HTML and PDF
        const htmlContent = renderResumeHtml(resumeData)
        const pdfBuffer = await generatePdfFromHtml(htmlContent)
        
        resume.pdfBuffer = pdfBuffer
        await resume.save()

        const responseData = resume.toObject()
        delete responseData.pdfBuffer

        res.status(200).json({
            message: "Resume updated and PDF re-generated successfully",
            resume: responseData
        })
    } catch (err) {
        console.error("Update resume controller error:", err)
        res.status(500).json({ message: err.message || "Failed to update resume" })
    }
}

/**
 * Fetches a single resume details (excludes pdfBuffer)
 */
async function getResumeByIdController(req, res) {
    try {
        const { resumeId } = req.params
        const resume = await Resume.findOne({ _id: resumeId, user: req.user.id }).select("-pdfBuffer")
        
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        res.status(200).json({
            message: "Resume fetched successfully",
            resume
        })
    } catch (err) {
        console.error("Get resume by ID error:", err)
        res.status(500).json({ message: err.message || "Failed to fetch resume" })
    }
}

/**
 * Lists user's generated resumes metadata
 */
async function getAllResumesController(req, res) {
    try {
        const resumes = await Resume.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-pdfBuffer -jobDescription -selfDescription -resumeData.projects -resumeData.education -resumeData.additional")

        res.status(200).json({
            message: "Resumes fetched successfully",
            resumes
        })
    } catch (err) {
        console.error("Get all resumes error:", err)
        res.status(500).json({ message: err.message || "Failed to fetch resumes list" })
    }
}

/**
 * Downloads/streams the generated PDF buffer
 */
async function downloadResumePdfController(req, res) {
    try {
        const { resumeId } = req.params
        const resume = await Resume.findOne({ _id: resumeId, user: req.user.id })
        
        if (!resume || !resume.pdfBuffer) {
            return res.status(404).json({ message: "Resume PDF not found" })
        }

        const safeFilename = resume.resumeData.name.replace(/[^a-zA-Z0-9]/g, "_") + "_Resume.pdf"

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`)
        res.send(resume.pdfBuffer)
    } catch (err) {
        console.error("Download resume PDF error:", err)
        res.status(500).json({ message: err.message || "Failed to download resume PDF" })
    }
}

module.exports = {
    generateResumeController,
    updateResumeController,
    getResumeByIdController,
    getAllResumesController,
    downloadResumePdfController
}
