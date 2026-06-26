"use client";

import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';

// Dummy data: Replace these with your actual CSE projects, hackathons, or SaaS builds!
const projects = [
  {
    id: 1,
    title: 'AI Resume Analyzer',
    category: 'Next.js • OpenAI',
    // Using a gorgeous placeholder gradient from Unsplash for now
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', 
    link: '#',
  },
  {
    id: 2,
    title: 'Distributed Chat DB',
    category: 'Go • PostgreSQL',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 3,
    title: 'WebGL Physics Engine',
    category: 'TypeScript • Three.js',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 4,
    title: 'Fintech API Gateway',
    category: 'Node.js • Redis',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop',
    link: '#',
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen px-6 pt-32 pb-24 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-12">
          All my best work
        </h1>

        {/* The Stats Strip (Adapted for a CSE student) */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center border-y border-white/10 py-8 w-full max-w-3xl">
          <div>
            <div className="text-3xl font-semibold text-white mb-1">{projects.length}</div>
            <div className="text-sm text-neutral-500">Full-Stack Projects</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-white mb-1">3</div>
            <div className="text-sm text-neutral-500">Hackathons Won</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-white mb-1">5+</div>
            <div className="text-sm text-neutral-500">Languages Mastered</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-white mb-1">∞</div>
            <div className="text-sm text-neutral-500">Lines of Code</div>
          </div>
        </div>
      </motion.div>

      {/* The Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>

    </main>
  );
}