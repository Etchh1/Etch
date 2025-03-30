import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test the connection
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: '✅ Successfully connected to database!' })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { status: '❌ Database connection error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 