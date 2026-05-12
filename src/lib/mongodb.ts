import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
    clientPromise = Promise.reject(new Error('MONGODB_URI is not configured'))
} else if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
    if (!uri) {
        throw new Error('MONGODB_URI is not configured')
    }
    const client = await clientPromise
    return client.db('med-construction')
}