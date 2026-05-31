import { Suspense } from 'react'
import AnalyticsClient from '@/components/dashboard/AnalyticsClient'

export default function AnalyticsPage() {
    return (
        <Suspense fallback={null}>
            <AnalyticsClient />
        </Suspense>
    )
}
