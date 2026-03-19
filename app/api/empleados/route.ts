import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const empleados = await prisma.empleado.findMany({
    where: {
      activo: true,
      OR: [
        { nombre: { contains: q, mode: 'insensitive' } },
        { cargo: { contains: q, mode: 'insensitive' } },
        { dependencia: { contains: q, mode: 'insensitive' } },
        { equipo: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { nombre: 'asc' },
    take: 20,
  })
  return NextResponse.json(empleados)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { nombre, cargo, dependencia, equipo, ip, tipo, serial } = body

    if (!nombre?.trim()) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      )
    }

    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        nombre: nombre.trim(),
        cargo: cargo || 'Planta',
        dependencia: dependencia?.trim() || 'PENDIENTE',
        equipo: equipo || 'PENDIENTE',
        ip: ip || null,
        tipo: tipo || 'ESCRITORIO',
        serial: serial || null,
        activo: true,
      },
    })

    return NextResponse.json(nuevoEmpleado, { status: 201 })
  } catch (error) {
    console.error('POST /api/empleados error:', error)
    return NextResponse.json(
      { error: 'Error interno al crear el empleado' },
      { status: 500 }
    )
  }
}