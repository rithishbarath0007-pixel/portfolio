import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const getDatabaseUrl = () => {
  return process.env.DATABASE_URL ?? process.env.DIRECT_URL
}

const prismaClientSingleton = () => {
  const databaseUrl = getDatabaseUrl()
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL or DIRECT_URL is required to initialize PrismaClient')
  }

  // 1. Create a native Postgres connection pool
  const pool = new Pool({ connectionString: databaseUrl })
  
  // 2. Feed the pool into the Prisma adapter
  const adapter = new PrismaPg(pool)

  // 3. Satisfy the new Prisma requirement by passing the adapter
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma