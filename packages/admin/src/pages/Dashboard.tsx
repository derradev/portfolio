import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { Users, FileText, Briefcase, BookOpen, GraduationCap, Award } from 'lucide-react'

const Dashboard = () => {
  const { data: stats } = useQuery('dashboard-stats', async () => {
    const [projects, learning, blog, workHistory, education, certifications] = await Promise.all([
      api.get('/projects'),
      api.get('/learning'),
      api.get('/blog/admin/all'),
      api.get('/work-history'),
      api.get('/education'),
      api.get('/certifications')
    ])
    
    return {
      projects: projects.data.data.length,
      learning: learning.data.data.length,
      blogPosts: blog.data.data.length,
      workHistory: workHistory.data.data.length,
      education: education.data.data.length,
      certifications: certifications.data.data.length,
      publishedPosts: blog.data.data.filter((post: any) => post.published).length
    }
  })

  const statCards = [
    {
      name: 'Projects',
      value: stats?.projects || 0,
      icon: Briefcase,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    },
    {
      name: 'Learning',
      value: stats?.learning || 0,
      icon: BookOpen,
      color: 'bg-gradient-to-r from-emerald-500 to-cyan-600',
    },
    {
      name: 'Blog posts',
      value: stats?.blogPosts || 0,
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    },
    {
      name: 'Work history',
      value: stats?.workHistory || 0,
      icon: Users,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    },
    {
      name: 'Education',
      value: stats?.education || 0,
      icon: GraduationCap,
      color: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    },
    {
      name: 'Certifications',
      value: stats?.certifications || 0,
      icon: Award,
      color: 'bg-gradient-to-r from-indigo-500 to-violet-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Dashboard · <span className="gradient-text">Overview</span>
        </h1>
        <p className="mt-2 text-gray-400 font-medium max-w-2xl">
          Content counts for your public portfolio at william-malone.com
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.name} className="card p-5 hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {item.name}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-100">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-xl font-bold gradient-text mb-6">
          Quick actions
        </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/projects"
              className="relative group card p-6 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-cyan-600"
            >
              <div>
                <span className="rounded-xl inline-flex p-3 bg-gradient-to-r from-blue-900/50 to-blue-800 text-blue-300">
                  <Briefcase className="w-6 h-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  Manage projects
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Add, edit, or remove portfolio projects
                </p>
              </div>
            </a>

            <a
              href="/blog"
              className="relative group card p-6 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-cyan-600"
            >
              <div>
                <span className="rounded-xl inline-flex p-3 bg-gradient-to-r from-cyan-900/50 to-cyan-800 text-cyan-300">
                  <FileText className="w-6 h-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  Blog posts
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Create and publish articles
                </p>
              </div>
            </a>

            <a
              href="/learning"
              className="relative group card p-6 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-cyan-600"
            >
              <div>
                <span className="rounded-xl inline-flex p-3 bg-gradient-to-r from-green-900/50 to-green-800 text-green-300">
                  <BookOpen className="w-6 h-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  Learning
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Update learning items and skills
                </p>
              </div>
            </a>

            <a
              href="/education"
              className="relative group card p-6 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-cyan-600"
            >
              <div>
                <span className="rounded-xl inline-flex p-3 bg-gradient-to-r from-cyan-900/50 to-cyan-800 text-cyan-300">
                  <GraduationCap className="w-6 h-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  Education
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Manage education entries
                </p>
              </div>
            </a>
          </div>
      </div>

      {/* Portfolio Stats */}
      <div className="card p-6">
        <h3 className="text-xl font-bold gradient-text mb-6">
          Publishing
        </h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-[var(--border-color)]">
            <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Published blog posts
            </span>
            <span className="text-lg font-bold text-cyan-400">
              {stats?.publishedPosts || 0} / {stats?.blogPosts || 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-[var(--border-color)]">
            <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Total content items
            </span>
            <span className="text-lg font-bold text-blue-400">
              {(stats?.projects || 0) + (stats?.learning || 0) + (stats?.blogPosts || 0) + (stats?.workHistory || 0) + (stats?.education || 0) + (stats?.certifications || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
