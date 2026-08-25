"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Message, type MessageProps } from "./message"

export type MessageGroupProps = {
  role: MessageProps["role"]
  messages: React.ReactNode[]
  className?: string
}

export function MessageGroup({ role, messages, className }: MessageGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {messages.map((content, i) => (
        <Message key={i} role={role}>
          {content}
        </Message>
      ))}
    </div>
  )
}
