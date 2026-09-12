"use client";

import { motion } from 'framer-motion';

const workflowSteps = [
  { id: '01', title: 'System Design', desc: 'Mapping out scalable architectures and database schemas before writing a single line of code.' },
  { id: '02', title: 'API Architecture', desc: 'Building robust, secure, and lightning-fast REST or GraphQL backends.' },
  { id: '03', title: 'Frontend Dev', desc: 'Crafting pixel-perfect, responsive client interfaces using Next.js and Tailwind.' },
  { id: '04', title: 'Database Optimization', desc: 'Tuning complex queries and ensuring data integrity with Prisma and PostgreSQL.' },
  { id: '05', title: 'CI/CD & DevOps', desc: 'Automating testing and deployment pipelines for zero-downtime releases.' },
  { id: '06', title: 'Handover & Docs', desc: 'Writing clean, maintainable documentation for future contributors or clients.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 pt-32 pb-24 max-w-4xl mx-auto flex flex-col items-center">
      
      {/* Bio Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-24"
      >
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-12">
          A few words <br className="hidden md:block" /> about me
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed max-w-3xl mx-auto font-light">
          Hi! I'm a <span className="text-white font-medium">full-stack developer</span> and CSE student deeply passionate about clean code and scalable systems. I design and build high-performance web applications. Currently based in university, but <span className="text-white font-medium">ready to engineer worldwide.</span>
        </p>
      </motion.div>

      {/* Profile Image / Gallery Placeholder */}
  
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    duration: 0.8,
    delay: 0.2,
    ease: [0.16, 1, 0.3, 1]
  }}
  className="
    relative
    w-full
    max-w-2xl
    h-[70vh]
    rounded-[32px]
    overflow-hidden
    bg-neutral-900
    border border-white/10
    mb-32
    flex items-center justify-center
  "
>
  {/* Blurred background */}
  <img
    src="/about_me.jpg"
    alt=""
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      scale-110
      blur-2xl
      opacity-40
    "
  />

  {/* Full image — never cropped */}
  <img
    src="/about_me.jpg"
    alt="My Workspace"
    className="
      relative
      z-10
      w-full
      h-full
      object-contain
    "
  />
</motion.div>



      {/* Workflow Section */}
      <div className="w-full">
        <h2 className="text-4xl font-medium text-white text-center mb-16">My workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
          {workflowSteps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black p-8 flex flex-col"
            >
              <div className="text-neutral-600 text-sm font-mono mb-8">{step.id}</div>
              <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </main>
  );
}