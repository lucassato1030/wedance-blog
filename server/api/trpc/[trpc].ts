import { initTRPC } from '@trpc/server'
import { createNuxtApiHandler } from 'trpc-nuxt'
import { dbRouter } from './db.js'
import { userRouter } from './user.js'
import { prisma } from '~/server/utils/prisma.js'

export interface Context {
  prisma: typeof prisma
}

const t = initTRPC.context<Context>().create()

export const appRouter = t.router({
  db: dbRouter,
  user: userRouter
})

export type AppRouter = typeof appRouter

// Export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({
    prisma
  }),
  onError({ error, path }) {
    console.error(`Error in tRPC handler for ${path}:`, error)
  }
}) 