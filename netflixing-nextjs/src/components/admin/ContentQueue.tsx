'use client'

import { useState } from 'react'
import { approveContent, rejectContent } from '@/app/actions/content'

export default function ContentQueue({ content: initialContent }: { content: any[] }) {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (contentId: string) => {
    setLoading(contentId)
    try {
      await approveContent(contentId)
      setContent(content.filter(item => item.id !== contentId))
    } catch (error) {
      console.error('Failed to approve content:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (contentId: string) => {
    setLoading(contentId)
    try {
      await rejectContent(contentId)
      setContent(content.filter(item => item.id !== contentId))
    } catch (error) {
      console.error('Failed to reject content:', error)
    } finally {
      setLoading(null)
    }
  }

  if (content.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-gray-500">
        No pending content to review
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {content.map((item) => (
        <div key={item.id} className="px-6 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-900">{item.agent_name}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">{item.platform_target}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">{item.content_type}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-700 mb-4">{item.body}</p>
              {item.hashtags && item.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.hashtags.map((tag: string, idx: number) => (
                    <span key={idx} className="text-blue-600 text-sm">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(item.id)}
                  disabled={loading === item.id}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading === item.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  disabled={loading === item.id}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {loading === item.id ? 'Processing...' : 'Reject'}
                </button>
                <button
                  disabled={loading === item.id}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
