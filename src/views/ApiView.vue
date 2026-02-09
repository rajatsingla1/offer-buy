<script setup>
import { ref } from "vue";

const structureOpen = ref(false);
</script>

<template>
  <div class="mt-10 grid gap-6">
    <div class="card p-8">
      <h2 class="text-2xl font-semibold text-ink">API</h2>
      <p class="mt-2 text-slate-600">
        Public GET endpoint for listing carbon credit offers.
      </p>

      <div class="mt-6 rounded-xl bg-slate-50 p-4 font-mono text-sm">
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">GET</span>
          <a href="https://api.publicdomain.co.in/offers/api" target="_blank" rel="noopener noreferrer"
            class="text-primary hover:underline">
            https://api.publicdomain.co.in/offers/api
          </a>
        </div>
      </div>

      <h3 class="mt-8 text-lg font-semibold text-ink">Response</h3>
      <p class="mt-1 text-sm text-slate-600">
        Returns a JSON array of offer objects. No query parameters required.
      </p>

      <button type="button"
        class="mt-6 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-800 transition hover:bg-slate-100"
        @click="structureOpen = !structureOpen">
        <span>Response structure</span>
        <svg class="h-5 w-5 shrink-0 transition-transform" :class="{ 'rotate-180': structureOpen }" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="structureOpen"
        class="mt-3 overflow-x-auto rounded-lg border border-slate-200 border-t-0 rounded-t-none">
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
              <td class="table-cell">Offer serial identifier (e.g. VCS902-2020-1)</td>
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

      <div class="mt-6">
        <a href="https://api.publicdomain.co.in/offers/api" target="_blank" rel="noopener noreferrer"
          class="button-primary inline-flex items-center gap-2">
          Open API in new tab
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
