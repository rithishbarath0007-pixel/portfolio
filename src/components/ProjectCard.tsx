"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  category: string;
  imageUrl: string;
  link: string;
}

export default function ProjectCard({ title, category, imageUrl, link }: ProjectCardProps) {
  return (
    <Link href={link} className="block w-full">
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer"
      >
        {/* The Image (Scales up on hover) */}
        <motion.img
          src={imageUrl}
          alt={title}
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 },
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* The Frosted Glass Label */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          <div className="px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="text-sm font-medium text-white shadow-sm">
              {title}
            </span>
          </div>
          {/* Optional second tag for Tech Stack/Category */}
          <div className="hidden sm:block px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="text-xs font-medium text-neutral-300">
              {category}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}