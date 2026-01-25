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
            </div>
            <Button class="w-80" type="submit" label="Subscribe" />
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSubscribedUserStore } from '../stores/subscribedUser.ts'
import Button from "primevue/button"
const subscribedUserStore = useSubscribedUserStore()
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const formData = ref({
    email: '',
    receiveInstantEmail: false,
    emailFrequency: 'daily' as 'daily' | 'weekly'
})

const handleSubmit = () => {
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Subscription created successfully',
        life: 3000
    });
    // subscribedUserStore.createSubscribedUser({
    //     email: formData.value.email,
    //     instantUpdates: formData.value.receiveInstantEmail,
    //     schedulePreference: formData.value.emailFrequency
    // })
    // TODO: Implement actual subscription logic
}
</script>