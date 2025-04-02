"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (!response.ok) {
          throw new Error('Error al cargar los mensajes')
        }
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los mensajes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [toast])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Cargando mensajes...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Mensajes Recibidos</h1>
        
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No hay mensajes aún</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{message.subject}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(message.createdAt), "PPpp", { locale: es })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>De:</strong> {message.name} ({message.email})</p>
                    <p className="whitespace-pre-wrap">{message.message}</p>
                    <p className="text-sm text-gray-500">
                      Estado: {message.status === 'pending' ? 'Pendiente' : 'Respondido'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 