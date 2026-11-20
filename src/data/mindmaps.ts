// Interactive mindmaps for the projects that don't have a written case study.
//
// Sources, in order of authority: Prachi's own project descriptions in
// projects.ts, her résumé and About page (dates, Circle Health's +20% and three
// features, Impressio's World AI Summit demo, her B.Arch, mentoring), and her
// related case studies (the ten-foot TV patterns from Revee & Mo and iZak).
// Where those run out, nodes are inferred from the domain: plausible design
// surfaces and challenges for that kind of product. Inferred nodes never
// carry numbers, research findings or results; every figure below is one
// Prachi stated. The inferred nodes are listed in the session notes for her
// to confirm before interviews.

export interface MindmapBranch {
  /** Short label on the branch node. */
  label: string
  /** One sentence shown in the detail card when the branch is open. */
  summary: string
  /** Leaf nodes: short phrases, ideally under ~28 characters. */
  leaves: string[]
}

export interface ProjectMindmap {
  /** Overrides the ownership-derived role in the brief's facts column. */
  roleLabel?: string
  /** Overrides the year parsed from `sub`. */
  when?: string
  branches: MindmapBranch[]
}

export const MINDMAPS: Record<string, ProjectMindmap> = {
  impressio: {
    when: '2024',
    branches: [
      {
        label: 'The brief',
        summary: 'Put the MIAs app ecosystem on Aeon, a humanoid robot, and let a person cast apps to it from a desktop or a tablet.',
        leaves: ['Cast apps to a robot', 'Desktop and tablet control', 'Built for live demos'],
      },
      {
        label: 'Who it’s for',
        summary: 'The people running the robot in front of an audience, and the enterprise audience watching what it can do.',
        leaves: ['Demo operators on stage', 'Enterprise audiences', 'Teams setting up content'],
      },
      {
        label: 'My role',
        summary: 'Lead designer for the casting experience, end to end, from flows to the final desktop and tablet UI.',
        leaves: ['UX flows end to end', 'Desktop and tablet UI', 'Live-demo interface'],
      },
      {
        label: 'What I designed',
        summary: 'A casting console: choose an app, send it to the robot, and stay in control while it runs.',
        leaves: ['Tablet casting interface', 'App picker and queue', 'Live session controls', 'Robot connection status'],
      },
      {
        label: 'The hard part',
        summary: 'A live stage forgives nothing: every tap happens in front of an audience, so the interface has to be impossible to get lost in.',
        leaves: ['Instant feedback on every tap', 'Large, forgiving targets', 'Recover in one tap', 'Robot state always visible'],
      },
      {
        label: 'Outcome',
        summary: 'The casting interface ran the live demo at the World AI Summit.',
        leaves: ['World AI Summit live demo', 'Robotics added to the MIAs story', 'Multi-device UX'],
      },
    ],
  },

  holacracy: {
    branches: [
      {
        label: 'The brief',
        summary: 'Internal software for self-organising teams: circles, roles, tensions and governance, without a traditional management hierarchy.',
        leaves: ['Circles', 'Roles', 'Tensions', 'Governance'],
      },
      {
        label: 'Who it’s for',
        summary: 'Everyone inside a self-organising company, from people holding roles to the facilitators who run governance.',
        leaves: ['Role holders', 'Circle leads', 'Facilitators and secretaries', 'New members learning it'],
      },
      {
        label: 'My role',
        summary: 'Co-designer with shared ownership of the flows and UI for the governance workflows.',
        leaves: ['Flows and UI', 'Governance workflows', 'Shared ownership'],
      },
      {
        label: 'What I designed',
        summary: 'The everyday surfaces of a self-organising company: who does what, what needs changing, and how decisions get made.',
        leaves: ['Map of circles', 'Role cards with accountabilities', 'Tension inbox', 'Governance meeting flow'],
      },
      {
        label: 'The hard part',
        summary: 'Holacracy is a rulebook. The design had to turn its constitution into something people can use without reading it.',
        leaves: ['Rules turned into UI', 'Who owns what, at a glance', 'Tensions processed fast', 'Records without bureaucracy'],
      },
      {
        label: 'What it shows',
        summary: 'Where org design meets product design: modelling how a company works, then making that model usable.',
        leaves: ['Systems thinking', 'Complex internal workflows', 'Org design as product'],
      },
    ],
  },

  kya: {
    branches: [
      {
        label: 'The brief',
        summary: 'Know Your Anything: document workflow and management for enterprise compliance teams, with documents connected as a knowledge graph.',
        leaves: ['Document workflows', 'Compliance management', 'Knowledge-graph UX'],
      },
      {
        label: 'Who it’s for',
        summary: 'Compliance teams who have to find, review and prove things across large sets of documents.',
        leaves: ['Compliance officers', 'Reviewers and approvers', 'Auditors'],
      },
      {
        label: 'My role',
        summary: 'Lead designer across the information architecture, flows and UI.',
        leaves: ['Information architecture', 'End-to-end flows', 'UI design'],
      },
      {
        label: 'What I designed',
        summary: 'The path a document takes, from arriving to being approved, and a graph view that shows what it connects to.',
        leaves: ['Document intake', 'Review and approval flow', 'Graph of linked entities', 'Search across documents'],
      },
      {
        label: 'The hard part',
        summary: 'Dense information with high stakes: compliance work needs everything traceable without burying people in detail.',
        leaves: ['Traceable for audits', 'Status at a glance', 'Relationships without clutter', 'Permission-aware views'],
      },
      {
        label: 'Outcome',
        summary: 'KYA became part of the agentic Mobius DTaaS suite, alongside the Unified Canvas and the SAI model catalog.',
        leaves: ['Part of the Mobius DTaaS suite', 'Knowledge-graph UX', 'Enterprise compliance'],
      },
    ],
  },

  amplyfund: {
    branches: [
      {
        label: 'The brief',
        summary: 'Redesign a crowdfunding and fundraising platform for the TV, fixing its usability friction and onboarding.',
        leaves: ['TV UI redesign', 'Usability friction', 'Design-system alignment', 'Better onboarding'],
      },
      {
        label: 'Who it’s for',
        summary: 'People browsing causes from the sofa, and the organisers who need their campaigns to be seen.',
        leaves: ['Donors on the sofa', 'Campaign organisers', 'First-time givers'],
      },
      {
        label: 'My role',
        summary: 'Co-designer with shared ownership of the redesign, from usability fixes to onboarding.',
        leaves: ['Usability fixes', 'Onboarding flows', 'Design-system alignment'],
      },
      {
        label: 'What I designed',
        summary: 'A ten-foot fundraising experience: discover a cause, understand it, and give without wrestling the remote.',
        leaves: ['Campaign discovery rows', 'Campaign detail page', 'Giving via phone handoff', 'Goal progress at a glance'],
      },
      {
        label: 'The hard part',
        summary: 'Giving money with a remote: payment details don’t belong on a TV, and trust has to read from across the room.',
        leaves: ['No typing card numbers on TV', 'Trust signals at ten feet', 'Short, focus-safe flows'],
      },
      {
        label: 'What it shows',
        summary: 'The same ten-foot discipline as Revee & Mo and iZak, applied to money.',
        leaves: ['Ten-foot UX', 'Payments on TV', 'Design-system consistency'],
      },
    ],
  },

  voteiq: {
    branches: [
      {
        label: 'The brief',
        summary: 'A civic engagement product on TV and the web that helps first-time voters understand elections and take part.',
        leaves: ['Civic engagement', 'TV and web', 'First-time voters'],
      },
      {
        label: 'Who it’s for',
        summary: 'People voting for the first time, and the households who watch and talk about elections together.',
        leaves: ['First-time voters', 'Undecided voters', 'Households watching together'],
      },
      {
        label: 'My role',
        summary: 'Co-designer with Khushi and Cherry, working together through research and design.',
        leaves: ['Research', 'Persona-based user flows', 'TV and web UI'],
      },
      {
        label: 'What I designed',
        summary: 'Persona-based journeys from “I don’t know where to start” to “I’m ready to vote”.',
        leaves: ['Candidate and party explainers', 'Voter readiness checklist', 'Dates and booth reminders', 'Neutral issue comparisons'],
      },
      {
        label: 'The hard part',
        summary: 'Civic information has to be clear without ever feeling partisan, and the journey has to hold together across two screens.',
        leaves: ['No bias in the interface', 'Plain-language explainers', 'One journey on TV and web'],
      },
      {
        label: 'What it shows',
        summary: 'Research-led flows for a sensitive, public-interest product, designed across surfaces.',
        leaves: ['Civic tech', 'Persona-driven design', 'Cross-surface journeys'],
      },
    ],
  },

  mo: {
    roleLabel: 'Product Design Intern',
    when: 'Jan – Jun 2023',
    branches: [
      {
        label: 'The brief',
        summary: 'Employee health on one side and the HR team on the other: an employee app, an HR dashboard, and a consumer healthcare pilot.',
        leaves: ['Employee app', 'HR dashboard', 'Consumer healthcare pilot'],
      },
      {
        label: 'Who it’s for',
        summary: 'Employees using their health benefits, the HR teams who run them, and the users of the internal pilot.',
        leaves: ['Employees', 'HR teams', 'Pilot users'],
      },
      {
        label: 'My role',
        summary: 'Product Design Intern in Bengaluru, leading three major features and supporting the pilot through leadership reviews and QA.',
        leaves: ['Led 3 major features', 'IA and prototyping', 'CEO and Head of Design reviews', 'QA handoff support'],
      },
      {
        label: 'What I designed',
        summary: 'An HR dashboard and an employee app, from concept to Play Store release, plus the pilot’s information architecture and prototypes.',
        leaves: ['HR dashboard', 'Employee app', 'Three feature launches', 'Pilot IA and prototypes'],
      },
      {
        label: 'The hard part',
        summary: 'Two audiences in one product: employees need privacy and simplicity, HR needs visibility, and it all had to ship within six months.',
        leaves: ['Employee privacy vs HR view', 'Simple health flows', 'Concept to store in six months'],
      },
      {
        label: 'Outcome',
        summary: 'The three features lifted engagement by 20%, and the employee app shipped to the Play Store.',
        leaves: ['+20% engagement', 'Shipped to the Play Store', 'Pilot reviewed by leadership'],
      },
    ],
  },

  clink: {
    branches: [
      {
        label: 'The brief',
        summary: 'A UI redesign of a social mobile app: a fresher, more consistent product without losing what users already knew.',
        leaves: ['UI redesign', 'Visual consistency', 'Social mobile app'],
      },
      {
        label: 'Who it’s for',
        summary: 'Everyday users of a social app, and the new users who meet it for the first time.',
        leaves: ['Everyday social users', 'New users', 'The design team itself'],
      },
      {
        label: 'My role',
        summary: 'Co-designer alongside Moon and Ritesh: I shaped the visual direction, led refinement sessions and onboarded Ritesh to the team.',
        leaves: ['Shaped the visual direction', 'Led refinement sessions', 'Onboarded Ritesh'],
      },
      {
        label: 'What I designed',
        summary: 'A visual language and the core screens built from it, as reusable components rather than one-off layouts.',
        leaves: ['Visual language', 'Core screens', 'Reusable components'],
      },
      {
        label: 'The hard part',
        summary: 'Redesigning a product people already use, while bringing a new designer up to speed at the same time.',
        leaves: ['Keep familiar patterns', 'One visual system', 'Fast feedback loops'],
      },
      {
        label: 'What it shows',
        summary: 'Art direction and team-building as much as screens: part of the five-plus designers I’ve mentored.',
        leaves: ['Art direction', 'Mentoring designers', 'Design critique rituals'],
      },
    ],
  },

  arch: {
    roleLabel: 'Architect',
    when: 'B.Arch, 2015 – 2020',
    branches: [
      {
        label: 'The brief',
        summary: 'Before screens, buildings: residential architecture, from the B.Arch at IPS Academy, Indore.',
        leaves: ['Residential projects', 'B.Arch, 2015 – 2020', 'IPS Academy, Indore'],
      },
      {
        label: 'Who it’s for',
        summary: 'Families who live in the homes, and everyone who has to build them.',
        leaves: ['Families and homeowners', 'Contractors on site', 'Local authorities'],
      },
      {
        label: 'My role',
        summary: 'Solo, from a client’s brief through spatial planning to construction drawings.',
        leaves: ['Client briefs', 'Spatial planning', 'Construction drawings'],
      },
      {
        label: 'What I designed',
        summary: 'Homes shaped around how people actually move through them, and the light they live in.',
        leaves: ['Floor plans', 'Light and ventilation', 'Material palettes', '3D visualisation'],
      },
      {
        label: 'What carries over',
        summary: 'Architecture taught the habits I bring to every interface.',
        leaves: ['Circulation becomes navigation', 'Wayfinding becomes IA', 'Drawings become specs', 'Site visits become research'],
      },
      {
        label: 'Where it shows',
        summary: 'The spatial thinking runs through my product work, and through this portfolio, built as a city.',
        leaves: ['LiDAR and 3D on iZak', 'Ten-foot spatial layouts', 'This portfolio, as a city'],
      },
    ],
  },
}
