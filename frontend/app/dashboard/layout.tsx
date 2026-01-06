'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/firebase'
import {
    LayoutDashboard,
    Briefcase,
    Search,
    MessageSquare,
    User,
    Settings,
    LogOut,
    Bell,
    PlusCircle,
    Menu,
    X,
    Zap
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null)
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (u) => {
            if (u) {
                // Fetch role from backend
                try {
                    const idToken = await u.getIdToken()
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`, {
                        headers: { Authorization: `Bearer ${idToken}` }
                    })
                    const profile = await res.json()
                    setUser({ ...u, role: profile.role })
                } catch (err) {
                    console.error(err)
                }
            } else {
                router.push('/login')
            }
            setLoading(false)
        })
        return () => unsub()
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    )

    const isSeeker = user?.role === 'seeker'

    const navItems = isSeeker ? [
        { label: 'Feed', icon: LayoutDashboard, href: '/dashboard/seeker' },
        { label: 'My Applications', icon: Briefcase, href: '/dashboard/seeker/applications' },
        { label: 'Find Jobs', icon: Search, href: '/dashboard/seeker/jobs' },
        { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
        { label: 'Profile', icon: User, href: '/dashboard/seeker/profile' },
    ] : [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/recruiter' },
        { label: 'Post Job', icon: PlusCircle, href: '/dashboard/recruiter/post' },
        { label: 'My Jobs', icon: Briefcase, href: '/dashboard/recruiter/jobs' },
        { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
        { label: 'Company Profile', icon: Building2, href: '/dashboard/recruiter/profile' },
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Zap className="text-indigo-500 w-8 h-8" />
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                DreamPath
                            </span>
                        </Link>
                        <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                  ${pathname === item.href
                                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
                            >
                                <item.icon size={20} className={pathname === item.href ? 'text-indigo-400' : 'group-hover:text-indigo-400'} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-top border-slate-800">
                        <button
                            onClick={() => auth.signOut()}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-white hidden sm:block">
                            {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white transition relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white">{user?.displayName}</p>
                                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-slate-700 flex items-center justify-center font-bold text-white">
                                {user?.displayName?.[0] || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    )
}

function Building2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    )
}
