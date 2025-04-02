import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const localPreferencesSchema = z.object({
  guestName: z.string().min(1),
  roomNumber: z.string().min(1),
  language: z.enum(["es", "en"]),
  dietaryNeeds: z.string().optional(),
  temperature: z.number().min(16).max(30),
  wakeUpCall: z.string().optional(),
  newspaper: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = localPreferencesSchema.parse(body)

    const preferences = await prisma.localPreferences.create({
      data: validatedData,
    })

    return NextResponse.json(preferences)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error al guardar preferencias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const preferences = await prisma.localPreferences.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error al obtener preferencias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 