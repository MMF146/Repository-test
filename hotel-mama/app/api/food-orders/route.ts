import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const foodOrderSchema = z.object({
  guest: z.string(),
  items: z.array(z.string()),
  specialInstructions: z.string().optional(),
  totalAmount: z.number(),
  status: z.enum(['preparing', 'delivered', 'cancelled']),
})

type FoodOrderInput = z.infer<typeof foodOrderSchema>

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = foodOrderSchema.parse(body)

    const order = await prisma.foodOrder.create({
      data: {
        guestName: validatedData.guest,
        items: JSON.stringify(validatedData.items),
        specialInstructions: validatedData.specialInstructions || '',
        totalAmount: validatedData.totalAmount,
        status: validatedData.status,
      },
    })

    return NextResponse.json({
      ...order,
      items: JSON.parse(order.items) as string[]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const orders = await prisma.foodOrder.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(
      orders.map(order => ({
        ...order,
        items: JSON.parse(order.items) as string[]
      }))
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 