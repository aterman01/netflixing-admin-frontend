'use client'

import { useState } from 'react'
import { toggleAgentStatus } from '@/app/actions/agents'

export default function AgentList({ agents: initialAgents }: { agents: any[] }) {
  const [agents, setAgents] = useState(initialAgents)
  const [loading, setLoading] = useState<number | null>(null)

  const handleToggle = async (agentId: number) => {
    setLoading(agentId)
    try {
      await toggleAgentStatus(agentId)
      setAgents(agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
          : agent
      ))
    } catch (error) {
      console.error('Failed to toggle agent:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="divide-y divide-gray-200">
      {agents.map((agent) => (
        <div key={agent.id} className="px-6 py-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <img 
                  className="h-10 w-10 rounded-full"
                  src={agent.avatar_url || `https://ui-avatars.com/api/?name=${agent.name}`}
                  alt={agent.name}
                />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                <div className="text-sm text-gray-500">{agent.niche} • {agent.platform}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggle(agent.id)}
                disabled={loading === agent.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  agent.status === 'active'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } ${loading === agent.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading === agent.id ? 'Updating...' : agent.status || 'active'}
              </button>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
