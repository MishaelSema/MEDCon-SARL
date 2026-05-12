import nodemailer from 'nodemailer'

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP configuration not found. Email sending will be disabled.')
}

const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
}) : null

export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string
    subject: string
    html?: string
    text?: string
}) {
    if (!transporter) {
        console.log('Email would be sent:', { to, subject })
        return { success: true, messageId: 'mock-id' }
    }

    try {
        const info = await transporter.sendMail({
            from: `"MED Construction" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        })
        console.log('Message sent: %s', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}

export default transporter
