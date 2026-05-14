'use client'

import { useEffect } from 'react'

export default function StructuredData() {
  useEffect(() => {
    const SITE_URL = 'https://medconsarl.com'
    const PHONE = '+237671911489'
    const EMAIL = 'support@medconsarl.com'
    
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        // Organization Schema
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'MEDCon SARL',
          description: 'Premier construction company in Cameroon offering professional building, renovation, interior design, and real estate services.',
          url: SITE_URL,
          logo: `${SITE_URL}/og-image.png`,
          image: `${SITE_URL}/og-image.png`,
          email: EMAIL,
          telephone: PHONE,
          foundingDate: '2019',
          foundingLocation: 'Yaoundé, Cameroon',
          numberOfEmployees: '11-50',
          knowsAbout: [
            'Construction Management',
            'Building Construction',
            'Renovation',
            'Interior Design',
            'Real Estate Development',
            'Project Management',
            'Civil Engineering',
          ],
          areaServed: {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: 3.8480,
              longitude: 11.5021,
            },
            geoRadius: '50000',
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: PHONE,
              email: EMAIL,
              contactType: 'customer service',
              availableLanguage: ['English', 'French'],
              hoursAvailable: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '08:00',
                closes: '18:00',
              },
            },
          ],
          sameAs: [
            'https://www.facebook.com/MEDCon01',
            'https://www.instagram.com/MEDConSARL',
            'https://www.linkedin.com/company/MEDConSARL',
          ],
        },
        // WebSite Schema with SearchAction
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'MEDCon SARL | Premier Construction Company in Cameroon',
          description: 'Expert construction, renovation, interior design and real estate services in Yaoundé and across Cameroon.',
          publisher: { '@id': `${SITE_URL}/#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
            name: 'Search',
          },
          inLanguage: ['en-US', 'fr-CM'],
        },
        // LocalBusiness Schema (Primary)
        {
          '@type': 'LocalBusiness',
          '@id': `${SITE_URL}/#localbusiness`,
          name: 'MEDCon SARL',
          description: 'Professional construction, renovation, interior design, and real estate services in Yaoundé, Cameroon.',
          url: SITE_URL,
          image: `${SITE_URL}/og-image.png`,
          priceRange: '$$',
          telephone: PHONE,
          email: EMAIL,
          address: {
            '@type': 'PostalAddress',
            '@id': `${SITE_URL}/#address`,
            streetAddress: 'Yaoundé',
            addressLocality: 'Yaoundé',
            addressRegion: 'Centre Region',
            postalCode: '0000',
            addressCountry: {
              '@type': 'Country',
              name: 'CM',
            },
          },
          geo: {
            '@type': 'GeoCoordinates',
            '@id': `${SITE_URL}/#geo`,
            latitude: 3.8480,
            longitude: 11.5021,
          },
          geocoder: 'Google Maps',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '09:00',
              closes: '14:00',
            },
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Construction Services',
            itemListElement: [
              { '@type': 'Offer', name: 'Building Construction' },
              { '@type': 'Offer', name: 'Renovation' },
              { '@type': 'Offer', name: 'Interior Design' },
              { '@type': 'Offer', name: 'Real Estate' },
            ],
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '47',
            bestRating: '5',
          },
          makesOffer: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Building Construction',
                description: 'Professional residential and commercial construction services',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Renovation',
                description: 'Home and office renovation services',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Interior Design',
                description: 'Interior design and decoration services',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Real Estate',
                description: 'Real estate management and property services',
              },
            },
          ],
        },
        // FAQ Schema
        {
          '@type': 'FAQPage',
          '@id': `${SITE_URL}/#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How long does it take to build a house in Cameroon?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The construction timeline varies based on project size. A standard residential house typically takes 3-6 months, while larger projects may take 6-12 months. We provide detailed timelines during the quoting process.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you offer free construction estimates?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, we provide free initial consultations and estimates. Contact us to schedule a site visit and receive a detailed quote for your project.',
              },
            },
            {
              '@type': 'Question',
              name: 'What areas do you serve in Cameroon?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We serve clients across Cameroon, with primary operations in Yaoundé and Douala. We also handle projects in other regions upon request.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you provide warranties on your construction work?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, we provide warranties on all our construction work. Residential projects come with a 5-year structural warranty, and commercial projects have customized warranty terms.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can you help with obtaining building permits?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, we assist clients with the entire permit process including building permits, environmental assessments, and any other required documentation.',
              },
            },
          ],
        },
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    script.setAttribute('id', 'schema-org-data')
    document.head.appendChild(script)

    return () => {
      const existing = document.getElementById('schema-org-data')
      if (existing) existing.remove()
    }
  }, [])

  return null
}