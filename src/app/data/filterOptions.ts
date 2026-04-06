export const filterCategories = {
  workingOn: {
    label: 'What are you working on?',
    shared: [
      'New idea',
      'Existing project',
      'Research study',
      'Clinical workflow problem',
      'Product concept',
      'Service/system improvement',
      'Looking to join a project',
      'Looking to advise',
      'Exploring opportunities'
    ],
    doctor: [
      'Clinical problem',
      'Patient care improvement',
      'Research question',
      'Translational idea',
      'Device opportunity'
    ],
    engineer: [
      'Technical build',
      'Prototype development',
      'Data system',
      'Software tool',
      'Hardware integration'
    ],
    designer: [
      'Experience redesign',
      'Service design challenge',
      'Interface concept',
      'Patient/provider journey',
      'Visual communication need'
    ]
  },
  collaboratorType: {
    label: 'What kind of collaborator do you need?',
    shared: [
      'Doctor / clinician',
      'Engineer',
      'Designer',
      'Researcher',
      'Student',
      'Faculty',
      'Project lead',
      'Technical advisor',
      'Domain expert'
    ],
    doctor: [
      'Biomedical engineer',
      'UX designer',
      'Service designer',
      'Data scientist',
      'Clinical researcher'
    ],
    engineer: [
      'Surgeon',
      'Physician',
      'Nurse perspective',
      'Product designer',
      'Clinical subject matter expert'
    ],
    designer: [
      'Clinician sponsor',
      'Engineer / builder',
      'Data specialist',
      'Research partner',
      'Implementation partner'
    ]
  },
  areaOfInterest: {
    label: 'Area of interest / domain',
    shared: [
      'Cancer care',
      'Surgery',
      'Pediatrics',
      'Aging / older adults',
      'Mental health',
      'Pulmonary / respiratory',
      'Cardiology',
      'Neurology',
      'Rehabilitation',
      'Medical education',
      'Clinical operations',
      'Accessibility',
      'AI in healthcare',
      'Diagnostic tools',
      'Medical devices',
      'Preventive care',
      'Chronic disease',
      'Community health',
      'Patient experience',
      'Provider workflow',
      'Care coordination',
      'Communication tools',
      'Decision support',
      'Remote care',
      'Documentation burden',
      'Training / education',
      'Digital platform',
      'Data visualization'
    ]
  },
  skills: {
    label: 'Skills / expertise',
    shared: [
      'Research',
      'Strategy',
      'Communication',
      'Evaluation',
      'Testing',
      'Prototyping',
      'Documentation',
      'Stakeholder engagement',
      'Systems thinking',
      'Implementation planning'
    ],
    doctor: [
      'Clinical insight',
      'Patient care workflow',
      'Subject matter expertise',
      'Clinical validation',
      'Trial design',
      'Translational research',
      'Department access',
      'Clinical feasibility'
    ],
    engineer: [
      'Hardware',
      'Software development',
      'App development',
      'Embedded systems',
      'Data engineering',
      'Machine learning',
      'AI / NLP',
      'CAD / fabrication',
      'Systems integration',
      'Sensors',
      'API / backend',
      'Device engineering'
    ],
    designer: [
      'UX research',
      'UI design',
      'Product design',
      'Service design',
      'Journey mapping',
      'Experience strategy',
      'Visual design',
      'Information architecture',
      'Storytelling',
      'Design systems',
      'Accessibility design',
      'Usability testing'
    ]
  },
  projectStage: {
    label: 'Project stage',
    shared: [
      'Just exploring',
      'Defining the problem',
      'Looking for collaborators',
      'Early concept',
      'Research underway',
      'Prototype in progress',
      'Pilot ready',
      'Testing with users',
      'Seeking implementation support',
      'Scaling / handoff',
      'Looking for funding',
      'Post-project continuation'
    ]
  },
  availability: {
    label: 'Time / availability',
    shared: [
      'One-time conversation',
      'Occasional advising',
      'Short-term collaboration',
      'Semester-long collaboration',
      'Long-term collaboration',
      'Weekly check-ins',
      'Monthly check-ins',
      'Flexible availability',
      'Limited availability',
      'Actively seeking projects',
      '1-2 hours/week',
      '3-5 hours/week',
      '5+ hours/week'
    ]
  },
  location: {
    label: 'Location / proximity',
    shared: [
      'In-person preferred',
      'Hybrid',
      'Remote okay',
      'Same institution',
      'Nearby campus',
      'Within 5 miles',
      'Within 10 miles',
      'Within 25 miles',
      'University Hospitals',
      'Case Western',
      'Cleveland Clinic',
      'CIA',
      'Cross-institution collaboration welcome'
    ]
  },
  collaborationType: {
    label: 'Type of collaboration',
    shared: [
      'Brainstorming',
      'Consultation',
      'Research collaboration',
      'Design support',
      'Technical build support',
      'Validation / feedback',
      'Co-leading a project',
      'Joining an existing team',
      'Mentorship',
      'Advising',
      'Networking / exploration',
      'Grant support',
      'Long-term partnership'
    ]
  },
  constraints: {
    label: 'Constraints / needs',
    shared: [
      'Need funding',
      'No funding yet',
      'Need institutional support',
      'Need clearer scope',
      'Need technical help',
      'Need clinical access',
      'Need research support',
      'Need design support',
      'Need implementation partner',
      'Need approval / buy-in',
      'Need dedicated time',
      'Looking for low-lift collaboration',
      'Early-stage / informal',
      'Ready for formalization'
    ]
  },
  workingStyle: {
    label: 'Preferred way of working',
    shared: [
      'Structured process',
      'Flexible / informal',
      'Quick conversations first',
      'Workshop style',
      'Async communication',
      'Scheduled meetings',
      'Hands-on prototyping',
      'Strategy-first',
      'Research-first',
      'Build-first',
      'Needs clear milestones',
      'Open to experimentation'
    ]
  }
};

export type FilterCategoryKey = keyof typeof filterCategories;
export type UserRole = 'doctor' | 'engineer' | 'designer';
