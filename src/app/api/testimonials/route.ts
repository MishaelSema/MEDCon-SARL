import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/nodemailer'
import { testimonialNotificationEmail } from '@/lib/email-templates'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'medcocoltd@gmail.com'

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { name, email, rating, text } = data

        if (!name || !email || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { getDatabase } = await import('@/lib/mongodb')
        
        try {
            const db = await getDatabase()
            await db.collection('testimonials').insertOne({
                name,
                email,
                rating: rating || 5,
                text,
                status: 'pending',
                createdAt: new Date(),
            })
        } catch (dbError) {
            console.log('MongoDB not configured, skipping database insert')
        }

        await sendEmail({
            to: ADMIN_EMAIL,
            subject: `New Testimonial from ${name} - MEDCon SARL`,
            html: testimonialNotificationEmail({ name, email, rating: rating || 5, text }),
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Testimonial error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const { getDatabase } = await import('@/lib/mongodb')
            const db = await getDatabase()
            const testimonials = await db.collection('testimonials').find({}).sort({ createdAt: -1 }).toArray()
            return NextResponse.json(testimonials)
        } catch (error) {
            console.error('Testimonials GET error:', error)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }
    }

    if (status) {
        try {
            const { getDatabase } = await import('@/lib/mongodb')
            const db = await getDatabase()
            const testimonials = await db.collection('testimonials').find({ status }).sort({ createdAt: -1 }).toArray()
            return NextResponse.json(testimonials)
        } catch (error) {
            console.error('Testimonials GET error:', error)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }
    }

    try {
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        const testimonials = await db.collection('testimonials').find({ status: 'approved' }).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(testimonials)
    } catch (error) {
        console.error('Testimonials GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}