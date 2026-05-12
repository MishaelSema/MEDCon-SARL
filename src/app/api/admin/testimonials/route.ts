import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const { name, email, rating, text, status } = data

        if (!name || !email || !text) {
            return NextResponse.json({ error: 'Name, email, and text are required' }, { status: 400 })
        }

        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        const testimonial = {
            name,
            email,
            rating: rating || 5,
            content: text,
            text: text,
            status: status || 'approved',
            createdAt: new Date(),
        }

        const result = await db.collection('testimonials').insertOne(testimonial)
        return NextResponse.json({ success: true, insertedId: result.insertedId })
    } catch (error) {
        console.error('Testimonials POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const { _id, status } = data

        if (!_id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 })
        }

        const { ObjectId } = await import('mongodb')
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        await db.collection('testimonials').updateOne(
            { _id: new ObjectId(_id) },
            { $set: { status, updatedAt: new Date() } }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Testimonials PATCH error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 })
        }

        const { ObjectId } = await import('mongodb')
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Testimonials DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}