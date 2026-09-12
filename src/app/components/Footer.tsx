export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900/80 bg-[#0a0a0a] py-10 mt-24">
      <div className="max-w-2xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Copyright */}
        <p className="text-xs text-zinc-500 tracking-wide">
          © {currentYear} Designed and developed by Rithish Barath. All rights reserved. Security policy
        </p>
        
        {/* Social Links */}
        <div className="flex items-center gap-6 text-xs font-medium text-zinc-400">
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-zinc-200 transition-colors duration-200"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-zinc-200 transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:your.email@example.com" 
            className="hover:text-zinc-200 transition-colors duration-200"
          >
            Email
          </a>
        </div>

      </div>
    </footer>
  );
}