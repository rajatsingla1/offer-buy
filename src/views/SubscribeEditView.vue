<template>
    <div class="max-w-2xl">
        <h2 class="text-2xl font-semibold text-ink mb-2">Edit Subscription</h2>
        <p class="text-slate-600 mb-8">
            Update your email alert preferences and product selections.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email (uneditable) -->
            <div>
                <label for="email" class="block text-slate-700 mb-2">
                    Email Address
                </label>
                <input 
                    id="email" 
                    :value="formData.email" 
                    type="email" 
                    disabled
                    class="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed" 
                />
            </div>

            <!-- Email alert settings -->
            <div class="space-y-4">
                <h3 class="text-ink">Email alert settings</h3>

                <div class="flex items-center gap-4">
                    <label for="instant-email"
                        class="text-sm text-slate-700 cursor-pointer whitespace-nowrap min-w-[350px]">
                        Receive instant email when new or changed offer:
                    </label>
                    <input 
                        id="instant-email" 
                        v-model="formData.receiveInstantEmail" 
                        type="checkbox"
                        class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" 
                    />
                </div>

                <div class="flex items-center gap-4">
                    <label class="text-sm text-slate-700 whitespace-nowrap min-w-[350px]">
                        Receive email of all offers:
                    </label>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <input 
                                id="frequency-daily" 
                                v-model="formData.emailFrequency" 
                                type="radio" 
                                value="daily"
                                class="h-4 w-4 text-primary border-slate-300 focus:ring-primary" 
                            />
                            <label for="frequency-daily" class="text-sm text-slate-700 cursor-pointer">
                                Daily
                            </label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input 
                                id="frequency-weekly" 
                                v-model="formData.emailFrequency" 
                                type="radio" 
                                value="weekly"
                                class="h-4 w-4 text-primary border-slate-300 focus:ring-primary" 
                            />
                            <label for="frequency-weekly" class="text-sm text-slate-700 cursor-pointer">
                                Weekly
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Unsubscribe all emails button -->
            <div>
                <Button 
                    type="button" 
                    label="Unsubscribe All Emails" 
                    severity="secondary"
                    outlined
                    @click="handleUnsubscribeAll"
                    class="w-80"
                />
            </div>

            <!-- Product Selection Section -->
            <div class="space-y-4 pt-6 border-t border-slate-200">
                <h3 class="text-ink">Product Selection</h3>
                <p class="text-sm text-slate-600 mb-4">
                    Select which products to include in your email alerts.
                </p>

                <section class="card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-primary-100">
                            <thead class="table-header">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left">Project ID</th>
                                    <th scope="col" class="px-6 py-3 text-left">Vintage</th>
                                    <th scope="col" class="px-6 py-3 text-left">No Credits</th>
                                    <th scope="col" class="px-6 py-3 text-left">Include in email:</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-primary-50 bg-white">
                                <tr v-for="product in products" :key="product.id" class="hover:bg-primary-50/40">
                                    <td class="table-cell">
                                        <div class="text-sm font-semibold text-ink">
                                            {{ product.projectId }}
                                        </div>
                                    </td>
                                    <td class="table-cell">{{ product.vintage }}</td>
                                    <td class="table-cell">
                                        {{ product.noCredits.toLocaleString() }}
                                    </td>
                                    <td class="table-cell">
                                        <input 
                                            type="checkbox" 
                                            :checked="product.includeInEmail"
                                            @change="toggleProduct(product.id)"
                                            class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <!-- Submit button -->
            <div class="pt-4">
                <Button class="w-80" type="submit" label="Save Changes" />
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSubscribedUserStore } from '../stores/subscribedUser.ts'
import Button from "primevue/button"
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const subscribedUserStore = useSubscribedUserStore()
const toast = useToast()

// Mock product data - replace with actual API call
const products = ref([
    { id: '1', projectId: 'ABC', vintage: '2022', noCredits: 1000, includeInEmail: true },
    { id: '2', projectId: 'CCC', vintage: '2019', noCredits: 5000, includeInEmail: true },
    { id: '3', projectId: 'DEFG', vintage: '2023', noCredits: 12500, includeInEmail: true },
])

const formData = ref({
    email: '',
    receiveInstantEmail: false,
    emailFrequency: 'daily' as 'daily' | 'weekly'
})

const toggleProduct = (productId: string) => {
    const product = products.value.find(p => p.id === productId)
    if (product) {
        product.includeInEmail = !product.includeInEmail
    }
}

const loadUserData = async () => {
    const uuid = route.params.uuid as string
    if (uuid) {
        await subscribedUserStore.getSubscribedUser(uuid)
        const user = subscribedUserStore.subscribedUser as any
        if (user) {
            formData.value.email = user.email || ''
            formData.value.receiveInstantEmail = user.instant_updates || false
            formData.value.emailFrequency = (user.schedule_preference || 'daily') as 'daily' | 'weekly'
            
            // Load product selection from blacklisted_project_ids
            // This is a simplified version - adjust based on your actual data structure
            if (user.blacklisted_project_ids) {
                products.value.forEach(product => {
                    product.includeInEmail = !user.blacklisted_project_ids[product.projectId]
                })
            }
        }
    }
}

const handleSubmit = async () => {
    const uuid = route.params.uuid as string
    if (!uuid) return

    // Build blacklisted_project_ids object
    const blacklistedProjectIds: Record<string, boolean> = {}
    products.value.forEach(product => {
        blacklistedProjectIds[product.projectId] = !product.includeInEmail
    })

    const response = await subscribedUserStore.updateSubscribedUser(uuid, {
        instantUpdates: formData.value.receiveInstantEmail,
        schedulePreference: formData.value.emailFrequency,
        blacklistedProjectIds,
    })

    if (response) {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Subscription updated successfully',
            life: 3000
        })
    }
}

const handleUnsubscribeAll = async () => {
    const uuid = route.params.uuid as string
    if (!uuid) return

    const response = await subscribedUserStore.updateSubscribedUser(uuid, {
        active: false,
    })

    if (response) {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Unsubscribed from all emails',
            life: 3000
        })
    }
}

onMounted(() => {
    loadUserData()
})
</script>
