export type Note = {
  id?: number
  title: string
  description: string
  subject: string
  image: string
  link: string
  drivelink?: string
  course?: string
  year?: string
  semester?: string
  // ── New SEO fields ──────────────────────────────────────────────────────────
  noteType?: 'handwritten' | 'typed' | 'printed' | 'mixed'
  pages?: number
  topics?: string[]   // ['OOPs', 'Inheritance', 'Exception Handling']
}

// ── Course config ─────────────────────────────────────────────────────────────
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

export const notes: Note[] = [

  // ── BTech ──────────────────────────────────────────────────────────────────
  {
    title: 'JAVA Programming',
    description: 'Complete JAVA Programming notes for BTech 2nd Year students. Covers core Java concepts including Object-Oriented Programming (OOPs), classes and objects, inheritance, polymorphism, abstraction, encapsulation, exception handling, collections framework, multithreading, and file I/O. Includes solved examples, important exam questions, and concise revision-ready summaries. Free PDF download.',
    subject: 'JAVA',
    course: 'BTech',
    year: '2nd Year',
    semester: '3rd Sem',
    image: '',
    link: '/notes/java-programming',
    drivelink: 'https://drive.google.com/file/d/1_POWjMbllkuTnAaQHZGLbT4V6M9L0RQY/view?usp=sharing',
    noteType: 'handwritten',
    pages: 48,
    topics: ['OOPs', 'Inheritance', 'Polymorphism', 'Exception Handling', 'Collections', 'Multithreading', 'File I/O'],
  },

  // ── Commented notes — uncomment karo jab PDF ready ho ──────────────────────

  // {
  //   title: 'Basic Electrical Engineering',
  //   description: 'Complete BEE notes for BTech 1st Year students. Covers Ohm\'s Law, Kirchhoff\'s Current and Voltage Laws, AC and DC circuit analysis, network theorems, transformers, and electrical machines. Exam-focused notes with diagrams and solved numericals. Free PDF download.',
  //   subject: 'Physics',
  //   course: 'BTech',
  //   year: '1st Year',
  //   semester: '1st Sem',
  //   image: '',
  //   link: '/notes/bee',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'AC Circuits', 'DC Circuits', 'Transformers'],
  // },

  // {
  //   title: 'Data Structures & Algorithms',
  //   description: 'Complete DSA notes for BTech 2nd Year Computer Science students. Covers Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting algorithms, and Searching algorithms. Includes time complexity analysis, exam questions, and implementation examples. Free PDF download.',
  //   subject: 'Computer Science',
  //   course: 'BTech',
  //   year: '2nd Year',
  //   semester: '3rd Sem',
  //   image: '',
  //   link: '/notes/dsa',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Sorting', 'Searching'],
  // },

  // {
  //   title: 'Operating Systems',
  //   description: 'Complete OS notes for BTech 3rd Year students. Covers Process Management, CPU Scheduling, Memory Management, Virtual Memory, Deadlocks, File Systems, and I/O Management. Clear diagrams, solved previous year questions, and exam tips included. Free PDF.',
  //   subject: 'Computer Science',
  //   course: 'BTech',
  //   year: '3rd Year',
  //   semester: '5th Sem',
  //   image: '',
  //   link: '/notes/os',
  //   drivelink: '',
  //   noteType: 'typed',
  //   topics: ['Process Management', 'CPU Scheduling', 'Memory Management', 'Deadlocks', 'File Systems'],
  // },

  // {
  //   title: 'Machine Learning',
  //   description: 'Complete Machine Learning notes for BTech 4th Year students. Covers Supervised and Unsupervised Learning, Linear and Logistic Regression, Decision Trees, SVM, Neural Networks, and model evaluation techniques. Practical examples and exam-focused summaries included.',
  //   subject: 'Computer Science',
  //   course: 'BTech',
  //   year: '4th Year',
  //   semester: '7th Sem',
  //   image: '',
  //   link: '/notes/ml',
  //   drivelink: '',
  //   noteType: 'typed',
  //   topics: ['Regression', 'Classification', 'Decision Trees', 'SVM', 'Neural Networks'],
  // },

  // ── BCA ────────────────────────────────────────────────────────────────────

  // {
  //   title: 'C Programming Basics',
  //   description: 'Complete C Programming notes for BCA 1st Year students. Covers variables, data types, operators, control flow, loops, functions, arrays, pointers, and file handling. Beginner-friendly explanations with practical examples and lab programs. Free PDF download.',
  //   subject: 'Computer Science',
  //   course: 'BCA',
  //   year: '1st Year',
  //   semester: '1st Sem',
  //   image: '',
  //   link: '/notes/c-programming',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Variables', 'Loops', 'Functions', 'Arrays', 'Pointers', 'File Handling'],
  // },

  // {
  //   title: 'Database Management System',
  //   description: 'Complete DBMS notes for BCA 2nd Year students. Covers ER Diagrams, Relational Model, SQL queries, Normalization (1NF, 2NF, 3NF, BCNF), Transaction Management, and Indexing. Exam-ready notes with solved questions and important topics highlighted.',
  //   subject: 'Computer Science',
  //   course: 'BCA',
  //   year: '2nd Year',
  //   semester: '3rd Sem',
  //   image: '',
  //   link: '/notes/dbms',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['ER Diagrams', 'SQL', 'Normalization', 'Transactions', 'Indexing'],
  // },

  // {
  //   title: 'Web Development',
  //   description: 'Complete Web Development notes for BCA 3rd Year students. Covers HTML5, CSS3, JavaScript, DOM manipulation, PHP basics, and MySQL integration. Includes mini project ideas, practical examples, and exam important questions. Free PDF download.',
  //   subject: 'Computer Science',
  //   course: 'BCA',
  //   year: '3rd Year',
  //   semester: '5th Sem',
  //   image: '',
  //   link: '/notes/web-dev',
  //   drivelink: '',
  //   noteType: 'typed',
  //   topics: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
  // },

  // ── Diploma ────────────────────────────────────────────────────────────────

  // {
  //   title: 'Engineering Drawing',
  //   description: 'Complete Engineering Drawing notes for Diploma 1st Year students. Covers Orthographic Projection, Isometric Views, Sectional Views, Dimensioning, and AutoCAD basics. Step-by-step drawing examples and exam practice sheets included. Free PDF.',
  //   subject: 'Drawing',
  //   course: 'Diploma',
  //   year: '1st Year',
  //   semester: '1st Sem',
  //   image: '',
  //   link: '/notes/engg-drawing',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Orthographic Projection', 'Isometric Views', 'Sectional Views', 'Dimensioning'],
  // },

  // ── Class 10 ───────────────────────────────────────────────────────────────

  // {
  //   title: 'Newton\'s Laws of Motion',
  //   description: 'Complete notes on Newton\'s 3 Laws of Motion for Class 10 Physics. Covers Law of Inertia, F=ma, Action-Reaction law with real-life examples, solved numericals, and NCERT exercise answers. Exam-focused with important definitions and diagrams.',
  //   subject: 'Physics',
  //   course: 'Class 10',
  //   image: '',
  //   link: '/notes/newton-laws',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Law of Inertia', 'F=ma', 'Action-Reaction', 'Momentum'],
  // },

  // {
  //   title: 'Quadratic Equations',
  //   description: 'Complete Quadratic Equations notes for Class 10 Maths. Covers factorization method, completing the square, quadratic formula (x = −b ± √b²−4ac / 2a), nature of roots, and word problems. Includes all NCERT solutions and extra practice questions.',
  //   subject: 'Maths',
  //   course: 'Class 10',
  //   image: '',
  //   link: '/notes/quadratic-formula',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Factorization', 'Quadratic Formula', 'Nature of Roots', 'Word Problems'],
  // },

  // {
  //   title: 'Photosynthesis',
  //   description: 'Complete Photosynthesis notes for Class 10 Biology. Covers the process of photosynthesis (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂), light and dark reactions, chlorophyll, factors affecting photosynthesis, and NCERT important questions with answers.',
  //   subject: 'Biology',
  //   course: 'Class 10',
  //   image: '',
  //   link: '/notes/photosynthesis',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Light Reactions', 'Dark Reactions', 'Chlorophyll', 'Factors Affecting Photosynthesis'],
  // },

  // ── Class 12 ───────────────────────────────────────────────────────────────

  // {
  //   title: 'Electrostatics',
  //   description: 'Complete Electrostatics notes for Class 12 Physics Chapter 1. Covers Coulomb\'s Law, Electric Field, Electric Potential, Gauss\'s Law, Capacitors, and dielectrics. Includes solved numericals, important formulas, and previous year board questions. Free PDF.',
  //   subject: 'Physics',
  //   course: 'Class 12',
  //   image: '',
  //   link: '/notes/electrostatics',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Coulomb\'s Law', 'Electric Field', 'Gauss\'s Law', 'Capacitors'],
  // },

  // {
  //   title: 'Integration',
  //   description: 'Complete Integration notes for Class 12 Maths. Covers Indefinite Integrals, Definite Integrals, integration by substitution, by parts, partial fractions, and applications of integration. All standard formulas, NCERT solutions, and board exam tips included.',
  //   subject: 'Maths',
  //   course: 'Class 12',
  //   image: '',
  //   link: '/notes/integration',
  //   drivelink: '',
  //   noteType: 'handwritten',
  //   topics: ['Indefinite Integrals', 'Definite Integrals', 'Integration by Parts', 'Applications'],
  // },

]