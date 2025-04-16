<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Nuxt, Tailwindcss, Vue.shadcn, Prisma, Supabase, tRPC App</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Database Connection Panel -->
          <div class="col-span-1 bg-white shadow rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-3">Supabase Status</h2>
            
            <div class="flex items-center gap-3 mb-4">
              <button 
                @click="testConnection" 
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-1.5"
                :disabled="dbLoading"
              >
                <span v-if="dbLoading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing...
                </span>
                <span v-else>Test</span>
              </button>
              
              <div v-if="connectionStatus" :class="`px-2 py-1 text-xs rounded-full ${connectionStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                {{ connectionStatus === 'success' ? 'Connected' : 'Failed' }}
              </div>
            </div>
            
            <div v-if="dbResult && dbResult.status === 'success'" class="text-green-600 text-xs">
              {{ dbResult.message }}
            </div>
            
            <div v-else-if="dbResult && dbResult.status === 'error'" class="text-red-600 text-xs">
              {{ dbResult.message }}
              <div class="mt-1">{{ dbResult.error }}</div>
            </div>
          </div>

          <!-- User Management Panel -->
          <div class="col-span-2 bg-white shadow rounded-lg p-6">
            <UserList />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from '~/components/UserList.vue'

const { $trpc } = useNuxtApp()

interface DbResult {
  status: 'success' | 'error';
  message: string;
  error?: string;
}

// Database connection test
const dbLoading = ref(false)
const dbResult = ref<DbResult | null>(null)
const connectionStatus = ref<'success' | 'error' | null>(null)

// Test database connection using tRPC
const testConnection = async () => {
  try {
    dbLoading.value = true
    connectionStatus.value = null
    dbResult.value = null
    
    const result = await $trpc.db.test.query()
    dbResult.value = result as DbResult
    connectionStatus.value = result.status
  } catch (error) {
    console.error('Error testing connection:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    dbResult.value = {
      status: 'error',
      message: 'Failed to connect to database',
      error: errorMessage
    }
    connectionStatus.value = 'error'
  } finally {
    dbLoading.value = false
  }
}

// Load initial data
onMounted(() => {
  testConnection()
})
</script>

<style>
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f9fafb;
}
</style>
