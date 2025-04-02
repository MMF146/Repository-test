import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para la creación de mensajes
const createMessageSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

// Tipo para el mensaje de la base de datos
type DBMessage = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: Date
  updatedAt: Date
}

// GET - Obtener todos los mensajes
export async function GET() {
  try {
    const messages = await prisma.$queryRaw<DBMessage[]>`
      SELECT * FROM Message ORDER BY createdAt DESC
    `
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error al obtener mensajes:', error)
    return NextResponse.json(
      { error: 'Error al obtener los mensajes' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo mensaje
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = createMessageSchema.parse(body)
    
    // Crear el mensaje usando SQL raw para evitar problemas con el cliente Prisma
    await prisma.$executeRaw`
      INSERT INTO Message (
        name,
        email,
        subject,
        message,
        status,
        createdAt,
        updatedAt
      ) VALUES (
        ${validatedData.name},
        ${validatedData.email},
        ${validatedData.subject},
        ${validatedData.message},
        'pending',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `

    // Obtener el mensaje recién creado
    const [newMessage] = await prisma.$queryRaw<DBMessage[]>`
      SELECT * FROM Message 
      WHERE name = ${validatedData.name}
      AND email = ${validatedData.email}
      AND subject = ${validatedData.subject}
      ORDER BY createdAt DESC 
      LIMIT 1
    `

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error('Error al crear mensaje:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear el mensaje' },
      { status: 500 }
    )
  }
} 