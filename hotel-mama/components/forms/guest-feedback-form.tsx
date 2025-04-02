"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const feedbackSchema = z.object({
  guestName: z.string().min(1, "El nombre es requerido"),
  roomNumber: z.string().min(1, "El número de habitación es requerido"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres"),
  category: z.enum(["general", "food", "cleanliness", "service"]),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

export function GuestFeedbackForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      category: "general",
    },
  })

  async function onSubmit(data: FeedbackFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al enviar el feedback")
      }

      toast({
        title: "¡Gracias por tu feedback!",
        description: "Tu opinión es muy importante para nosotros.",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el feedback. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Huésped</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roomNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Habitación</FormLabel>
              <FormControl>
                <Input placeholder="101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calificación</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ Muy malo</SelectItem>
                    <SelectItem value="2">⭐⭐ Malo</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Regular</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Bueno</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="food">Comida</SelectItem>
                    <SelectItem value="cleanliness">Limpieza</SelectItem>
                    <SelectItem value="service">Servicio</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos tu experiencia..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mínimo 10 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Feedback"}
        </Button>
      </form>
    </Form>
  )
} 