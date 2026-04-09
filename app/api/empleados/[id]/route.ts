import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params  // ← await aquí
        const body = await req.json()
        const { nombre, cargo, dependencia, equipo, ip, tipo, serial } = body

        if (!nombre?.trim()) {
            return NextResponse.json(
                { error: 'El nombre es obligatorio' },
                { status: 400 }
            )
        }

        const empleado = await prisma.empleado.update({
            where: { id: Number(id) },
            data: {
                nombre: nombre.trim(),
                cargo: cargo || 'Planta',
                dependencia: dependencia?.trim() || '',
                equipo: equipo || '',
                ip: ip || null,
                tipo: tipo || 'ESCRITORIO',
                serial: serial || null,
            },
        })

        return NextResponse.json(empleado)
    } catch (error: any) {
        console.error('ERROR PUT EMPLEADO:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}