'use client'

import { useEffect } from 'react'

export default function StructuredData() {
  useEffect(() => {
    const SITE_URL = 'https://medconsarl.com'
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'MEDCon SARL',
      description: 'Professional construction, renovation, and real estate services in Yaoundé, Cameroon.',
      url: SITE_URL,
      telephone: '+237671911489',
      email: 'support@medconsarl.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Yaoundé',
        addressCountry: 'CM',
      },
      geo: {
        '@type': 'GeoCoordinates',
        addressCountry: 'Cameroon',
      },
      openingHours: 'Mo-Fr 08:00-18:00',
      priceRange: '$$',
      image: `${SITE_URL}/og-image.png`,
      sameAs: [
        'https://www.facebook.com/MEDCon01',
      ],
      serviceType: [
        'Construction Services',
        'Renovation',
        'Interior Design',
        'Real Estate Management',
        'General Merchandise',
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
