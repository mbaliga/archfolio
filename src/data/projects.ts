import type { Project, FillerTile, GridPoint } from '../types'

// Twelve shipped surfaces + the architecture "Studio" cottage, mapped onto the
// complexity (x) / audience (y) graph.
export const PROJECTS: Project[] = [
  // Q1 — Enterprise + Complex
  {
    id: 'impressio',
    gx: 2,
    gy: 4,
    scale: 1.3,
    label: 'Impressio',
    sub: 'AEON ROBOT · 2024',
    glyph: 'robot',
    desc: 'End-to-end UX/UI flows for casting MIAs on the Aeon humanoid robot — desktop and tablet. Included the World AI Summit live demo and tablet casting interface.',
    tags: ['Enterprise', 'Robotics', 'Tablet', 'B2B'],
  },
  {
    id: 'izak',
    gx: 6,
    gy: 4,
    scale: 1.5,
    label: 'iZak',
    sub: '3D SCANNING · LiDAR',
    glyph: 'scanner',
    desc: 'UX research and design for a LiDAR + photogrammetry 3D space scanning workflow. Deep research into spatial computing, sensor use cases, and professional scanning tools.',
    tags: ['Enterprise', 'Spatial', 'UX Research', 'Mobile'],
  },
  {
    id: 'paas',
    gx: 4,
    gy: 2,
    scale: 1.2,
    label: 'PaaS',
    sub: 'PROMPT LIBRARY',
    glyph: 'servers',
    desc: 'Prompt-as-a-service platform — library management, versioning, and evaluation surfaces. AI tooling for enterprise teams building on top of language models.',
    tags: ['Enterprise', 'AI', 'Dashboard', 'B2B'],
  },
  {
    id: 'snaplogic',
    gx: 2,
    gy: 2,
    scale: 1.0,
    label: 'SnapLogic',
    sub: 'CMS · CONNECTORS',
    glyph: 'connector',
    desc: "CMS surfaces and connector configuration UI for SnapLogic's integration platform. Weekly reviews, reworks, prototype, and full developer handoff.",
    tags: ['Enterprise', 'Integration', 'B2B'],
  },
  // Q2 — Enterprise + Simple
  {
    id: 'lms',
    gx: -2,
    gy: 2,
    scale: 0.9,
    label: 'SnapLogic LMS',
    sub: 'ACADEMY · 6 COURSES',
    glyph: 'book',
    desc: 'Redesign of 6 internal SnapLogic Academy course pages. Ran weekly review cycles across stakeholders, built high-fidelity prototypes, and managed developer handoff.',
    tags: ['Enterprise', 'Education', 'B2B'],
  },
  {
    id: 'holacracy',
    gx: -4,
    gy: 4,
    scale: 1.15,
    label: 'Holacracy',
    sub: 'INTERNAL TOOLING',
    glyph: 'circles',
    desc: 'Internal tooling for self-organising teams — circles, roles, tensions, and governance workflows. Where org design meets product design.',
    tags: ['Enterprise', 'Internal', 'Governance'],
  },
  {
    id: 'kya',
    gx: -2,
    gy: 4,
    scale: 1.05,
    label: 'KYA',
    sub: 'DOCUMENT WORKFLOW',
    glyph: 'docs',
    desc: 'Know-your-anything: document workflow and management surfaces for enterprise compliance teams. Information architecture, flows, and UI design.',
    tags: ['Enterprise', 'Documents', 'Workflow'],
  },
  // Q4 — Consumer + Complex
  {
    id: 'amplyfund',
    gx: 2,
    gy: -2,
    scale: 1.1,
    label: 'Amplyfund',
    sub: 'TV · FUNDRAISING',
    glyph: 'tv',
    desc: 'TV UI redesign for a crowdfunding and fundraising platform. Addressed core usability friction, updated design system alignment, and improved onboarding flows.',
    tags: ['Consumer', 'TV', 'Fundraising'],
  },
  {
    id: 'voteiq',
    gx: 4,
    gy: -4,
    scale: 1.35,
    label: 'Vote IQ',
    sub: 'TV + WEB · CIVICS',
    glyph: 'ballot',
    desc: 'Civic engagement product spanning TV and web. Persona-based user flows for first-time voters; collaborated with Khushi and Cherry throughout design and research.',
    tags: ['Consumer', 'TV', 'Web', 'Politics'],
  },
  // Q3 — Consumer + Simple
  {
    id: 'mo',
    gx: -2,
    gy: -2,
    scale: 1.0,
    label: 'Mo',
    sub: 'MOBILE · HEALTHCARE',
    glyph: 'heart',
    desc: 'Information architecture and UX/UI prototyping for a consumer healthcare app. Internal pilot — attended CEO and Head of Design reviews, supported QA handoff.',
    tags: ['Consumer', 'Mobile', 'Healthcare'],
  },
  {
    id: 'clink',
    gx: -4,
    gy: -2,
    scale: 0.85,
    label: 'Clink',
    sub: 'UI REDESIGN',
    glyph: 'bubble',
    desc: 'UI redesign alongside Moon and Ritesh. Onboarded Ritesh to the design team, led refinement sessions, and shaped the overall visual direction.',
    tags: ['Consumer', 'Mobile', 'Social'],
  },
  {
    id: 'revee',
    gx: -2,
    gy: -4,
    scale: 0.95,
    label: 'Revee',
    sub: 'FLOWS · QA',
    glyph: 'sprout',
    desc: "User flow mapping, prototyping, QA handoff, and developer collaboration for Revee's internal pilot launch. First project from concept to shipped.",
    tags: ['Consumer', 'UX', 'Mobile'],
  },
  // Easter egg — Architecture
  {
    id: 'arch',
    gx: 6,
    gy: 6,
    scale: 1.1,
    label: 'Studio',
    sub: 'ARCHITECTURE · RES.',
    glyph: 'cottage',
    height: 8,
    roofStyle: 'pitched',
    desc: 'Residential architectural practice — the quiet cottage at the far edge of the map. Prachi brings the same spatial thinking she applies to physical buildings to every digital surface she designs.',
    tags: ['Architecture', 'Residential', 'Spatial'],
  },
]

// Decorative grass/rock patches that round out the empty quadrant corners.
export const FILLER: FillerTile[] = [
  { id: 'f0', gx: -6, gy: 2, glyph: 'trees' },
  { id: 'f1', gx: -6, gy: 4, glyph: 'rocks' },
  { id: 'f2', gx: -6, gy: -2, glyph: 'trees' },
  { id: 'f3', gx: -6, gy: -4, glyph: 'trees' },
  { id: 'f4', gx: 4, gy: 6, glyph: 'trees' },
  { id: 'f5', gx: -4, gy: 6, glyph: 'rocks' },
  { id: 'f6', gx: 6, gy: -6, glyph: 'trees' },
  { id: 'f7', gx: 4, gy: -6, glyph: 'rocks' },
  { id: 'f8', gx: -4, gy: -6, glyph: 'trees' },
  { id: 'f9', gx: 5, gy: 5, glyph: 'trees' },
]

// Road network as polylines in grid space.
export const MAIN_ROADS: GridPoint[][] = [
  [
    [-7, 0],
    [7, 0],
  ],
  [
    [0, -6],
    [0, 6],
  ],
]

export const ARTERIES: GridPoint[][] = [
  // Horizontals (constant gy)
  [
    [-4, 2],
    [6, 2],
  ],
  [
    [-4, -2],
    [4, -2],
  ],
  [
    [-4, 4],
    [5, 4],
  ],
  [
    [-2, -4],
    [4, -4],
  ],
  // Verticals (constant gx)
  [
    [2, -1],
    [2, 4],
  ],
  [
    [-2, -4],
    [-2, 4],
  ],
  [
    [4, -4],
    [4, 3],
  ],
  [
    [6, 0],
    [6, 6],
  ],
  [
    [-4, -2],
    [-4, 5],
  ],
]
