import { Suspense } from 'react'
import ProcessingClient from '@/components/dashboard/ProcessingClient'

export default function DataProcessingPage() {
    return (
        <Suspense fallback={null}>
            <ProcessingClient />
        </Suspense>
    )
}
