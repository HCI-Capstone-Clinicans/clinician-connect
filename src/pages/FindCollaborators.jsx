import { useState } from 'react'
import { Link } from 'react-router-dom'
import { collaborators } from '../data/mockData'
import './FindCollaborators.css'

function Avatar({ initials, color, size = 180 }) {
  return (
    <div className="collab-avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.28 }}>
      {initials}
    </div>
  )
}

function MatchBadge({ percentage }) {
  const isHigh = percentage >= 70
  return (
    <span className={`match-badge ${isHigh ? 'match-high' : 'match-mid'}`}>
      {percentage}% Match
    </span>
  )
}

function SkillPill({ label }) {
  return <span className="skill-pill">{label}</span>
}

export default function FindCollaborators() {
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const filtered = collaborators.filter(c => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q)) ||
      c.interests.some(i => i.toLowerCase().includes(q))
    )
  })

  return (
    <div className="find-page">
      <div className="find-container">
        <div className="search-bar-row">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Service Designer"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <span>⚙</span> Filter
          </button>
          <button className="filter-btn">
            <span>↕</span> Sort by
          </button>
        </div>

        <p className="results-count">Results 1–{filtered.length}</p>

        <div className="results-list">
          {filtered.map(person => (
            <div key={person.id} className="collab-card">
              <div className="collab-card-badges">
                <MatchBadge percentage={person.matchPercentage} />
                <Link to={`/collaborators/${person.id}`} className="get-in-touch-btn">
                  Get in touch
                </Link>
              </div>

              <div className="collab-card-body">
                <Avatar initials={person.initials} color={person.avatarColor} size={175} />
                <div className="collab-info">
                  <h2 className="collab-name">{person.name}</h2>
                  <p className="collab-title">{person.title}</p>
                  <p className="collab-role">{person.role}</p>
                  <p className="collab-contact">Contact {person.email} | {person.phone}</p>

                  <div className="collab-section">
                    <p className="collab-section-label">Past Projects</p>
                    <div className="projects-tag-row">
                      {person.pastProjects.map(p => (
                        <span key={p.id} className="project-tag">{p.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="collab-section">
                    <p className="collab-section-label">Skills</p>
                    <div className="pills-row">
                      {person.skills.map((s, i) => <SkillPill key={i} label={s} />)}
                    </div>
                  </div>

                  <div className="collab-section">
                    <p className="collab-section-label">Interests</p>
                    <div className="pills-row">
                      {person.interests.map((s, i) => <SkillPill key={i} label={s} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
