'use client'

import { useEffect } from 'react'

/** Applies reduce-motion / low-end GPU flags site-wide for iOS & Android performance. */
export function DeviceEffects() {
    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const lowEnd =
            typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4

        if (prefersReduced || lowEnd) {
            document.documentElement.classList.add('reduce-effects')
        }

        return () => document.documentElement.classList.remove('reduce-effects')
    }, [])

    return null
}
