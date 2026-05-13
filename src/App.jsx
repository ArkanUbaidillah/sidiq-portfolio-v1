import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminReports from './pages/admin/AdminReports.jsx'
import AdminProjects from './pages/admin/AdminProjects.jsx'
import AdminCertificates from './pages/admin/AdminCertificates.jsx'
import AdminCourses from './pages/admin/AdminCourses.jsx'
import ReportDetail from './pages/praktikum/ReportDetail.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#e2e8f0',
            border: '1px solid rgba(16,185,129,0.3)',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#000' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sidiq-admin" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>
        <Route path="/praktikum/:courseSlug/:reportSlug" element={<ReportDetail />} />
      </Routes>
    </>
  )
}

export default App
