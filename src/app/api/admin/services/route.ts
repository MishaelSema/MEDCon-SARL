import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        const services = await db.collection('services').find({}).sort({ order: 1 }).toArray()
        return NextResponse.json(services)
    } catch (error) {
        console.error('Services GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        const service = {
            ...data,
            createdAt: new Date(),
            showOnHome: data.showOnHome ?? true,
        }

        if (data._id) {
            const { ObjectId } = await import('mongodb')
            await db.collection('services').updateOne(
                { _id: new ObjectId(data._id) },
                { $set: { ...service, updatedAt: new Date() } }
            )
            return NextResponse.json({ success: true, message: 'Service updated' })
        } else {
            const result = await db.collection('services').insertOne(service)
            return NextResponse.json({ success: true, insertedId: result.insertedId })
        }
    } catch (error) {
        console.error('Services POST error:', error)
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
            return NextResponse.json({ error: 'Service ID required' }, { status: 400 })
        }

        const { ObjectId } = await import('mongodb')
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        await db.collection('services').deleteOne({ _id: new ObjectId(id) })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Services DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}