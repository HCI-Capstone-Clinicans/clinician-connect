import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projects, currentUser } from '../data/mockData'
import './SkillsMap.css'

const YOU_CIRCLE = {
  id: 'you',
  name: 'You',
  role: currentUser.title,
  cx: 360, cy: 280, r: 200,
  color: 'rgba(70, 130, 200, 0.55)',
  strokeColor: 'rgba(50, 100, 180, 0.7)',
  uniqueSkills: [
    { label: 'Product Design', x: 190, y: 220 },
    { label: 'Visual Design', x: 230, y: 285 },
  ],
}

const YOU_SHARED_SKILLS = [
  { label: 'Product Development', x: 468, y: 228 },
]

export default function SkillsMap() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  const [showYou, setShowYou] = useState(false)
  const [zoom, setZoom] = useState(50)

  if (!project) {
    return (
      <div className="sm-page">
        <p>Project not found. <Link to="/projects">Go back</Link></p>
      </div>
    )
  }

  const { members, sharedSkills } = project.skillsMap
  const scale = 0.6 + (zoom / 100) * 0.8

  return (
    <div className="sm-page">
      <div className="sm-layout">
        {/* Sidebar */}
        <aside className="sm-sidebar">
          <p className="sm-status">{project.status}</p>
          <h1 className="sm-title">{project.name}</h1>
          <h2 className="sm-lab">{project.lab}</h2>
          <p className="sm-location">📍 {project.location}</p>
          <div className="sm-actions">
            <button className="sm-action-btn">Stay Updated</button>
            <button className="sm-action-btn">Contact {project.coordinator}</button>
          </div>
        </aside>

        {/* Map area */}
        <main className="sm-main">
          <p className="sm-section-label">Skills Map</p>
          <div className="sm-canvas-wrapper">
            {/* Controls */}
            <div className="sm-controls">
              <div className="sm-how-fit-wrapper">
                <button
                  className={`sm-how-fit-btn ${showYou ? 'sm-how-fit-active' : ''}`}
                  onClick={() => setShowYou(v => !v)}
                >
                  How do I fit in?
                </button>
                {showYou && (
                  <div className="sm-insights-panel">
                    <p className="sm-insights-heading">Insights Generated</p>
                    <ul className="sm-insights-list">
                      <li>You are closest in skillset to <strong>Andrew Chan</strong></li>
                      <li>Your HCI skills complement the team's engineering focus</li>
                      <li>You can fill the gap in product design and visual communication</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="sm-zoom-control">
                <span className="sm-zoom-label">Zoom</span>
                <span className="sm-zoom-val">0</span>
                <input
                  type="range" min="0" max="100" value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="sm-zoom-slider"
                />
                <span className="sm-zoom-val">100</span>
              </div>
            </div>

            {/* SVG Venn Diagram */}
            <div className="sm-svg-container">
              <svg
                viewBox="0 0 900 750"
                className="sm-svg"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
              >
                {/* You circle (shown when toggled) */}
                {showYou && (
                  <circle
                    cx={YOU_CIRCLE.cx} cy={YOU_CIRCLE.cy} r={YOU_CIRCLE.r}
                    fill={YOU_CIRCLE.color} stroke={YOU_CIRCLE.strokeColor} strokeWidth="2"
                  />
                )}

                {/* Team member circles */}
                {members.map(m => (
                  <circle
                    key={m.id}
                    cx={m.cx} cy={m.cy} r={m.r}
                    fill={m.color} stroke={m.strokeColor} strokeWidth="2"
                  />
                ))}

                {/* You label and skills */}
                {showYou && (
                  <>
                    <text x={YOU_CIRCLE.cx - 110} y={YOU_CIRCLE.cy - 60} className="sm-person-name">
                      {YOU_CIRCLE.name}
                    </text>
                    <text x={YOU_CIRCLE.cx - 110} y={YOU_CIRCLE.cy - 40} className="sm-person-role">
                      {YOU_CIRCLE.role}
                    </text>
                    {YOU_CIRCLE.uniqueSkills.map((s, i) => (
                      <SkillTag key={i} x={s.x} y={s.y} label={s.label} />
                    ))}
                    {YOU_SHARED_SKILLS.map((s, i) => (
                      <SkillTag key={i} x={s.x} y={s.y} label={s.label} />
                    ))}
                  </>
                )}

                {/* Member labels and unique skills */}
                {members.map(m => (
                  <g key={m.id}>
                    <text
                      x={m.id === 'andrew-chan' ? m.cx - 70 : m.id === 'daniel-kim' ? m.cx - 55 : m.id === 'maya-patel' ? m.cx - 70 : m.cx - 70}
                      y={m.id === 'andrew-chan' ? m.cy - 70 : m.id === 'daniel-kim' ? m.cy - 110 : m.id === 'maya-patel' ? m.cy + 100 : m.cy + 70}
                      className="sm-person-name"
                    >
                      {m.name}
                    </text>
                    <text
                      x={m.id === 'andrew-chan' ? m.cx - 70 : m.id === 'daniel-kim' ? m.cx - 55 : m.id === 'maya-patel' ? m.cx - 70 : m.cx - 70}
                      y={m.id === 'andrew-chan' ? m.cy - 50 : m.id === 'daniel-kim' ? m.cy - 90 : m.id === 'maya-patel' ? m.cy + 120 : m.cy + 90}
                      className="sm-person-role"
                    >
                      {m.role}
                    </text>
                    {m.uniqueSkills.map((s, i) => (
                      <SkillTag key={i} x={s.x} y={s.y} label={s.label} />
                    ))}
                  </g>
                ))}

                {/* Shared skills in overlapping zones */}
                {sharedSkills.map((s, i) => (
                  <SkillTag key={i} x={s.x} y={s.y} label={s.label} />
                ))}
              </svg>
            </div>

            {/* Nav buttons */}
            <div className="sm-nav-btns">
              <button className="sm-nav-btn" onClick={() => setZoom(v => Math.max(0, v - 20))}>–</button>
              <button className="sm-nav-btn" onClick={() => setZoom(v => Math.min(100, v + 20))}>+</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SkillTag({ x, y, label }) {
  const width = label.length * 7.5 + 20
  return (
    <g>
      <rect
        x={x - width / 2} y={y - 12}
        width={width} height={24}
        rx={12} ry={12}
        fill="white" stroke="#ddd" strokeWidth="1"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }}
      />
      <text
        x={x} y={y + 5}
        textAnchor="middle"
        fontSize="11"
        fill="#333"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        {label}
      </text>
    </g>
  )
}
