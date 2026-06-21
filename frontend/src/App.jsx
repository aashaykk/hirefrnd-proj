import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { ResumeProvider } from "./features/resume/resume.context.jsx"

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <ResumeProvider>
          <RouterProvider router={router} />
        </ResumeProvider>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
