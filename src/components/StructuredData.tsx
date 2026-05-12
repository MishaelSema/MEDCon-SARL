'use client'

import { useEffect } from 'react'

export default function StructuredData() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'MEDCon SARL',
      description: 'Professional construction, renovation, and real estate services in Yaoundé, Cameroon.',
      url: 'https://medconstruction-cm.com',
      telephone: '+237671911489',
      email: 'medconsarl@gmail.com',
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
      image: 'https://medconstruction-cm.com/og-image.png',
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
