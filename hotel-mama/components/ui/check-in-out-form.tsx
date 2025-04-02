"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Definición del esquema de validación
const formSchema = z.object({
  guestName: z.string().min(2, {
    message: "El nombre del huésped debe tener al menos 2 caracteres.",
  }),
  roomNumber: z.string().min(1, {
    message: "El número de habitación es requerido.",
  }),
  checkInDate: z.date({
    required_error: "La fecha de check-in es requerida.",
  }),
  checkOutDate: z.date({
    required_error: "La fecha de check-out es requerida.",
  }),
  documentId: z.string().min(1, {
    message: "El documento de identidad es requerido.",
  }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Por favor ingrese un número de teléfono válido.",
  }).optional(),
  email: z.string().email({
    message: "Por favor ingrese un email válido.",
  }).optional(),
  notes: z.string().optional(),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Ingrese un monto válido (ejemplo: 100.50)",
  }),
})

// Definición de tipos para las props
type CheckInOutFormProps = {
  /** Modo del formulario: check-in o check-out */
  mode?: "check-in" | "check-out"
  /** Función que se ejecuta al enviar el formulario */
  onSubmit?: (values: z.infer<typeof formSchema>) => void
  /** Clases CSS adicionales para el contenedor */
  className?: string
  /** Título personalizado para el formulario */
  title?: string
  /** Texto personalizado para el botón de envío */
  submitText?: string
  /** Función que se ejecuta cuando hay un error */
  onError?: (error: unknown) => void
  /** Estado inicial del formulario */
  initialValues?: Partial<z.infer<typeof formSchema>>
}

export function CheckInOutForm({ 
  mode = "check-in",
  onSubmit: externalOnSubmit,
  className,
  title,
  submitText,
  onError,
  initialValues
}: CheckInOutFormProps) {
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: initialValues?.guestName || "",
      roomNumber: initialValues?.roomNumber || "",
      notes: initialValues?.notes || "",
      documentId: initialValues?.documentId || "",
      phoneNumber: initialValues?.phoneNumber || "",
      email: initialValues?.email || "",
      totalAmount: initialValues?.totalAmount || "",
      checkInDate: initialValues?.checkInDate,
      checkOutDate: initialValues?.checkOutDate,
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Transformar las fechas a formato ISO
      const data = {
        ...values,
        checkInDate: values.checkInDate.toISOString(),
        checkOutDate: values.checkOutDate.toISOString(),
        totalAmount: parseFloat(values.totalAmount),
      }

      // Enviar datos a la API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en la respuesta del servidor')
      }

      const result = await response.json()

      // Mostrar notificación de éxito
      toast({
        title: "Reservación creada",
        description: `Reservación registrada correctamente para ${values.guestName}`,
      })

      // Llamar al callback externo si existe
      if (externalOnSubmit) {
        externalOnSubmit(values)
      }

      // Resetear el formulario
      form.reset()
    } catch (error) {
      console.error("Error al procesar la operación:", error)
      
      // Llamar al callback de error si existe
      if (onError) {
        onError(error)
      }

      // Mostrar notificación de error
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un error al procesar la operación.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {title || (mode === "check-in" ? "Registro de Entrada" : "Registro de Salida")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Huésped</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo" {...field} />
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
              name="checkInDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Entrada</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOutDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Salida</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < form.getValues("checkInDate")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Identidad</FormLabel>
                  <FormControl>
                    <Input placeholder="DNI/Pasaporte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 123456789" {...field} />
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
                    <Input placeholder="huesped@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Total</FormLabel>
                  <FormControl>
                    <Input placeholder="100.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Input placeholder="Notas adicionales" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {submitText || (mode === "check-in" ? "Registrar Entrada" : "Registrar Salida")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}