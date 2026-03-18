import { Link } from 'react-router-dom'
import { projects } from '../data/mockData'
import './FindProjects.css'

export default function MyProjects() {
  const myProjects = projects.filter(p =>
    p.people.some(person => person.name.toLowerCase().includes('andrew'))
  )

  return (
    <div className="fp-page">
      <div className="fp-container">
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#1a1a1a' }}>My Projects</h1>
        <div className="fp-list">
          {myProjects.map(proj => (
            <Link to={`/projects/${proj.id}`} key={proj.id} className="fp-card">
              <div className="fp-project-color-block" style={{ background: proj.gallery?.[0]?.color || '#ccc' }}>
                <span className="fp-project-initial">{proj.name[0]}</span>
              </div>
              <div className="fp-card-info">
                <p className="fp-status">{proj.status}</p>
                <h2 className="fp-proj-name">{proj.name}</h2>
                <p className="fp-lab">{proj.lab}</p>
                <p className="fp-location">📍 {proj.location}</p>
                <div className="fp-topics">
                  {proj.topics.map((t, i) => <span key={i} className="fp-topic-tag">{t}</span>)}
                </div>
              </div>
              <div className="fp-card-arrow">→</div>
            </Link>
          ))}
          {myProjects.length === 0 && (
            <p style={{ color: '#888', fontSize: 14 }}>You haven't joined any projects yet. <Link to="/projects" style={{ color: '#00B4C8' }}>Find Projects →</Link></p>
          )}
        </div>
      </div>
    </div>
  )
}
