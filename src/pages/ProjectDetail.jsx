import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/mockData'
import './ProjectDetail.css'

function SkillPill({ label, highlighted }) {
  return <span className={`pd-pill ${highlighted ? 'pd-pill-hl' : ''}`}>{label}</span>
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="pd-page">
        <div className="pd-container">
          <p>Project not found. <Link to="/projects">Go back</Link></p>
        </div>
      </div>
    )
  }

  return (
    <div className="pd-page">
      <div className="pd-layout">
        {/* Left sidebar */}
        <aside className="pd-sidebar">
          <p className="pd-status">{project.status}</p>
          <h1 className="pd-title">{project.name}</h1>
          <h2 className="pd-lab">{project.lab}</h2>
          <p className="pd-location">📍 {project.location}</p>

          <div className="pd-sidebar-actions">
            <button className="pd-action-btn">Stay Updated</button>
            <button className="pd-action-btn">Contact {project.coordinator}</button>
          </div>

          <div className="pd-sidebar-section">
            <p className="pd-sidebar-label">Project Topics</p>
            <div className="pd-tags">
              {project.topics.map((t, i) => (
                <span key={i} className="pd-topic-tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="pd-sidebar-section">
            <p className="pd-sidebar-label">Looking for</p>
            <div className="pd-tags">
              {project.lookingFor.map((l, i) => (
                <span key={i} className="pd-looking-tag">{l}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="pd-main">
          <div className="pd-section">
            <p className="pd-section-label">Project Description</p>
            <div className="pd-description">
              {project.description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="pd-section">
            <p className="pd-section-label">Gallery</p>
            <div className="pd-gallery">
              {project.gallery.map((img, i) => (
                <div key={i} className="pd-gallery-item">
                  <div className="pd-gallery-img" style={{ background: img.color }}>
                    <span className="pd-gallery-initial">{img.caption[0]}</span>
                  </div>
                  <p className="pd-gallery-caption">{img.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-section">
            <div className="pd-people-header">
              <p className="pd-section-label" style={{ marginBottom: 0 }}>People</p>
              <Link to={`/projects/${id}/skills-map`} className="pd-skills-map-btn">
                See Skills Map
              </Link>
            </div>
            <div className="pd-people-list">
              {project.people.map(person => (
                <div key={person.id} className={`pd-person-card ${person.isHighlighted ? 'pd-person-hl' : ''}`}>
                  <div className="pd-person-avatar" style={{ background: person.isHighlighted ? '#00B4C8' : '#e0e0e0', color: person.isHighlighted ? 'white' : '#555' }}>
                    {person.initials}
                  </div>
                  <div className="pd-person-info">
                    <p className="pd-person-name">{person.name}</p>
                    <p className="pd-person-role">{person.role}</p>
                    <p className="pd-person-title">{person.title}</p>
                    <p className="pd-person-contact">Contact {person.email} | {person.phone}</p>
                  </div>
                  {person.isHighlighted && (
                    <button className="pd-contact-coordinator-btn">Contact Project Coordinator</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
