import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing passwords' }, { status: 400 })
        }

        const db = await getDatabase()
        const admin = await db.collection('admins').findOne({ role: 'admin' })

        if (!admin) {
            return NextResponse.json({ error: 'No admin found' }, { status: 404 })
        }

        const isValid = await bcrypt.compare(currentPassword, admin.password)
        
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        
        await db.collection('admins').updateOne(
            { role: 'admin' },
            { 
                $set: { 
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            }
        )

        return NextResponse.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
        console.error('Settings error:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}