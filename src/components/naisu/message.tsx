"use client"

import * as React from "react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type MessageRole = "user" | "assistant"

export type MessageProps = {
  role: MessageRole
  children: React.ReactNode
  className?: string
}

export function Message({ role, children, className }: MessageProps) {
  const isUser = role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.soft}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-background text-foreground ring-1 ring-border"
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}

export type MessageGroupProps = {
  role: MessageRole
  messages: React.ReactNode[]
  className?: string
}

export function MessageGroup({ role, messages, className }: MessageGroupProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {messages.map((content, i) => (
        <Message key={i} role={role}>
          {content}
        </Message>
      ))}
    </div>
  )
}
