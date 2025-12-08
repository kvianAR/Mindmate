'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between max-w-7xl">
        <Link href="/dashboard" className="text-lg sm:text-xl font-bold tracking-tight transition-colors hover:text-primary">
          MindMate
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary relative group">
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/notes" className="text-sm font-medium transition-colors hover:text-primary relative group">
            Notes
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/flashcards" className="text-sm font-medium transition-colors hover:text-primary relative group">
            Flashcards
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/sessions" className="text-sm font-medium transition-colors hover:text-primary relative group">
            Sessions
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <div className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-4 border-l border-border">
            <ThemeToggle />
            <span className="hidden lg:block text-sm text-muted-foreground font-medium">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="transition-all hover:scale-105">
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs px-2">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

