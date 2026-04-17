import { Header } from "../components/Header";
import { UserCircle2, Pencil, Mail, MapPin, Clock, X } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useBookmarks } from "../context/BookmarksContext";
import imgProfile from "../../assets/1a8e8f1388acd7e29af0518ac07ccba9821174d6.png";
import imgProject from "../../assets/58fc0ac8e1ce3bfeee1106e5418571c76bcc020d.png";
import imgResume from "../../assets/eea162a3bdec95f2e78582620862a4027b240df8.png";

const myProjects = [
  {
    id: "robodog",
    name: "RoboDog",
    lab: "Carroll Labs",
    location: "UH Cleveland Medical Center",
    role: "HCI Researcher",
    tags: ["Robotics", "Human-Robot Interaction", "Surgery Assistance"],
  },
];

export default function MyProfile() {
  const [showResume, setShowResume] = useState(false);
  const { bookmarks } = useBookmarks();
  const skills = [
    "Product Design",
    "User Research",
    "Prototyping",
    "UX Design",
    "Service Design",
    "Design Thinking",
    "Figma",
  ];

  // Availability data - your general availability
  const myAvailability = [
    { day: "Monday", timeSlots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
    { day: "Tuesday", timeSlots: ["10:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"] },
    { day: "Wednesday", timeSlots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
    { day: "Thursday", timeSlots: ["10:00 AM - 3:00 PM"] },
    { day: "Friday", timeSlots: ["9:00 AM - 11:00 AM", "1:00 PM - 4:00 PM"] },
  ];

  const testimonials = [
    {
      quote: "They have a rare ability to turn messy human experiences into elegant, thoughtful interactions.",
      author: "Colleague, Manager at CMU HCII",
    },
    {
      quote: "Working with them changed the way I think about design research—they ask questions no one else thinks to ask.",
      author: "Grad Student, CMU HCII",
    },
    {
      quote: "Their work consistently bridges rigorous research and real human impact.",
      author: "Industry Partner, UX Research Lead",
    },
  ];

  const insights = [
    {
      title: "Technical Expertise",
      description: "Proven ability to optimize chemical processes and streamline production workflows, resulting in improved efficiency and cost reduction. Strong foundation in analytical chemistry and process engineering.",
    },
    {
      title: "Skilled at Rapid Prototyping and Experimentation",
      description: "Project experience demonstrates a strength in quickly building and testing interactive systems—using tools like sensors, embedded electronics, and digital interfaces—to explore new human–technology interactions.",
    },
    {
      title: "Effective Cross-Disciplinary Collaborator",
      description: "Their background working with designers, engineers, and researchers suggests an ability to communicate across disciplines and help teams align around user-centered goals.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
              <button className="px-4 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 rounded-md">
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-md">
                Import from LinkedIn
              </button>
              <button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-md">
                Import from ORCID
              </button>
              <button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-md">
                Download Resume
              </button>
            </div>
          </div>

          {/* My Availability Section */}
          <div className="bg-white border border-cyan-200 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-cyan-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-[13px] font-semibold text-gray-900 mb-1">My General Availability</h2>
                <p className="text-[12px] text-gray-600 mb-4">
                  Your typical weekly availability for meetings and collaboration (EST)
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {myAvailability.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <h4 className="text-[12px] font-semibold text-gray-900">
                        {day.day}
                      </h4>
                      <div className="space-y-1">
                        {day.timeSlots.map((slot, idx) => (
                          <div 
                            key={idx}
                            className="px-2.5 py-1.5 bg-cyan-50 text-cyan-700 text-[11px] font-medium rounded-md border border-cyan-200"
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                {/* Profile Picture */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <UserCircle2 className="w-16 h-16 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Andrew Chan</h2>
                    <p className="text-[13px] text-gray-600">UX Researcher</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-gray-600">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span>andrew.chan@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>Cleveland, Ohio</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[11px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] border border-gray-200 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Research Interests */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[11px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Research Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Human-Robot Interaction", "Clinical UX", "Healthcare Technology", "Participatory Design", "Accessibility"].map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] border border-gray-200 rounded-md"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collaboration Style */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[11px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Collaboration Style</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Remote-Friendly", "Async-First", "Cross-Disciplinary", "Workshop Facilitator"].map((style) => (
                      <span
                        key={style}
                        className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] border border-gray-200 rounded-md"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Activity</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-[11px] text-gray-500 mb-0.5">Active Projects</div>
                    <div className="text-base font-semibold text-gray-900">1</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 mb-0.5">Collaborators</div>
                    <div className="text-base font-semibold text-gray-900">3</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 mb-0.5">Publications</div>
                    <div className="text-base font-semibold text-gray-900">8</div>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Resume</p>
                <button
                  onClick={() => setShowResume(true)}
                  className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                >
                  View Resume
                </button>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">About</h2>
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  I'm a UX researcher passionate about human-robot interaction and designing systems that enhance surgical precision. 
                  Currently working on the RoboDog project at University Hospitals Cleveland, where I bridge the gap between 
                  technology and clinical practice through user-centered design.
                </p>
              </div>

              {/* AI Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">AI Insights</h2>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200 uppercase tracking-wide">
                    Beta
                  </span>
                </div>
                <div className="space-y-4">
                  {insights.map((insight, idx) => (
                    <div key={idx} className="border-l-2 border-gray-300 pl-4 py-1 rounded-sm">
                      <h3 className="text-[13px] font-semibold text-gray-900 mb-1">{insight.title}</h3>
                      <p className="text-[12px] text-gray-600 leading-relaxed">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Testimonials</h2>
                <div className="space-y-4">
                  {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-md p-4">
                      <p className="text-[13px] text-gray-700 italic mb-2">"{testimonial.quote}"</p>
                      <p className="text-[11px] text-gray-500">— {testimonial.author}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Overview */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Projects</h2>
                  <Link to="/my-projects" className="text-[12px] text-gray-600 hover:text-gray-900 transition-colors">
                    View All →
                  </Link>
                </div>

                {/* My Projects */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Member</p>
                  <div className="space-y-2">
                    {myProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/project/${project.id}`}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[13px] font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                              {project.name}
                            </span>
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-50 text-green-700 border border-green-200 rounded uppercase tracking-wide flex-shrink-0">
                              Active
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500">{project.lab} · {project.role}</p>
                        </div>
                        <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-[11px] text-gray-500 hidden sm:block">{project.location}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Following */}
                {bookmarks.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Following</p>
                    <div className="space-y-2">
                      {bookmarks.map((project) => (
                        <Link
                          key={project.id}
                          to={`/project/${project.id}`}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[13px] font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                                {project.name}
                              </span>
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded uppercase tracking-wide flex-shrink-0">
                                Following
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500">{project.lab} · {project.location}</p>
                          </div>
                          {project.matchPercentage && (
                            <span className="text-[11px] text-gray-500 ml-3 flex-shrink-0">{project.matchPercentage}% match</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {bookmarks.length === 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Following</p>
                    <p className="text-[12px] text-gray-400 px-1">No followed projects yet. Use "Stay Updated" on any project to track it here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Resume Modal */}
      {showResume && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowResume(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <p className="text-[13px] font-semibold text-gray-900">Andrew Chan — Resume</p>
              <button
                onClick={() => setShowResume(false)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              <img
                src={imgResume}
                alt="Resume"
                className="w-full rounded-md border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}