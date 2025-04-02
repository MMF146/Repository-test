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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const checkInOutSchema = z.object({
  guestName: z.string().min(1, "El nombre es requerido"),
  roomNumber: z.string().min(1, "El número de habitación es requerido"),
  type: z.enum(["check-in", "check-out"]),
  specialRequests: z.string().optional(),
  luggage: z.number().min(0),
  roomCondition: z.string().optional(),
  minibarUsage: z.boolean().default(false),
})

type CheckInOutFormValues = z.infer<typeof checkInOutSchema>

export function CheckInOutForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CheckInOutFormValues>({
    resolver: zodResolver(checkInOutSchema),
    defaultValues: {
      type: "check-in",
      luggage: 0,
      minibarUsage: false,
    },
  })

  const isCheckOut = form.watch("type") === "check-out"

  async function onSubmit(data: CheckInOutFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/check-in-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error al procesar el ${data.type}`)
      }

      toast({
        title: `¡${data.type === "check-in" ? "Check-in" : "Check-out"} exitoso!`,
        description: `Se ha registrado el ${data.type} correctamente.`,
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo procesar el ${form.getValues("type")}. Por favor, intenta de nuevo.`,
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Operación</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="check-in">Check-in</SelectItem>
                    <SelectItem value="check-out">Check-out</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="luggage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Maletas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solicitudes Especiales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Almohadas extra, vista preferida..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isCheckOut && (
          <>
            <FormField
              control={form.control}
              name="roomCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de la Habitación</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones sobre el estado de la habitación..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minibarUsage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Uso del Minibar
                    </FormLabel>
                    <FormDescription>
                      ¿El huésped consumió productos del minibar?
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
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : `Realizar ${form.getValues("type") === "check-in" ? "Check-in" : "Check-out"}`}
        </Button>
      </form>
    </Form>
  )
} 