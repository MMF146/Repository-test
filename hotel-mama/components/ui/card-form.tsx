"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { prisma } from "@/lib/prisma"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  dbName: z.string().min(1, {
    message: "El nombre de la base de datos es requerido.",
  }),
  dbType: z.string().min(1, {
    message: "El tipo de base de datos es requerido.",
  }),
  host: z.string().min(1, {
    message: "El host es requerido.",
  }),
  port: z.string().regex(/^\d+$/, {
    message: "El puerto debe ser un número.",
  }),
  username: z.string().min(1, {
    message: "El usuario es requerido.",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida.",
  }),
  monitoringInterval: z.string().regex(/^\d+$/, {
    message: "El intervalo debe ser un número en segundos.",
  }),
})

export function CardForm({ 
  onSubmit: externalOnSubmit, 
  title = "Monitoreo de Base de Datos",
  submitText = "Conectar y Monitorear",
  className 
}: { 
  onSubmit?: (values: z.infer<typeof formSchema>) => void
  title?: string
  submitText?: string
  className?: string
}) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dbName: "",
      dbType: "",
      host: "",
      port: "",
      username: "",
      password: "",
      monitoringInterval: "60",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Guardar en la base de datos SQLite usando Prisma
      const result = await prisma.databaseMonitoring.create({
        data: {
          ...values,
          isActive: true,
          status: "pending",
        },
      })

      toast({
        title: "Conexión guardada",
        description: "La configuración de monitoreo se ha guardado correctamente.",
      })

      // Si hay un manejador externo, lo llamamos también
      if (externalOnSubmit) {
        externalOnSubmit(values)
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error)
      toast({
        title: "Error",
        description: "Hubo un error al guardar la configuración de monitoreo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dbName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Base de Datos</FormLabel>
                  <FormControl>
                    <Input placeholder="nombre_db" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dbType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Base de Datos</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de base de datos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                      <SelectItem value="sqlserver">SQL Server</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input placeholder="localhost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puerto</FormLabel>
                  <FormControl>
                    <Input placeholder="3306" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="usuario_db" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monitoringInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo de Monitoreo (segundos)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {submitText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 