"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className = "" }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`bg-neutral-900 border-orange-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <CardHeader className="border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-orange-500">
              {title}
            </CardTitle>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}