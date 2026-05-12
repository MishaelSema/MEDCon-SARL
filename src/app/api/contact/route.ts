import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/nodemailer'
import { contactNotificationEmail, thankYouEmail, contactReplyEmail } from '@/lib/email-templates'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'medconsarl@gmail.com'

export async function GET(request: NextRequest) {
    try {
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        const contacts = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(contacts)
    } catch (error) {
        console.error('Contact GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { name, email, phone, service, message } = data

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { getDatabase } = await import('@/lib/mongodb')
        
        try {
            const db = await getDatabase()
            await db.collection('contacts').insertOne({
                name,
                email,
                phone,
                service,
                message,
                createdAt: new Date(),
                read: false,
            })
        } catch (dbError) {
            console.log('MongoDB not configured, skipping database insert')
        }

        await sendEmail({
            to: ADMIN_EMAIL,
            subject: `New Inquiry from ${name} - MEDCon SARL`,
            html: contactNotificationEmail({ name, email, phone, service, message }),
        })

        await sendEmail({
            to: email,
            subject: 'Thank you for contacting MEDCon SARL',
            html: thankYouEmail(name),
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const { id, read, reply, repliedAt } = data
        
        const { ObjectId } = await import('mongodb')
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        const updateData: any = { updatedAt: new Date() }
        if (read !== undefined) updateData.read = read
        if (reply !== undefined) updateData.reply = reply
        if (repliedAt !== undefined) updateData.repliedAt = repliedAt
        
        await db.collection('contacts').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )
        
        if (reply) {
            const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) })
            if (contact) {
                await sendEmail({
                    to: contact.email,
                    subject: `Re: Your inquiry to MEDCon SARL`,
                    html: contactReplyEmail({
                        customerName: contact.name,
                        customerEmail: contact.email,
                        reply: reply,
                        originalMessage: contact.message
                    }),
                })
            }
        }
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact PATCH error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: 'Contact ID required' }, { status: 400 })
        }
        
        const { ObjectId } = await import('mongodb')
        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()
        
        await db.collection('contacts').deleteOne({ _id: new ObjectId(id) })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}