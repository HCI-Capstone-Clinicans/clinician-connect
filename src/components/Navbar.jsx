import { Link, useLocation, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const isProfilePage = location.pathname === '/profile'

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/collaborators" className="navbar-brand">
          <span className="navbar-logo">✦</span>
          Clinician Connect
        </Link>
        <div className="navbar-links">
          <NavLink to="/collaborators" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Find Collaborators
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Find Projects
          </NavLink>
          <NavLink to="/my-projects" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            My Projects
          </NavLink>
        </div>
      </div>
      <Link to="/profile" className={`navbar-profile-btn ${isProfilePage ? 'active' : ''}`}>
        My Profile
      </Link>
    </nav>
  )
}
