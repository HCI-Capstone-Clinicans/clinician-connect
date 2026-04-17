import { Header } from "../components/Header";
import { Link, useParams } from "react-router";
import { Mail, Phone, MapPin, Clock, TrendingUp, ArrowLeft, Award, CheckCircle2, X, UserCircle2 } from "lucide-react";
import { useState } from "react";
import imgProject1Jane from "../../assets/50ea0122d65dbf98475b5bcd3be009ec20788d72.png";
import imgProject2Jane from "../../assets/9b50c70f59b6a8d251cb854d643ae19e2b09f1ee.png";
import imgResumeJane from "../../assets/63c954fdc052bbdee5ea11e1d6c367589196bb22.png";

type AvailabilityDay = { day: string; timeSlots: string[] };
type Project = { id: number; title: string; role: string; endorsement?: string; image?: string; featured: boolean };
type Testimonial = { id: number; text: string; highlight?: string; author: string };
type Insight = { title: string; description: string };

type ProfileData = {
  name: string;
  role: string;
  organization: string;
  email: string;
  phone: string;
  location: string;
  match: number;
  about: string;
  skills: string[];
  interests: string[];
  collaborationStyle: string[];
  availability: AvailabilityDay[];
  platformYears: string;
  platformProjects: number;
  platformSatisfaction: string;
  platformBio: string;
  stats: { label: string; value: string }[];
  projects: Project[];
  testimonials: Testimonial[];
  insights: Insight[];
  resumeImage?: string;
};

const profiles: Record<string, ProfileData> = {
  "jane-smith": {
    name: "Jane Smith",
    role: "UX Researcher and Designer",
    organization: "UX Research Manager at Philips Medical",
    email: "js@pm.com",
    phone: "555-555-5555",
    location: "Pittsburgh, PA",
    match: 80,
    about:
      "UX researcher and designer specializing in medical device interfaces and surgical robotics. Currently leading UX research at Philips Medical, where I bridge clinical workflows and human-centered design to improve outcomes in operating room environments.",
    skills: ["Service Design", "User Research", "UX Prototyping", "Rapid Prototyping", "Product Design"],
    interests: ["Human-Robot Interaction", "Human-Centered Design", "User Research", "Healthcare"],
    collaborationStyle: ["In-person", "Frequent Communicator", "Team Player"],
    availability: [
      { day: "Monday", timeSlots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
      { day: "Tuesday", timeSlots: ["10:00 AM - 1:00 PM"] },
      { day: "Wednesday", timeSlots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
      { day: "Thursday", timeSlots: ["10:00 AM - 3:00 PM"] },
      { day: "Friday", timeSlots: ["9:00 AM - 11:00 AM"] },
    ],
    platformYears: "3+",
    platformProjects: 12,
    platformSatisfaction: "95%",
    platformBio:
      "Jane has been an active member of Clinician Connect for 3+ years, successfully completing 12 collaborative projects with a 95% satisfaction rating. Her expertise in healthcare UX and consistent delivery make her a highly sought-after collaborator.",
    stats: [
      { label: "Projects Completed", value: "12" },
      { label: "Satisfaction Rating", value: "95%" },
      { label: "Platform Member", value: "3+ years" },
    ],
    projects: [
      { id: 1, title: "Surgical Robot Research", role: "UX Designer", endorsement: "Endorsed by Sophia Skedros", image: imgProject1Jane, featured: true },
      { id: 2, title: "Operating Room Design", role: "UX Researcher", image: imgProject2Jane, featured: false },
    ],
    testimonials: [
      { id: 1, text: "Jane has a rare ability to translate complex clinical workflows into intuitive design solutions through", highlight: "Rapid Prototyping", author: "Surgical Robotics Engineer, Philips Medical" },
      { id: 2, text: "Her research consistently surfaces insights that clinicians actually recognize from their day-to-day work.", author: "Attending Surgeon, University Hospital" },
      { id: 3, text: "Jane moves effortlessly between rigorous user research and rapid prototyping, which makes her an invaluable collaborator on interdisciplinary teams.", author: "Product Manager, Healthcare Innovation Lab" },
    ],
    insights: [
      { title: "Bridges Research and Product Development", description: "Jane's resume suggests a strength in moving insights from user research into tangible design solutions, combining UX research methods with prototyping and product design experience." },
      { title: "Deep Experience in Healthcare Contexts", description: "Her work on surgical robotics and operating room design indicates a strong ability to understand complex clinical environments and design solutions that fit into high-stakes workflows." },
      { title: "Strong Cross-Functional Communication", description: "Roles that involve collaboration with engineers, clinicians, and product teams highlight her ability to translate user needs and research insights across disciplines." },
    ],
    resumeImage: imgResumeJane,
  },

  "john-doe": {
    name: "John Doe",
    role: "Service Designer",
    organization: "Service Designer at Pittsburgh International Airport",
    email: "jd@pit.com",
    phone: "555-555-5555",
    location: "Pittsburgh, PA",
    match: 47,
    about:
      "Service designer with 8+ years transforming complex transit and public infrastructure into intuitive human experiences. Currently leading experience design at Pittsburgh International Airport, focused on reducing friction in high-traffic, high-stress travel environments.",
    skills: ["Service Design", "User Research", "UX Prototyping", "Rapid Prototyping", "Product Design"],
    interests: ["Human-Robot Interaction", "Human-Centered Design", "Product Design", "Sustainability", "User Research"],
    collaborationStyle: ["Hybrid", "Structured Communicator", "Systems Thinker"],
    availability: [
      { day: "Monday", timeSlots: ["10:00 AM - 12:00 PM"] },
      { day: "Tuesday", timeSlots: ["1:00 PM - 4:00 PM"] },
      { day: "Wednesday", timeSlots: ["10:00 AM - 12:00 PM"] },
      { day: "Thursday", timeSlots: [] },
      { day: "Friday", timeSlots: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"] },
    ],
    platformYears: "2",
    platformProjects: 8,
    platformSatisfaction: "88%",
    platformBio:
      "John has been a member of Clinician Connect for 2 years, completing 8 collaborative projects with an 88% satisfaction rating. His background in large-scale public service environments brings a unique systems perspective to clinical and research collaborations.",
    stats: [
      { label: "Projects Completed", value: "8" },
      { label: "Satisfaction Rating", value: "88%" },
      { label: "Platform Member", value: "2 years" },
    ],
    projects: [
      { id: 1, title: "Check-in Robotics", role: "Lead Service Designer", endorsement: "Endorsed by Maria Chen", featured: true },
      { id: 2, title: "TSA Kiosk", role: "UX Strategist", featured: false },
    ],
    testimonials: [
      { id: 1, text: "John has an uncanny ability to see the full system before anyone else in the room.", author: "Lead Architect, Pittsburgh International Airport" },
      { id: 2, text: "His process is rigorous but his outputs are always remarkably human.", author: "Product Director, TSA Innovation Lab" },
      { id: 3, text: "Working with John on the kiosk project changed how our whole team thinks about service flows.", author: "UX Lead, Federal Systems Integrator" },
    ],
    insights: [
      { title: "Systems Thinking in High-Volume Environments", description: "John's work on airport check-in systems and TSA kiosks demonstrates experience designing for scale and under operational constraints, where small UX improvements create outsized impact across millions of user touchpoints." },
      { title: "Strong Foundation in Physical and Digital Service Design", description: "His portfolio spans both tangible environments and digital interfaces, indicating a rare ability to design coherent experiences across touchpoints—a transferable skill in complex clinical settings." },
      { title: "Multi-Stakeholder Research and Alignment", description: "Projects in airport infrastructure require navigating security, regulatory, and operational stakeholders alongside end users, suggesting strong skills in balancing competing requirements—directly applicable to healthcare research contexts." },
    ],
  },

  "eric-shanefield": {
    name: "Eric Shanefield",
    role: "Clinical Researcher",
    organization: "Clinical Research Manager at UPMC",
    email: "ericsh@upmc.org",
    phone: "555-555-5555",
    location: "Pittsburgh, PA",
    match: 20,
    about:
      "Clinical research manager with deep expertise in healthcare environment design and research operations. Leading multi-site studies at UPMC focused on clinical workflow optimization and patient safety in emergency and trauma settings.",
    skills: ["Research Ops", "User Research", "Grant Writing", "Team Management", "Microsoft Office"],
    interests: ["Human-Robot Interaction", "Human-Centered Design", "Product Design", "Sustainability", "User Research"],
    collaborationStyle: ["In-person Preferred", "Detail-Oriented Communicator", "Evidence-Based"],
    availability: [
      { day: "Monday", timeSlots: ["8:00 AM - 10:00 AM"] },
      { day: "Tuesday", timeSlots: [] },
      { day: "Wednesday", timeSlots: ["8:00 AM - 10:00 AM", "3:00 PM - 5:00 PM"] },
      { day: "Thursday", timeSlots: ["12:00 PM - 2:00 PM"] },
      { day: "Friday", timeSlots: [] },
    ],
    platformYears: "1",
    platformProjects: 5,
    platformSatisfaction: "82%",
    platformBio:
      "Eric joined Clinician Connect 1 year ago and has completed 5 collaborative projects with an 82% satisfaction rating. His clinical domain expertise and research operations background make him a strong partner for projects requiring deep institutional knowledge.",
    stats: [
      { label: "Projects Completed", value: "5" },
      { label: "Satisfaction Rating", value: "82%" },
      { label: "Platform Member", value: "1 year" },
    ],
    projects: [
      { id: 1, title: "Hallway Design for EDs", role: "Clinical Research Lead", endorsement: "Endorsed by Dr. Patel", featured: true },
      { id: 2, title: "Trauma Room Design", role: "Research Coordinator", featured: false },
    ],
    testimonials: [
      { id: 1, text: "Eric brings a clinical rigor to design research that most UX people simply can't match.", author: "Director of Emergency Medicine, UPMC" },
      { id: 2, text: "His ability to translate clinical observations into design language made our collaboration remarkably productive.", author: "Research Lead, Carnegie Mellon HCII" },
    ],
    insights: [
      { title: "Deep Clinical Domain Knowledge", description: "Eric's hands-on research in emergency departments and trauma rooms gives him firsthand insight into high-stakes clinical workflows that most designers only read about—valuable for grounding research in operational reality." },
      { title: "Experienced Research Operations Leader", description: "His role managing clinical research operations at UPMC suggests strong skills in coordinating multi-stakeholder studies, navigating IRB processes, and translating findings into actionable recommendations." },
      { title: "Grant Writing and Institutional Navigation", description: "Experience securing research funding indicates an ability to communicate research value to non-technical audiences and work within institutional structures—an asset for academic-clinical collaborations." },
    ],
  },
};

function calculateTotalHours(availability: AvailabilityDay[]) {
  let total = 0;
  availability.forEach(day => {
    day.timeSlots.forEach(slot => {
      const [start, end] = slot.split(' - ');
      const startHour = parseInt(start.split(':')[0]) + (start.includes('PM') && !start.startsWith('12') ? 12 : 0);
      const endHour = parseInt(end.split(':')[0]) + (end.includes('PM') && !end.startsWith('12') ? 12 : 0);
      total += endHour - startHour;
    });
  });
  return total;
}

function getOverlapStatus(hours: number) {
  if (hours >= 15) return { label: "Excellent", textColor: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-500" };
  if (hours >= 10) return { label: "Good", textColor: "text-cyan-700", bgColor: "bg-cyan-50", borderColor: "border-cyan-500" };
  if (hours >= 5) return { label: "Moderate", textColor: "text-yellow-700", bgColor: "bg-yellow-50", borderColor: "border-yellow-500" };
  return { label: "Limited", textColor: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-500" };
}

export default function ProfileView() {
  const { id } = useParams<{ id: string }>();
  const [showResume, setShowResume] = useState(false);

  const profile = id ? profiles[id] : null;

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-[15px] font-medium text-gray-900">Profile not found</p>
            <Link to="/find-collaborators" className="text-[13px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Collaborators
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const totalOverlapHours = calculateTotalHours(profile.availability);
  const overlapStatus = getOverlapStatus(totalOverlapHours);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Breadcrumb + Header */}
          <div className="mb-8">
            <div className="mb-4">
              <Link to="/find-collaborators" className="text-[13px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Collaborators
              </Link>
            </div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{profile.name}</h1>
                <p className="text-[13px] text-gray-600 mt-0.5">{profile.role} · {profile.organization}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1.5 bg-gradient-to-r from-green-50 to-blue-50 text-green-700 text-[11px] font-semibold rounded-md border border-green-200 inline-flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {profile.match}% Match
                </div>
                <button className="px-4 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-md">
                  Add to Project
                </button>
                <button className="px-4 py-2 text-[13px] font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors">
                  Get in Touch
                </button>
              </div>
            </div>
          </div>

          {/* Overlapping Availability Banner */}
          <div className="bg-white border border-cyan-200 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-cyan-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-[13px] font-semibold text-gray-900">Overlapping Availability</h2>
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded ${overlapStatus.bgColor} ${overlapStatus.textColor} border ${overlapStatus.borderColor}`}>
                    {totalOverlapHours} hrs/wk · {overlapStatus.label}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 mb-4">
                  Times when you and {profile.name.split(" ")[0]} are both available to meet and work together (EST)
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {profile.availability.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <h4 className="text-[12px] font-semibold text-gray-900">{day.day}</h4>
                      <div className="space-y-1">
                        {day.timeSlots.length === 0 ? (
                          <p className="text-[11px] text-gray-400 italic">No overlap</p>
                        ) : (
                          day.timeSlots.map((slot, idx) => (
                            <div key={idx} className="px-2.5 py-1.5 bg-cyan-50 text-cyan-700 text-[11px] font-medium rounded-md border border-cyan-200">
                              {slot}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Platform Experience Banner */}
          <div className="bg-white border border-cyan-200 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-cyan-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-[13px] font-semibold text-gray-900 mb-1">Experienced Platform Member</h2>
                <p className="text-[13px] text-gray-700 leading-relaxed">{profile.platformBio}</p>
              </div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">

              {/* Profile Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <UserCircle2 className="w-16 h-16 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                    <p className="text-[13px] text-gray-600">{profile.role}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-gray-600">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[11px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] border border-gray-200 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Research Interests */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[11px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Research Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.interests.map((interest) => (
                      <span key={interest} className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] border border-gray-200 rounded-md">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collaboration Style */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[11px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Collaboration Style</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.collaborationStyle.map((style) => (
                      <span key={style} className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] border border-gray-200 rounded-md">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Resume button */}
              {profile.resumeImage && (
                <button
                  onClick={() => setShowResume(true)}
                  className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                >
                  View Resume
                </button>
              )}

              {/* Activity Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Activity</p>
                <div className="space-y-3">
                  {profile.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-[11px] text-gray-500 mb-0.5">{stat.label}</div>
                      <div className="text-base font-semibold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">About</h2>
                <p className="text-[13px] text-gray-700 leading-relaxed">{profile.about}</p>
              </div>

              {/* AI Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">AI Insights</h2>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200 uppercase tracking-wide rounded-md">
                    Beta
                  </span>
                </div>
                <div className="space-y-4">
                  {profile.insights.map((insight, idx) => (
                    <div key={idx} className="border-l-2 border-gray-300 pl-4 py-1">
                      <h3 className="text-[13px] font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        {insight.title}
                      </h3>
                      <p className="text-[12px] text-gray-600 leading-relaxed pl-6">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Testimonials</h2>
                <div className="space-y-4">
                  {profile.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border border-gray-200 rounded-md p-4">
                      <p className="text-[13px] text-gray-700 italic mb-2">
                        "{testimonial.text}
                        {testimonial.highlight && (
                          <span className="not-italic inline-flex items-center mx-1 px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[11px] font-medium rounded-md border border-cyan-200">
                            {testimonial.highlight}
                          </span>
                        )}
                        {testimonial.highlight ? '."' : '"'}
                      </p>
                      <p className="text-[11px] text-gray-500">— {testimonial.author}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Projects */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <h2 className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Past Projects</h2>
                <div className="grid grid-cols-2 gap-6">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="space-y-3">
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-md border border-gray-200" />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-[11px] text-gray-400">Image coming soon</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-[13px] font-semibold text-gray-900 mb-0.5">{project.title}</h3>
                        <p className="text-[12px] text-gray-600 mb-1">{project.role}</p>
                        {project.featured && project.endorsement && (
                          <div className="flex items-center gap-1.5 text-[12px] text-gray-700">
                            <Award className="w-3.5 h-3.5 text-cyan-600" />
                            <span>{project.endorsement}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Resume Modal */}
      {showResume && profile.resumeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowResume(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <p className="text-[13px] font-semibold text-gray-900">{profile.name} — Resume</p>
              <button onClick={() => setShowResume(false)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              <img src={profile.resumeImage} alt="Resume" className="w-full rounded-md border border-gray-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
