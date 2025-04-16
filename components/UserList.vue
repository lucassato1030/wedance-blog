<template>
  <div class="flex flex-col h-full">
    <div class="flex-none">
      <h2 class="text-2xl font-bold tracking-tight">Total Users</h2>
    </div>
    
    <div class="flex-1 overflow-y-auto min-h-0 max-h-[400px]">
      <div v-if="isLoading" class="flex items-center justify-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      
      <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded-md">
        Error loading users: {{ error.message }}
      </div>
      
      <div v-else>
        <div v-if="users && users.length === 0" class="p-4 text-gray-500 text-center">
          No users found
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="user in users" :key="user.id" 
               class="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <h3 class="font-medium">{{ user.name }}</h3>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex-none mt-6">
      <div class="space-y-4">
        <h3 class="text-xl font-bold tracking-tight">Add User</h3>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Name
            </label>
            <input 
              v-model="newUser.name" 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter name" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <input 
              v-model="newUser.email" 
              type="email"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter email"
            />
          </div>
          
          <button 
            @click="createUser" 
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            :disabled="isCreating"
          >
            {{ isCreating ? 'Creating...' : 'Create User' }}
          </button>
        </div>
        
        <p v-if="createError" class="text-sm text-red-500">
          {{ createError.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// User state
const users = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<Error | null>(null);

// Form state
const newUser = ref({
  name: '',
  email: '',
});
const isCreating = ref(false);
const createError = ref<Error | null>(null);

const { $trpc } = useNuxtApp();

// Load all users
const loadUsers = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const result = await $trpc.user.getAll.query();
    users.value = result;
  } catch (err) {
    console.error('Error loading users:', err);
    error.value = err as Error;
  } finally {
    isLoading.value = false;
  }
};

// Create a new user
const createUser = async () => {
  if (!newUser.value.name || !newUser.value.email) return;
  
  try {
    isCreating.value = true;
    createError.value = null;
    
    await $trpc.user.create.mutate({ 
      name: newUser.value.name,
      email: newUser.value.email
    });
    
    // Refresh the user list
    await loadUsers();
    
    // Clear the input
    newUser.value = {
      name: '',
      email: ''
    };
  } catch (err) {
    createError.value = err as Error;
  } finally {
    isCreating.value = false;
  }
};

// Load users when component is mounted
onMounted(() => {
  loadUsers();
});
</script> 