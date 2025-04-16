import { useNuxtApp } from '#app'

/**
 * A composable for handling tRPC queries with automatic error handling and loading states
 */
export function useTrpcQuery<T>(
  path: string,
  input?: any
) {
  const { $trpc } = useNuxtApp()
  
  return $trpc[path].query(input)
} 