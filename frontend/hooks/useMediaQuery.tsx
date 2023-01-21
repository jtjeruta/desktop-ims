import { useState, useEffect } from 'react'

const sizes = {
    xs: '(min-width: 0)',
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
}

export const useMediaQuery = (size: keyof typeof sizes): boolean => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(sizes[size])
        setMatches(media.matches)

        const handleChange = (e: MediaQueryListEvent) => {
            setMatches(e.matches)
        }
        media.addEventListener('change', handleChange)

        return () => {
            media.removeEventListener('change', handleChange)
        }
    }, [size])

    return matches
}
