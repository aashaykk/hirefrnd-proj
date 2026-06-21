const { GoogleGenAI } = require("@google/genai")
const puppeteer = require("puppeteer")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "integer",
            description: "The match score between the candidate and the job description"
        },
        technicalQuestions: {
            type: "array",
            description: "The technical questions that can be asked in the interview along with their answers and intentions",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description: "The technical questions that can be asked in the interview"
                    },
                    intention: {
                        type: "string",
                        description: "The intention of the interviewer behind this question"
                    },
                    answer: {
                        type: "string",
                        description: "How to answer this question, what points to highlight, what to avoid etc..."
                    }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "The behavioral questions that can be asked in the interview along with their answers and intentions",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description: "The behavioral questions that can be asked in the interview"
                    },
                    intention: {
                        type: "string",
                        description: "The intention of the interviewer behind this question"
                    },
                    answer: {
                        type: "string",
                        description: "How to answer this question, what points to highlight, what to avoid etc..."
                    }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "The skills which the candidate is lacking along with their severity",
            items: {
                type: "object",
                properties: {
                    skill: {
                        type: "string",
                        description: "The skill which the candidate is lacking or needs to improve"
                    },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "The severity of the skill gap"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "The preparation plan for the interview",
            items: {
                type: "object",
                properties: {
                    day: {
                        type: "integer",
                        description: "The day of the preparation plan"
                    },
                    focus: {
                        type: "string",
                        description: "The focus of the preparation plan on that day"
                    },
                    tasks: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title: {
            type: "string",
            description: "The title of the job for which the interview report is generated"
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
}

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
            responseSchema: interviewReportSchema
        }
    })

    return JSON.parse(response.text)

}

async function generatePdfFromHtml() {

}

async function generateHtml({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer"),
    })

    const prompt = `Generate a professional resume in HTML format for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    Please generate a HTML response with the following structure:
    - html: string (The HTML content of the resume)

    Make the resume look professional and modern.
    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema
        }
    })

    return JSON.parse(response.text).html
}

module.exports = generateInterviewReport