import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import MyProfile from './pages/MyProfile'
import FindCollaborators from './pages/FindCollaborators'
import CollaboratorProfile from './pages/CollaboratorProfile'
import FindProjects from './pages/FindProjects'
import MyProjects from './pages/MyProjects'
import ProjectDetail from './pages/ProjectDetail'
import SkillsMap from './pages/SkillsMap'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/collaborators" replace />} />
        <Route path="/collaborators" element={<FindCollaborators />} />
        <Route path="/collaborators/:id" element={<CollaboratorProfile />} />
        <Route path="/projects" element={<FindProjects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/skills-map" element={<SkillsMap />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </BrowserRouter>
  )
}
