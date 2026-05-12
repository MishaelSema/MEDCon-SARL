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
    let data
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        data = await request.json()
    } catch (parseError) {
        console.error('JSON parse error:', parseError)
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    try {
        const { ObjectId } = await import('mongodb')
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        if (data._id) {
            try {
                const objectId = new ObjectId(data._id)
                const existingService = await db.collection('services').findOne({ _id: objectId })
                
                if (!existingService) {
                    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
                }
                
                await db.collection('services').updateOne(
                    { _id: objectId },
                    { 
                        $set: { 
                            title: data.title,
                            description: data.description,
                            features: data.features || [],
                            images: data.images || [],
                            icon: data.icon,
                            showOnHome: data.showOnHome ?? true,
                            order: data.order || 1,
                            projectIds: data.projectIds || [],
                            updatedAt: new Date()
                        } 
                    }
                )
                return NextResponse.json({ success: true, message: 'Service updated' })
            } catch (idError) {
                console.error('Invalid ObjectId:', idError)
                return NextResponse.json({ error: 'Invalid service ID format' }, { status: 400 })
            }
        } else {
            const service = {
                title: data.title,
                description: data.description,
                features: data.features || [],
                images: data.images || [],
                icon: data.icon,
                showOnHome: data.showOnHome ?? true,
                order: data.order || 1,
                projectIds: data.projectIds || [],
                createdAt: new Date(),
            }
            const result = await db.collection('services').insertOne(service)
            return NextResponse.json({ success: true, insertedId: result.insertedId })
        }
    } catch (error) {
        console.error('Services POST error:', error)
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