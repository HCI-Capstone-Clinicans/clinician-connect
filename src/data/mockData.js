export const currentUser = {
  id: 'current-user',
  name: 'Vincent Aleven',
  title: 'HCI Practitioner',
  institution: 'Carnegie Mellon University Human Computer Interaction Institute (HCII)',
  email: 'va@cmu.edu',
  phone: '555-555-5555',
  initials: 'VA',
  avatarColor: '#e8f4f8',
  blurb: 'HCI Researcher at Carnegie Mellon University Human Computer Interaction Institute (HCII)',
  projects: [
    {
      id: 'mathtutor',
      name: 'MathTutor Website',
      description: 'A free site where middle school students learn math',
      color: '#2196F3',
    },
  ],
  testimonials: [
    {
      text: '"They have a rare ability to turn messy human experiences into elegant, thoughtful interactions."',
      source: '— Colleague, Manager at CMU HCII',
    },
    {
      text: '"Working with them changed the way I think about design research—they ask questions no one else thinks to ask."',
      source: '— Grad Student, CMU HCII',
    },
    {
      text: 'Their work consistently bridges rigorous research and real human impact.',
      source: '— Industry Partner, UX Research Lead',
    },
  ],
  resumeInsights: [
    {
      title: 'Technical Expertise',
      body: 'Proven ability to optimize chemical processes and streamline production workflows, resulting in improved efficiency and cost reduction. Strong foundation in analytical chemistry and process engineering.',
    },
    {
      title: 'Skilled at Rapid Prototyping and Experimentation',
      body: 'Project experience demonstrates a strength in quickly building and testing interactive systems—using tools like sensors, embedded electronics, and digital interfaces—to explore new human–technology interactions.',
    },
    {
      title: 'Effective Cross-Disciplinary Collaborator',
      body: 'Their background working with designers, engineers, and researchers suggests an ability to communicate across disciplines and help teams align around user-centered goals.',
    },
  ],
  skills: ['Product Design', 'Service Design', 'User Research', 'UX Prototyping', 'Rapid Prototyping', 'HCI', 'Design Thinking'],
  interests: ['Human-computer interaction', 'Educational technology', 'Design research', 'Learning systems'],
}

export const collaborators = [
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    title: 'UX Researcher and Designer',
    role: 'UX Research Manager at Phillips Medical',
    email: 'js@pm.com',
    phone: '555-555-5555',
    matchPercentage: 80,
    initials: 'JS',
    avatarColor: '#c8e6c9',
    pastProjects: [
      { id: 'surgical-robot', name: 'Surgical Robot Research', color: '#37474F' },
      { id: 'or-design', name: 'Operating Room Design', color: '#546E7A' },
    ],
    skills: ['Service Design', 'User Research', 'UX Prototyping', 'Rapid Prototyping', 'Product Design'],
    interests: ['Human-robot interaction', 'Human centered design', 'Product design', 'Sustainability', 'User research'],
    testimonials: [
      {
        text: '"Jane has a rare ability to translate complex clinical workflows into intuitive design solutions."',
        source: '— Surgical Robotics Engineer, Philips Medical',
      },
      {
        text: '"Her research consistently surfaces insights that clinicians actually recognize from their day-to-day work."',
        source: '— Attending Surgeon, University Hospital',
      },
      {
        text: '"Jane moves effortlessly between rigorous user research and rapid prototyping, which makes her an invaluable collaborator on interdisciplinary teams."',
        source: '— Product Manager, Healthcare Innovation Lab',
      },
    ],
    resumeInsights: [
      {
        title: 'Bridges Research and Product Development',
        body: "Jane's resume suggests a strength in moving insights from user research into tangible design solutions, combining UX research methods with prototyping and product design experience.",
      },
      {
        title: 'Deep Experience in Healthcare Contexts',
        body: 'Her work on surgical robotics and operating room design indicates a strong ability to understand complex clinical environments and design solutions that fit into high-stakes workflows.',
      },
      {
        title: 'Strong Cross-Functional Communication',
        body: 'Roles that involve collaboration with engineers, clinicians, and product teams highlight her ability to translate user needs and research insights across disciplines.',
      },
    ],
  },
  {
    id: 'john-doe',
    name: 'John Doe',
    title: 'Service Designer',
    role: 'Service Designer at Pittsburgh International Airport',
    email: 'jd@pit.com',
    phone: '555-555-5555',
    matchPercentage: 47,
    initials: 'JD',
    avatarColor: '#fff9c4',
    pastProjects: [
      { id: 'check-in-robots', name: 'Check-in Robots', color: '#455A64' },
      { id: 'tsa-kiosk', name: 'TSA Kiosk', color: '#607D8B' },
    ],
    skills: ['Service Design', 'User Research', 'UX Prototyping', 'Rapid Prototyping', 'Product Design'],
    interests: ['Human-robot interaction', 'Human centered design', 'Product design', 'Sustainability', 'User research'],
    testimonials: [
      {
        text: '"John brings a systems-level perspective to every design challenge he tackles."',
        source: '— Director of Innovation, Pittsburgh Airport',
      },
      {
        text: '"He has an impressive ability to align stakeholders around complex service flows."',
        source: '— UX Lead, Airport Systems Team',
      },
    ],
    resumeInsights: [
      {
        title: 'Systems Thinking in Public Spaces',
        body: 'John\'s work in airport environments demonstrates a deep understanding of large-scale service ecosystems and how design can improve passenger experience across multiple touchpoints.',
      },
      {
        title: 'Human-Robot Interaction in Public Settings',
        body: 'Experience with check-in robots and automated kiosks shows hands-on knowledge of deploying interactive technology in high-traffic, diverse user contexts.',
      },
    ],
  },
  {
    id: 'sarah-lee',
    name: 'Sarah Lee',
    title: 'Clinical Informaticist',
    role: 'Health Systems Researcher at UPMC',
    email: 'sl@upmc.edu',
    phone: '555-555-5555',
    matchPercentage: 62,
    initials: 'SL',
    avatarColor: '#f3e5f5',
    pastProjects: [
      { id: 'ehr-redesign', name: 'EHR Redesign', color: '#6A1B9A' },
      { id: 'telehealth', name: 'Telehealth Platform', color: '#7B1FA2' },
    ],
    skills: ['Clinical Workflow Analysis', 'User Research', 'Health Informatics', 'Data Visualization', 'Usability Testing'],
    interests: ['Clinical decision support', 'Patient safety', 'Digital health', 'Human factors in medicine'],
    testimonials: [
      {
        text: '"Sarah understands both the clinical and technical sides of healthcare in a way few researchers do."',
        source: '— Chief Medical Officer, UPMC',
      },
    ],
    resumeInsights: [
      {
        title: 'Deep Clinical Domain Knowledge',
        body: "Sarah's dual background in medicine and informatics positions her uniquely to design health systems that clinicians actually adopt.",
      },
    ],
  },
]

export const projects = [
  {
    id: 'robodog',
    name: 'RoboDog',
    lab: 'Carroll Labs',
    location: 'UH Cleveland Medical Center',
    status: 'Ongoing Research Project',
    coordinator: 'Andrew Chan',
    coordinatorEmail: 'ac@uh.com',
    topics: ['Robotics', 'Human-Robot Interaction', 'Surgery Assistance'],
    lookingFor: ['Robotics Engineers', 'Human-Robot Interaction Practitioner', 'Grant Writers'],
    description: `RoboDog is a pioneering research initiative led by Dr. Bryan Carroll at University Hospitals Cleveland, dedicated to exploring the transformative potential of robotic canine technology within the field of dermatologic surgery. The project sits at the intersection of robotics, artificial intelligence, and precision medicine, with the goal of developing autonomous robotic dogs capable of assisting surgeons during complex dermatological procedures.

By leveraging advanced sensor arrays, machine learning algorithms, and real-time imaging capabilities, RoboDog aims to enhance surgical accuracy, reduce procedural variability, and improve overall patient outcomes in skin cancer excisions, reconstructive procedures, and other dermatological interventions.

Under Dr. Carroll's leadership, the University Hospitals Cleveland research team is working to design robotic platforms that can seamlessly integrate into existing surgical workflows while complementing the expertise of human clinicians. Early-stage development focuses on refining the robots' dexterity and tactile sensitivity to meet the exacting demands of skin surgery, where millimeter-level precision can be the difference between optimal cosmetic results and complications.

As the project progresses, Dr. Carroll and his team envision RoboDog serving not only as a surgical assistant but also as a data-gathering tool that contributes to a growing body of knowledge around automated dermatologic care, ultimately helping to expand access to high-quality surgical treatment across a broader range of clinical settings.`,
    gallery: [
      { caption: 'Robot Dog Render (future state)', color: '#e8e8e8' },
      { caption: 'Robot Dog Prototype', color: '#f5a623' },
      { caption: 'Carroll Labs Team', color: '#7eb8d4' },
    ],
    people: [
      {
        id: 'bryan-carroll',
        name: 'Dr Bryan Carroll',
        role: 'Clinician',
        title: 'Dermatologic Surgeon, Researcher, Professor at Case Western',
        email: 'bca@uh.com',
        phone: '555-555-5555',
        initials: 'BC',
        avatarColor: '#e8e8e8',
        skills: ['Surgery', 'Dermatology', 'Clinical Research'],
      },
      {
        id: 'maya-patel',
        name: 'Dr Maya Patel',
        role: 'Clinician Support',
        title: 'Medical Operations Executive',
        email: 'bca@uh.com',
        phone: '555-555-5555',
        initials: 'MP',
        avatarColor: '#e8e8e8',
        skills: ['Research Operations', 'Quantitative Research', 'Medicine'],
      },
      {
        id: 'daniel-kim',
        name: 'Daniel Kim',
        role: 'Engineer',
        title: 'Biomedical Engineer Professor at Case Western Reserve',
        email: 'bca@uh.com',
        phone: '555-555-5555',
        initials: 'DK',
        avatarColor: '#e8e8e8',
        skills: ['Mechanical Engineering', 'Electronics Engineering', 'Quantitative Research', 'Human-Robot Interaction'],
      },
      {
        id: 'andrew-chan',
        name: 'Andrew Chan',
        role: 'HCI Researcher',
        title: 'Student Designer at CMU',
        email: 'bca@uh.com',
        phone: '555-555-5555',
        initials: 'AC',
        avatarColor: '#e8e8e8',
        isHighlighted: true,
        skills: ['Service Design', 'UX Writing', 'Human-Robot Interaction', 'Design Thinking'],
      },
    ],
    skillsMap: {
      members: [
        {
          id: 'andrew-chan',
          name: 'Andrew Chan',
          role: 'HCI Practitioner',
          cx: 270, cy: 390, r: 185,
          color: 'rgba(160, 220, 230, 0.55)',
          strokeColor: 'rgba(100, 180, 200, 0.7)',
          uniqueSkills: [{ label: 'Service Design', x: 100, y: 420 }],
        },
        {
          id: 'daniel-kim',
          name: 'Daniel Kim',
          role: 'Robotics Engineer',
          cx: 495, cy: 210, r: 175,
          color: 'rgba(180, 230, 180, 0.55)',
          strokeColor: 'rgba(120, 190, 120, 0.7)',
          uniqueSkills: [
            { label: 'Mechanical Engineering', x: 500, y: 105 },
            { label: 'Electronics Engineering', x: 570, y: 145 },
          ],
        },
        {
          id: 'maya-patel',
          name: 'Dr. Maya Patel',
          role: 'Clinician Support',
          cx: 565, cy: 430, r: 180,
          color: 'rgba(250, 235, 160, 0.55)',
          strokeColor: 'rgba(210, 190, 100, 0.7)',
          uniqueSkills: [{ label: 'Research Operations', x: 660, y: 430 }],
        },
        {
          id: 'bryan-carroll',
          name: 'Dr. Bryan Carroll',
          role: 'Dermatologic Surgeon',
          cx: 625, cy: 610, r: 160,
          color: 'rgba(255, 190, 180, 0.55)',
          strokeColor: 'rgba(220, 140, 130, 0.7)',
          uniqueSkills: [{ label: 'Surgery', x: 690, y: 660 }],
        },
      ],
      sharedSkills: [
        { label: 'Human-Robot Interaction', x: 375, y: 285 },
        { label: 'Design Thinking', x: 445, y: 390 },
        { label: 'UX Writing', x: 400, y: 450 },
        { label: 'Quantitative Research', x: 565, y: 325 },
        { label: 'Medicine', x: 610, y: 535 },
      ],
    },
  },
  {
    id: 'telehealth-ai',
    name: 'Telehealth AI Assistant',
    lab: 'Digital Health Lab',
    location: 'UPMC Presbyterian',
    status: 'Ongoing Research Project',
    coordinator: 'Sarah Lee',
    coordinatorEmail: 'sl@upmc.edu',
    topics: ['AI', 'Telehealth', 'Patient Communication'],
    lookingFor: ['ML Engineers', 'Conversation Designers', 'Clinical Advisors'],
    description: `An AI-powered telehealth assistant designed to help patients navigate symptoms, schedule appointments, and communicate more effectively with their care teams. This project aims to reduce administrative burden on clinicians while improving patient engagement and health literacy.`,
    gallery: [
      { caption: 'System Architecture', color: '#b2dfdb' },
      { caption: 'Patient Interface Prototype', color: '#80cbc4' },
    ],
    people: [
      {
        id: 'sarah-lee',
        name: 'Sarah Lee',
        role: 'Lead Researcher',
        title: 'Health Systems Researcher at UPMC',
        email: 'sl@upmc.edu',
        phone: '555-555-5555',
        initials: 'SL',
        avatarColor: '#e8e8e8',
        skills: ['Clinical Workflow Analysis', 'User Research', 'Health Informatics'],
      },
    ],
    skillsMap: {
      members: [
        {
          id: 'sarah-lee',
          name: 'Sarah Lee',
          role: 'Clinical Informaticist',
          cx: 300, cy: 350, r: 175,
          color: 'rgba(180, 220, 210, 0.55)',
          strokeColor: 'rgba(120, 180, 170, 0.7)',
          uniqueSkills: [{ label: 'Health Informatics', x: 130, y: 350 }],
        },
      ],
      sharedSkills: [],
    },
  },
]
