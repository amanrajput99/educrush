'use client'

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project, projects } from '@/data/projects';
import { getProjectsFromSupabase } from '@/lib/projectService';
import Link from 'next/link';

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <motion.a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-emerald-500/10 hover:shadow-xl"
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
            className="h-[clamp(180px,50vw,245px)] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?w=600';
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
            <span className="flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-sm">
              View Project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="relative mt-4">
          <h3 className="text-lg font-semibold text-white tracking-tight">{project.name}</h3>
        </div>
        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags?.map((tag, j) => (
            <span
              key={j}
              className="rounded-full border border-slate-700/80 bg-slate-900 px-3 py-0.5 text-xs text-slate-400 group-hover:border-emerald-800/50 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
};

const ViewMoreCard = () => {
  return (
    <Link
      href="/projects"
      className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900/60 min-h-[360px]"
    >
      {/* Animated glow bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Icon ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-700 group-hover:border-emerald-500/50 text-emerald-400 transition-all duration-300 group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
          Explore More
        </h3>
        <p className="text-sm text-slate-500 max-w-[180px] leading-relaxed">
          See our full collection of projects & experiments
        </p>

        {/* CTA pill */}
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-800/60 bg-emerald-950/50 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          View All Projects
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

const ProjectCards = ({ limit }: { limit?: number }) => {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjectsFromSupabase();
        if (data && data.length > 0) {
          setProjectList(data);
        } else {
          setProjectList(projects);
        }
      } catch (err) {
        setProjectList(projects);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const displayedProjects = limit ? projectList.slice(0, limit) : projectList;
  const showViewMore = limit && projectList.length > limit;

  if (loading) {
    return (
      <section className="bg-black text-slate-100 py-16 px-6">
        <div className="text-center mb-11">
          <div className="h-8 w-24 bg-slate-800 animate-pulse mx-auto rounded-lg mb-4" />
          <div className="h-10 w-64 bg-slate-800 animate-pulse mx-auto rounded mb-3" />
          <div className="h-4 w-80 bg-slate-800 animate-pulse mx-auto rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-900 animate-pulse rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-slate-100 px-6 py-12">
      <div className="text-center mb-12">
          <button className='px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg'>Projects</button>
        

        <h1 className="text-[42px] font-medium text-white tracking-tighter mt-1">
          {limit ? 'Our Latest Projects' : 'All Projects'}
        </h1>
        <p className="text-base text-slate-400 max-w-md mx-auto mt-2">
          {limit
            ? 'A collection of creative web projects — each crafted with code, design, and attention to detail.'
            : 'Explore our complete portfolio of web applications, experiments, and creative designs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {displayedProjects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
        {showViewMore && <ViewMoreCard />}
      </div>
    </section>
  );
};

export default ProjectCards;