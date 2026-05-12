import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(projects)
    } catch (error) {
        console.error('Projects GET error:', error)
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
        
        const project = {
            ...data,
            createdAt: new Date(),
            status: data.status || 'active',
        }

        if (data._id) {
            const { ObjectId } = await import('mongodb')
            await db.collection('projects').updateOne(
                { _id: new ObjectId(data._id) },
                { $set: { ...project, updatedAt: new Date() } }
            )
            return NextResponse.json({ success: true, message: 'Project updated' })
        } else {
            const result = await db.collection('projects').insertOne(project)
            return NextResponse.json({ success: true, insertedId: result.insertedId })
        }
    } catch (error) {
        console.error('Projects POST error:', error)
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
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        const { ObjectId } = await import('mongodb')
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        await db.collection('projects').deleteOne({ _id: new ObjectId(id) })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Projects DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}