// 


export type CodeBlock = {
  language: string   // e.g. 'HTML', 'CSS', 'JavaScript'
  filename: string   // e.g. 'index.html'
  code: string
}

export type Project = {
  name: string
  description: string
  image: string
  tags: string[]
  link: string
  slug: string       // used for internal detail page route
  longDescription?: string
  codeBlocks?: CodeBlock[]
}

export const projects: Project[] = [
  {
    name: '9 Dot Navigation Menu',
    slug: '9-dot-navigation-menu',
    description: 'Modern 9-dot nav menu with smooth animations and a responsive layout for desktop and mobile.',
    longDescription: 'A clean 9-dot grid navigation menu inspired by Google\'s app launcher. Features smooth CSS animations, a responsive grid layout, and hover effects. Built with pure HTML and CSS — no JavaScript required.',
    image: 'https://educrush.in/img/9-dot-navigation-menu.jpg',
    tags: ['HTML', 'CSS'],
    link: 'https://educrush.in/all-projects/9-dot-navigation-menu',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>9 Dot Navigation Menu</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <nav class="navbar">
    <div class="dot-menu">
      <button class="dot-btn" id="dotBtn">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </button>
      <div class="dropdown" id="dropdown">
        <a href="#"><img src="icon1.png" alt="App 1" /><p>App 1</p></a>
        <a href="#"><img src="icon2.png" alt="App 2" /><p>App 2</p></a>
        <a href="#"><img src="icon3.png" alt="App 3" /><p>App 3</p></a>
        <a href="#"><img src="icon4.png" alt="App 4" /><p>App 4</p></a>
        <a href="#"><img src="icon5.png" alt="App 5" /><p>App 5</p></a>
        <a href="#"><img src="icon6.png" alt="App 6" /><p>App 6</p></a>
      </div>
    </div>
  </nav>

</body>
</html>`,
      },
      {
        language: 'CSS',
        filename: 'style.css',
        code: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0f0f0f;
  font-family: 'Poppins', sans-serif;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
  background: #111;
  border-bottom: 1px solid #222;
}

.dot-btn {
  display: grid;
  grid-template-columns: repeat(3, 6px);
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.dot-btn:hover {
  background: rgba(255,255,255,0.08);
}

.dot-btn span {
  width: 6px;
  height: 6px;
  background: #aaa;
  border-radius: 50%;
  transition: background 0.2s;
}

.dot-menu {
  position: relative;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-8px) scale(0.97);
  transition: all 0.25s ease;
  z-index: 100;
}

.dropdown.open {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0) scale(1);
}

.dropdown a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown a:hover {
  background: rgba(255,255,255,0.06);
}

.dropdown a p {
  font-size: 11px;
  color: #ccc;
  text-align: center;
}`,
      },
    ],
  },

  {
    name: 'Interactive 3D Web Hero',
    slug: 'interactive-3d-web-hero-section',
    description: 'Real-time 3D hero with particle systems and dynamic connections using Three.js.',
    longDescription: 'A stunning interactive 3D hero section built with Three.js. Features a live particle network that reacts to mouse movement, dynamic connection lines between nearby particles, and smooth camera rotation. Perfect for modern landing pages.',
    image: 'https://educrush.in/img/interactive-3d-web-hero-section.jpg',
    tags: ['Three.js', 'JavaScript'],
    link: 'https://educrush.in/all-projects/interactive-3d-web-hero-section',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Interactive 3D Web Hero</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; }
    canvas { display: block; }
    .hero-text {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 10;
    }
    .hero-text h1 {
      font-size: clamp(2rem, 6vw, 5rem);
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      color: #fff;
      text-align: center;
      letter-spacing: -0.03em;
    }
    .hero-text p {
      color: rgba(255,255,255,0.5);
      font-family: 'Poppins', sans-serif;
      margin-top: 12px;
      font-size: 1rem;
    }
  </style>
</head>
<body>
  <div class="hero-text">
    <h1>Interactive 3D Hero</h1>
    <p>Move your mouse to interact</p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js"></script>
  <script src="main.js"></script>
</body>
</html>`,
      },
      {
        language: 'JavaScript',
        filename: 'main.js',
        code: `const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

camera.position.z = 80

// Particles
const PARTICLE_COUNT = 120
const positions = []
const velocities = []

for (let i = 0; i < PARTICLE_COUNT; i++) {
  positions.push({
    x: (Math.random() - 0.5) * 160,
    y: (Math.random() - 0.5) * 100,
    z: (Math.random() - 0.5) * 60,
  })
  velocities.push({
    x: (Math.random() - 0.5) * 0.08,
    y: (Math.random() - 0.5) * 0.08,
  })
}

const geometry = new THREE.BufferGeometry()
const posArr = new Float32Array(PARTICLE_COUNT * 3)
positions.forEach((p, i) => {
  posArr[i * 3] = p.x
  posArr[i * 3 + 1] = p.y
  posArr[i * 3 + 2] = p.z
})
geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3))

const material = new THREE.PointsMaterial({ color: 0x4ade80, size: 0.8, transparent: true, opacity: 0.85 })
const points = new THREE.Points(geometry, material)
scene.add(points)

// Lines between nearby particles
const lineMat = new THREE.LineBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.15 })
const lineGeo = new THREE.BufferGeometry()
const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6)
lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
const lines = new THREE.LineSegments(lineGeo, lineMat)
scene.add(lines)

let mouse = { x: 0, y: 0 }
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth - 0.5) * 0.3
  mouse.y = -(e.clientY / innerHeight - 0.5) * 0.3
})

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

function animate() {
  requestAnimationFrame(animate)

  // Move particles
  const pos = geometry.attributes.position.array
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i].x += velocities[i].x
    positions[i].y += velocities[i].y
    if (Math.abs(positions[i].x) > 80) velocities[i].x *= -1
    if (Math.abs(positions[i].y) > 50) velocities[i].y *= -1
    pos[i * 3] = positions[i].x
    pos[i * 3 + 1] = positions[i].y
  }
  geometry.attributes.position.needsUpdate = true

  // Draw connection lines
  let lineIdx = 0
  const lp = lineGeo.attributes.position.array
  const THRESHOLD = 25
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const dx = positions[i].x - positions[j].x
      const dy = positions[i].y - positions[j].y
      if (Math.sqrt(dx*dx + dy*dy) < THRESHOLD) {
        lp[lineIdx++] = positions[i].x; lp[lineIdx++] = positions[i].y; lp[lineIdx++] = positions[i].z
        lp[lineIdx++] = positions[j].x; lp[lineIdx++] = positions[j].y; lp[lineIdx++] = positions[j].z
      }
    }
  }
  lineGeo.setDrawRange(0, lineIdx / 3)
  lineGeo.attributes.position.needsUpdate = true

  // Mouse parallax
  camera.position.x += (mouse.x * 20 - camera.position.x) * 0.05
  camera.position.y += (mouse.y * 15 - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}
animate()`,
      },
    ],
  },

  {
    name: '3D Book Portfolio',
    slug: 'book-portfolio',
    description: 'Smooth page-flip animations and creative UI using advanced CSS 3D transforms.',
    longDescription: 'A creative portfolio layout styled as a 3D flip-book. Each "page" reveals a new section with realistic CSS 3D transform animations. Uses perspective, rotateY, and backface-visibility for an immersive book-reading experience.',
    image: 'https://educrush.in/img/Book-portfolio.png',
    tags: ['CSS 3D', 'JavaScript'],
    link: 'https://educrush.in/all-projects/book-portfolio',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>3D Book Portfolio</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="scene">
    <div class="book" id="book">
      <div class="page" id="page1">
        <div class="front"><h2>Cover</h2><p>My Portfolio</p></div>
        <div class="back"><h2>About Me</h2><p>Hello! I'm a developer.</p></div>
      </div>
      <div class="page" id="page2">
        <div class="front"><h2>Projects</h2><p>See my work</p></div>
        <div class="back"><h2>Contact</h2><p>Get in touch</p></div>
      </div>
    </div>
  </div>
  <div class="controls">
    <button onclick="prevPage()">← Prev</button>
    <button onclick="nextPage()">Next →</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        language: 'CSS',
        filename: 'style.css',
        code: `body {
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.scene {
  perspective: 1200px;
}

.book {
  position: relative;
  width: 340px;
  height: 460px;
  transform-style: preserve-3d;
}

.page {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform-origin: left center;
  transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1.000);
}

.page.flipped {
  transform: rotateY(-180deg);
}

.front, .back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 0 16px 16px 0;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

.front {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid #2a2a4a;
}

.back {
  background: linear-gradient(135deg, #0d2818, #0a1a10);
  border: 1px solid #1a4a2a;
  transform: rotateY(180deg);
}

.front h2, .back h2 {
  font-size: 28px;
  color: #fff;
  font-weight: 700;
}

.front p, .back p {
  color: rgba(255,255,255,0.5);
  font-size: 14px;
}

.controls {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.controls button {
  padding: 10px 24px;
  border-radius: 10px;
  background: #1a1a2e;
  border: 1px solid #3a3a5e;
  color: #fff;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: all 0.2s;
}

.controls button:hover {
  background: #2a2a4e;
  border-color: #4ade80;
  color: #4ade80;
}`,
      },
      {
        language: 'JavaScript',
        filename: 'script.js',
        code: `const pages = document.querySelectorAll('.page')
let current = 0

function nextPage() {
  if (current < pages.length) {
    pages[current].classList.add('flipped')
    current++
  }
}

function prevPage() {
  if (current > 0) {
    current--
    pages[current].classList.remove('flipped')
  }
}`,
      },
    ],
  },

  {
    name: 'Animated Electric Border Card',
    slug: 'electric-card',
    description: 'Stylish glowing border card built with modern CSS animations and effects.',
    longDescription: 'A visually striking card component with an animated electric glow border. Uses conic-gradient and CSS keyframe animations to create a rotating plasma-like border effect. No JavaScript needed — pure CSS magic.',
    image: 'https://educrush.in/img/electric-card.jpg',
    tags: ['HTML', 'CSS'],
    link: 'https://educrush.in/all-projects/electric-card',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Electric Border Card</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="card">
    <div class="card-inner">
      <h2>Electric Card</h2>
      <p>Hover to feel the energy ⚡</p>
    </div>
  </div>
</body>
</html>`,
      },
      {
        language: 'CSS',
        filename: 'style.css',
        code: `* {
  margin: 0; padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #050505;
  font-family: 'Poppins', sans-serif;
}

.card {
  position: relative;
  width: 320px;
  height: 200px;
  border-radius: 20px;
  background: conic-gradient(
    from var(--angle),
    #4ade80, #22d3ee, #a855f7, #f43f5e, #4ade80
  );
  animation: rotate 3s linear infinite;
  padding: 2px;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate {
  to { --angle: 360deg; }
}

.card-inner {
  background: #0c0c0c;
  border-radius: 18px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.card-inner h2 {
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.card-inner p {
  color: rgba(255,255,255,0.4);
  font-size: 14px;
}`,
      },
    ],
  },

  {
    name: 'Animated Tesla Landing Page',
    slug: 'tesla-animation',
    description: 'Futuristic Tesla landing page with smooth transitions and interactive navigation.',
    longDescription: 'A pixel-perfect clone-inspired Tesla landing page featuring full-screen sections, smooth scroll-snap navigation, fade-in animations, and a sticky header. Built with HTML, CSS, and vanilla JavaScript.',
    image: 'https://educrush.in/img/tesla-animation.jpg',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://educrush.in/all-projects/tesla-animation',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Tesla Landing Page</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <header class="navbar">
    <div class="logo">TESLA</div>
    <nav>
      <a href="#">Model S</a>
      <a href="#">Model 3</a>
      <a href="#">Model X</a>
      <a href="#">Model Y</a>
    </nav>
    <div class="nav-right">
      <a href="#">Shop</a>
      <a href="#">Account</a>
      <button class="menu-btn">☰</button>
    </div>
  </header>

  <main class="sections">
    <section class="hero" style="background-image: url('model-s.jpg')">
      <div class="hero-text">
        <h1>Model S</h1>
        <p>Order Online for Touchless Delivery</p>
        <div class="cta">
          <button class="btn-primary">Custom Order</button>
          <button class="btn-secondary">Existing Inventory</button>
        </div>
      </div>
    </section>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        language: 'CSS',
        filename: 'style.css',
        code: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Poppins', sans-serif;
  background: #000;
  color: #fff;
}

.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
}

.logo {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: #fff;
}

nav, .nav-right {
  display: flex;
  gap: 24px;
}

nav a, .nav-right a {
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
}

nav a:hover, .nav-right a:hover { opacity: 0.7; }

.menu-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.hero {
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 120px;
}

.hero-text {
  text-align: center;
  animation: fadeUp 1s ease forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-text h1 {
  font-size: 52px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero-text p {
  font-size: 16px;
  color: rgba(255,255,255,0.7);
  margin-top: 8px;
}

.cta {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: center;
}

.btn-primary {
  padding: 14px 32px;
  border-radius: 4px;
  background: rgba(255,255,255,0.9);
  color: #000;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-primary:hover { background: #fff; }

.btn-secondary {
  padding: 14px 32px;
  border-radius: 4px;
  background: rgba(23,26,32,0.8);
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 14px;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.btn-secondary:hover { background: rgba(23,26,32,0.95); }`,
      },
      {
        language: 'JavaScript',
        filename: 'script.js',
        code: `// Navbar transparency on scroll
const navbar = document.querySelector('.navbar')

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(0,0,0,0.9)'
  } else {
    navbar.style.background = 'rgba(0,0,0,0.5)'
  }
})

// Fade-in on scroll using IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
    }
  })
}, { threshold: 0.2 })

document.querySelectorAll('.hero-text').forEach(el => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(30px)'
  el.style.transition = 'all 0.8s ease'
  observer.observe(el)
})`,
      },
    ],
  },

  {
    name: 'Netflix Button Animation',
    slug: 'netflix-animation',
    description: 'Glowing Netflix-style button with smooth animations for modern interactive UIs.',
    longDescription: 'A polished Netflix-inspired animated button with a red glowing pulse effect, smooth hover scale, and ripple animation on click. Pure HTML and CSS — no libraries needed.',
    image: 'https://educrush.in/img/netflix-animation.jpg',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://educrush.in/all-projects/netflix-animation',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Netflix Button</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="container">
    <button class="netflix-btn" id="btn">
      <span>Get Started</span>
    </button>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        language: 'CSS',
        filename: 'style.css',
        code: `body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #141414;
  font-family: 'Poppins', sans-serif;
}

.netflix-btn {
  position: relative;
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  background: #e50914;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.4);
}

.netflix-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(229, 9, 20, 0.7);
}

.netflix-btn:active {
  transform: scale(0.98);
}

.netflix-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.netflix-btn:hover::before {
  opacity: 1;
}

/* Ripple */
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  transform: scale(0);
  animation: ripple-anim 0.6s linear;
  pointer-events: none;
}

@keyframes ripple-anim {
  to { transform: scale(4); opacity: 0; }
}`,
      },
      {
        language: 'JavaScript',
        filename: 'script.js',
        code: `const btn = document.getElementById('btn')

btn.addEventListener('click', function(e) {
  const ripple = document.createElement('span')
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)

  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px'
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px'
  ripple.classList.add('ripple')

  btn.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
})`,
      },
    ],
  },

  {
    name: 'Animated Image Hover Effect',
    slug: 'card-hover',
    description: 'Smooth hover transitions creating a modern interactive gallery design.',
    longDescription: 'An elegant image gallery with smooth CSS hover transitions. Each card expands, reveals overlay text, and applies a zoom + blur effect on hover. Built entirely with HTML and CSS.',
    image: 'https://educrush.in/img/card-hover.jpg',
    tags: ['HTML', 'CSS'],
    link: 'https://educrush.in/all-projects/card-hover',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Image Hover Effect</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="gallery">
    <div class="card">
      <img src="https://picsum.photos/400/300?random=1" alt="Photo 1"/>
      <div class="overlay"><p>Nature</p></div>
    </div>
    <div class="card">
      <img src="https://picsum.photos/400/300?random=2" alt="Photo 2"/>
      <div class="overlay"><p>City</p></div>
    </div>
    <div class="card">
      <img src="https://picsum.photos/400/300?random=3" alt="Photo 3"/>
      <div class="overlay"><p>Abstract</p></div>
    </div>
  </div>
</body>
</html>`,
      },
      {
        language: 'CSS',
        filename: 'style.css',
        code: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  font-family: 'Poppins', sans-serif;
  padding: 40px;
}

.gallery {
  display: flex;
  gap: 16px;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  width: 240px;
  height: 320px;
  cursor: pointer;
  flex-shrink: 0;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.5s ease;
}

.card:hover img {
  transform: scale(1.1);
  filter: brightness(0.6);
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover .overlay {
  opacity: 1;
}

.overlay p {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  transform: translateY(12px);
  transition: transform 0.4s ease;
}

.card:hover .overlay p {
  transform: translateY(0);
}`,
      },
    ],
  },

  {
    name: 'Heart Particle Animation',
    slug: 'heart-animation',
    description: 'Thousands of particles forming a glowing heart shape using Three.js and WebGL.',
    longDescription: 'A mesmerizing Three.js animation where thousands of glowing particles assemble into a beating heart shape. Uses parametric equations to position particles, with continuous oscillation and color transitions for a lifelike pulse effect.',
    image: 'https://educrush.in/img/heart-animation.jpg',
    tags: ['Three.js', 'JavaScript'],
    link: 'https://educrush.in/all-projects/heart-animation',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Heart Particle Animation</title>
  <style>
    * { margin: 0; padding: 0; }
    body { background: #000; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js"></script>
  <script src="main.js"></script>
</body>
</html>`,
      },
      {
        language: 'JavaScript',
        filename: 'main.js',
        code: `const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

camera.position.z = 30

// Heart parametric equation
function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)
  return { x: x * 0.8, y: y * 0.8 }
}

const COUNT = 3000
const positions = new Float32Array(COUNT * 3)
const colors = new Float32Array(COUNT * 3)
const color = new THREE.Color()

for (let i = 0; i < COUNT; i++) {
  const t = (i / COUNT) * Math.PI * 2
  const p = heartPoint(t)
  const noise = () => (Math.random() - 0.5) * 1.5

  positions[i * 3]     = p.x + noise()
  positions[i * 3 + 1] = p.y + noise()
  positions[i * 3 + 2] = noise()

  color.setHSL(0.95 + Math.random() * 0.05, 1, 0.5 + Math.random() * 0.3)
  colors[i * 3]     = color.r
  colors[i * 3 + 1] = color.g
  colors[i * 3 + 2] = color.b
}

const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const mat = new THREE.PointsMaterial({
  size: 0.2,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
})

const heart = new THREE.Points(geo, mat)
scene.add(heart)

let t = 0
function animate() {
  requestAnimationFrame(animate)
  t += 0.02

  // Pulse
  const scale = 1 + Math.sin(t * 2) * 0.04
  heart.scale.set(scale, scale, scale)

  // Slow rotation
  heart.rotation.y += 0.005

  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})`,
      },
    ],
  },

  {
    name: 'Universe Particle Animation',
    slug: 'universe-particle',
    description: 'Rotating galaxy effect using thousands of particles with modern WebGL techniques.',
    longDescription: 'A hypnotic galaxy animation built with Three.js. Thousands of particles are distributed in a spiral arm pattern, colored with a blue-to-purple gradient, and continuously rotate to simulate a living universe. Includes mouse interaction for camera control.',
    image: 'https://educrush.in/img/carousel-3.jpg',
    tags: ['Three.js', 'JavaScript'],
    link: 'https://educrush.in/all-projects/universe-particle',
    codeBlocks: [
      {
        language: 'HTML',
        filename: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Universe Particle</title>
  <style>
    * { margin: 0; padding: 0; }
    body { background: #000; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js"></script>
  <script src="main.js"></script>
</body>
</html>`,
      },
      {
        language: 'JavaScript',
        filename: 'main.js',
        code: `const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000)
const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

camera.position.set(0, 40, 80)
camera.lookAt(0, 0, 0)

const COUNT = 8000
const positions = new Float32Array(COUNT * 3)
const colors = new Float32Array(COUNT * 3)
const color = new THREE.Color()

const ARMS = 3
const ARM_ANGLE = (Math.PI * 2) / ARMS

for (let i = 0; i < COUNT; i++) {
  const arm = i % ARMS
  const r = Math.random() * 40 + 2
  const spin = r * 0.35
  const angle = arm * ARM_ANGLE + spin + (Math.random() - 0.5) * 0.5

  positions[i * 3]     = Math.cos(angle) * r + (Math.random() - 0.5) * 2
  positions[i * 3 + 1] = (Math.random() - 0.5) * 2
  positions[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 2

  const t = r / 40
  color.setHSL(0.55 + t * 0.15, 1, 0.5 + (1 - t) * 0.3)
  colors[i * 3]     = color.r
  colors[i * 3 + 1] = color.g
  colors[i * 3 + 2] = color.b
}

const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const mat = new THREE.PointsMaterial({
  size: 0.25,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
})

const galaxy = new THREE.Points(geo, mat)
scene.add(galaxy)

function animate() {
  requestAnimationFrame(animate)
  galaxy.rotation.y += 0.001
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})`,
      },
    ],
  },
]