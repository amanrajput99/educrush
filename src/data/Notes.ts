export type Note = {
  id?: number
  title: string
  description: string
  subject: string
  image: string
  link: string
  drivelink?: string    // Google Drive PDF link — used in detail page viewer
  course?: string       // e.g. 'BTech', 'Class 10', 'BCA', 'Diploma'
  year?: string         // e.g. '1st Year', '2nd Year', 'Year 1' OR 'Class 10', 'Class 12'
  semester?: string     // optional: '1st Sem', '2nd Sem' etc.
}

// ── Course config — year options per course ───────────────────────────────────
export const COURSE_YEARS: Record<string, string[]> = {
  'BTech':    ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  'BCA':      ['1st Year', '2nd Year', '3rd Year'],
  'Diploma':  ['1st Year', '2nd Year', '3rd Year'],
  'Class 10': [],
  'Class 11': [],
  'Class 12': [],
  'MCA':      ['1st Year', '2nd Year'],
  'MBA':      ['1st Year', '2nd Year'],
  'BSc':      ['1st Year', '2nd Year', '3rd Year'],
}

export const COURSES = Object.keys(COURSE_YEARS)

// ── Sample notes data ─────────────────────────────────────────────────────────
export const notes: Note[] = [
  // ── BTech ──────────────────────────────────────────────────────────────────
  {
    title: 'Engineering Mathematics I',
    description: 'Matrices, Differential Calculus, aur Integration — BTech 1st year ka core math.',
    subject: 'Maths',
    course: 'BTech',
    year: '1st Year',
    image: '',
    link: '/notes/engg-maths-1',
    drivelink: 'https://drive.google.com/file/d/1C2jlSxU2cmwDGfzFPrIfKjztxAdDILgP/view?usp=sharing',  // 🔗 Add Google Drive link: https://drive.google.com/file/d/FILE_ID/view
  },
  {
    title: 'Basic Electrical Engineering',
    description: 'Ohm\'s Law, Kirchhoff\'s Laws, AC/DC circuits — electrical fundamentals.',
    subject: 'Physics',
    course: 'BTech',
    year: '1st Year',
    image: '',
    link: '/notes/bee',
    drivelink: 'https://drive.google.com/file/d/1C2jlSxU2cmwDGfzFPrIfKjztxAdDILgP/view?usp=sharing',
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Arrays, Linked Lists, Trees, Sorting — CS ka backbone.',
    subject: 'Computer Science',
    course: 'BTech',
    year: '2nd Year',
    image: '',
    link: '/notes/dsa',
    drivelink: 'https://drive.google.com/file/d/1C2jlSxU2cmwDGfzFPrIfKjztxAdDILgP/view?usp=sharing',
  },
  {
    title: 'Operating Systems',
    description: 'Process Management, Memory, Deadlocks — OS ke concepts clearly explain kiye.',
    subject: 'Computer Science',
    course: 'BTech',
    year: '3rd Year',
    image: '',
    link: '/notes/os',
    drivelink: 'https://drive.google.com/file/d/1C2jlSxU2cmwDGfzFPrIfKjztxAdDILgP/view?usp=sharing',
  },
  {
    title: 'Machine Learning',
    description: 'Regression, Classification, Neural Networks — ML ka complete overview.',
    subject: 'Computer Science',
    course: 'BTech',
    year: '4th Year',
    image: '',
    link: '/notes/ml',
    drivelink: '',
  },

  // ── BCA ────────────────────────────────────────────────────────────────────
  {
    title: 'C Programming Basics',
    description: 'Variables, Loops, Functions, Pointers — C language shuru se seekho.',
    subject: 'Computer Science',
    course: 'BCA',
    year: '1st Year',
    image: '',
    link: '/notes/c-programming',
    drivelink: '',
  },
  {
    title: 'Database Management System',
    description: 'SQL, ER Diagrams, Normalization — DBMS ke saare important topics.',
    subject: 'Computer Science',
    course: 'BCA',
    year: '2nd Year',
    image: '',
    link: '/notes/dbms',
    drivelink: '',
  },
  {
    title: 'Web Development',
    description: 'HTML, CSS, JavaScript, PHP — full web dev notes for BCA final year.',
    subject: 'Computer Science',
    course: 'BCA',
    year: '3rd Year',
    image: '',
    link: '/notes/web-dev',
    drivelink: '',
  },

  // ── Diploma ────────────────────────────────────────────────────────────────
  {
    title: 'Engineering Drawing',
    description: 'Orthographic Projection, Isometric Views — Diploma 1st year drawing notes.',
    subject: 'Drawing',
    course: 'Diploma',
    year: '1st Year',
    image: '',
    link: '/notes/engg-drawing',
    drivelink: '',
  },
  {
    title: 'Applied Mechanics',
    description: 'Forces, Moments, Friction — Diploma 2nd year mechanics.',
    subject: 'Physics',
    course: 'Diploma',
    year: '2nd Year',
    image: '',
    link: '/notes/applied-mechanics',
    drivelink: '',
  },
  {
    title: 'Industrial Management',
    description: 'Production planning, Quality control, Management principles.',
    subject: 'Management',
    course: 'Diploma',
    year: '3rd Year',
    image: '',
    link: '/notes/industrial-mgmt',
    drivelink: '',
  },

  // ── Class 10 ───────────────────────────────────────────────────────────────
  {
    title: 'Newton ke 3 Laws',
    description: 'Inertia, F=ma, aur Action-Reaction — classical mechanics ka base.',
    subject: 'Physics',
    course: 'Class 10',
    image: '',
    link: '/notes/newton-laws',
    drivelink: '',
  },
  {
    title: 'Quadratic Formula',
    description: 'x = (−b ± √b²−4ac) / 2a — koi bhi quadratic equation solve karo.',
    subject: 'Maths',
    course: 'Class 10',
    image: '',
    link: '/notes/quadratic-formula',
    drivelink: '',
  },
  {
    title: 'Photosynthesis',
    description: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ — plants sunlight se food banate hain.',
    subject: 'Biology',
    course: 'Class 10',
    image: '',
    link: '/notes/photosynthesis',
    drivelink: '',
  },
  {
    title: 'French Revolution',
    description: '1789 mein hui — Liberty, Equality, Fraternity ka naara.',
    subject: 'History',
    course: 'Class 10',
    image: '',
    link: '/notes/french-revolution',
    drivelink: '',
  },

  // ── Class 11 ───────────────────────────────────────────────────────────────
  {
    title: 'Thermodynamics',
    description: 'Laws of Thermodynamics, Heat engines, Entropy — Class 11 Physics.',
    subject: 'Physics',
    course: 'Class 11',
    image: '',
    link: '/notes/thermodynamics',
    drivelink: '',
  },
  {
    title: 'Organic Chemistry Basics',
    description: 'Hydrocarbons, Functional Groups, IUPAC Naming — Class 11 Chemistry.',
    subject: 'Chemistry',
    course: 'Class 11',
    image: '',
    link: '/notes/organic-chem',
    drivelink: '',
  },
  {
    title: 'Permutations & Combinations',
    description: 'nPr, nCr, aur Binomial Theorem — Class 11 Maths ka important chapter.',
    subject: 'Maths',
    course: 'Class 11',
    image: '',
    link: '/notes/pnc',
    drivelink: '',
  },

  // ── Class 12 ───────────────────────────────────────────────────────────────
  {
    title: 'Electrostatics',
    description: 'Coulomb\'s Law, Electric Field, Gauss\'s Law — Class 12 Physics Chapter 1.',
    subject: 'Physics',
    course: 'Class 12',
    image: '',
    link: '/notes/electrostatics',
    drivelink: '',
  },
  {
    title: 'Integration',
    description: 'Definite & Indefinite Integrals, by parts, substitution — Class 12 Maths.',
    subject: 'Maths',
    course: 'Class 12',
    image: '',
    link: '/notes/integration',
    drivelink: '',
  },
  {
    title: 'Genetics & Evolution',
    description: 'Mendel\'s Laws, DNA, Natural Selection — Class 12 Biology.',
    subject: 'Biology',
    course: 'Class 12',
    image: '',
    link: '/notes/genetics',
    drivelink: '',
  },
  {
    title: 'World War II',
    description: '1939–1945 — Hitler, Allied forces, aur nuclear bombing of Japan.',
    subject: 'History',
    course: 'Class 12',
    image: '',
    link: '/notes/world-war-2',
    drivelink: '',
  },
]