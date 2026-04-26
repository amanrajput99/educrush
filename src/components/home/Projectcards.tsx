'use client'

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';

const ProjectCard = ({ project }: { project: (typeof projects)[number] }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group relative min-w-[280px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-5 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400"
    >
      {/* Cursor Glow */}
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 blur-2xl"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? 1 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />

      <div className="relative z-10">
        {/* Thumbnail */}
        <div className="thumb-wrap relative overflow-hidden rounded-xl">
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="h-[clamp(180px,50vw,245px)] w-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?w=600';
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-3">
            <span className="flex items-center gap-2 rounded-md border border-emerald-400/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-sm">
              View Project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H7M17 7v10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Title + Desc */}
        <div className="relative mt-4">
          <div className="absolute inset-x-0 -bottom-2 h-12 bg-gradient-to-t from-emerald-500/20 to-transparent blur-lg opacity-70 pointer-events-none" />
          <h3 className="relative text-lg font-semibold text-white tracking-tight">
            {project.name}
          </h3>
        </div>
        <p className="text-sm text-slate-300 mt-1 line-clamp-2">{project.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag, j) => (
            <span
              key={j}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};

const ProjectCards = () => {
  return (
    <section className="bg-black text-slate-100 py-16 px-6">
      <div className="text-center mb-11">
        <h1 className="text-[42px] font-medium text-white tracking-tighter">
          Our Latest Projects
        </h1>
        <p className="text-base/6 text-slate-300 max-w-md mx-auto mt-1">
          A collection of creative web projects — each crafted with code, design, and attention to detail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectCards;
