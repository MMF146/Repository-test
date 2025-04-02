"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckInOutForm } from "@/components/ui/check-in-out-form"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { z } from 'zod'

// Esquema de validación para la reservación
const reservationResponseSchema = z.object({
  id: z.number().optional(),
  guestName: z.string(),
  roomNumber: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  status: z.string().optional(),
  totalAmount: z.union([z.string(), z.number()]),
  paymentStatus: z.string().optional(),
  notes: z.string().optional(),
  documentId: z.string(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

type ReservationResponse = z.infer<typeof reservationResponseSchema>

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Cargar reservaciones
  const loadReservations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/reservations')
      if (!response.ok) throw new Error('Error al cargar reservaciones')
      const data = await response.json()
      
      // Validar datos recibidos
      const validatedData = z.array(reservationResponseSchema).parse(data)
      setReservations(validatedData)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof z.ZodError 
          ? "Datos inválidos recibidos del servidor"
          : "No se pudieron cargar las reservaciones",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const handleNewReservation = async (values: any) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la reservación')
      }
      
      const data = await response.json()
      const validatedData = reservationResponseSchema.parse(data)
      
      toast({
        title: "Éxito",
        description: "Reservación creada correctamente",
      })
      
      setShowForm(false)
      loadReservations()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la reservación",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reservaciones</h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
          disabled={isLoading}
        >
          {showForm ? "Cancelar" : "Nueva Reservación"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CheckInOutForm 
            onSubmit={handleNewReservation}
            title="Nueva Reservación"
            submitText="Crear Reservación"
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <p>Cargando...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Habitación {reservation.roomNumber}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Huésped:</strong> {reservation.guestName}</p>
                  <p><strong>Check-in:</strong> {format(new Date(reservation.checkInDate), 'PPP', { locale: es })}</p>
                  <p><strong>Check-out:</strong> {format(new Date(reservation.checkOutDate), 'PPP', { locale: es })}</p>
                  <p><strong>Estado:</strong> {reservation.status === 'checked-in' ? 'Registrado' : 'Finalizado'}</p>
                  <p><strong>Monto:</strong> ${reservation.totalAmount}</p>
                  <p><strong>Pago:</strong> {reservation.paymentStatus === 'pending' ? 'Pendiente' : 'Pagado'}</p>
                  {reservation.documentId && <p><strong>Documento:</strong> {reservation.documentId}</p>}
                  {reservation.phoneNumber && <p><strong>Teléfono:</strong> {reservation.phoneNumber}</p>}
                  {reservation.email && <p><strong>Email:</strong> {reservation.email}</p>}
                  {reservation.notes && <p><strong>Notas:</strong> {reservation.notes}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 