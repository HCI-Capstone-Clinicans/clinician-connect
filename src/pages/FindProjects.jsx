import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/mockData'
import './FindProjects.css'

export default function FindProjects() {
  const [search, setSearch] = useState('')

  const filtered = projects.filter(p => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.lab.toLowerCase().includes(q) ||
      p.topics.some(t => t.toLowerCase().includes(q)) ||
      p.lookingFor.some(l => l.toLowerCase().includes(q))
    )
  })

  return (
    <div className="fp-page">
      <div className="fp-container">
        <div className="fp-search-row">
          <div className="fp-search-box">
            <span className="fp-search-icon">🔍</span>
            <input
              type="text"
              className="fp-search-input"
              placeholder="Search projects, topics, roles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="fp-filter-btn">⚙ Filter</button>
          <button className="fp-filter-btn">↕ Sort by</button>
        </div>

        <p className="fp-count">Results 1–{filtered.length}</p>

        <div className="fp-list">
          {filtered.map(proj => (
            <Link to={`/projects/${proj.id}`} key={proj.id} className="fp-card">
              <div className="fp-card-left">
                <div className="fp-project-color-block" style={{ background: proj.gallery?.[0]?.color || '#ccc' }}>
                  <span className="fp-project-initial">{proj.name[0]}</span>
                </div>
              </div>
              <div className="fp-card-info">
                <p className="fp-status">{proj.status}</p>
                <h2 className="fp-proj-name">{proj.name}</h2>
                <p className="fp-lab">{proj.lab}</p>
                <p className="fp-location">📍 {proj.location}</p>
                <div className="fp-topics">
                  {proj.topics.map((t, i) => (
                    <span key={i} className="fp-topic-tag">{t}</span>
                  ))}
                </div>
                <p className="fp-looking-label">Looking for:</p>
                <div className="fp-topics">
                  {proj.lookingFor.map((l, i) => (
                    <span key={i} className="fp-looking-tag">{l}</span>
                  ))}
                </div>
              </div>
              <div className="fp-card-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
