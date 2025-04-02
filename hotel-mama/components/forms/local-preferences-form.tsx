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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const localPreferencesSchema = z.object({
  guestName: z.string().min(1, "El nombre es requerido"),
  roomNumber: z.string().min(1, "El número de habitación es requerido"),
  language: z.enum(["es", "en"]),
  dietaryNeeds: z.string().optional(),
  temperature: z.number().min(16).max(30),
  wakeUpCall: z.string().optional(),
  newspaper: z.boolean().default(false),
})

type LocalPreferencesFormValues = z.infer<typeof localPreferencesSchema>

export function LocalPreferencesForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LocalPreferencesFormValues>({
    resolver: zodResolver(localPreferencesSchema),
    defaultValues: {
      language: "es",
      temperature: 22,
      newspaper: false,
    },
  })

  async function onSubmit(data: LocalPreferencesFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/local-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al guardar las preferencias")
      }

      toast({
        title: "¡Preferencias guardadas!",
        description: "Las preferencias se han guardado correctamente.",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las preferencias. Por favor, intenta de nuevo.",
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
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idioma Preferido</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Necesidades Dietéticas</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vegetariano, alergias, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperatura Preferida (°C)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="16"
                  max="30"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Entre 16°C y 30°C
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wakeUpCall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Llamada de Despertar</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newspaper"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Periódico Diario
                </FormLabel>
                <FormDescription>
                  ¿Desea recibir el periódico en su habitación?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Preferencias"}
        </Button>
      </form>
    </Form>
  )
} 