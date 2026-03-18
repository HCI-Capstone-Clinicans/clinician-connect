import { useParams, Link } from 'react-router-dom'
import { collaborators } from '../data/mockData'
import './CollaboratorProfile.css'

function Avatar({ initials, color, size = 140 }) {
  return (
    <div className="cp-avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.28 }}>
      {initials}
    </div>
  )
}

function MatchBadge({ percentage }) {
  const isHigh = percentage >= 70
  return (
    <span className={`cp-match-badge ${isHigh ? 'match-high' : 'match-mid'}`}>
      {percentage}% Match
    </span>
  )
}

function SkillPill({ label }) {
  return <span className="cp-skill-pill">{label}</span>
}

function SectionLabel({ text }) {
  return <p className="cp-section-label">{text}</p>
}

export default function CollaboratorProfile() {
  const { id } = useParams()
  const person = collaborators.find(c => c.id === id)

  if (!person) {
    return (
      <div className="cp-page">
        <div className="cp-container">
          <p>Collaborator not found. <Link to="/collaborators">Go back</Link></p>
        </div>
      </div>
    )
  }

  return (
    <div className="cp-page">
      <div className="cp-container">

        {/* Blurb Card */}
        <div className="cp-card">
          <SectionLabel text="Blurb" />
          <div className="cp-blurb-row">
            <Avatar initials={person.initials} color={person.avatarColor} size={150} />
            <div className="cp-blurb-info">
              <div className="cp-blurb-badges">
                <MatchBadge percentage={person.matchPercentage} />
                <button className="cp-git-btn">Get in touch</button>
              </div>
              <h2 className="cp-name">{person.name}</h2>
              <p className="cp-title">{person.title}</p>
              <p className="cp-role">{person.role}</p>
              <p className="cp-contact">Contact {person.email} | {person.phone}</p>

              <div className="cp-inline-section">
                <p className="cp-inline-label">Skills</p>
                <div className="cp-pills-row">
                  {person.skills.map((s, i) => <SkillPill key={i} label={s} />)}
                </div>
              </div>

              <div className="cp-inline-section">
                <p className="cp-inline-label">Interests</p>
                <div className="cp-pills-row">
                  {person.interests.slice(0, 4).map((s, i) => <SkillPill key={i} label={s} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Projects */}
        <div className="cp-card">
          <div className="cp-card-header">
            <SectionLabel text="Past Projects" />
            <button className="cp-edit-btn" aria-label="Edit">✎</button>
          </div>
          <div className="cp-projects-grid">
            {person.pastProjects.map(proj => (
              <div key={proj.id} className="cp-project-thumb">
                <div className="cp-project-img" style={{ background: proj.color }}>
                  <span className="cp-project-img-label">{proj.name}</span>
                </div>
                <p className="cp-project-name">{proj.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="cp-card">
          <SectionLabel text="Testimonials" />
          <div className="cp-testimonials">
            {person.testimonials.map((t, i) => (
              <div key={i} className="cp-testimonial">
                <p className="cp-testimonial-text">{t.text}</p>
                <p className="cp-testimonial-source">{t.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div className="cp-card">
          <SectionLabel text="Resume" />
          <div className="cp-resume-row">
            <div className="cp-resume-preview">
              <div className="cp-resume-doc">
                <div className="cp-resume-lines">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className="cp-resume-line" style={{ width: `${50 + (i * 7) % 40}%` }} />
                  ))}
                </div>
              </div>
              <p className="cp-resume-link">View resume</p>
            </div>
            <div className="cp-insights">
              <h3 className="cp-insights-title">Insights Generated</h3>
              {person.resumeInsights.map((insight, i) => (
                <div key={i} className="cp-insight-item">
                  <h4 className="cp-insight-heading">{insight.title}</h4>
                  <p className="cp-insight-body">{insight.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="cp-card">
          <SectionLabel text="Skills" />
          <div className="cp-pills-row">
            {person.skills.map((s, i) => <SkillPill key={i} label={s} />)}
          </div>
        </div>

        {/* Interests */}
        <div className="cp-card">
          <SectionLabel text="Interests" />
          <div className="cp-pills-row">
            {person.interests.map((s, i) => <SkillPill key={i} label={s} />)}
          </div>
        </div>

      </div>
    </div>
  )
}
