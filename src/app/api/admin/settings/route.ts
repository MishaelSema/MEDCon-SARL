import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BOOMINATI100$'

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

        const isValid = ADMIN_PASSWORD.startsWith('$2')
            ? await bcrypt.compare(currentPassword, ADMIN_PASSWORD)
            : currentPassword === ADMIN_PASSWORD
        
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const fs = await import('fs')
        const path = await import('path')
        const envPath = path.join(process.cwd(), '.env.local')

        let envContent = fs.readFileSync(envPath, 'utf-8')
        envContent = envContent.replace(/ADMIN_PASSWORD=.*/, `ADMIN_PASSWORD=${hashedPassword}`)
        fs.writeFileSync(envPath, envContent)

        return NextResponse.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
        console.error('Settings error:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}