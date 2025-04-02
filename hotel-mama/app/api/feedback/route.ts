import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const feedbackSchema = z.object({
  guestName: z.string().min(1),
  roomNumber: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
  category: z.enum(["general", "food", "cleanliness", "service"]),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    const feedback = await prisma.guestFeedback.create({
      data: validatedData,
    })

    return NextResponse.json(feedback)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error al guardar feedback:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const feedback = await prisma.guestFeedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error al obtener feedback:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 