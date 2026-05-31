import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { MarketingHeader } from '@/components/layout/Headers'

export default function SignInPage() {
    return (
        <div className="auth-page min-h-screen overflow-x-hidden">
            <MarketingHeader />
            <div className="auth-page-body flex items-center justify-center px-5 py-10 sm:px-6 sm:py-16">
                <div className="w-full max-w-md">
                    <div className="surface-card reveal-on-scroll p-8">
                        <div className="mb-8 text-center">
                            <div className="mb-4 inline-flex items-center gap-2">
                                <div className="rounded-lg bg-blue-600 p-2.5">
                                    <BarChart3 className="h-7 w-7 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-blue-700">KautilyaAI</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                            <p className="mt-2 text-slate-600">Sign in to access your dashboard</p>
                        </div>

                        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-800">
                            <strong>Demo Mode:</strong> Click &quot;Continue to Dashboard&quot; to access the platform
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>
                                <input type="email" id="email" placeholder="you@company.com" className="input-field" />
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <input type="password" id="password" placeholder="••••••••" className="input-field" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center text-sm text-slate-600">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-2">Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                    Forgot password?
                                </a>
                            </div>
                            <Link href="/dashboard" className="btn-primary w-full py-3">
                                Continue to Dashboard
                            </Link>
                        </form>

                        <p className="mt-6 text-center text-slate-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-700">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
