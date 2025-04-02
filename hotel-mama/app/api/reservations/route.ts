import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Esquema de validación para la reservación
const createReservationSchema = z.object({
  guestName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  roomNumber: z.string().min(1, "El número de habitación es requerido"),
  checkInDate: z.string().datetime({
    message: "Fecha de check-in inválida",
    offset: true
  }),
  checkOutDate: z.string().datetime({
    message: "Fecha de check-out inválida", 
    offset: true
  }),
  notes: z.string().optional(),
  totalAmount: z.number().positive({
    message: "El monto total debe ser un número positivo"
  }),
  documentId: z.string().min(1, "El documento de identidad es requerido"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido").optional(),
  email: z.string().email("Email inválido").optional(),
});

// GET - Obtener todas las reservaciones
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error al obtener reservaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reservaciones' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva reservación
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos de entrada
    const validatedData = createReservationSchema.parse(body);

    // Validar que la fecha de check-out sea después del check-in
    if (validatedData.checkOutDate <= validatedData.checkInDate) {
      return NextResponse.json(
        { error: "La fecha de check-out debe ser posterior a la de check-in" },
        { status: 400 }
      );
    }

    // Crear la reservación en la base de datos
    const reservation = await prisma.reservation.create({
      data: {
        guestName: validatedData.guestName,
        roomNumber: validatedData.roomNumber,
        checkInDate: validatedData.checkInDate,
        checkOutDate: validatedData.checkOutDate,
        totalAmount: validatedData.totalAmount,
        documentId: validatedData.documentId,
        notes: validatedData.notes,
        phoneNumber: validatedData.phoneNumber,
        email: validatedData.email,
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error al crear reservación:', error);

    // Manejo de errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    // Manejo de errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Error en la base de datos", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error desconocido al crear la reservación' },
      { status: 500 }
    );
  }
}
