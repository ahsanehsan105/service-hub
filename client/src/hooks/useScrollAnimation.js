import { useEffect, useRef, useState } from "react"

/**
 * Custom hook for triggering animations when elements come into view
 * @param {Object} options - Intersection Observer options
 * @returns {Object} - { ref, isVisible }
 */
export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        // Stop observing after element becomes visible
        observer.unobserve(entry.target)
      }
    }, {
      threshold: 0.1,
      ...options
    })

    const currentElement = ref.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [options])

  return { ref, isVisible }
}

export default useScrollAnimation
