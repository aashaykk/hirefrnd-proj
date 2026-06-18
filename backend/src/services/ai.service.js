const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score between the candidate and the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical questions that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind this question"),
        answer: z.string().describe("How to answer this question, what points to highlight, what to avoid etc...")
    })).describe("The technical questions that can be asked in the interview along with their answers and intentions"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral questions that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind this question"),
        answer: z.string().describe("How to answer this question, what points to highlight, what to avoid etc...")
    })).describe("The behavioral questions that can be asked in the interview along with their answers and intentions"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking or needs to improve"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
    })).describe("The skills which the candidate is lacking along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of the preparation plan"),
        focus: z.string().describe("The focus of the preparation plan on that day"),
        tasks: z.array(z.string().describe("The tasks to be done on that day"))
    })).describe("The preparation plan for the interview")
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    Please generate a JSON response with the following structure:
    - matchScore: number (0-100)
    - technicalQuestions: array of { question, intention, answer }
    - behavioralQuestions: array of { question, intention, answer }
    - skillGaps: array of { skill, severity (low/medium/high) }
    - preparationPlan: array of { day, focus, tasks[] }
    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })

    return JSON.parse(response.text)

}

module.exports = {
    generateInterviewReport
}