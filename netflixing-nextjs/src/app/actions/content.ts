'use server'

const API_URL = process.env.BACKEND_URL || 'https://netflixing-admin-backend-production.up.railway.app'

export async function getContentQueue(status: string = 'pending') {
  try {
    const response = await fetch(`${API_URL}/api/admin/content/queue?status=${status}`, {
      cache: 'no-store'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch content queue')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching content queue:', error)
    return []
  }
}

export async function approveContent(contentId: string) {
  try {
    const response = await fetch(`${API_URL}/api/admin/content/${contentId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) {
      throw new Error('Failed to approve content')
    }
    return await response.json()
  } catch (error) {
    console.error('Error approving content:', error)
    throw error
  }
}

export async function rejectContent(contentId: string, feedback?: string) {
  try {
    const response = await fetch(`${API_URL}/api/admin/content/${contentId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback })
    })
    if (!response.ok) {
      throw new Error('Failed to reject content')
    }
    return await response.json()
  } catch (error) {
    console.error('Error rejecting content:', error)
    throw error
  }
}

export async function getContentStats() {
  try {
    const response = await fetch(`${API_URL}/api/admin/content/stats`, {
      cache: 'no-store'
    })
    if (!response.ok) {
      return { pending: 0, approved: 0, rejected: 0, total: 0 }
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching content stats:', error)
    return { pending: 0, approved: 0, rejected: 0, total: 0 }
  }
}
