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
        
        const { ObjectId } = await import('mongodb')
        
        const project = {
            ...data,
            createdAt: data._id ? undefined : new Date(),
            status: data.status || 'active',
        }
        
        if (data._id) {
            try {
                const objectId = new ObjectId(data._id)
                const existingProject = await db.collection('projects').findOne({ _id: objectId })
                
                if (!existingProject) {
                    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
                }
                
                await db.collection('projects').updateOne(
                    { _id: objectId },
                    { 
                        $set: { 
                            title: data.title,
                            scope: data.scope,
                            location: data.location,
                            year: data.year,
                            area: data.area,
                            description: data.description,
                            features: data.features,
                            images: data.images,
                            mainImage: data.mainImage,
                            status: data.status || 'active',
                            serviceIds: data.serviceIds,
                            updatedAt: new Date()
                        } 
                    }
                )
                return NextResponse.json({ success: true, message: 'Project updated' })
            } catch (idError) {
                console.error('Invalid ObjectId:', idError)
                return NextResponse.json({ error: 'Invalid project ID format' }, { status: 400 })
            }
        } else {
            const result = await db.collection('projects').insertOne(project)
            return NextResponse.json({ success: true, insertedId: result.insertedId })
        }
    } catch (error) {
        console.error('Projects POST error:', error)
        return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
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