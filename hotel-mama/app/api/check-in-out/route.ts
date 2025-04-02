import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const checkInOutSchema = z.object({
  guestName: z.string().min(1),
  roomNumber: z.string().min(1),
  type: z.enum(["check-in", "check-out"]),
  specialRequests: z.string().optional(),
  luggage: z.number().min(0),
  roomCondition: z.string().optional(),
  minibarUsage: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = checkInOutSchema.parse(body)

    const checkInOut = await prisma.checkInOut.create({
      data: validatedData,
    })

    return NextResponse.json(checkInOut)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error al procesar check-in/out:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const checkInOuts = await prisma.checkInOut.findMany({
      orderBy: {
        dateTime: 'desc',
      },
    })

    return NextResponse.json(checkInOuts)
  } catch (error) {
    console.error('Error al obtener registros de check-in/out:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 