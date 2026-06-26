'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function loginAdmin(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  // Check against your .env variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // AWAIT the cookies before setting them
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    
    // Refresh the admin page to show the dashboard
    revalidatePath('/admin')
    return { success: true }
  }

  return { error: 'Invalid username or password' }
}

export async function logoutAdmin() {
  // AWAIT the cookies before deleting them
  const cookieStore = await cookies();
  cookieStore.delete('admin_session')
  revalidatePath('/admin')
}