"use client"

import { MessageForm } from "@/components/ui/message-form"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Contáctenos</h1>
        <MessageForm />
      </div>
    </div>
  )
} 