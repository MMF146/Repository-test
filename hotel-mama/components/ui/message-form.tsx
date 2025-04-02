"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"

// Definición del esquema de validación
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingrese un email válido.",
  }),
  subject: z.string().min(5, {
    message: "El asunto debe tener al menos 5 caracteres.",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres.",
  }),
})

// Definición de tipos para las props
type MessageFormProps = {
  /** Función que se ejecuta al enviar el formulario */
  onSubmit?: (values: z.infer<typeof formSchema>) => void
  /** Clases CSS adicionales para el contenedor */
  className?: string
  /** Título personalizado para el formulario */
  title?: string
  /** Función que se ejecuta cuando hay un error */
  onError?: (error: unknown) => void
}

export function MessageForm({ 
  onSubmit: externalOnSubmit,
  className,
  title,
  onError,
}: MessageFormProps) {
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Enviar datos a la API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en la respuesta del servidor')
      }

      const result = await response.json()

      // Mostrar notificación de éxito
      toast({
        title: "Mensaje enviado",
        description: "Su mensaje ha sido enviado correctamente. Nos pondremos en contacto pronto.",
      })

      // Llamar al callback externo si existe
      if (externalOnSubmit) {
        externalOnSubmit(values)
      }

      // Resetear el formulario
      form.reset()
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      
      // Llamar al callback de error si existe
      if (onError) {
        onError(error)
      }

      // Mostrar notificación de error
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un error al enviar el mensaje.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {title || "Enviar Mensaje"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Su nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="su@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto</FormLabel>
                  <FormControl>
                    <Input placeholder="Asunto del mensaje" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escriba su mensaje aquí..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Enviar Mensaje
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 