import { getAgents } from '@/app/actions/agents'
import AgentList from '@/components/admin/AgentList'

export default async function AgentsPage() {
  const agents = await getAgents()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
        <p className="mt-2 text-gray-600">Manage your AI agents and their configurations</p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Active Agents ({agents.length})
          </h3>
        </div>
        <AgentList agents={agents} />
      </div>
    </div>
  )
}
