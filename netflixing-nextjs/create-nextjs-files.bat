@echo off
REM Complete Next.js File Setup Script
REM Run this from inside your netflixing-nextjs folder

echo ====================================================
echo Creating all Next.js files and folders...
echo ====================================================
echo.

REM Create folder structure
echo Creating folder structure...
mkdir src\app\admin 2>nul
mkdir src\app\admin\agents 2>nul
mkdir src\app\admin\content 2>nul
mkdir src\app\actions 2>nul
mkdir src\components\admin 2>nul
mkdir src\lib 2>nul

REM Create .env.local file
echo Creating environment configuration...
(
echo BACKEND_URL=https://netflixing-admin-backend-production.up.railway.app
echo ORCHESTRATOR_ENABLED=false
) > .env.local

REM Create agents server actions
echo Creating agent server actions...
(
echo 'use server'
echo.
echo const API_URL = process.env.BACKEND_URL ^|^| 'https://netflixing-admin-backend-production.up.railway.app'
echo.
echo export async function getAgents^(^) {
echo   try {
echo     const response = await fetch^(`${API_URL}/api/agents`, {
echo       cache: 'no-store'
echo     }^)
echo     if ^(!response.ok^) {
echo       throw new Error^('Failed to fetch agents'^)
echo     }
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error fetching agents:', error^)
echo     return []
echo   }
echo }
echo.
echo export async function toggleAgentStatus^(agentId: number^) {
echo   try {
echo     const response = await fetch^(`${API_URL}/api/admin/agents/${agentId}/toggle`, {
echo       method: 'POST',
echo       headers: {
echo         'Content-Type': 'application/json',
echo       }
echo     }^)
echo     if ^(!response.ok^) {
echo       throw new Error^('Failed to toggle agent status'^)
echo     }
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error toggling agent:', error^)
echo     throw error
echo   }
echo }
echo.
echo export async function updateAgentConfig^(agentId: number, config: any^) {
echo   try {
echo     const response = await fetch^(`${API_URL}/api/admin/agents/${agentId}/config`, {
echo       method: 'PUT',
echo       headers: {
echo         'Content-Type': 'application/json',
echo       },
echo       body: JSON.stringify^(config^)
echo     }^)
echo     if ^(!response.ok^) {
echo       throw new Error^('Failed to update agent configuration'^)
echo     }
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error updating agent config:', error^)
echo     throw error
echo   }
echo }
) > src\app\actions\agents.ts

REM Create content server actions
echo Creating content server actions...
(
echo 'use server'
echo.
echo const API_URL = process.env.BACKEND_URL ^|^| 'https://netflixing-admin-backend-production.up.railway.app'
echo.
echo export async function getContentQueue^(status: string = 'pending'^) {
echo   try {
echo     const response = await fetch^(`${API_URL}/api/admin/content/queue?status=${status}`, {
echo       cache: 'no-store'
echo     }^)
echo     if ^(!response.ok^) {
echo       throw new Error^('Failed to fetch content queue'^)
echo     }
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error fetching content queue:', error^)
echo     return []
echo   }
echo }
echo.
echo export async function approveContent^(contentId: string^) {
echo   try {
echo     const response = await fetch^(`${API_URL}/api/admin/content/${contentId}/approve`, {
echo       method: 'POST',
echo       headers: {
echo         'Content-Type': 'application/json',
echo       }
echo     }^)
echo     if ^(!response.ok^) {
echo       throw new Error^('Failed to approve content'^)
echo     }
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error approving content:', error^)
echo     throw error
echo   }
echo }
echo.
echo export async function rejectContent^(contentId: string, feedback?: string^) {
echo   try {
echo     const response = await fetch^(`${API_URL}/api/admin/content/${contentId}/reject`, {
echo       method: 'POST',
echo       headers: {
echo         'Content-Type': 'application/json',
echo       },
echo       body: JSON.stringify^({ feedback }^)
echo     }^)
echo     if ^(!response.ok^) {
echo       throw new Error^('Failed to reject content'^)
echo     }
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error rejecting content:', error^)
echo     throw error
echo   }
echo }
echo.
echo export async function getContentStats^(^) {
echo   try {
echo     const response = await fetch^(`${API_URL}/api/admin/content/stats`, {
echo       cache: 'no-store'
echo     }^)
echo     if ^(!response.ok^) {
echo       return { pending: 0, approved: 0, rejected: 0, total: 0 }
echo     }
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error fetching content stats:', error^)
echo     return { pending: 0, approved: 0, rejected: 0, total: 0 }
echo   }
echo }
) > src\app\actions\content.ts

REM Create admin layout
echo Creating admin layout...
(
echo export default function AdminLayout^({
echo   children,
echo }: {
echo   children: React.ReactNode
echo }^) {
echo   return ^(
echo     ^<div className="min-h-screen bg-gray-100"^>
echo       ^<nav className="bg-white shadow"^>
echo         ^<div className="max-w-7xl mx-auto px-4"^>
echo           ^<div className="flex justify-between h-16"^>
echo             ^<div className="flex items-center"^>
echo               ^<h1 className="text-xl font-semibold"^>Netflixing Admin^</h1^>
echo             ^</div^>
echo             ^<div className="flex space-x-8 items-center"^>
echo               ^<a href="/admin" className="text-gray-700 hover:text-gray-900"^>Dashboard^</a^>
echo               ^<a href="/admin/agents" className="text-gray-700 hover:text-gray-900"^>Agents^</a^>
echo               ^<a href="/admin/content" className="text-gray-700 hover:text-gray-900"^>Content^</a^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^</nav^>
echo       ^<main className="max-w-7xl mx-auto py-6 px-4"^>
echo         {children}
echo       ^</main^>
echo     ^</div^>
echo   ^)
echo }
) > src\app\admin\layout.tsx

REM Create admin dashboard page
echo Creating admin dashboard...
(
echo import { getAgents } from '../actions/agents'
echo import { getContentStats } from '../actions/content'
echo.
echo export default async function AdminDashboard^(^) {
echo   const [agents, stats] = await Promise.all^([
echo     getAgents^(^),
echo     getContentStats^(^)
echo   ]^)
echo.
echo   const activeAgents = agents.filter^(^(a: any^) =^> a.status === 'active'^).length
echo.
echo   return ^(
echo     ^<div^>
echo       ^<h1 className="text-3xl font-bold text-gray-900 mb-8"^>Dashboard^</h1^>
echo       
echo       ^<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"^>
echo         ^<div className="bg-white overflow-hidden shadow rounded-lg"^>
echo           ^<div className="p-5"^>
echo             ^<div className="flex items-center"^>
echo               ^<div className="flex-shrink-0"^>
echo                 ^<svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"^>
echo                   ^<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"^>^</path^>
echo                 ^</svg^>
echo               ^</div^>
echo               ^<div className="ml-5 w-0 flex-1"^>
echo                 ^<dl^>
echo                   ^<dt className="text-sm font-medium text-gray-500 truncate"^>Total Agents^</dt^>
echo                   ^<dd className="text-lg font-medium text-gray-900"^>{agents.length}^</dd^>
echo                 ^</dl^>
echo               ^</div^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo.
echo         ^<div className="bg-white overflow-hidden shadow rounded-lg"^>
echo           ^<div className="p-5"^>
echo             ^<div className="flex items-center"^>
echo               ^<div className="flex-shrink-0"^>
echo                 ^<svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"^>
echo                   ^<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"^>^</path^>
echo                 ^</svg^>
echo               ^</div^>
echo               ^<div className="ml-5 w-0 flex-1"^>
echo                 ^<dl^>
echo                   ^<dt className="text-sm font-medium text-gray-500 truncate"^>Active Agents^</dt^>
echo                   ^<dd className="text-lg font-medium text-gray-900"^>{activeAgents}^</dd^>
echo                 ^</dl^>
echo               ^</div^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo.
echo         ^<div className="bg-white overflow-hidden shadow rounded-lg"^>
echo           ^<div className="p-5"^>
echo             ^<div className="flex items-center"^>
echo               ^<div className="flex-shrink-0"^>
echo                 ^<svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"^>
echo                   ^<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"^>^</path^>
echo                 ^</svg^>
echo               ^</div^>
echo               ^<div className="ml-5 w-0 flex-1"^>
echo                 ^<dl^>
echo                   ^<dt className="text-sm font-medium text-gray-500 truncate"^>Pending Content^</dt^>
echo                   ^<dd className="text-lg font-medium text-gray-900"^>{stats.pending}^</dd^>
echo                 ^</dl^>
echo               ^</div^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo.
echo         ^<div className="bg-white overflow-hidden shadow rounded-lg"^>
echo           ^<div className="p-5"^>
echo             ^<div className="flex items-center"^>
echo               ^<div className="flex-shrink-0"^>
echo                 ^<svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"^>
echo                   ^<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"^>^</path^>
echo                 ^</svg^>
echo               ^</div^>
echo               ^<div className="ml-5 w-0 flex-1"^>
echo                 ^<dl^>
echo                   ^<dt className="text-sm font-medium text-gray-500 truncate"^>Total Content^</dt^>
echo                   ^<dd className="text-lg font-medium text-gray-900"^>{stats.total ^|^| 0}^</dd^>
echo                 ^</dl^>
echo               ^</div^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   ^)
echo }
) > src\app\admin\page.tsx

REM Create agents page
echo Creating agents page...
(
echo import { getAgents } from '@/app/actions/agents'
echo import AgentList from '@/components/admin/AgentList'
echo.
echo export default async function AgentsPage^(^) {
echo   const agents = await getAgents^(^)
echo.
echo   return ^(
echo     ^<div^>
echo       ^<div className="mb-8"^>
echo         ^<h1 className="text-3xl font-bold text-gray-900"^>Agent Management^</h1^>
echo         ^<p className="mt-2 text-gray-600"^>Manage your AI agents and their configurations^</p^>
echo       ^</div^>
echo.
echo       ^<div className="bg-white shadow overflow-hidden rounded-lg"^>
echo         ^<div className="px-4 py-5 sm:px-6"^>
echo           ^<h3 className="text-lg leading-6 font-medium text-gray-900"^>
echo             Active Agents ^({agents.length}^)
echo           ^</h3^>
echo         ^</div^>
echo         ^<AgentList agents={agents} /^>
echo       ^</div^>
echo     ^</div^>
echo   ^)
echo }
) > src\app\admin\agents\page.tsx

REM Create AgentList component
echo Creating AgentList component...
(
echo 'use client'
echo.
echo import { useState } from 'react'
echo import { toggleAgentStatus } from '@/app/actions/agents'
echo.
echo export default function AgentList^({ agents: initialAgents }: { agents: any[] }^) {
echo   const [agents, setAgents] = useState^(initialAgents^)
echo   const [loading, setLoading] = useState^<number ^| null^>^(null^)
echo.
echo   const handleToggle = async ^(agentId: number^) =^> {
echo     setLoading^(agentId^)
echo     try {
echo       await toggleAgentStatus^(agentId^)
echo       setAgents^(agents.map^(agent =^> 
echo         agent.id === agentId 
echo           ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
echo           : agent
echo       ^)^)
echo     } catch ^(error^) {
echo       console.error^('Failed to toggle agent:', error^)
echo     } finally {
echo       setLoading^(null^)
echo     }
echo   }
echo.
echo   return ^(
echo     ^<div className="divide-y divide-gray-200"^>
echo       {agents.map^(^(agent^) =^> ^(
echo         ^<div key={agent.id} className="px-6 py-4 hover:bg-gray-50"^>
echo           ^<div className="flex items-center justify-between"^>
echo             ^<div className="flex items-center"^>
echo               ^<div className="flex-shrink-0 h-10 w-10"^>
echo                 ^<img 
echo                   className="h-10 w-10 rounded-full"
echo                   src={agent.avatar_url ^|^| `https://ui-avatars.com/api/?name=${agent.name}`}
echo                   alt={agent.name}
echo                 /^>
echo               ^</div^>
echo               ^<div className="ml-4"^>
echo                 ^<div className="text-sm font-medium text-gray-900"^>{agent.name}^</div^>
echo                 ^<div className="text-sm text-gray-500"^>{agent.niche} • {agent.platform}^</div^>
echo               ^</div^>
echo             ^</div^>
echo             ^<div className="flex items-center space-x-2"^>
echo               ^<button
echo                 onClick={^(^) =^> handleToggle^(agent.id^)}
echo                 disabled={loading === agent.id}
echo                 className={`px-3 py-1 rounded-full text-xs font-medium ${
echo                   agent.status === 'active'
echo                     ? 'bg-green-100 text-green-800 hover:bg-green-200'
echo                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
echo                 } ${loading === agent.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
echo               ^>
echo                 {loading === agent.id ? 'Updating...' : agent.status ^|^| 'active'}
echo               ^</button^>
echo               ^<button className="text-blue-600 hover:text-blue-900 text-sm font-medium"^>
echo                 Configure
echo               ^</button^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^)^)}
echo     ^</div^>
echo   ^)
echo }
) > src\components\admin\AgentList.tsx

REM Create content page
echo Creating content page...
(
echo import { getContentQueue } from '@/app/actions/content'
echo import ContentQueue from '@/components/admin/ContentQueue'
echo.
echo export default async function ContentPage^(^) {
echo   const content = await getContentQueue^('pending'^)
echo.
echo   return ^(
echo     ^<div^>
echo       ^<div className="mb-8"^>
echo         ^<h1 className="text-3xl font-bold text-gray-900"^>Content Moderation^</h1^>
echo         ^<p className="mt-2 text-gray-600"^>Review and approve agent-generated content^</p^>
echo       ^</div^>
echo.
echo       ^<div className="bg-white shadow overflow-hidden rounded-lg"^>
echo         ^<div className="px-4 py-5 sm:px-6"^>
echo           ^<h3 className="text-lg leading-6 font-medium text-gray-900"^>
echo             Pending Content ^({content.length}^)
echo           ^</h3^>
echo         ^</div^>
echo         ^<ContentQueue content={content} /^>
echo       ^</div^>
echo     ^</div^>
echo   ^)
echo }
) > src\app\admin\content\page.tsx

REM Create ContentQueue component
echo Creating ContentQueue component...
(
echo 'use client'
echo.
echo import { useState } from 'react'
echo import { approveContent, rejectContent } from '@/app/actions/content'
echo.
echo export default function ContentQueue^({ content: initialContent }: { content: any[] }^) {
echo   const [content, setContent] = useState^(initialContent^)
echo   const [loading, setLoading] = useState^<string ^| null^>^(null^)
echo.
echo   const handleApprove = async ^(contentId: string^) =^> {
echo     setLoading^(contentId^)
echo     try {
echo       await approveContent^(contentId^)
echo       setContent^(content.filter^(item =^> item.id !== contentId^)^)
echo     } catch ^(error^) {
echo       console.error^('Failed to approve content:', error^)
echo     } finally {
echo       setLoading^(null^)
echo     }
echo   }
echo.
echo   const handleReject = async ^(contentId: string^) =^> {
echo     setLoading^(contentId^)
echo     try {
echo       await rejectContent^(contentId^)
echo       setContent^(content.filter^(item =^> item.id !== contentId^)^)
echo     } catch ^(error^) {
echo       console.error^('Failed to reject content:', error^)
echo     } finally {
echo       setLoading^(null^)
echo     }
echo   }
echo.
echo   if ^(content.length === 0^) {
echo     return ^(
echo       ^<div className="px-6 py-12 text-center text-gray-500"^>
echo         No pending content to review
echo       ^</div^>
echo     ^)
echo   }
echo.
echo   return ^(
echo     ^<div className="divide-y divide-gray-200"^>
echo       {content.map^(^(item^) =^> ^(
echo         ^<div key={item.id} className="px-6 py-6"^>
echo           ^<div className="flex justify-between items-start"^>
echo             ^<div className="flex-1"^>
echo               ^<div className="flex items-center mb-2"^>
echo                 ^<span className="font-medium text-gray-900"^>{item.agent_name}^</span^>
echo                 ^<span className="mx-2 text-gray-400"^>•^</span^>
echo                 ^<span className="text-sm text-gray-500"^>{item.platform_target}^</span^>
echo                 ^<span className="mx-2 text-gray-400"^>•^</span^>
echo                 ^<span className="text-sm text-gray-500"^>{item.content_type}^</span^>
echo               ^</div^>
echo               ^<h3 className="text-lg font-medium text-gray-900 mb-2"^>{item.title}^</h3^>
echo               ^<p className="text-gray-700 mb-4"^>{item.body}^</p^>
echo               {item.hashtags ^&^& item.hashtags.length ^> 0 ^&^& ^(
echo                 ^<div className="flex flex-wrap gap-2 mb-4"^>
echo                   {item.hashtags.map^(^(tag: string, idx: number^) =^> ^(
echo                     ^<span key={idx} className="text-blue-600 text-sm"^>#{tag}^</span^>
echo                   ^)^)}
echo                 ^</div^>
echo               ^)}
echo               ^<div className="flex space-x-2"^>
echo                 ^<button
echo                   onClick={^(^) =^> handleApprove^(item.id^)}
echo                   disabled={loading === item.id}
echo                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
echo                 ^>
echo                   {loading === item.id ? 'Processing...' : 'Approve'}
echo                 ^</button^>
echo                 ^<button
echo                   onClick={^(^) =^> handleReject^(item.id^)}
echo                   disabled={loading === item.id}
echo                   className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
echo                 ^>
echo                   {loading === item.id ? 'Processing...' : 'Reject'}
echo                 ^</button^>
echo                 ^<button
echo                   disabled={loading === item.id}
echo                   className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
echo                 ^>
echo                   Edit
echo                 ^</button^>
echo               ^</div^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^)^)}
echo     ^</div^>
echo   ^)
echo }
) > src\components\admin\ContentQueue.tsx

REM Update main page to redirect
echo Updating main page...
(
echo import { redirect } from 'next/navigation'
echo.
echo export default function Home^(^) {
echo   redirect^('/admin'^)
echo }
) > src\app\page.tsx

echo.
echo ====================================================
echo    All files created successfully!
echo ====================================================
echo.
echo Files created:
echo - .env.local (environment variables)
echo - src\app\actions\agents.ts (server actions)
echo - src\app\actions\content.ts (content actions)
echo - src\app\admin\layout.tsx (admin layout)
echo - src\app\admin\page.tsx (dashboard)
echo - src\app\admin\agents\page.tsx (agents page)
echo - src\app\admin\content\page.tsx (content page)
echo - src\components\admin\AgentList.tsx (agent list)
echo - src\components\admin\ContentQueue.tsx (content queue)
echo - src\app\page.tsx (redirect to admin)
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:3000
echo 3. You should see the admin dashboard!
echo.
echo To upload to GitHub:
echo 1. Open GitHub Desktop
echo 2. You should see all the new files
echo 3. Commit with message: "Add Next.js admin functionality"
echo 4. Push to GitHub
echo.
pause
