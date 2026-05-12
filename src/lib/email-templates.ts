export const COLORS = {
    deepSpaceBlue: '#073856',
    deepSpaceBlueLight: '#0a4a70',
    yellowGreen: '#9cc639',
    yellowGreenLight: '#b5d456',
    cornsilk: '#fff8dc',
    white: '#ffffff',
    darkCyan: '#008b8b',
    yaleBlue: '#1f5c8b',
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    }
}

export const BASE_TEMPLATE = (content: string, footerExtra = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEDCon SARL</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${COLORS.gray[100]};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: ${COLORS.white};">
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, ${COLORS.deepSpaceBlue} 0%, ${COLORS.deepSpaceBlueLight} 100%); padding: 40px 30px; text-align: center;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="text-align: center;">
                            <h1 style="color: ${COLORS.white}; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 1px;">
                                MED<span style="color: ${COLORS.yellowGreen};">Con</span> SARL
                            </h1>
                            <p style="color: ${COLORS.yellowGreen}; font-size: 12px; margin: 8px 0 0; letter-spacing: 3px; text-transform: uppercase;">
                                Building Tomorrow's Dreams Today
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Accent Bar -->
        <tr>
            <td style="background-color: ${COLORS.yellowGreen}; height: 4px;"></td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="padding: 40px 35px;">
                ${content}
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: ${COLORS.deepSpaceBlue}; padding: 30px 35px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="text-align: center;">
                            <p style="color: ${COLORS.white}; font-size: 14px; margin: 0 0 15px;">
                                <strong>Contact Us</strong>
                            </p>
                            <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0 0 8px;">
                                📞 +237 671 911 489
                            </p>
                            <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0 0 8px;">
                                ✉️ medcocoltd@gmail.com
                            </p>
                            <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0 0 20px;">
                                📍 Yaoundé, Cameroon
                            </p>
                            ${footerExtra}
                            <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 20px 0 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                                © ${new Date().getFullYear()} MEDCon SARL. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`

// Contact Notification Email (Admin)
export const contactNotificationEmail = (data: {
    name: string
    email: string
    phone?: string
    service?: string
    message: string
}) => {
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                New Inquiry
            </div>
            <h2 style="color: ${COLORS.deepSpaceBlue}; font-size: 26px; margin: 20px 0 10px;">
                You have a new message
            </h2>
            <p style="color: ${COLORS.gray[500]}; font-size: 14px;">
                Someone just sent you an inquiry from your website
            </p>
        </div>
        
        <div style="background-color: ${COLORS.gray[50]}; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Name</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <strong style="color: ${COLORS.deepSpaceBlue}; font-size: 15px;">${data.name}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Email</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <a href="mailto:${data.email}" style="color: ${COLORS.yaleBlue}; font-size: 15px; text-decoration: none;">${data.email}</a>
                    </td>
                </tr>
                ${data.phone ? `
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Phone</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <a href="tel:${data.phone}" style="color: ${COLORS.yaleBlue}; font-size: 15px; text-decoration: none;">${data.phone}</a>
                    </td>
                </tr>
                ` : ''}
                ${data.service ? `
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Service</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <span style="background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${data.service}</span>
                    </td>
                </tr>
                ` : ''}
            </table>
        </div>
        
        <div style="background: linear-gradient(135deg, ${COLORS.deepSpaceBlue} 0%, ${COLORS.deepSpaceBlueLight} 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <p style="color: ${COLORS.gray[400]}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Message</p>
            <p style="color: ${COLORS.white}; font-size: 15px; line-height: 1.7; margin: 0;">${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="https://medconstruction-cm.com/admin/contacts" style="display: inline-block; background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 14px 35px; border-radius: 25px; font-size: 14px; font-weight: 700; text-decoration: none;">
                View in Admin Dashboard →
            </a>
        </div>
    `
    
    return BASE_TEMPLATE(content, `
        <p style="color: ${COLORS.yellowGreen}; font-size: 12px; margin: 0;">
            Log in to your admin dashboard to respond to this inquiry.
        </p>
    `)
}

// Auto-reply Thank You Email (Customer)
export const thankYouEmail = (name: string) => {
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: ${COLORS.yellowGreen}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${COLORS.deepSpaceBlue}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h2 style="color: ${COLORS.deepSpaceBlue}; font-size: 26px; margin: 0 0 10px;">
                Thank You, ${name}!
            </h2>
            <p style="color: ${COLORS.gray[500]}; font-size: 15px; margin: 0;">
                We've received your message and will get back to you soon.
            </p>
        </div>
        
        <div style="background-color: ${COLORS.cornsilk}; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid ${COLORS.yellowGreen};">
            <p style="color: ${COLORS.deepSpaceBlue}; font-size: 14px; line-height: 1.7; margin: 0;">
                <strong>What happens next?</strong><br><br>
                Our team will review your inquiry and respond within <strong style="color: ${COLORS.yellowGreen};">24 hours</strong>.
            </p>
        </div>
        
        <div style="background-color: ${COLORS.gray[50]}; border-radius: 12px; padding: 25px;">
            <p style="color: ${COLORS.gray[600]}; font-size: 14px; line-height: 1.7; margin: 0 0 15px;">
                In the meantime, feel free to explore our services or reach out directly:
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="padding: 8px 0;">
                        <a href="tel:+237671911489" style="color: ${COLORS.deepSpaceBlue}; text-decoration: none; font-size: 14px;">
                            📞 +237 671 911 489
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;">
                        <a href="mailto:medcocoltd@gmail.com" style="color: ${COLORS.deepSpaceBlue}; text-decoration: none; font-size: 14px;">
                            ✉️ medcocoltd@gmail.com
                        </a>
                    </td>
                </tr>
            </table>
        </div>
    `
    
    return BASE_TEMPLATE(content)
}

// Testimonial Notification Email (Admin)
export const testimonialNotificationEmail = (data: {
    name: string
    email: string
    rating: number
    text: string
}) => {
    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating)
    
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                New Testimonial
            </div>
            <h2 style="color: ${COLORS.deepSpaceBlue}; font-size: 26px; margin: 20px 0 10px;">
                Someone left a review
            </h2>
            <p style="color: ${COLORS.gray[500]}; font-size: 14px;">
                A new testimonial is waiting for your approval
            </p>
        </div>
        
        <div style="background-color: ${COLORS.gray[50]}; border-radius: 12px; padding: 25px; margin-bottom: 25px; text-align: center;">
            <p style="font-size: 32px; margin: 0 0 10px; color: ${COLORS.yellowGreen}; letter-spacing: 4px;">${stars}</p>
            <p style="color: ${COLORS.gray[600]}; font-size: 13px; margin: 0;">Rating</p>
        </div>
        
        <div style="background-color: ${COLORS.gray[50]}; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Name</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <strong style="color: ${COLORS.deepSpaceBlue}; font-size: 15px;">${data.name}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0;">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Email</span>
                    </td>
                    <td style="padding: 12px 0; text-align: right;">
                        <a href="mailto:${data.email}" style="color: ${COLORS.yaleBlue}; font-size: 15px; text-decoration: none;">${data.email}</a>
                    </td>
                </tr>
            </table>
        </div>
        
        <div style="background: linear-gradient(135deg, ${COLORS.deepSpaceBlue} 0%, ${COLORS.deepSpaceBlueLight} 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; position: relative;">
            <div style="position: absolute; top: 15px; left: 20px; font-size: 40px; color: rgba(255,255,255,0.1);">"</div>
            <p style="color: ${COLORS.white}; font-size: 16px; line-height: 1.7; margin: 0; font-style: italic; position: relative; z-index: 1;">
                ${data.text}
            </p>
        </div>
        
        <div style="text-align: center; display: flex; gap: 15px; justify-content: center;">
            <a href="https://medconstruction-cm.com/admin/testimonials" style="display: inline-block; background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 14px 30px; border-radius: 25px; font-size: 14px; font-weight: 700; text-decoration: none;">
                Review & Approve →
            </a>
        </div>
    `
    
    return BASE_TEMPLATE(content, `
        <p style="color: ${COLORS.yellowGreen}; font-size: 12px; margin: 0;">
            Visit the admin dashboard to approve or reject this testimonial.
        </p>
    `)
}

// Lead Notification Email (Admin)
export const leadNotificationEmail = (data: {
    name: string
    phone: string
    type: string
    budget?: string
    timeline?: string
    location?: string
    message?: string
}) => {
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                New Lead
            </div>
            <h2 style="color: ${COLORS.deepSpaceBlue}; font-size: 26px; margin: 20px 0 10px;">
                New Construction Guide Download
            </h2>
            <p style="color: ${COLORS.gray[500]}; font-size: 14px;">
                Someone downloaded your free construction guide
            </p>
        </div>
        
        <div style="background-color: ${COLORS.gray[50]}; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Name</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <strong style="color: ${COLORS.deepSpaceBlue}; font-size: 15px;">${data.name}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Phone</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <a href="tel:${data.phone}" style="color: ${COLORS.yaleBlue}; font-size: 15px; text-decoration: none;">${data.phone}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Project Type</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <span style="background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${data.type}</span>
                    </td>
                </tr>
                ${data.budget ? `
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Budget</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <strong style="color: ${COLORS.deepSpaceBlue}; font-size: 15px;">${data.budget}</strong>
                    </td>
                </tr>
                ` : ''}
                ${data.timeline ? `
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]};">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Timeline</span>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right;">
                        <strong style="color: ${COLORS.deepSpaceBlue}; font-size: 15px;">${data.timeline}</strong>
                    </td>
                </tr>
                ` : ''}
                ${data.location ? `
                <tr>
                    <td style="padding: 12px 0;">
                        <span style="color: ${COLORS.gray[500]}; font-size: 13px;">Location</span>
                    </td>
                    <td style="padding: 12px 0; text-align: right;">
                        <strong style="color: ${COLORS.deepSpaceBlue}; font-size: 15px;">${data.location}</strong>
                    </td>
                </tr>
                ` : ''}
            </table>
        </div>
        
        ${data.message ? `
        <div style="background: linear-gradient(135deg, ${COLORS.deepSpaceBlue} 0%, ${COLORS.deepSpaceBlueLight} 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <p style="color: ${COLORS.gray[400]}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Additional Notes</p>
            <p style="color: ${COLORS.white}; font-size: 15px; line-height: 1.7; margin: 0;">${data.message}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center;">
            <a href="https://medconstruction-cm.com/admin/leads" style="display: inline-block; background-color: ${COLORS.yellowGreen}; color: ${COLORS.deepSpaceBlue}; padding: 14px 35px; border-radius: 25px; font-size: 14px; font-weight: 700; text-decoration: none;">
                View Lead in Dashboard →
            </a>
        </div>
    `
    
    return BASE_TEMPLATE(content, `
        <p style="color: ${COLORS.yellowGreen}; font-size: 12px; margin: 0;">
            This lead downloaded your free Construction Guide - follow up quickly!
        </p>
    `)
}