export const JOB_ROLES = [
  'Software Developer',
  'Python Developer',
  'Java Developer',
  'Data Analyst',
  'Machine Learning Engineer',
  'Web Developer'
];

export const INTERVIEW_TYPES = [
  { id: 'Mixed', label: 'Mixed (All Competencies)', desc: 'Adaptive rotation across Technical, Problem Solving, Communication, and Behavioral topics.' },
  { id: 'Technical', label: 'Technical Deep-Dive', desc: 'Core programming, syntax, internal data structures, and computer science theory.' },
  { id: 'Problem Solving', label: 'Problem Solving & Architecture', desc: 'System design, algorithm optimization, debugging, and trade-off analysis.' },
  { id: 'Communication', label: 'Communication & Stakeholders', desc: 'Cross-functional collaboration, technical documentation, and incident articulation.' },
  { id: 'Behavioral', label: 'Behavioral & Leadership', desc: 'STAR-method leadership, conflict resolution, accountability, and resilience.' }
];

export const DIFFICULTY_LEVELS = {
  EASY: { label: 'Easy', color: '#10b981', badgeClass: 'badge-easy' },
  MEDIUM: { label: 'Medium', color: '#f59e0b', badgeClass: 'badge-medium' },
  HARD: { label: 'Hard', color: '#f43f5e', badgeClass: 'badge-hard' }
};

export const READINESS_LEVELS = {
  'JOB READY': { min: 80, badgeClass: 'badge-job-ready', color: '#10b981', text: 'Job Ready' },
  'INTERVIEW READY': { min: 60, badgeClass: 'badge-interview-ready', color: '#06b6d4', text: 'Interview Ready' },
  'BEGINNER READY': { min: 40, badgeClass: 'badge-beginner-ready', color: '#f59e0b', text: 'Beginner Ready' },
  'NOT READY': { min: 0, badgeClass: 'badge-not-ready', color: '#f43f5e', text: 'Needs Improvement' }
};

export const AI_AGENTS_INFO = [
  {
    name: 'Interview Orchestrator Agent',
    role: 'Session Coordinator & State Manager',
    desc: 'Manages candidate lifecycle, tracks progress, coordinates agent delegation, and triggers assessment.',
    icon: 'Brain'
  },
  {
    name: 'Adaptive Interview Agent',
    role: 'Dynamic Difficulty & Question Generator',
    desc: 'Analyzes prior performance in real time to adapt difficulty (EASY/MEDIUM/HARD) and sequence topics.',
    icon: 'Cpu'
  },
  {
    name: 'Answer Evaluation Agent',
    role: 'Multi-Dimensional Answer Evaluator',
    desc: 'Evaluates candidate correctness, relevance, completeness, technical depth, and returns structured feedback.',
    icon: 'CheckCircle2'
  },
  {
    name: 'Skill Assessment Agent',
    role: 'Competency Synthesizer & Gap Detector',
    desc: 'Aggregates full interview trajectory across Technical, Problem Solving, Communication, and Behavioral pillars.',
    icon: 'Activity'
  },
  {
    name: 'Career Readiness Agent',
    role: 'Benchmark Calculator & Career Roadmap',
    desc: 'Applies formula (35% Tech + 25% Prob + 20% Comm + 20% Beh) and produces personalized career recommendations.',
    icon: 'TrendingUp'
  }
];
