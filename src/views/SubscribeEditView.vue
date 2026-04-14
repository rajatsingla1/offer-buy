<template>
    <div class="max-w-2xl mb-40">
        <h2 class="text-2xl font-semibold text-ink mb-2">Edit Subscription</h2>
        <p class="text-slate-600 mb-8">
            Update your email alert preferences and product selections.
        </p>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center min-h-[240px]">
            <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
        </div>

        <!-- Show resubscribe button if inactive -->
        <div v-else-if="!isActive" class="space-y-6">
            <div>
                <label for="email" class="block text-slate-700 mb-2">
                    Email Address
                </label>
                <input id="email" :value="formData.email" type="email" disabled
                    class="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed" />
            </div>
            <div>
                <p class="text-slate-600 mb-4">
                    You are currently unsubscribed from email alerts.
                </p>
                <Button type="button" label="Subscribe to Emails" @click="handleSubscribe" :loading="subscribing"
                    class="w-80" />
            </div>
        </div>

        <!-- Show full form if active -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email (uneditable) -->
            <div>
                <label for="email" class="block text-slate-700 mb-2">
                    Email Address
                </label>
                <input id="email" :value="formData.email" type="email" disabled
                    class="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed" />
            </div>

            <!-- Email alert settings -->
            <div class="space-y-4">
                <h3 class="text-ink">Email alert settings</h3>

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
                    <label for="auto-subscribe-new-edit"
                        class="text-sm text-slate-700 cursor-pointer whitespace-nowrap min-w-[350px]">
                        Automatically subscribe to new offers:
                    </label>
                    <input id="auto-subscribe-new-edit" v-model="formData.autoSubscribeNewOffers" type="checkbox"
                        class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                </div>
            </div>

            <!-- Tabs -->
            <div class="space-y-4 pt-6 border-t border-slate-200">
                <h3 class="text-ink">Projects to include</h3>
                <p class="text-sm text-slate-600 mb-4">
                    Choose which projects to include in your email alerts. When "All projects" is checked, every
                    available project is included regardless of individual selection.
                </p>

                <!-- Spot Credits -->
                <div class="space-y-3">
                    <h4 class="text-sm font-semibold text-ink">Spot credits</h4>
                    <div class="flex flex-wrap items-center gap-3">
                        <button type="button" class="button-outline text-sm" @click="filterDialogVisible = true">
                            Amend the list of projects you receive emails about
                        </button>
                        <template v-if="hasActiveFilters">
                            <span class="text-sm text-slate-600">{{ products.length }} projects</span>
                            <button type="button"
                                class="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
                                @click="resetFilters">
                                Reset
                            </button>
                        </template>
                    </div>

                    <section class="card overflow-hidden">
                        <div class="overflow-x-auto max-h-[300px] overflow-y-auto">
                            <table class="min-w-full divide-y divide-primary-100">
                                <thead class="table-header sticky top-0 z-1">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left w-12">Include</th>
                                        <th scope="col" class="px-6 py-3 text-left">Project ID</th>
                                        <th scope="col" class="px-6 py-3 text-left">Vintage</th>
                                        <th scope="col" class="px-6 py-3 text-left">No Credits</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-primary-50 bg-white">
                                    <tr v-if="!hasActiveFilters" class="bg-primary-50/30 hover:bg-primary-50/50">
                                        <td class="table-cell">
                                            <input id="projects-all-edit" type="checkbox" :checked="allProjectsChecked"
                                                @change="toggleAllProjects"
                                                class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                                        </td>
                                        <td class="table-cell" colspan="3">
                                            <label for="projects-all-edit"
                                                class="text-sm font-medium text-ink cursor-pointer">
                                                All projects
                                            </label>
                                        </td>
                                    </tr>
                                    <tr v-for="product in products" :key="product.projectId"
                                        class="hover:bg-primary-50/40">
                                        <td class="table-cell">
                                            <input type="checkbox"
                                                :checked="selectedProjectIds.has(product.projectId)"
                                                :disabled="allProjectsChecked && !hasActiveFilters"
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

                <!-- Forward Credits -->
                <div class="space-y-3">
                    <h4 class="text-sm font-semibold text-ink">Forward credits</h4>
                    <div class="flex flex-wrap items-center gap-3">
                        <button type="button" class="button-outline text-sm"
                            @click="forwardFilterDialogVisible = true">
                            Amend the list of forward credits you receive emails about
                        </button>
                        <template v-if="hasActiveForwardFiltersComputed">
                            <span class="text-sm text-slate-600">{{ forwardOffersList.length }} forward credits</span>
                            <button type="button"
                                class="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
                                @click="resetForwardFilters">
                                Reset
                            </button>
                        </template>
                    </div>
                    <section class="card overflow-hidden">
                        <div class="overflow-x-auto max-h-[300px] overflow-y-auto">
                            <table class="min-w-full divide-y divide-primary-100">
                                <thead class="table-header sticky top-0 z-1">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left w-12">Include</th>
                                        <th scope="col" class="px-6 py-3 text-left">Project Name</th>
                                        <th scope="col" class="px-6 py-3 text-left">Vintages</th>
                                        <th scope="col" class="px-6 py-3 text-left">Country</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-primary-50 bg-white">
                                    <tr class="bg-primary-50/30 hover:bg-primary-50/50">
                                        <td class="table-cell">
                                            <input id="forward-all-edit" type="checkbox" :checked="allForwardChecked"
                                                @change="toggleAllForward"
                                                class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" />
                                        </td>
                                        <td class="table-cell" colspan="3">
                                            <label for="forward-all-edit"
                                                class="text-sm font-medium text-ink cursor-pointer">
                                                All forward credits
                                            </label>
                                        </td>
                                    </tr>
                                    <tr v-for="fo in forwardOffersList" :key="fo.id" class="hover:bg-primary-50/40">
                                        <td class="table-cell">
                                            <input type="checkbox" :checked="selectedForwardIds.has(fo.id)"
                                                :disabled="allForwardChecked" @change="toggleForwardOffer(fo.id)"
                                                class="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary disabled:opacity-50" />
                                        </td>
                                        <td class="table-cell">
                                            <div class="text-sm font-semibold text-ink">{{ fo.projectName }}</div>
                                        </td>
                                        <td class="table-cell">{{ fo.vintages }}</td>
                                        <td class="table-cell">{{ fo.country }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Submit button -->
            <div class="pt-4">
                <Button class="w-80" type="submit" label="Save Changes" :loading="saving" />
            </div>

            <!-- Unsubscribe all emails button -->
            <div class="pt-4">
                <Button type="button" label="Unsubscribe All Emails" severity="secondary" outlined
                    @click="handleUnsubscribeAll" :loading="unsubscribing" class="w-80" />
            </div>
        </form>

        <OffersFilterDialog v-model:visible="filterDialogVisible" v-model:criteria="filterCriteria" :offers="offers"
            @applied="onFiltersApplied" />

        <ForwardOffersFilterDialog v-model:visible="forwardFilterDialogVisible"
            v-model:criteria="forwardFilterCriteria" :offers="forwardOffers ?? []"
            @applied="onForwardFiltersApplied" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSubscribedUserStore } from '../stores/subscribedUser.ts'
import Button from "primevue/button"
import ProgressSpinner from "primevue/progressspinner"
import { useToast } from 'primevue/usetoast'
import { useOffersStore } from '../stores/offers.ts'
import OffersFilterDialog from '../components/OffersFilterDialog.vue'
import ForwardOffersFilterDialog from '../components/ForwardOffersFilterDialog.vue'
import { defaultCriteria, filterOffers, hasActiveFilters as checkHasActiveFilters } from '../composables/offersFilter.js'
import { defaultForwardCriteria, filterForwardOffers, hasActiveForwardFilters } from '../composables/forwardOffersFilter.js'

const route = useRoute()
const subscribedUserStore = useSubscribedUserStore()
const toast = useToast()
const offersStore = useOffersStore()
const { offers, forwardOffers } = storeToRefs(offersStore)

const filterDialogVisible = ref(false)
const filterCriteria = ref(defaultCriteria())
const forwardFilterDialogVisible = ref(false)
const forwardFilterCriteria = ref(defaultForwardCriteria())

const filteredOffers = computed(() => filterOffers(offers.value ?? [], filterCriteria.value))
const hasActiveFilters = computed(() => checkHasActiveFilters(filterCriteria.value))
const filteredForwardOffers = computed(() => filterForwardOffers(forwardOffers.value ?? [], forwardFilterCriteria.value))
const hasActiveForwardFiltersComputed = computed(() => hasActiveForwardFilters(forwardFilterCriteria.value))

const products = computed(() => {
    const projects: { projectId: string; vintage: string; noCredits: number }[] = []
    const offerList = filteredOffers.value
    offerList.forEach((offer: any) => {
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

function onFiltersApplied() {
    allProjectsChecked.value = false
    selectedProjectIds.value = new Set(products.value.map((p) => p.projectId))
    toast.add({ severity: 'success', summary: 'View updated', life: 3000 })
}

function resetFilters() {
    filterCriteria.value = defaultCriteria()
}

function onForwardFiltersApplied() {
    allForwardChecked.value = false
    selectedForwardIds.value = new Set(forwardOffersList.value.map((fo) => fo.id))
    toast.add({ severity: 'success', summary: 'View updated', life: 3000 })
}

function resetForwardFilters() {
    forwardFilterCriteria.value = defaultForwardCriteria()
}

const isActive = ref(true)
const loading = ref(true)
const saving = ref(false)
const unsubscribing = ref(false)
const subscribing = ref(false)

const formData = ref({
    email: '',
    receiveInstantEmail: false,
    emailFrequency: 'daily' as 'daily' | 'weekly',
    autoSubscribeNewOffers: true,
})

const allProjectsChecked = ref(true)
const selectedProjectIds = ref<Set<string>>(new Set())

// Forward credits state
const allForwardChecked = ref(true)
const selectedForwardIds = ref<Set<string>>(new Set())

const forwardOffersList = computed(() => {
    const list = filteredForwardOffers.value ?? []
    return list.map((fo: any) => ({
        id: fo.id,
        projectName: fo.projectName || '',
        vintages: fo.vintages || '',
        country: fo.country || '',
    }))
})

watch(forwardOffersList, (list) => {
    if (allForwardChecked.value) {
        selectedForwardIds.value = new Set(list.map((fo) => fo.id))
    }
}, { immediate: true })

function toggleAllForward() {
    allForwardChecked.value = !allForwardChecked.value
    if (allForwardChecked.value) {
        selectedForwardIds.value = new Set(forwardOffersList.value.map((fo) => fo.id))
    }
}

function toggleForwardOffer(id: string) {
    if (allForwardChecked.value) return
    const next = new Set(selectedForwardIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selectedForwardIds.value = next
}

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

const loadUserData = async () => {
    const uuid = route.params.uuid as string
    loading.value = true
    try {
        if (uuid) {
            await offersStore.fetchOffers();
            await offersStore.fetchForwardOffers();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await subscribedUserStore.getSubscribedUser(uuid);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const user = subscribedUserStore.subscribedUser as any
            if (user) {
                formData.value.email = user.email || ''
                isActive.value = user.active !== false
                formData.value.receiveInstantEmail = user.instant_updates || false
                formData.value.emailFrequency = (user.schedule_preference || 'daily') as 'daily' | 'weekly'
                formData.value.autoSubscribeNewOffers = user.subscribe_new_projects !== false

                const subscribedIds = user.subscribed_project_ids
                const idsList = Array.isArray(subscribedIds) ? subscribedIds : []
                const allIds = new Set(products.value.map((p) => p.projectId))
                const subscribedSet = new Set(idsList)
                const hasAll = allIds.size > 0 && allIds.size === subscribedSet.size && [...allIds].every((id) => subscribedSet.has(id))
                allProjectsChecked.value = hasAll
                selectedProjectIds.value = subscribedSet

                // Restore forward credit selections
                const subForwardIds = user.subscribed_forward_credit_ids
                const subForwardList = Array.isArray(subForwardIds) ? subForwardIds : []

                if (subForwardList.length > 0) {
                    const allFwdIds = new Set(forwardOffersList.value.map((fo) => fo.id))
                    const subFwdSet = new Set(subForwardList)
                    const hasAllFwd = allFwdIds.size > 0 && allFwdIds.size === subFwdSet.size && [...allFwdIds].every((id) => subFwdSet.has(id))
                    allForwardChecked.value = hasAllFwd
                    selectedForwardIds.value = subFwdSet
                } else {
                    allForwardChecked.value = false
                    selectedForwardIds.value = new Set()
                }
            }
        }
    } finally {
        loading.value = false
    }
}

const handleSubmit = async () => {
    const uuid = route.params.uuid as string
    if (!uuid) return

    saving.value = true
    try {
        const allProductIds = products.value.map((p) => p.projectId)
        const subscribedProjectIds = (allProjectsChecked.value && !hasActiveFilters.value)
            ? allProductIds
            : Array.from(selectedProjectIds.value)

        const allOfferProjectIds = [...new Set((offers.value ?? []).map((o: any) => o.projectId))]
        const subscribedSet = new Set(subscribedProjectIds)
        const unsubscribedProjectIds = allOfferProjectIds.filter((id) => !subscribedSet.has(id))

        const allForwardIds = (forwardOffers.value ?? []).map((fo: any) => fo.id)
        const subscribedForwardCreditIds = allForwardChecked.value && !hasActiveForwardFiltersComputed.value
            ? allForwardIds
            : Array.from(selectedForwardIds.value)
        const forwardSubSet = new Set(subscribedForwardCreditIds)
        const unsubscribedForwardCreditIds = allForwardIds.filter((id: string) => !forwardSubSet.has(id))

        const response = await subscribedUserStore.updateSubscribedUser(uuid, {
            instantUpdates: formData.value.receiveInstantEmail,
            schedulePreference: formData.value.emailFrequency,
            subscribedProjectIds,
            autoSubscribeNewOffers: formData.value.autoSubscribeNewOffers,
            unsubscribedProjectIds,
            subscribedForwardCreditIds,
            unsubscribedForwardCreditIds,
        })

        if (response) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Subscription updated successfully',
                life: 3000
            })
        }
    } finally {
        saving.value = false
    }
}

const handleUnsubscribeAll = async () => {
    const uuid = route.params.uuid as string
    if (!uuid) return

    unsubscribing.value = true
    try {
        const response = await subscribedUserStore.updateSubscribedUser(uuid, {
            active: false,
        })

        if (response) {
            isActive.value = false
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Unsubscribed from all emails',
                life: 3000
            })
        }
    } finally {
        unsubscribing.value = false
    }
}

const handleSubscribe = async () => {
    const uuid = route.params.uuid as string
    if (!uuid) return

    subscribing.value = true
    try {
        const response = await subscribedUserStore.updateSubscribedUser(uuid, {
            active: true,
        })

        if (response) {
            isActive.value = true
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Subscribed to emails successfully',
                life: 3000
            })
        }
    } finally {
        subscribing.value = false
    }
}

onMounted(() => {
    loadUserData()
})
</script>
