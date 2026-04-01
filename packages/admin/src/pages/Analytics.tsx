import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { BarChart3, Users, Eye, Clock, Globe } from 'lucide-react'

interface AnalyticsOverview {
  totalVisits: number
  uniqueVisitors: number
  pageViews: Array<{
    page_path: string
    views: number
    avg_duration: number
  }>
  dailyVisits: Array<{
    date: string
    visits: number
  }>
  topReferrers: Array<{
    referrer: string
    visits: number
  }>
}

const Analytics = () => {
  const { data: analytics, isLoading } = useQuery('analytics-overview', async () => {
    const response = await api.get('/analytics/overview')
    return response.data.data as AnalyticsOverview
  })

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getPageDisplayName = (path: string) => {
    const pathMap: { [key: string]: string } = {
      '/': 'Home',
      '/projects': 'Projects',
      '/work-history': 'Work History',
      '/learning': 'Learning',
      '/blog': 'Blog',
      '/about': 'About'
    }
    return pathMap[path] || path
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading your analytics data... 📈</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">📊 Analytics Dashboard</h1>
        <p className="mt-2 text-gray-400 font-medium">
          Track visitor engagement and page performance ✨
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  👁️ Total Visits
                </dt>
                <dd className="text-2xl font-bold text-gray-100">
                  {analytics?.totalVisits || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5 hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  👥 Unique Visitors
                </dt>
                <dd className="text-2xl font-bold text-gray-100">
                  {analytics?.uniqueVisitors || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5 hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  📊 Pages Tracked
                </dt>
                <dd className="text-2xl font-bold text-gray-100">
                  {analytics?.pageViews?.length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5 hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ⏱️ Avg. Duration
                </dt>
                <dd className="text-2xl font-bold text-gray-100">
                  {analytics?.pageViews?.length ? 
                    formatDuration(Math.round(analytics.pageViews.reduce((acc, pv) => acc + pv.avg_duration, 0) / analytics.pageViews.length)) : 
                    '0s'
                  }
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Page Views */}
      <div className="card p-6">
        <h3 className="text-xl font-bold gradient-text mb-6">
          📄 Page Views
        </h3>
          <div className="space-y-4">
            {analytics?.pageViews?.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl hover:from-cyan-900/50 hover:to-blue-900/50 transition-all duration-300">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {getPageDisplayName(page.page_path)}
                    </span>
                    <span className="ml-2 text-xs text-cyan-400 font-medium">
                      {page.page_path}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-400 font-medium">
                      👁️ {page.views} views
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      ⏱️ Avg: {formatDuration(page.avg_duration)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (page.views / Math.max(...(analytics?.pageViews?.map(p => p.views) || [1]))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Daily Visits Chart */}
      <div className="card p-6">
        <h3 className="text-xl font-bold gradient-text mb-6">
          📈 Daily Visits (Last 30 Days)
        </h3>
        <div className="space-y-2">
          {analytics?.dailyVisits?.slice(0, 10).map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg border border-[var(--border-color)] hover:border-cyan-500/30 transition-all duration-300">
              <span className="text-sm text-gray-300 font-medium">
                {new Date(day.date).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-white tabular-nums">
                  {day.visits}
                </span>
                <div className="w-24 bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (day.visits / Math.max(...(analytics?.dailyVisits?.map(d => d.visits) || [1]))) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Referrers */}
      {analytics?.topReferrers && analytics.topReferrers.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold gradient-text mb-6">
            🌐 Top Referrers
          </h3>
          <div className="space-y-4">
            {analytics.topReferrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-900/15 to-cyan-900/15 rounded-xl border border-[var(--border-color)] hover:border-emerald-500/25 transition-all duration-300">
                <div className="flex items-center min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
                    <Globe className="w-4 h-4 text-[var(--primary-dark)]" />
                  </div>
                  <span className="text-sm text-gray-200 font-medium truncate max-w-xs">
                    {referrer.referrer}
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full shrink-0 tabular-nums">
                  {referrer.visits} visits
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
