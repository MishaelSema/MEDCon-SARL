import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/nodemailer'
import { leadNotificationEmail, guideDownloadEmail } from '@/lib/email-templates'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@medconsarl.com'

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { name, phone, email, type, budget, timeline, location, message, downloadUrl } = data

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
            
            const lead = {
                name,
                phone,
                email,
                type: type || 'Not specified',
                budget: budget || 'Not specified',
                timeline: timeline || 'Not specified',
                location: location || 'Not specified',
                message,
                source: 'construction-guide',
                createdAt: new Date(),
            }
            
            await db.collection('leads').insertOne(lead)

            await sendEmail({
                to: ADMIN_EMAIL,
                subject: `New Lead: ${name} downloaded Construction Guide - MEDCon SARL`,
                html: leadNotificationEmail({ name, phone, type: type || 'Not specified', budget, timeline, location, message }),
            })

            // Send guide confirmation email to customer
            const guideTitle = type || 'Get the Construction Guide for Free'
            const guideDesc = message || 'Discover everything you need to know before starting your construction project.'
            
            await sendEmail({
                to: email,
                subject: 'Your Free Construction Guide from MEDCon SARL',
                html: guideDownloadEmail({ 
                    customerName: name, 
                    guideTitle, 
                    guideDescription: guideDesc,
                    downloadUrl: downloadUrl || undefined
                }),
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