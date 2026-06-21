import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import "../style/interview.scss"

const sampleReportData = {
  _id: "6a346f50a5b9254a10c72881",
  jobDescription: "Backend Web Developer\nLocation\n\nMumbai, India (Hybrid)\n\nExperience\n\n0–2 Years\n\nJob Type\n\nFull-Time\n\nAbout the Role\n\nWe are looking for a Backend Web Developer to design, develop, and maintain scalable web applications and APIs. You will work closely with frontend developers, designers, and product teams to build reliable and secure backend systems.\n\nResponsibilities\nDevelop and maintain RESTful APIs and backend services.\nDesign and manage databases efficiently.\nIntegrate third-party APIs and services.\nWrite clean, maintainable, and well-documented code.\nOptimize application performance and scalability.\nImplement authentication and authorization mechanisms.\nDebug and resolve backend-related issues.\nCollaborate with frontend developers to ensure seamless integration.\nParticipate in code reviews and technical discussions.\nRequired Skills\nStrong knowledge of JavaScript/TypeScript.\nExperience with Node.js and Express.js.\nUnderstanding of REST APIs.\nKnowledge of SQL databases (MySQL/PostgreSQL) or NoSQL databases (MongoDB).\nFamiliarity with Git and GitHub.\nUnderstanding of authentication methods such as JWT and OAuth.\nBasic knowledge of cloud platforms and deployment.",
  resume: "AASHAY KAMBLE\nMumbai, MH | P: +91 9175109492 | aashaykamble911@gmail.com | GitHub | LinkedIn\nEDUCATION\nVEERAMTA JIJABAI TECHNOLOGICAL INSTITUTE \tMumbai, MH\nBachelor of Technology \tExpected 2028\nMajor in Information Technology; Minors in Entrepreneurship\nCumulative GPA: 7.04\nRelevant Coursework: DBMS; Operating Systems; Design and Analysis of Algorithms; Artificial Intelligence; Data Structures\nPROJECTS\nOneVJTI \tGitHub (Backend only)\nGitHub (Full project)\nBackend Development \tJan 2026\n● Built a role-based backend system using Node.js, Express, and MongoDB to manage committees, members, events, and registrations for organizational workflows",
  selfDescription: "A passionate and detail-oriented Backend Developer with a strong foundation in server-side development, database management, and API design. Skilled in building scalable and efficient backend systems using modern technologies while ensuring security, performance, and reliability. Experienced in developing RESTful APIs, working with databases, and integrating third-party services. Possesses strong problem-solving abilities, a solid understanding of software development principles, and a commitment to writing clean, maintainable code. Eager to contribute to impactful projects, collaborate with cross-functional teams, and continuously expand technical expertise in backend engineering and cloud technologies.",
  matchScore: 90,
  technicalQuestions: [
    {
      question: "Can you explain the Node.js event loop and how it handles asynchronous operations?",
      intention: "To assess the candidate's understanding of Node.js's fundamental concurrency model and how it processes I/O operations without blocking.",
      answer: "The Node.js event loop is a single-threaded, non-blocking I/O model that allows Node.js to perform asynchronous operations. It continuously checks the call stack for tasks to execute. If it encounters an asynchronous operation (like a network request or file I/O), it offloads it to the system kernel (or worker threads for CPU-bound tasks). Once the operation completes, its callback is moved to the message queue. The event loop then pushes callbacks from the message queue to the call stack when the call stack is empty. Key phases include timers, pending callbacks, poll, check, and close callbacks. This mechanism is crucial for Node.js's high performance in I/O-bound applications."
    },
    {
      question: "You've used JWT for authentication in your projects. Can you describe how JWT works and compare it to session-based authentication, highlighting pros and cons of each?",
      intention: "To evaluate their understanding of authentication mechanisms beyond basic implementation, including security and scalability considerations.",
      answer: "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of a header, payload, and signature. Upon successful login, the server issues a JWT to the client, which stores it (e.g., in local storage or cookies) and sends it with subsequent requests. The server verifies the signature to ensure authenticity. The main difference from session-based authentication is that JWTs are stateless; the server doesn't need to maintain session information. This makes JWTs highly scalable for distributed systems. Pros of JWT: stateless, good for microservices, mobile-friendly. Cons: larger token size, potential for XSS if stored insecurely, requires refresh tokens for long sessions. Session-based authentication is stateful; the server stores session data and uses a session ID (often in a cookie). Pros: easy revocation, less vulnerable to XSS if cookies are HttpOnly. Cons: difficult to scale horizontally, requires session storage (e.g., Redis) for multiple servers, vulnerable to CSRF."
    },
    {
      question: "In your 'OneVJTI' and 'MediaHub' projects, you designed MongoDB schemas. Can you elaborate on your schema design choices, particularly regarding relationships and how you optimized data retrieval?",
      intention: "To probe their practical experience with NoSQL database design, understanding of trade-offs, and optimization techniques.",
      answer: "In both projects, I primarily used MongoDB, which is schema-less but benefits greatly from thoughtful design. For 'OneVJTI' (managing committees, events, registrations), I designed normalized schemas to reduce redundancy and ensure referential integrity for entities like committees, members, and events, using references between collections. For 'MediaHub' (social media with posts, likes, comments), I used a mix of embedding and referencing. For instance, comments might be embedded within a post document if they are tightly coupled and always accessed together, improving read performance. However, for users and their interactions (likes, subscriptions), I used references to avoid data duplication and allow for flexible querying across different types of content. To optimize data retrieval, especially for complex relationships and engagement metrics, I leveraged MongoDB aggregation pipelines extensively. This allowed me to reduce multiple database calls into optimized single-query pipelines, for example, fetching a post, its creator, and a count of likes/comments efficiently."
    },
    {
      question: "The job description mentions 'optimizing application performance and scalability'. What strategies or techniques would you consider to achieve this in a Node.js backend application?",
      intention: "To assess their knowledge of performance tuning and architectural considerations for scalable backend systems.",
      answer: "To optimize performance and scalability in a Node.js backend, I would focus on several areas. First, **database optimization** is key: ensuring proper indexing, optimizing queries (as I did with MongoDB aggregation pipelines), and choosing the right database for the workload. Second, **caching** with tools like Redis (which I'm familiar with) can significantly reduce database load by storing frequently accessed data. Third, **load balancing** across multiple Node.js instances can distribute traffic and improve throughput. Fourth, **asynchronous programming** and non-blocking I/O are inherent to Node.js, so ensuring efficient use of the event loop and offloading CPU-intensive tasks to worker threads (if necessary) is important. Fifth, **efficient API design** (e.g., using pagination, filtering, projection, and avoiding N+1 queries) helps. Finally, **code optimization** through profiling, reducing unnecessary computations, and using efficient algorithms also contributes to overall performance."
    }
  ],
  behavioralQuestions: [
    {
      question: "Tell me about a challenging technical problem you encountered in one of your projects and how you approached solving it.",
      intention: "To assess problem-solving skills, debugging techniques, resilience, and ability to learn from challenges.",
      answer: "In my MediaHub project, I faced a challenge with efficiently querying and aggregating diverse relational data (users, posts, likes, comments) for user feeds and engagement metrics. Initially, I was making multiple separate database calls, which impacted performance. My approach was to dive deep into MongoDB's aggregation framework. I started by understanding the data relationships more thoroughly, then experimented with different aggregation stages like $lookup for joins, $group for counts, and $project for shaping output. It took some trial and error to craft a single, optimized pipeline that could fetch posts, their authors, the number of likes, and a sample of comments in one go. This significantly reduced database round trips and improved the API's response time, teaching me the power of leveraging database-specific features for optimization."
    },
    {
      question: "How do you ensure your code is clean, maintainable, and well-documented, especially when working in a team environment?",
      intention: "To understand their commitment to code quality, best practices, and collaborative development principles mentioned in the job description.",
      answer: "I believe clean, maintainable, and well-documented code is crucial for team productivity and project longevity. I adhere to several practices: following consistent coding conventions and style guides (often enforced with linters like ESLint), using meaningful variable and function names, breaking down complex logic into smaller, modular functions, and writing clear, concise comments where necessary, especially for non-obvious logic. For APIs, I prioritize clear and consistent endpoint naming, request/response structures, and comprehensive API documentation (e.g., OpenAPI/Swagger, though I've primarily focused on good READMEs for my projects). In a team, I'd actively participate in code reviews, providing constructive feedback and being open to receiving it, ensuring that our collective codebase maintains high standards."
    },
    {
      question: "The role requires collaboration with frontend developers. Describe a time you successfully collaborated with a frontend team or individual to ensure a seamless integration.",
      intention: "To evaluate their teamwork, communication skills, and ability to work effectively across different development stacks.",
      answer: "In my OneVJTI project, I was responsible for the backend, and another team member handled the frontend. Our collaboration was key to the project's success. We started by clearly defining the API contracts – specifying endpoints, HTTP methods, request payloads, and expected response structures. We used tools like Postman to document and test the API endpoints independently. We had regular sync-up meetings, at least twice a week, to discuss progress, any breaking changes, and resolve integration issues. For example, there was a point where the frontend needed a specific data structure for event registrations that differed slightly from my initial backend design. Through open communication, we found a middle ground, either by adjusting the API response or by transforming the data on the frontend, ensuring minimal friction and a smooth user experience. This iterative feedback loop was crucial for a seamless integration."
    },
    {
      question: "Where do you see yourself developing professionally in the next 2-3 years, particularly concerning backend development and cloud technologies?",
      intention: "To gauge their ambition, self-awareness, and alignment with potential growth paths within the company, given their expressed desire to continuously expand technical expertise.",
      answer: "In the next 2-3 years, I aim to significantly deepen my expertise in backend engineering. I want to move beyond foundational knowledge and gain hands-on experience with more complex system architectures, such as microservices, which I've only explored theoretically so far. I also intend to become proficient in a major cloud platform like AWS or GCP, understanding services like EC2, S3, RDS, and Lambda for scalable deployments and infrastructure management. I'm eager to contribute to projects that involve optimizing for high traffic, building resilient systems, and exploring new technologies like serverless functions or advanced caching strategies. My goal is to become a well-rounded backend developer capable of designing, building, and maintaining robust, scalable, and secure applications in a cloud-native environment."
    }
  ],
  skillGaps: [
    { skill: "TypeScript proficiency", severity: "medium" },
    { skill: "Cloud Platform (AWS/Azure/GCP) hands-on experience", severity: "medium" },
    { skill: "CI/CD pipelines experience", severity: "medium" },
    { skill: "Microservices architecture experience", severity: "low" },
    { skill: "SQL database project experience", severity: "low" }
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "Core Node.js, Express & JavaScript (incl. TypeScript basics)",
      tasks: [
        "Review Node.js event loop, streams, and error handling mechanisms.",
        "Deepen understanding of Express middleware, routing, and common security practices (e.g., input validation, rate limiting).",
        "Familiarize with TypeScript syntax, basic types, interfaces, and how it integrates with Node.js/Express projects."
      ]
    },
    {
      day: 2,
      focus: "Database Management (MongoDB & PostgreSQL) & API Design",
      tasks: [
        "Review advanced MongoDB aggregation pipelines, indexing strategies, and schema design principles for scalability.",
        "Refresh PostgreSQL basics: common queries, joins, normalization forms, and transactions.",
        "Study REST API design best practices: idempotency, versioning, status codes, and error handling."
      ]
    },
    {
      day: 3,
      focus: "Authentication, Authorization & Docker",
      tasks: [
        "Deep dive into JWT security best practices, refresh token mechanisms, and common vulnerabilities.",
        "Understand OAuth 2.0 flows and principles.",
        "Practice Dockerizing a Node.js application, creating a Dockerfile, and basic Docker Compose setups."
      ]
    },
    {
      day: 4,
      focus: "Cloud Fundamentals & Performance Optimization",
      tasks: [
        "Research fundamental concepts of a major cloud provider (e.g., AWS: EC2, S3, RDS, Lambda, VPC).",
        "Review caching strategies using Redis: use cases, eviction policies, and implementation patterns.",
        "Study general principles of application scalability, load balancing, and monitoring."
      ]
    },
    {
      day: 5,
      focus: "Behavioral Questions & Project Review",
      tasks: [
        "Practice answering common behavioral questions using the STAR method, focusing on collaboration, problem-solving, and conflict resolution.",
        "Prepare to articulate technical decisions, challenges, and lessons learned from 'OneVJTI' and 'MediaHub' in detail.",
        "Review resume and self-description for talking points and areas to highlight relevant experience."
      ]
    }
  ]
}

const Interview = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const { user, handleLogout } = useAuth()
  const { getReportById, loading, report: contextReport } = useInterview()
  const [fallbackReport, setFallbackReport] = useState(null)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("technical") // 'technical' | 'behavioral' | 'roadmap' | 'details'
  
  // Keep track of ticked roadmap tasks in state
  const [completedTasks, setCompletedTasks] = useState({})
  
  // Expanded card indices for showing answers
  const [expandedCards, setExpandedCards] = useState({})

  const report = contextReport || fallbackReport

  useEffect(() => {
    if (interviewId) {
      getReportById({ interviewId }).catch(err => {
        console.warn("Backend endpoints not fully deployed or returned error. Falling back to sample data.", err)
        setFallbackReport(sampleReportData)
      })
    }
  }, [interviewId])

  const toggleTask = (dayIndex, taskIndex) => {
    const key = `${dayIndex}-${taskIndex}`
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleExpand = (type, index) => {
    const key = `${type}-${index}`
    setExpandedCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Copy helper
  const copyToClipboard = (text, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    const btn = e.currentTarget
    const origText = btn.innerHTML
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Copied!`
    btn.style.color = "#34d399"
    setTimeout(() => {
      btn.innerHTML = origText
      btn.style.color = ""
    }, 2000)
  }

  if (loading) {
    return (
      <main className="interview-page loading-state">
        <header className="dashboard-header">
          <a href="/" className="brand-logo">
            <span>Jobnosis.</span>
          </a>
        </header>
        <div className="skeleton-container">
          <div className="skeleton-sidebar">
            <div className="skeleton-bar title"></div>
            <div className="skeleton-bar nav-item"></div>
            <div className="skeleton-bar nav-item"></div>
            <div className="skeleton-bar nav-item"></div>
          </div>
          <div className="skeleton-main">
            <div className="skeleton-bar header"></div>
            <div className="skeleton-bar paragraph-line"></div>
            <div className="skeleton-bar card"></div>
            <div className="skeleton-bar card"></div>
          </div>
          <div className="skeleton-right">
            <div className="skeleton-bar score-circle"></div>
            <div className="skeleton-bar gap-title"></div>
            <div className="skeleton-bar chip"></div>
            <div className="skeleton-bar chip"></div>
          </div>
        </div>
      </main>
    )
  }

  if (!report) {
    return (
      <main className="interview-page error-state">
        <header className="dashboard-header">
          <a href="/" className="brand-logo">
            <span>Jobnosis.</span>
          </a>
          <button className="button primary-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </header>
        <div className="error-card">
          <h2>Oops! Report Not Found</h2>
          <p>We couldn't retrieve the interview report details for ID: <code>{interviewId}</code>.</p>
          <button className="button primary-button" onClick={() => navigate('/')}>
            Generate New Report
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="interview-page">
      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <a href="/" className="brand-logo">
            <span>Jobnosis.</span>
          </a>
          <div className="header-breadcrumbs">
            <span className="separator">/</span>
            <span className="breadcrumb-current">Interview <i>Report</i></span>
          </div>
        </div>
        <div className="user-nav">
          {user && (
            <span className="username-display">
              Welcome, {user.username || user.email}
            </span>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout Grid */}
      <div className="dashboard-layout">

        {/* Left column: Navigation Menu */}
        <aside className="left-sidebar">
          <div className="sidebar-group">
            <h3>Diagnostic Views</h3>
            <nav className="sidebar-nav">
              <button
                className={`nav-button ${activeTab === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveTab('technical')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                Technical Questions
              </button>
              <button
                className={`nav-button ${activeTab === 'behavioral' ? 'active' : ''}`}
                onClick={() => setActiveTab('behavioral')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Behavioral Questions
              </button>
              <button
                className={`nav-button ${activeTab === 'roadmap' ? 'active' : ''}`}
                onClick={() => setActiveTab('roadmap')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                Road Map
              </button>
            </nav>
          </div>

          <div className="sidebar-group footer-details-group">
            <h3>Submitted Data</h3>
            <nav className="sidebar-nav">
              <button
                className={`nav-button ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
                Profile & JD Details
              </button>
            </nav>
          </div>
        </aside>

        {/* Middle column: Main Content Panel */}
        <section className="main-content-area">
          <div className="content-container">

            {/* Technical Questions View */}
            {activeTab === 'technical' && (
              <div className="tab-pane">
                <div className="pane-header">
                  <h2>Technical <i>Questions</i></h2>
                  <p>Targeted core engineering interview questions curated specifically from your match profile.</p>
                </div>

                <div className="questions-list">
                  {report.technicalQuestions && report.technicalQuestions.map((item, idx) => {
                    const isOpen = !!expandedCards[`tech-${idx}`]
                    return (
                      <div key={idx} className={`question-card ${isOpen ? 'expanded' : ''}`}>
                        <div className="card-header" onClick={() => toggleExpand('tech', idx)}>
                          <div className="q-badge">Q{idx + 1}</div>
                          <h3 className="q-title">{item.question}</h3>
                          <span className="expand-icon-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="chevron-icon">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </div>

                        {isOpen && (
                          <div className="card-body">
                            <div className="meta-section intention-box">
                              <span className="meta-label">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="12" y1="16" x2="12" y2="12" />
                                  <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                Interviewer's Intention
                              </span>
                              <p className="meta-content">{item.intention}</p>
                            </div>

                            <div className="meta-section answer-box">
                              <div className="answer-header">
                                <span className="meta-label">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                  </svg>
                                  Model Answer & Preparation Tips
                                </span>
                                <button className="copy-btn" onClick={(e) => copyToClipboard(item.answer, e)}>
                                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                  </svg>
                                  Copy
                                </button>
                              </div>
                              <p className="meta-content text-glow-light">{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Behavioral Questions View */}
            {activeTab === 'behavioral' && (
              <div className="tab-pane">
                <div className="pane-header">
                  <h2>Behavioral <i>Questions</i></h2>
                  <p>Situational questions designed to check fit, leadership capabilities, and cross-team collaboration.</p>
                </div>

                <div className="questions-list">
                  {report.behavioralQuestions && report.behavioralQuestions.map((item, idx) => {
                    const isOpen = !!expandedCards[`behav-${idx}`]
                    return (
                      <div key={idx} className={`question-card ${isOpen ? 'expanded' : ''}`}>
                        <div className="card-header" onClick={() => toggleExpand('behav', idx)}>
                          <div className="q-badge behavioral">Q{idx + 1}</div>
                          <h3 className="q-title">{item.question}</h3>
                          <span className="expand-icon-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="chevron-icon">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </div>

                        {isOpen && (
                          <div className="card-body">
                            <div className="meta-section intention-box behavioral">
                              <span className="meta-label">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="12" y1="16" x2="12" y2="12" />
                                  <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                Interviewer's Intention
                              </span>
                              <p className="meta-content">{item.intention}</p>
                            </div>

                            <div className="meta-section answer-box behavioral">
                              <div className="answer-header">
                                <span className="meta-label">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                  </svg>
                                  Suggested Response Strategy (STAR Method)
                                </span>
                                <button className="copy-btn" onClick={(e) => copyToClipboard(item.answer, e)}>
                                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                  </svg>
                                  Copy
                                </button>
                              </div>
                              <p className="meta-content text-glow-light">{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Road Map View */}
            {activeTab === 'roadmap' && (
              <div className="tab-pane">
                <div className="pane-header">
                  <h2>Preparation <i>Road Map</i></h2>
                  <p>A day-by-day customized training curriculum to study core topics, plug gaps, and build solid talking points.</p>
                </div>

                <div className="timeline-container">
                  {report.preparationPlan && report.preparationPlan.map((dayData, dIdx) => (
                    <div key={dIdx} className="timeline-day-card">
                      <div className="day-badge-column">
                        <div className="day-badge">Day <i>{dayData.day}</i></div>
                        <div className="day-connector-line"></div>
                      </div>
                      <div className="day-content-panel">
                        <div className="day-header">
                          <h4>{dayData.focus}</h4>
                        </div>
                        <ul className="day-task-list">
                          {dayData.tasks && dayData.tasks.map((task, tIdx) => {
                            const isTicked = !!completedTasks[`${dIdx}-${tIdx}`]
                            return (
                              <li
                                key={tIdx}
                                className={`task-item ${isTicked ? 'checked' : ''}`}
                                onClick={() => toggleTask(dIdx, tIdx)}
                              >
                                <div className="custom-checkbox">
                                  {isTicked && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </div>
                                <span className="task-text">{task}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile & JD Details View */}
            {activeTab === 'details' && (
              <div className="tab-pane details-pane">
                <div className="pane-header">
                  <h2>Profile & <i>JD Summary</i></h2>
                  <p>Verify details of the job requirements and experience data used for this evaluation.</p>
                </div>

                <div className="details-grid">
                  <div className="details-card">
                    <h4>Submitted Job Description</h4>
                    <pre className="details-text-box">{report.jobDescription}</pre>
                  </div>

                  {report.selfDescription && (
                    <div className="details-card">
                      <h4>Self Description</h4>
                      <pre className="details-text-box">{report.selfDescription}</pre>
                    </div>
                  )}

                  {report.resume && (
                    <div className="details-card full-width">
                      <h4>Extracted Resume Text</h4>
                      <pre className="details-text-box">{report.resume}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Right column: Skill Gaps and Match Score */}
        <aside className="right-sidebar">
          {/* Match Score Card */}
          <div className="sidebar-widget score-widget">
            <h3>Match Score</h3>
            <div className="score-radial-container">
              <svg viewBox="0 0 36 36" className="circular-chart-svg">
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle-fill-bar"
                  strokeDasharray={`${report.matchScore || 0}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="score-percentage-text">
                <span className="percent-val">{report.matchScore || 0}%</span>
                <span className="percent-lbl">Match Rate</span>
              </div>
            </div>
            <div className="score-footer-text">
              {report.matchScore >= 80 ? (
                <span className="status-pill high">Highly Compatible</span>
              ) : report.matchScore >= 50 ? (
                <span className="status-pill medium">Medium Fit</span>
              ) : (
                <span className="status-pill low">Action Required</span>
              )}
            </div>
          </div>

          {/* Skill Gaps Widget */}
          <div className="sidebar-widget skillgaps-widget">
            <h3>Skill Gaps</h3>
            <p className="widget-desc">Key requirements missing or underdeveloped in your profile credentials:</p>
            <div className="skills-tag-cloud">
              {report.skillGaps && report.skillGaps.length > 0 ? (
                report.skillGaps.map((item, idx) => (
                  <div key={idx} className={`skill-tag-chip severity-${item.severity}`}>
                    <span className="skill-name">{item.skill}</span>
                    <span className="severity-dot" title={`Severity: ${item.severity}`}></span>
                  </div>
                ))
              ) : (
                <div className="no-gaps-message">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  No skill gaps detected! Excellent match!
                </div>
              )}
            </div>
          </div>
        </aside>

      </div>
    </main>
  )
}

export default Interview
