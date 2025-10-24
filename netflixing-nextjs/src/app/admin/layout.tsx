export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Netflixing Admin</h1>
            </div>
            <div className="flex space-x-8 items-center">
              <a href="/admin" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/admin/agents" className="text-gray-700 hover:text-gray-900">Agents</a>
              <a href="/admin/content" className="text-gray-700 hover:text-gray-900">Content</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  )
}
