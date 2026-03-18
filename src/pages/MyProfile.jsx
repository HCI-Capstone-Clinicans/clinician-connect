import { useState } from 'react'
import { currentUser } from '../data/mockData'
import './MyProfile.css'

function Avatar({ initials, color, size = 90 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}>
      {initials}
    </div>
  )
}

function SkillPill({ label }) {
  return <span className="skill-pill">{label}</span>
}

function SectionHeader({ title, onEdit }) {
  return (
    <div className="section-header">
      <span className="section-label">{title}</span>
      {onEdit && (
        <button className="edit-btn" onClick={onEdit} aria-label="Edit">
          ✎
        </button>
      )}
    </div>
  )
}

export default function MyProfile() {
  const user = currentUser
  const [editingBlurb, setEditingBlurb] = useState(false)
  const [blurbText, setBlurbText] = useState(user.blurb)

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="page-title">My Profile</h1>

        <div className="import-buttons">
          <button className="import-btn">Import from LinkedIn</button>
          <button className="import-btn">Import from ORCID</button>
        </div>

        {/* Blurb */}
        <div className="profile-card">
          <SectionHeader title="My Blurb" onEdit={() => setEditingBlurb(!editingBlurb)} />
          <div className="blurb-content">
            <Avatar initials={user.initials || 'VA'} color={user.avatarColor} size={100} />
            <div className="blurb-info">
              <h2 className="blurb-name">{user.name}</h2>
              <p className="blurb-title">{user.title}</p>
              {editingBlurb ? (
                <textarea
                  className="blurb-textarea"
                  value={blurbText}
                  onChange={e => setBlurbText(e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="blurb-institution">{user.institution}</p>
              )}
              <p className="blurb-contact">Contact {user.email} | {user.phone}</p>
            </div>
          </div>
        </div>

        {/* My Projects */}
        <div className="profile-card">
          <SectionHeader title="My Projects" onEdit={() => {}} />
          <div className="projects-grid">
            {user.projects.map(proj => (
              <div key={proj.id} className="project-thumbnail">
                <div className="project-thumb-image" style={{ background: proj.color }}>
                  <span className="project-thumb-label">{proj.name}</span>
                </div>
                <p className="project-thumb-name">{proj.name}</p>
              </div>
            ))}
            <div className="project-thumbnail project-add">
              <div className="project-thumb-image project-add-box">
                <span className="project-add-icon">+</span>
              </div>
              <p className="project-thumb-name">Add another project</p>
            </div>
          </div>
        </div>

        {/* My Testimonials */}
        <div className="profile-card">
          <SectionHeader title="My Testimonials" onEdit={() => {}} />
          <button className="request-testimonial-btn">Request a Testimonial</button>
          <div className="testimonials-list">
            {user.testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="testimonial-text">{t.text}</p>
                <p className="testimonial-source">{t.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My Resume */}
        <div className="profile-card">
          <SectionHeader title="My Resume" onEdit={() => {}} />
          <div className="resume-content">
            <div className="resume-preview">
              <div className="resume-doc-preview">
                <div className="resume-lines">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="resume-line" style={{ width: `${60 + Math.random() * 30}%` }} />
                  ))}
                </div>
              </div>
              <p className="resume-label">My resume</p>
            </div>
            <div className="resume-insights">
              <h3 className="insights-title">Insights Generated</h3>
              {user.resumeInsights.map((insight, i) => (
                <div key={i} className="insight-item">
                  <h4 className="insight-heading">{insight.title}</h4>
                  <p className="insight-body">{insight.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Skills */}
        <div className="profile-card">
          <SectionHeader title="My Skills" onEdit={() => {}} />
          <div className="skills-grid">
            {user.skills.map((skill, i) => (
              <SkillPill key={i} label={skill} />
            ))}
          </div>
        </div>

        {/* My Interests */}
        <div className="profile-card">
          <SectionHeader title="My Interests" onEdit={() => {}} />
          <div className="skills-grid">
            {user.interests.map((interest, i) => (
              <SkillPill key={i} label={interest} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
