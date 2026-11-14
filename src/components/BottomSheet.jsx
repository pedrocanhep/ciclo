import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import s from './BottomSheet.module.css'
import { useAppState } from '../state/useAppState'

export default function BottomSheet({ eyebrow, title, icon, onClose, children }) {
  const panel = useRef(null)
  const overlay = useRef(null)
  const { returnFocusRef } = useAppState()
  const titleId = useId()

  useEffect(() => {
    const trigger = document.activeElement
    const scrollPosition = window.scrollY
    const bodyStyle = document.body.getAttribute('style')
    const previousOverflow = document.documentElement.style.overflowY
    const background = document.getElementById('dashboard')
    if (background.contains(trigger)) returnFocusRef.current = trigger
    const wasInert = background.inert
    background.inert = true
    document.documentElement.style.overflowY = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    panel.current.focus({ preventScroll: true })

    function handleKey(event) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const elements = [...panel.current.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex="0"]')].filter(element => element.tabIndex >= 0)
      const first = elements[0]
      const last = elements.at(-1)
      if (!first) { event.preventDefault(); panel.current.focus(); return }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) {
        event.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      if (bodyStyle === null) document.body.removeAttribute('style')
      else document.body.setAttribute('style', bodyStyle)
      document.documentElement.style.overflowY = previousOverflow
      window.scrollTo(0, scrollPosition)
      background.inert = wasInert
      requestAnimationFrame(() => {
        if (!document.getElementById('modal-root')?.querySelector('[role="dialog"]') && returnFocusRef.current?.isConnected) returnFocusRef.current.focus({ preventScroll: true })
      })
    }
  }, [onClose, returnFocusRef])

  // iOS keyboards resize the visual viewport independently of the layout viewport.
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    let frame
    function resize() {
      if (viewport.scale !== 1) {
        overlay.current.style.removeProperty('height')
        overlay.current.style.removeProperty('top')
        return
      }
      overlay.current.style.height = `${viewport.height}px`
      overlay.current.style.top = `${viewport.offsetTop}px`
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const focused = document.activeElement
        if (!panel.current?.contains(focused) || !focused.matches('input, select, textarea')) return
        const content = focused.closest('[data-sheet-content]')
        if (!content) return
        const fieldRect = focused.getBoundingClientRect()
        const contentRect = content.getBoundingClientRect()
        if (fieldRect.bottom > contentRect.bottom - 16) content.scrollTop += fieldRect.bottom - contentRect.bottom + 16
        else if (fieldRect.top < contentRect.top + 16) content.scrollTop -= contentRect.top + 16 - fieldRect.top
      })
    }
    resize()
    viewport.addEventListener('resize', resize)
    viewport.addEventListener('scroll', resize)
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('resize', resize)
      viewport.removeEventListener('scroll', resize)
    }
  }, [])

  return createPortal(
    <div ref={overlay} className={s.overlay} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <section ref={panel} className={s.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className={s.handle} aria-hidden="true" />
        <header className={s.header}>
          {icon && <span className={s.icon}>{icon}</span>}
          <div><p className={s.eyebrow}>{eyebrow}</p><h2 id={titleId}>{title}</h2></div>
          <button className={s.close} onClick={onClose} aria-label={`Fechar ${title}`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </header>
        <div data-sheet-content className={s.content}>{children}</div>
      </section>
    </div>, document.getElementById('modal-root'),
  )
}
