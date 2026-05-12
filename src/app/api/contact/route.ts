import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/nodemailer'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'medcocoltd@gmail.com'

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
            subject: `New Inquiry from ${name} - MED Construction`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
                <p><strong>Message:</strong></p>
                <blockquote style="background: #fefce8; padding: 15px; border-left: 4px solid #9cc639; margin: 10px 0;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
            </div>
            `,
        })

        await sendEmail({
            to: email,
            subject: 'Thank you for contacting MED Construction',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1f2937;">Hi ${name},</h2>
                <p>Thank you for reaching out to MED Construction!</p>
                <p>We have received your message and our team will review it shortly. We will get back to you within 24 hours.</p>
                <p>Best regards,<br><strong>The MED Construction Team</strong></p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 14px;">
                        <strong>Phone:</strong> +237 671 911 489<br>
                        <strong>Email:</strong> medcocoltd@gmail.com<br>
                        <strong>Location:</strong> Yaounde, Cameroon
                    </p>
                </div>
            </div>
            `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact error:', error)
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
        const contacts = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(contacts)
    } catch (error) {
        console.error('Contact GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}