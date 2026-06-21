const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const resumeController = require("../controllers/resume.controller.js")
const upload = require("../middlewares/file.middleware")

const resumeRouter = express.Router()

// Generate a new tailored resume from uploaded file, job description, self description
resumeRouter.post("/generate", authMiddleware.authUser, upload.single("resume"), resumeController.generateResumeController)

// Fetch metadata of all tailored resumes for the logged in user
resumeRouter.get("/", authMiddleware.authUser, resumeController.getAllResumesController)

// Fetch details of a specific resume by ID (excluding PDF buffer)
resumeRouter.get("/:resumeId", authMiddleware.authUser, resumeController.getResumeByIdController)

// Update/Edit resume JSON data and regenerate PDF
resumeRouter.put("/:resumeId", authMiddleware.authUser, resumeController.updateResumeController)

// Download the generated A4 PDF file of the resume
resumeRouter.get("/:resumeId/pdf", authMiddleware.authUser, resumeController.downloadResumePdfController)

module.exports = resumeRouter
