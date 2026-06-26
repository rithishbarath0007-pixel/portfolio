'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createGuestbookMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name || !email || !message || name.trim() === '' || email.trim() === '' || message.trim() === '') {
    throw new Error('All fields are required.')
  }

  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.')
  }

  if (message.length > 2000) {
    throw new Error('Message cannot exceed 2000 characters.')
  }

  try {
    // UPDATED: Now saving to contactMessage instead of guestbookMessage
    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
    })

    revalidatePath('/admin') 
    return { success: true } 

  } catch (error) {
    console.error('Failed to save message:', error)
    throw new Error('Something went wrong on our database server.')
  }
}