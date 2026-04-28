export type Note = {
  id?: number
  title: string
  description: string
  subject: string
  image: string
  link: string
}

export const notes: Note[] = [
  {
    title: 'Newton ke 3 Laws',
    description: 'Inertia, F=ma, aur Action-Reaction — ye teeno laws classical mechanics ka base hain.',
    subject: 'Physics',
    image: '',
    link: '/notes/newton-laws',
  },
  {
    title: 'Quadratic Formula',
    description: 'x = (−b ± √b²−4ac) / 2a — is formula se koi bhi quadratic equation solve ho jaati hai.',
    subject: 'Maths',
    image: '',
    link: '/notes/quadratic-formula',
  },
  {
    title: 'Photosynthesis',
    description: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ — plants sunlight se food banate hain.',
    subject: 'Biology',
    image: '',
    link: '/notes/photosynthesis',
  },
  {
    title: 'French Revolution',
    description: '1789 mein hui — Liberty, Equality, Fraternity ka naara poori duniya mein faila.',
    subject: 'History',
    image: '',
    link: '/notes/french-revolution',
  },
  {
    title: "Ohm's Law",
    description: 'V = IR — Voltage, Current aur Resistance ka relation.',
    subject: 'Physics',
    image: '',
    link: '/notes/ohms-law',
  },
  {
    title: 'Pythagoras Theorem',
    description: 'a² + b² = c² — right triangle mein kaam aata hai.',
    subject: 'Maths',
    image: '',
    link: '/notes/pythagoras',
  },
  {
    title: 'Cell Structure',
    description: 'Plant aur Animal cells ke beech ka fark — nucleus, mitochondria, cell wall.',
    subject: 'Biology',
    image: '',
    link: '/notes/cell-structure',
  },
  {
    title: 'World War II',
    description: '1939–1945 — Hitler, Allied forces, aur nuclear bombing of Japan.',
    subject: 'History',
    image: '',
    link: '/notes/world-war-2',
  },
  {
    title: 'Gravity & Orbits',
    description: 'F = Gm₁m₂/r² — planets kyun sun ke around ghoomte hain.',
    subject: 'Physics',
    image: '',
    link: '/notes/gravity',
  },
]