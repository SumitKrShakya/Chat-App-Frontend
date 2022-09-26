import { useState, useEffect, useCallback } from 'react'

function useIsTabVisible() {
    const [isVisible, setIsVisible] = useState(!document.hidden)

    const handleVisibility = useCallback(() => {
        setIsVisible(!document.hidden)
    }, [])

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [handleVisibility])

    return isVisible // returns boolean
}

export default useIsTabVisible