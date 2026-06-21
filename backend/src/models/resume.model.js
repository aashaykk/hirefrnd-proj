const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
    label: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: false })

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subtitle: { type: String, required: true },
    date: { type: String, required: true },
    links: [linkSchema],
    bullets: [{ type: String, required: true }]
}, { _id: false })

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    selfDescription: {
        type: String
    },
    resumeData: {
        name: { type: String, required: true },
        contact: {
            location: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
            github: { type: String, required: true },
            linkedin: { type: String, required: true }
        },
        education: {
            institution: { type: String, required: true },
            location: { type: String, required: true },
            degree: { type: String, required: true },
            major: { type: String, required: true },
            gpa: { type: String, required: true },
            expectedDate: { type: String, required: true },
            relevantCoursework: { type: String, required: true }
        },
        projects: [projectSchema],
        additional: {
            technicalSkills: { type: String, required: true },
            languages: { type: String, required: true },
            achievements: { type: String, required: true }
        }
    },
    pdfBuffer: {
        type: Buffer
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Resume", resumeSchema)
