import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        const db = await getDatabase()
        const admin = await db.collection('admins').findOne({ email, role: 'admin' })

        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isValid = await bcrypt.compare(password, admin.password)
        
        if (isValid) {
            const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
            return NextResponse.json({ 
                token, 
                email: admin.email,
                expiresIn: 30 * 24 * 60 * 60 * 1000
            })
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const db = await getDatabase()
        const adminCount = await db.collection('admins').countDocuments({ role: 'admin' })
        
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash('BOOMINATI100$', 10)
            await db.collection('admins').insertOne({
                email: 'support@medconsarl.com',
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            console.log('Default admin created')
        }
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: 'Failed to seed admin' }, { status: 500 })
    }
}