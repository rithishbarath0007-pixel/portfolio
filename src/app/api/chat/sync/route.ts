import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sessionId, messages } = await req.json();

    if (!sessionId || !messages || messages.length === 0) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 1. Find the existing conversation for this user, or create a new one
    let conversation = await prisma.aiConversation.findFirst({
      where: { sessionId },
    });

    if (!conversation) {
      conversation = await prisma.aiConversation.create({
        data: { sessionId },
      });
    }

    // 2. Insert all the new messages into this conversation
    await prisma.aiMessage.createMany({
      data: messages.map((msg: { role: string; content: string }) => ({
        conversationId: conversation.id,
        role: msg.role,
        content: msg.content,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to sync offline chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}