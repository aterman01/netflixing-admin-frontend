'use server'

const API_URL = process.env.BACKEND_URL || 'https://netflixing-admin-backend-production.up.railway.app'

export async function getAgents() {
  try {
    const response = await fetch(`${API_URL}/api/agents`, {
      cache: 'no-store'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch agents')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching agents:', error)
    return []
  }
}

export async function toggleAgentStatus(agentId: number) {
  try {
    const response = await fetch(`${API_URL}/api/admin/agents/${agentId}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) {
      throw new Error('Failed to toggle agent status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error toggling agent:', error)
    throw error
  }
}

export async function updateAgentConfig(agentId: number, config: any) {
  try {
    const response = await fetch(`${API_URL}/api/admin/agents/${agentId}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config)
    })
    if (!response.ok) {
      throw new Error('Failed to update agent configuration')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating agent config:', error)
    throw error
  }
}
