import { initTRPC } from '@trpc/server'
import type { Context } from './[trpc]'

const t = initTRPC.context<Context>().create()

export const dbRouter = t.router({
  test: t.procedure.query(async ({ ctx }) => {
    try {
      // Test the database connection
      await ctx.prisma.$queryRaw`SELECT 1`
      
      return {
        status: 'success' as const,
        message: 'Database connection successful'
      }
    } catch (error) {
      console.error('Database connection error:', error)
      return {
        status: 'error' as const,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })
}) 