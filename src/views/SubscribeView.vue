<template>
    <div class="max-w-2xl">
        <h2 class="text-2xl font-semibold text-ink mb-2">Subscribe</h2>
        <p class="text-slate-600 mb-8">
            Subscribe to receive email alerts for new credit offers.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
                <label for="email" class="block   text-slate-700 mb-2">
                    Email Address
                </label>
                <input id="email" v-model="formData.email" type="email" placeholder="your.email@example.com" required
                    class="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>


            <div class="space-y-4">
                <h3 class="  text-ink">Email alert settings</h3>

                <div class="flex items-center gap-4">
                    <label for="instant-email"
                        class="text-sm text-slate-700 cursor-pointer whitespace-nowrap min-w-[350px]">
                        Receive instant email when new or changed offer:
                    </label>
                    <input id="instant-email" v-model="formData.receiveInstantEmail" type="checkbox"
                        class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                </div>

                <div class="flex items-center gap-4">
                    <label class="text-sm text-slate-700 whitespace-nowrap min-w-[350px]">
                        Receive email of all offers:
                    </label>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <input id="frequency-daily" v-model="formData.emailFrequency" type="radio" value="daily"
                                class="h-4 w-4 text-primary border-slate-300 focus:ring-primary" />
                            <label for="frequency-daily" class="text-sm text-slate-700 cursor-pointer">
                                Daily
                            </label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input id="frequency-weekly" v-model="formData.emailFrequency" type="radio" value="weekly"
                                class="h-4 w-4 text-primary border-slate-300 focus:ring-primary" />
                            <label for="frequency-weekly" class="text-sm text-slate-700 cursor-pointer">
                                Weekly
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <label for="auto-subscribe-new" class="text-sm text-slate-700 cursor-pointer whitespace-nowrap min-w-[350px]">
                        Automatically subscribe to new offers:
                    </label>
                    <input id="auto-subscribe-new" v-model="formData.autoSubscribeNewOffers" type="checkbox"
                        class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                </div>
            </div>

            <!-- Projects section -->
            <div class="space-y-4 pt-6 border-t border-slate-200">
                <h3 class="text-ink">Projects to include</h3>
                <p class="text-sm text-slate-600 mb-4">
                    Choose which projects to include in your email alerts. When “All projects” is checked, every available project is included regardless of individual selection.
                </p>

                <section class="card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-primary-100">
                            <thead class="table-header">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left w-12">Include</th>
                                    <th scope="col" class="px-6 py-3 text-left">Project ID</th>
                                    <th scope="col" class="px-6 py-3 text-left">Vintage</th>
                                    <th scope="col" class="px-6 py-3 text-left">No Credits</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-primary-50 bg-white">
                                <tr class="bg-primary-50/30 hover:bg-primary-50/50">
                                    <td class="table-cell">
                                        <input id="projects-all" type="checkbox" :checked="allProjectsChecked"
                                            @change="toggleAllProjects"
                                            class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                                    </td>
                                    <td class="table-cell" colspan="3">
                                        <label for="projects-all" class="text-sm font-medium text-ink cursor-pointer">
                                            All projects
                                        </label>
                                    </td>
                                </tr>
                                <tr v-for="product in products" :key="product.projectId" class="hover:bg-primary-50/40">
                                    <td class="table-cell">
                                        <input type="checkbox" :checked="selectedProjectIds.has(product.projectId)"
                                            :disabled="allProjectsChecked"
                                            @change="toggleProject(product.projectId)"
                                            class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary disabled:opacity-50" />
                                    </td>
                                    <td class="table-cell">
                                        <div class="text-sm font-semibold text-ink">{{ product.projectId }}</div>
                                    </td>
                                    <td class="table-cell">{{ product.vintage }}</td>
                                    <td class="table-cell">{{ product.noCredits.toLocaleString() }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <Button class="w-80" type="submit" label="Subscribe" />
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSubscribedUserStore } from '../stores/subscribedUser.ts'
import { useOffersStore } from '../stores/offers.ts'
import Button from "primevue/button"
import { useToast } from 'primevue/usetoast'

const subscribedUserStore = useSubscribedUserStore()
const offersStore = useOffersStore()
const toast = useToast()

const formData = ref({
    email: '',
    receiveInstantEmail: false,
    emailFrequency: 'daily' as 'daily' | 'weekly',
    autoSubscribeNewOffers: true,
})

const allProjectsChecked = ref(true)
const selectedProjectIds = ref<Set<string>>(new Set())

const products = computed(() => {
    const projects: { projectId: string; vintage: string; noCredits: number }[] = []
    offersStore.offers.forEach((offer: any) => {
        const project = projects.find((p) => p.projectId === offer.projectId)
        if (project) {
            project.noCredits += offer.creditsToOffer ?? 0
        } else {
            projects.push({
                projectId: offer.projectId,
                vintage: offer.vintage ?? '',
                noCredits: offer.creditsToOffer ?? 0,
            })
        }
    })
    return projects
})

const toggleAllProjects = () => {
    allProjectsChecked.value = !allProjectsChecked.value
}

const toggleProject = (projectId: string) => {
    if (allProjectsChecked.value) return
    const next = new Set(selectedProjectIds.value)
    if (next.has(projectId)) next.delete(projectId)
    else next.add(projectId)
    selectedProjectIds.value = next
}

const resetForm = () => {
    formData.value.email = ''
    formData.value.receiveInstantEmail = false
    formData.value.emailFrequency = 'daily'
    formData.value.autoSubscribeNewOffers = true
    allProjectsChecked.value = true
    selectedProjectIds.value = new Set()
}

const handleSubmit = async () => {
    const subscribedProjectIds = allProjectsChecked.value
        ? products.value.map((p) => p.projectId)
        : Array.from(selectedProjectIds.value)

    const response = await subscribedUserStore.createSubscribedUser({
        email: formData.value.email,
        instantUpdates: formData.value.receiveInstantEmail,
        schedulePreference: formData.value.emailFrequency,
        subscribedProjectIds,
        autoSubscribeNewOffers: formData.value.autoSubscribeNewOffers,
    })

    if (response) {
        resetForm()
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Subscription created successfully',
            life: 3000,
        })
    }
}

onMounted(() => {
    offersStore.fetchOffers()
})
</script>