import { getPayload } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload()
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@nenenesor.com' } },
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json({ message: 'Admin user already exists.' })
    }

    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@nenenesor.com',
        password: 'adminpassword123',
        name: 'Nene Admin',
        role: 'admin',
      },
    })

    return NextResponse.json({
      message: 'Admin user created successfully!',
      email: newUser.email,
      password: 'adminpassword123',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
