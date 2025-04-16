import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { Context } from './[trpc].js'

const t = initTRPC.context<Context>().create()

export const userRouter = t.router({
  getAll: t.procedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.prisma.user.findMany({
        include: {
          posts: true
        }
      })
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }),

  create: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            name: input.name
          }
        })
        return user
      } catch (error) {
        console.error('Error creating user:', error)
        throw new Error('Failed to create user')
      }
    }),

  delete: t.procedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // First check if user has any posts
        const user = await ctx.prisma.user.findUnique({
          where: { id: input.id },
          include: { posts: true }
        })

        if (user?.posts.length) {
          throw new Error('Cannot delete user with existing posts')
        }

        await ctx.prisma.user.delete({
          where: { id: input.id }
        })

        return { success: true }
      } catch (error) {
        console.error('Error deleting user:', error)
        throw error instanceof Error ? error : new Error('Failed to delete user')
      }
    })
}) 