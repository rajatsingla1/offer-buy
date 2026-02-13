<script setup>
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import apiClient from "../utils/apiClient.ts";

const toast = useToast();
const structureOpen = ref(false);

const subscribeEmail = ref("");
const subscribeLoading = ref(false);
const subscribeError = ref("");

const emailValid = computed(() => {
  const e = subscribeEmail.value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
});

async function handleSubscribe() {
  subscribeError.value = "";
  const email = subscribeEmail.value.trim();
  if (!emailValid.value) {
    subscribeError.value = "Please enter a valid email address.";
    return;
  }
  subscribeLoading.value = true;
  try {
    await apiClient.root.post("offers/api/subscribe", { email });
    toast.add({
      severity: "success",
      summary: "Token sent",
      detail: "Email with token has been sent.",
      life: 5000,
    });
    subscribeEmail.value = "";
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Something went wrong. Please try again.";
    subscribeError.value = typeof msg === "string" ? msg : "Request failed.";
    toast.add({
      severity: "error",
      summary: "Subscription failed",
      detail: subscribeError.value,
      life: 5000,
    });
  } finally {
    subscribeLoading.value = false;
  }
}
</script>

<template>
  <div class="mt-10 grid gap-6">
    <div class="card p-8">
      <h2 class="text-2xl font-semibold text-ink">API</h2>
      <p class="mt-2 text-slate-600">
        GET endpoint for listing AlliedExchange.
      </p>

      <div class="mt-6 rounded-xl bg-slate-50 p-4 font-mono text-sm">
        <div class="flex items-center gap-2">
          <span
            class="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800"
            >GET</span
          >
          <a
            href="https://api.publicdomain.co.in/offers/api"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
          >
            https://api.publicdomain.co.in/offers/api
          </a>
        </div>
      </div>

      <h3 class="mt-10 text-lg font-semibold text-ink">Get an API token</h3>
      <p class="mt-1 text-sm text-slate-600">
        Enter your email to receive a token by email. We’ll send the endpoint
        and usage instructions.
      </p>
      <form class="mt-4 space-y-4" @submit.prevent="handleSubscribe">
        <div>
          <label for="api-subscribe-email" class="block text-slate-700 mb-2"
            >Email address</label
          >
          <input
            id="api-subscribe-email"
            v-model="subscribeEmail"
            type="email"
            placeholder="your.email@example.com"
            autocomplete="email"
            :disabled="subscribeLoading"
            class="w-full max-w-xs px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
            :class="subscribeError ? 'border-red-300' : 'border-slate-300'"
          />
          <p v-if="subscribeError" class="mt-1.5 text-sm text-red-600">
            {{ subscribeError }}
          </p>
        </div>
        <div>
          <button
            type="submit"
            :disabled="subscribeLoading || !subscribeEmail.trim()"
            class="button-primary text-sm"
          >
            <span
              v-if="subscribeLoading"
              class="inline-flex items-center gap-2"
            >
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending…
            </span>
            <span v-else>Send token</span>
          </button>
        </div>
      </form>

      <h3 class="mt-10 text-lg font-semibold text-ink">Using your token</h3>
      <p class="mt-1 text-sm text-slate-600">
        Send your token in the request header to authenticate.
      </p>
      <div class="mt-3 rounded-xl bg-slate-50 p-4 font-mono text-sm">
        <p class="text-slate-500">Header name:</p>
        <p class="mt-1 break-all text-ink">
          <code class="rounded bg-white px-1.5 py-0.5"
            >x-api-key-alliedexchange</code
          >
        </p>
        <p class="mt-3 text-slate-500">Header value:</p>
        <p class="mt-1 break-all text-ink">
          <code class="rounded bg-white px-1.5 py-0.5">your-token</code>
        </p>
      </div>

      <h3 class="mt-10 text-lg font-semibold text-ink">Response</h3>
      <p class="mt-1 text-sm text-slate-600">
        Returns a JSON array of offer objects.
      </p>
      <button
        type="button"
        class="mt-6 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-800 transition hover:bg-slate-100"
        @click="structureOpen = !structureOpen"
      >
        <span>Response structure</span>
        <svg
          class="h-5 w-5 shrink-0 transition-transform"
          :class="{ 'rotate-180': structureOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        v-show="structureOpen"
        class="mt-3 overflow-x-auto rounded-lg border border-slate-200 border-t-0 rounded-t-none"
      >
        <table class="min-w-full text-left text-sm">
          <thead class="table-header">
            <tr>
              <th class="px-4 py-3">Field</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="table-cell font-mono">serial</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">
                Offer serial identifier (e.g. VCS902-2020-1)
              </td>
            </tr>
            <tr>
              <td class="table-cell font-mono">status</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Offer status (e.g. pending)</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">orderId</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Order identifier</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">vintage</td>
              <td class="table-cell text-slate-600">number</td>
              <td class="table-cell">Vintage year of credits</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">createdAt</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">ISO 8601 creation timestamp</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">projectId</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Project ID (e.g. VCS902)</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">projectName</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Name of the carbon project</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">creditsToOffer</td>
              <td class="table-cell text-slate-600">number</td>
              <td class="table-cell">Number of credits offered</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">pricePerCredit</td>
              <td class="table-cell text-slate-600">number</td>
              <td class="table-cell">Price per credit</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">email</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Contact email for the offer</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">id</td>
              <td class="table-cell text-slate-600">null | number</td>
              <td class="table-cell">Internal ID (may be null)</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">project_uid</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Project unique identifier</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">countries</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Country or countries of the project</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">sectors</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Sector (e.g. Forestry and Land Use)</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">raters</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Rating agencies (comma-separated)</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">ccp</td>
              <td class="table-cell text-slate-600">boolean</td>
              <td class="table-cell">CCP flag</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">project_offset_type</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Offset type (e.g. Avoidance/Reduction)</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">top_3_buyers</td>
              <td class="table-cell text-slate-600">string</td>
              <td class="table-cell">Top buyers (comma-separated)</td>
            </tr>
            <tr>
              <td class="table-cell font-mono">compliance</td>
              <td class="table-cell text-slate-600">boolean</td>
              <td class="table-cell">Whether offer is compliance-grade</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
