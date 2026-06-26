// src/lib/portfolioBrain.ts
// ============================================================
//  PORTFOLIO LOCAL AI BRAIN — 100% offline, zero API
//  Custom NLP engine: tokenize → intent → response
// ============================================================

// ── KNOWLEDGE BASE ────────────────────────────────────────────
  export const KB = {
  about:
    "I'm Rithish Barath N, a 19-year-old full-stack developer and CSE student from Sankari, Salem, Tamil Nadu. I'm currently in my second year at Knowledge Institute of Technology, graduating in 2028. I build web apps and mobile apps, and I'm available for freelance work and internships. Currently heads-down building — the GitHub will speak soon.",

  skills: [
    "Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion",
    "Backend: Node.js, Express.js",
    "Databases: Supabase, PostgreSQL, MongoDB",
    "Mobile: Android & iOS app development",
    "Languages: TypeScript, JavaScript, Python (learning)",
    "Tools: Git, GitHub, Vercel, Figma",
  ],

  projects: [
    "Currently in active build mode — working on projects right now. Nothing public yet, but things are in motion. Check the GitHub soon: github.com/rithishbarath0007-pixel",
  ],

  experience:
    "I've completed internships and have certifications — all listed and verified on my LinkedIn. Head over there for the full picture: linkedin.com/in/rithishbarath0007",

  education:
    "B.E. in Computer Science and Engineering at Knowledge Institute of Technology, Salem. Expected graduation: 2028.",

  contact: {
    email: "rithishbarath0007@gmail.com",
    linkedin: "linkedin.com/in/rithishbarath0007",
    github: "github.com/rithishbarath0007-pixel",
  },

  availability:
    "Available for freelance web development, mobile app development (Android/iOS), and internships. Feel free to reach out.",

  interests: [
    "Chess — strategic thinker on and off the board",
    "Astronomy and space — genuinely fascinated by cosmology and the universe",
    "Philosophy — questions about existence, consciousness, and meaning",
    "Nature, wildlife, birds, and animals",
  ],

  privacy:
    "Nothing in this chat is saved. No logs, no storage, no memory. The moment you reload the page, it's all gone. 💨",

  personality:
    "Direct, confident, 50% professional and 50% funny. Answers questions straight — no fluff. Cracks a light joke where it fits but never wastes your time.",

  offTopic:
    "Happy to answer general questions too. Rithish is curious about a lot beyond code — space, chess, philosophy, nature. Ask away.",
    greetings: [
    "Hi there! I'm Rithish's Virtual Twin. You can ask me about his tech stack, projects, education, or if he's available for freelance work!",
    "Hello! I'm an offline AI assistant built directly into this portfolio. Ask me about Rithish's skills or experience."
  ]
};

// ── TOKENIZER ─────────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// ── INTENT PATTERNS ───────────────────────────────────────────
const INTENTS = [
  { name: "greeting",  patterns: ["hi", "hello", "hey", "start", "who are you", "what can you do"] },
  { name: "about",     patterns: ["about", "who is", "background", "bio", "tell me about"] },
  { name: "skills",    patterns: ["skills", "tech", "stack", "languages", "frameworks", "know", "react", "nextjs"] },
  { name: "projects",  patterns: ["projects", "work", "portfolio", "built", "made", "github"] },
  { name: "education", patterns: ["education", "study", "college", "degree", "cse", "student"] },
  { name: "contact",   patterns: ["contact", "email", "reach", "hire", "talk", "linkedin"] },
  { name: "freelance", patterns: ["freelance", "work", "job", "hiring", "available", "open to work"] }
];

function detectIntent(tokens: string[]): string {
  const text = tokens.join(" ");
  const scores: Record<string, number> = {};

  for (const intent of INTENTS) {
    scores[intent.name] = 0;
    // Exact phrase match gets higher score
    for (const p of intent.patterns) {
      if (text.includes(p)) scores[intent.name] += p.split(" ").length * 2;
    }
    // Token match gets lower score
    for (const token of tokens) {
      for (const p of intent.patterns) {
        if (p === token) scores[intent.name] += 1;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : "unknown";
}

// ── RESPONSE GENERATOR ────────────────────────────────────────
function generateResponse(intent: string): string {
  switch (intent) {
    case "greeting":
      return KB.greetings[Math.floor(Math.random() * KB.greetings.length)];
    case "about":
      return `👨‍💻 **About Rithish:**\n\n${KB.about}`;
    case "skills":
      return `🛠️ **Rithish's Tech Stack:**\n\n${KB.skills.join("\n")}`;
    case "projects":
      return `🚀 **Featured Projects:**\n\n${KB.projects.map(p => `**${p.name}**\n${p.desc}\n*(Stack: ${p.tech})*`).join("\n\n")}`;
    case "education":
      return `🎓 **Education:**\n\n${KB.education}`;
    case "contact":
      return `📫 **Contact:**\n\n${KB.contact}`;
    case "freelance":
      return `💼 **Freelance:**\n\n${KB.freelance}`;
    default:
      return "🤔 I'm not entirely sure about that. Try asking about Rithish's **skills**, **projects**, **education**, or **freelance availability**!";
  }
}

// ── MAIN AI FUNCTION ──────────────────────────────────────────
export function askPortfolioAI(userInput: string): string {
  const tokens = tokenize(userInput);
  const intent = detectIntent(tokens);
  return generateResponse(intent);
}