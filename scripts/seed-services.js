import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL

const services = [
    {
        title: { en: 'Construction', fr: 'Construction' },
        description: { en: 'Full-service construction for residential and commercial projects. From foundation to finish, we build structures that stand the test of time.', fr: 'Construction clé en main pour projets résidentiels et commerciaux. De la fondation à la finition, nous bâtissons des structures durables.' },
        icon: 'HardHat',
        order: 1,
        showOnHome: true,
        status: 'active',
        createdAt: new Date()
    },
    {
        title: { en: 'Renovation', fr: 'Rénovation' },
        description: { en: 'Transform your existing space with our expert renovation services. We handle everything from minor updates to complete transformations.', fr: 'Transformez votre espace avec nos services de rénovation experts. Du simple rafraîchissement à la transformation complète.' },
        icon: 'Hammer',
        order: 2,
        showOnHome: true,
        status: 'active',
        createdAt: new Date()
    },
    {
        title: { en: 'Interior Design', fr: 'Design Intérieur' },
        description: { en: 'Create beautiful, functional spaces with our interior design services. We combine aesthetics with practicality to deliver stunning results.', fr: 'Créez des espaces magnifiques et fonctionnels avec nos services de design intérieur. Nous combinons esthétique et praticité.' },
        icon: 'Palette',
        order: 3,
        showOnHome: true,
        status: 'active',
        createdAt: new Date()
    },
    {
        title: { en: 'Real Estate', fr: 'Immobilier' },
        description: { en: 'Find your dream property or sell your current one. Our real estate services connect buyers with sellers across Cameroon.', fr: 'Trouvez la propriété de vos rêves ou vendez la vôtre. Nos services immobiliers connectent acheteurs et vendeurs au Cameroun.' },
        icon: 'Building',
        order: 4,
        showOnHome: true,
        status: 'active',
        createdAt: new Date()
    },
    {
        title: { en: 'General Merchandise', fr: 'Négoce Général' },
        description: { en: 'We supply quality construction materials and equipment. From cement to roofing, we have everything you need for your building project.', fr: 'Nous fournissons des matériaux et équipements de construction de qualité. Du ciment aux tuiles, nous avons tout pour votre projet.' },
        icon: 'Package',
        order: 5,
        showOnHome: true,
        status: 'active',
        createdAt: new Date()
    }
]

async function seedServices() {
    const client = new MongoClient(MONGODB_URI)
    
    try {
        await client.connect()
        const db = client.db()
        
        const existing = await db.collection('services').countDocuments()
        if (existing > 0) {
            console.log(`Found ${existing} existing services. Deleting...`)
            await db.collection('services').deleteMany({})
        }
        
        const result = await db.collection('services').insertMany(services)
        console.log(`Inserted ${result.insertedCount} services successfully!`)
        
        const inserted = await db.collection('services').find({}).sort({ order: 1 }).toArray()
        console.log('\nServices in database:')
        inserted.forEach(s => console.log(`  - ${s.title.en} (${s.title.fr})`))
        
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await client.close()
    }
}

seedServices()