'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export const useToast = () => useContext(ToastContext)

const TOAST_STYLES: Record<ToastType, { bg: string; IconComp: React.ComponentType<{ className?: string }> }> = {
  success: { bg: 'bg-[#006D5B]', IconComp: CheckCircle },
  error:   { bg: 'bg-red-600',   IconComp: XCircle },
  warning: { bg: 'bg-amber-500', IconComp: AlertTriangle },
  info:    { bg: 'bg-[#044c43]', IconComp: Info },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999] px-4"
      >
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          {toasts.map(toast => {
            const { bg, IconComp } = TOAST_STYLES[toast.type]
            return (
              <div
                key={toast.id}
                role="alert"
                className={`${bg} text-white rounded-2xl shadow-2xl w-full pointer-events-auto overflow-hidden animate-toast-in`}
              >
                <div className="flex items-start gap-3 px-5 py-4">
                  <IconComp className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-90" />
                  <p className="text-sm font-medium leading-relaxed flex-1 whitespace-pre-line">{toast.message}</p>
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1 mt-0.5"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-1 bg-white/20 animate-toast-bar" />
              </div>
            )
          })}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
