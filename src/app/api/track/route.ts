import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are the Virtual Twin of Rithish Barath N, a full-stack engineer and CSE student. 
Your job is to answer questions about Rithish accurately, professionally, and conversationally.
Keep your answers relatively short and easy to read. Do not hallucinate. 

Context about Rithish:
- Tech Stack: React, Next.js, TypeScript, Tailwind, Node.js, Supabase, Prisma.
- Projects: Modern Portfolio (Next.js, Supabase), SGP (Scholarship Guidance Platform).
- Education: Current Computer Science Engineering (CSE) student.
- Status: Open to freelance web development work.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", 
      systemInstruction: SYSTEM_PROMPT
    });

    // 1. Map raw history
    const rawHistory = (history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // 2. BULLETPROOF HISTORY CLEANER
    const cleanHistory: { role: string; parts: { text: string }[] }[] = [];
    
    for (const msg of rawHistory) {
      if (cleanHistory.length === 0) {
        // Rule 1: History MUST start with a user message (strips the initial AI greeting)
        if (msg.role === 'user') cleanHistory.push(msg);
      } else {
        // Rule 2: Roles MUST strictly alternate
        const lastRole = cleanHistory[cleanHistory.length - 1].role;
        if (msg.role !== lastRole) cleanHistory.push(msg);
      }
    }
    
    // Rule 3: History array must end with a 'model' before we send a new 'user' message
    if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === 'user') {
      cleanHistory.pop();
    }

    // 3. Start chat with the perfectly validated history
    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return NextResponse.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}