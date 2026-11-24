// Single source of truth for all site content.
// Components read from here — to update the site, edit this file only.
// NOTE: currently ported as-is from the legacy site (legacy/index.html);
// it will be refreshed from the LinkedIn export in the content phase.

export interface Role {
  title: string
  org: string
  start: string
  end: string // "Present" for current roles
  summary?: string
  bullets?: string[]
}

export interface Project {
  name: string
  description: string
  link?: string
  tags?: string[]
}

export interface School {
  school: string
  credential: string
  years: string
}

export const profile = {
  name: 'Andrew Solbjor',
  headline: 'Software Engineer · Forward Deployed Engineer',
  email: 's0lbjorandr3w@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/andrew-solbjor-157092264/',
    github: 'https://github.com/Solbjor',
  },
  formspree: 'https://formspree.io/f/xayreogk',
}

export const experience: Role[] = [
  { title: 'Founding Frontend Engineer', org: 'Asakana Co', start: 'Oct 2025', end: 'Present' },
  { title: 'Tech Fellow', org: 'CodePath', start: 'Sep 2025', end: 'Present' },
  { title: 'Founding Developer', org: 'HeadshotX', start: 'Oct 2024', end: 'Present' },
  { title: 'Python Coding Teaching Assistant', org: 'Verizon Innovative Learning', start: 'Apr 2023', end: 'Aug 2023' },
  { title: 'Support Services Intern', org: 'Align Technology', start: 'Sep 2019', end: 'Dec 2019' },
  { title: 'IT Department Intern', org: 'Tegra Medical', start: 'Sep 2018', end: 'Sep 2018' },
]

export const projects: Project[] = [
  {
    name: 'CaneYouSeeMe',
    description:
      'Smart-sensing mobility cane that alerts visually impaired users to obstacles. 1st place Health Hack, Cruz Hacks 2026.',
    link: 'https://devpost.com/software/caneyousee',
  },
  {
    name: 'MediPal',
    description: 'Medical records and patient management app to improve healthcare access in rural communities.',
    link: 'https://github.com/Exception-Handlers/MediPal',
  },
  {
    name: 'LiNKFiiT',
    description: 'Coding lead for a fitness and nutrition app startup.',
    link: 'https://linkfit.net/',
  },
]

export const education: School[] = [
  { school: 'Sacramento State University', credential: "Bachelor's in Computer Science", years: '2024 – 2026' },
  { school: 'San Joaquin Delta College', credential: 'Computer Science', years: '2021 – 2023' },
  { school: 'Colegio Técnico Profesional de Ulloa', credential: 'Technical Degree in Networking', years: '2013 – 2019' },
]
