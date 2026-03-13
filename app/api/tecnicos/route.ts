import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tecnicos = await prisma.tecnico.findMany({
      where: { activo: true },
      select: { id: true, nombre: true, usuario: true, role: true },
      orderBy: { nombre: 'asc' },
    })
    return NextResponse.json(tecnicos)
  } catch (error: any) {
    console.error('ERROR TECNICOS:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}