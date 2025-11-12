'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { apiRequest } from '@/lib/api'

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await apiRequest('/api/analytics?days=30')
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-10 animate-fade-in">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-lg">Your study progress and insights</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            </div>
          ) : analytics ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-sm font-medium">Total Notes</CardDescription>
                    <CardTitle className="text-4xl font-bold mt-2">{analytics.overview.totalNotes}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-sm font-medium">Total Flashcards</CardDescription>
                    <CardTitle className="text-4xl font-bold mt-2">{analytics.overview.totalFlashcards}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-sm font-medium">Study Time</CardDescription>
                    <CardTitle className="text-4xl font-bold mt-2">{formatTime(analytics.overview.totalStudyTime)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-sm font-medium">Topics Studied</CardDescription>
                    <CardTitle className="text-4xl font-bold mt-2">{analytics.overview.topicsStudied}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-10">
                <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
                  <CardHeader>
                    <CardTitle className="text-xl">Study Recommendations</CardTitle>
                    <CardDescription>AI-powered suggestions for your next study session</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.recommendations && analytics.recommendations.length > 0 ? (
                      <ul className="space-y-3">
                        {analytics.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${0.6 + index * 0.1}s`, opacity: 0 }}>
                            <span className="text-primary mt-1.5">•</span>
                            <span className="leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground py-4">No recommendations yet. Start studying to get personalized suggestions!</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0 }}>
                  <CardHeader>
                    <CardTitle className="text-xl">Top Topics</CardTitle>
                    <CardDescription>Your most studied topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.topTopics && analytics.topTopics.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analytics.topTopics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm transition-all hover:scale-105">{topic}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground py-4">No topics yet. Create some notes to get started!</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.7s', opacity: 0 }}>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Your activity over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center pb-3 border-b border-border/50 transition-colors hover:border-border">
                      <span className="text-sm font-medium">Notes Created</span>
                      <span className="font-bold text-lg">{analytics.recentActivity.notesCreated}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-border/50 transition-colors hover:border-border">
                      <span className="text-sm font-medium">Flashcards Created</span>
                      <span className="font-bold text-lg">{analytics.recentActivity.flashcardsCreated}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-border/50 transition-colors hover:border-border">
                      <span className="text-sm font-medium">Sessions Completed</span>
                      <span className="font-bold text-lg">{analytics.recentActivity.sessionsCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center transition-colors">
                      <span className="text-sm font-medium">Total Reviews</span>
                      <span className="font-bold text-lg">{analytics.overview.totalFlashcardReviews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="animate-fade-in">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">Failed to load analytics</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

