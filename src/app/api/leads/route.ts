import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { name, email } = data

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
        }

        const { getDatabase } = await import('@/lib/mongodb')
        
        try {
            const db = await getDatabase()
            
            const existingLead = await db.collection('leads').findOne({ email })
            if (existingLead) {
                return NextResponse.json({ success: true, message: 'You are already subscribed!' })
            }
            
            await db.collection('leads').insertOne({
                name,
                email,
                source: 'construction-guide',
                createdAt: new Date(),
            })
        } catch (dbError) {
            console.log('MongoDB not configured, skipping database insert')
        }

        return NextResponse.json({ success: true, message: 'Guide sent to your email!' })
    } catch (error) {
        console.error('Lead error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        const leads = await db.collection('leads').find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(leads)
    } catch (error) {
        console.error('Leads GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}