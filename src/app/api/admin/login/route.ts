import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@medcon.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
            return NextResponse.json({ 
                token, 
                email: ADMIN_EMAIL,
                expiresIn: 30 * 24 * 60 * 60 * 1000
            })
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}