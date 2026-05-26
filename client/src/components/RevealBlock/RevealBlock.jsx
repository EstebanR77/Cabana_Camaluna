import { useEffect, useRef, useState } from 'react'
import styles from './RevealBlock.module.css'

function RevealBlock({
  as: Element = 'div',
  children,
  className = '',
  variant = '',
  ...props
}) {
  const blockRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const block = blockRef.current
    if (!block) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsVisible(true)
        observer.unobserve(entry.target)
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    observer.observe(block)

    return () => observer.disconnect()
  }, [])

  return (
    <Element
      ref={blockRef}
      className={[
        styles.revealBlock,
        isVisible ? styles.revealVisible : '',
        variant ? styles[variant] : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Element>
  )
}

export default RevealBlock
