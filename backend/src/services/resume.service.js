const { GoogleGenAI } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const resumeResponseSchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            description: "The full name of the candidate, e.g. AASHAY KAMBLE (in uppercase or regular capitalization)"
        },
        contact: {
            type: "object",
            description: "Contact information matching the reference style",
            properties: {
                location: { type: "string", description: "City and State, e.g. Mumbai, MH" },
                phone: { type: "string", description: "Phone number, e.g. +91 9175109492" },
                email: { type: "string", description: "Email address, e.g. aashaykamble91@gmail.com" },
                github: { type: "string", description: "GitHub URL, e.g. https://github.com/aashaykk" },
                linkedin: { type: "string", description: "LinkedIn URL, e.g. https://linkedin.com/in/aashaykk" }
            },
            required: ["location", "phone", "email", "github", "linkedin"]
        },
        education: {
            type: "object",
            description: "The education details. Limit to the most relevant/highest level of education.",
            properties: {
                institution: { type: "string", description: "University or college name in uppercase, e.g. VEERMATA JIJABAI TECHNOLOGICAL INSTITUTE" },
                location: { type: "string", description: "City and State of institution, e.g. Mumbai, MH" },
                degree: { type: "string", description: "Degree, e.g. Bachelor of Technology" },
                major: { type: "string", description: "Major details, e.g. Major in Information Technology; Minors in Entrepreneurship" },
                gpa: { type: "string", description: "GPA, e.g. 7.04 or Cumulative GPA: 7.04" },
                expectedDate: { type: "string", description: "Graduation or expected date, e.g. Expected 2028" },
                relevantCoursework: { type: "string", description: "Relevant coursework, separated by semicolons, e.g. DBMS; Operating Systems; Design and Analysis of Algorithms; Artificial Intelligence; Data Structures" }
            },
            required: ["institution", "location", "degree", "major", "gpa", "expectedDate", "relevantCoursework"]
        },
        projects: {
            type: "array",
            description: "Tailored projects list (maximum 2 to 3 projects to ensure the resume fits on exactly one page). Make them highly aligned with the target job description.",
            items: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Project name, e.g. OneVJTI" },
                    subtitle: { type: "string", description: "Project subtitle or role, e.g. Backend Development" },
                    date: { type: "string", description: "Date range or month, e.g. Jan 2026 or Dec 2025 – Jan 2026" },
                    links: {
                        type: "array",
                        description: "GitHub or live link objects for this project",
                        items: {
                            type: "object",
                            properties: {
                                label: { type: "string", description: "LinkLabel, e.g. GitHub or GitHub (Backend only) or Pratibimb" },
                                url: { type: "string", description: "The actual URL" }
                            },
                            required: ["label", "url"]
                        }
                    },
                    bullets: {
                        type: "array",
                        description: "3 to 4 concise bullet points describing details, achievements, and impact. BOLD key technical terms or libraries using <strong>...</strong> html tags. Do not bold non-technical words.",
                        items: { type: "string" }
                    }
                },
                required: ["name", "subtitle", "date", "links", "bullets"]
            }
        },
        additional: {
            type: "object",
            description: "Additional section items",
            properties: {
                technicalSkills: { type: "string", description: "Comma-separated list of technical skills and technologies, e.g. Node.js, Express, MongoDB, etc. Tailored to target job description." },
                languages: { type: "string", description: "Languages, e.g. Fluent in English; Marathi; Hindi" },
                achievements: { type: "string", description: "Key achievements, e.g. Solved 100+ Leetcode problems of various difficulties. Use <strong>...</strong> to bold key metrics." }
            },
            required: ["technicalSkills", "languages", "achievements"]
        }
    },
    required: ["name", "contact", "education", "projects", "additional"]
}

/**
 * Generate tailored resume JSON from input data via Gemini
 */
async function generateTailoredResumeData({ resumeText, selfDescription, jobDescription }) {
    const prompt = `You are an expert resume writer. Your task is to analyze the candidate's existing resume content, their self-description, and a target job description, and output a highly tailored, clean, and concise resume structure in JSON format.
    
    Here is the input data:
    ---
    EXISTING RESUME TEXT:
    ${resumeText}
    
    ---
    SELF-DESCRIPTION:
    ${selfDescription || "Not provided"}
    
    ---
    TARGET JOB DESCRIPTION:
    ${jobDescription}
    
    ---
    INSTRUCTIONS:
    1. Tailor the content to highly emphasize matching skills and requirements in the target Job Description and highlight positive points mentioned in the self-description.
    2. Maintain strict layout limits so the resume can fit on EXACTLY ONE PAGE when rendered.
    3. Include at most 2 or 3 projects. For each project, generate exactly 3 or 4 bullet points. Each bullet point should be no longer than 25 words.
    4. BOLD key programming languages, frameworks, or libraries using HTML <strong>...</strong> tags (e.g. <strong>Node.js</strong>, <strong>Express</strong>, <strong>React</strong>) inside the project bullet points and additional achievements.
    5. Clean up contact links (GitHub, LinkedIn) to make sure they are valid URLs.
    6. Select or summarize education details so it matches the reference style.
    7. Generate a list of skills in the additional section that aligns well with the target role.
    
    Please return a JSON response matching the provided schema.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumeResponseSchema
        }
    })

    return JSON.parse(response.text)
}

/**
 * Renders structured resume JSON into a clean, precise HTML document matching the reference layout
 */
function renderResumeHtml(resumeData) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resume - ${resumeData.name}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: "Times New Roman", Times, Georgia, serif;
            color: #000000;
            line-height: 1.35;
            font-size: 10.5pt;
            background-color: #ffffff;
            padding: 0.4in;
            width: 210mm;
            height: 297mm;
            overflow: hidden;
        }
        .header {
            text-align: center;
            margin-bottom: 12px;
        }
        .name {
            font-size: 21pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
        }
        .contact {
            font-size: 9.5pt;
            color: #111111;
        }
        .contact a {
            color: #0b4a8f;
            text-decoration: underline;
        }
        .section-title {
            font-size: 10.5pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000000;
            margin-top: 14px;
            margin-bottom: 6px;
            padding-bottom: 2px;
            letter-spacing: 0.5px;
        }
        .row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 1px;
        }
        .institution-name {
            font-size: 10.5pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .degree-name {
            font-size: 10pt;
            font-style: italic;
        }
        .location {
            font-size: 10pt;
            font-weight: normal;
        }
        .date {
            font-size: 10pt;
            font-weight: normal;
        }
        .project-name {
            font-size: 10.5pt;
            font-weight: bold;
        }
        .project-subtitle {
            font-size: 9.5pt;
            font-style: italic;
        }
        .project-links {
            font-size: 9.5pt;
            font-weight: normal;
        }
        .project-links a {
            color: #0b4a8f;
            text-decoration: underline;
        }
        .details-text {
            font-size: 9.5pt;
            margin-bottom: 1px;
        }
        .coursework {
            font-size: 9.5pt;
            margin-bottom: 1px;
        }
        .bullets {
            margin: 2px 0 5px 0;
            padding-left: 15px;
        }
        .bullets li {
            font-size: 9.5pt;
            margin-bottom: 2px;
            list-style-type: disc;
            text-align: justify;
        }
        .bullets li strong, .additional-item strong {
            font-weight: bold;
            color: #000000;
        }
        .additional-item {
            font-size: 9.5pt;
            margin-bottom: 4px;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${resumeData.name}</div>
        <div class="contact">
            ${resumeData.contact.location} | P: ${resumeData.contact.phone} | <a href="mailto:${resumeData.contact.email}">${resumeData.contact.email}</a> | <a href="${resumeData.contact.github}" target="_blank">GitHub</a> | <a href="${resumeData.contact.linkedin}" target="_blank">LinkedIn</a>
        </div>
    </div>

    <div>
        <div class="section-title">Education</div>
        <div class="row">
            <div class="institution-name">${resumeData.education.institution}</div>
            <div class="location">${resumeData.education.location}</div>
        </div>
        <div class="row">
            <div class="degree-name">${resumeData.education.degree}</div>
            <div class="date">${resumeData.education.expectedDate}</div>
        </div>
        <div class="details-text">${resumeData.education.major}</div>
        <div class="details-text">Cumulative GPA: ${resumeData.education.gpa}</div>
        <div class="coursework"><strong>Relevant Coursework:</strong> ${resumeData.education.relevantCoursework}</div>
    </div>

    <div>
        <div class="section-title">Projects</div>
        ${resumeData.projects.map(proj => `
            <div style="margin-bottom: 5px;">
                <div class="row">
                    <div class="project-name">${proj.name}</div>
                    <div class="project-links">
                        ${proj.links.map((link, idx) => `
                            <a href="${link.url}" target="_blank">${link.label}</a>${idx < proj.links.length - 1 ? ', ' : ''}
                        `).join('')}
                    </div>
                </div>
                <div class="row">
                    <div class="project-subtitle">${proj.subtitle}</div>
                    <div class="date">${proj.date}</div>
                </div>
                <ul class="bullets">
                    ${proj.bullets.map(bullet => `
                        <li>${bullet}</li>
                    `).join('')}
                </ul>
            </div>
        `).join('')}
    </div>

    <div>
        <div class="section-title">Additional</div>
        <div class="additional-item">
            <strong>Technical Skills:</strong> ${resumeData.additional.technicalSkills}
        </div>
        <div class="additional-item">
            <strong>Languages:</strong> ${resumeData.additional.languages}
        </div>
        <div class="additional-item">
            <strong>Achievements:</strong> ${resumeData.additional.achievements}
        </div>
    </div>
</body>
</html>`
}

/**
 * Compiles the HTML using Puppeteer and prints to a PDF buffer
 */
async function generatePdfFromHtml(htmlContent) {
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        })
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })
        
        // Generate A4 PDF with exact A4 sizing layout and 0 margin on Page setting, 
        // since the margin padding is handled by the HTML body itself (0.4in padding).
                const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px"
            }
        })
        return Buffer.from(pdfBuffer)
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}

module.exports = {
    generateTailoredResumeData,
    renderResumeHtml,
    generatePdfFromHtml
}
