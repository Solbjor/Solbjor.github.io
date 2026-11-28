// Single source of truth for all site content.
// Components read from here — to update the site, edit this file only.
// Source: LinkedIn profile export (Nov 2026). Never add a phone number here.

export type RoleType = 'fellowship' | 'founder' | 'job' | 'teaching' | 'internship'

export interface Role {
  title: string
  org: string
  /** Who the work is for, when different from the employer (e.g. a fellowship placement). */
  placement?: string
  type: RoleType
  start: string
  end: string // "Present" for current roles
  location?: string
  summary?: string
  bullets?: string[]
  /** Shown as one of the large featured cards. */
  featured?: boolean
  /** The mission Andrew is "landed" on right now. Exactly one role should set this. */
  current?: boolean
}

export interface Project {
  name: string
  description: string
  link?: string
  image?: string // path under public/, e.g. "projects/medipal.png"
  imageSrcSet?: string
  tags?: string[]
  award?: string
  /** Illustrative position on the portfolio map, not a project location. */
  mapMarker?: { latitude: number; longitude: number }
}

export interface School {
  school: string
  credential?: string
  years?: string
}

export interface Certification {
  name: string
  issuer?: string
  year?: string
}

export interface SkillGroup {
  label: string
  skills: string[]
}

export const profile = {
  name: 'Andrew Solbjor',
  headline: 'Software Engineer · Forward Deployed Engineer · Claude Corps Fellow',
  location: 'San Juan, Puerto Rico',
  summary:
    'Claude Corps Fellow at Foundation for Puerto Rico, building AI tools and systems for mission-driven work. ' +
    'Currently scoping, designing, and building the future of organizational intelligence.',
  email: 's0lbjorandr3w@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/andrew-solbjor-157092264/',
    github: 'https://github.com/Solbjor',
  },
  formspree: 'https://formspree.io/f/xayreogk',
  communities: ['MESA alumni', 'SHPE alumni'],
}

export const experience: Role[] = [
  {
    title: 'Claude Corps Fellow',
    org: 'Claude Corps',
    placement: 'Foundation for Puerto Rico',
    type: 'fellowship',
    start: 'Oct 2026',
    end: 'Present',
    location: 'San Juan, Puerto Rico',
    summary:
      'Forward deployed engineer placed with Foundation for Puerto Rico, scoping, designing, and building ' +
      'AI tools and systems for mission-driven work.',
    featured: true,
    current: true,
  },
  {
    title: 'Co-Founder · Frontend Developer',
    org: 'SparSafe',
    type: 'founder',
    start: 'Oct 2024',
    end: 'Present',
    location: 'Sacramento, CA',
    summary:
      'Co-founded a startup building an AI-powered smart headgear system for boxing that tracks head impacts ' +
      'and delivers real-time data to a custom-built mobile app. (Formerly HeadshotX.)',
    bullets: [
      'Lead frontend development for the companion mobile app.',
      'Collaborate on product design, user experience, and embedded systems integration.',
    ],
    featured: true,
  },
  {
    title: 'Frontend Developer',
    org: 'Asakana',
    type: 'job',
    start: 'Oct 2025',
    end: 'Sep 2026',
    location: 'Sacramento, CA',
    bullets: [
      'Implemented a major UI/UX overhaul of the main web dashboard and related services to improve accessibility for the target customers.',
      'Designed a user-centric MVP for managing inventory and handling orders at scale.',
      'Built reusable PostHog analytics services to measure engagement with the landing site and core platform features.',
    ],
    featured: true,
  },
  {
    title: 'TIP 101 Tech Fellow',
    org: 'CodePath',
    type: 'teaching',
    start: 'Sep 2025',
    end: 'Present',
    location: 'Remote',
    bullets: [
      'Teach technical interview preparation in Python, covering industry-standard data structures, to students from dozens of countries.',
      'Model best practices for building projects with an AI-assisted workflow.',
      'Run breakout rooms using structured problem solving (UMPIRE) and prepare students for HackerRank assessments.',
    ],
  },
  {
    title: 'Instructor',
    org: 'Dream Enrichment Classes',
    type: 'teaching',
    start: 'Jan 2025',
    end: 'Jun 2025',
    location: 'Sacramento County, CA',
    summary: 'Taught Scratch coding and programming logic fundamentals to elementary school students.',
  },
  {
    title: 'Teaching Assistant',
    org: 'MSU Verizon Innovative Learning',
    type: 'teaching',
    start: 'May 2023',
    end: 'Jul 2023',
    location: 'Stockton, CA',
    summary: 'Taught Python and problem-solving fundamentals to middle schoolers in classes of 10–15 students.',
  },
  {
    title: 'Data Science Intern',
    org: 'Align Technology',
    type: 'internship',
    start: 'Oct 2019',
    end: 'Dec 2019',
    location: 'Heredia, Costa Rica',
    summary: 'Verified the integrity of account data for hundreds of dentists as part of a company-wide project.',
  },
  {
    title: 'Information Technology Assistant',
    org: 'Tegra Medical',
    type: 'internship',
    start: 'Sep 2018',
    end: 'Sep 2018',
    location: 'Heredia, Costa Rica',
    summary:
      "Installed switch-box wiring that connected a new plant annex's assembly line machines to the plant-wide control systems and network.",
  },
]

export const projects: Project[] = [
  {
    name: 'CaneYouSeeMe',
    mapMarker: { latitude: 36.97, longitude: -122.03 },
    description: 'Smart-sensing mobility cane that alerts visually impaired users to obstacles in their path.',
    award: '1st place Health Hack · Cruz Hacks 2026',
    link: 'https://devpost.com/software/caneyousee',
    image: 'projects/caneyouseeme.png',
    imageSrcSet: 'projects/caneyouseeme-480.webp 480w, projects/caneyouseeme-960.webp 960w, projects/caneyouseeme.png 2268w',
    tags: ['Hardware', 'Accessibility', 'Hackathon'],
  },
  {
    name: 'MediPal',
    mapMarker: { latitude: -13.5, longitude: -54 },
    description: 'Medical records and patient management app built to improve healthcare access in rural communities.',
    link: 'https://github.com/Exception-Handlers/MediPal',
    image: 'projects/medipal.png',
    tags: ['Health', 'Mobile'],
  },
  {
    name: 'SparSafe app',
    mapMarker: { latitude: 50, longitude: 18 },
    description:
      'Companion mobile app for SparSafe’s smart boxing headgear, delivering head-impact data from a sparring session in real time.',
    tags: ['Mobile', 'Real-time data', 'Hardware'],
  },
  {
    name: 'LiNKFiiT',
    mapMarker: { latitude: 24, longitude: 103 },
    description: 'Coding lead for a fitness and nutrition app startup.',
    link: 'https://linkfit.net/',
    tags: ['Startup', 'Mobile'],
  },
]

export const education: School[] = [
  { school: 'California State University, Sacramento', credential: 'B.S. Computer Science', years: '2024 – 2026' },
  { school: 'San Joaquin Delta College', credential: 'Computer Science', years: '2021 – 2023' },
  { school: 'Colegio Técnico Profesional de Ulloa', credential: 'Technical Degree in Networking' },
]

export const certifications: Certification[] = [
  { name: 'AI Fluency: Framework & Foundations', issuer: 'Anthropic' },
  { name: 'Intermediate Technical Interview Prep', issuer: 'CodePath', year: '2025' },
  { name: 'Android Development', issuer: 'CodePath', year: '2023' },
  { name: 'Object Oriented Programming in JavaScript' },
  { name: 'Modern JavaScript for Beginners' },
]

export const skills: SkillGroup[] = [
  { label: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript', 'C++', 'Kotlin', 'HTML/CSS'] },
  { label: 'Frontend & Mobile', skills: ['React', 'Flutter', 'Android', 'Accessible UI'] },
  { label: 'AI', skills: ['Claude', 'LLM application development', 'AI-assisted workflows'] },
  { label: 'Product & Data', skills: ['PostHog analytics', 'Figma', 'MVP design'] },
  { label: 'Systems', skills: ['Networking & routing protocols', 'Embedded systems integration'] },
]
