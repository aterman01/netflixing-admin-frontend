import { getContentQueue } from '@/app/actions/content'
import ContentQueue from '@/components/admin/ContentQueue'

export default async function ContentPage() {
  const content = await getContentQueue('pending')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="mt-2 text-gray-600">Review and approve agent-generated content</p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pending Content ({content.length})
          </h3>
        </div>
        <ContentQueue content={content} />
      </div>
    </div>
  )
}
