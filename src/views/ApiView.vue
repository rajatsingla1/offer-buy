<template>
  <div class="mt-10 grid gap-6">
    <div class="card p-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-primary">
            API details
          </p>
          <h2 class="mt-2 text-2xl font-semibold text-ink">
            Access the offers API
          </h2>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div class="rounded-xl bg-primary-50 p-4 ring-1 ring-primary-100">
          <div class="text-sm font-semibold text-primary">Endpoint</div>
          <p class="mt-2 break-all text-sm text-slate-700">
            https://api.jsonbin.io/v3/b/692bdd54ae596e708f79af9d/latest
          </p>
          <div class="mt-4 text-sm">
            <div class="font-semibold text-primary">Headers</div>
            <p
              class="mt-1 rounded-lg bg-white px-3 py-2 font-mono text-xs ring-1 ring-primary-100"
            >
              X-Access-Key:
              $2a$10$xRngXRe4FPWGJY7TyvzERO3idRIuDna0.GjNr0Aal8ZnTmFd7rHRK
            </p>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-6 md:grid-cols-2">
        <div class="rounded-xl bg-white p-4 ring-1 ring-primary-100">
          <div class="text-sm font-semibold text-primary">
            JavaScript example
          </div>
          <pre
            class="mt-2 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100"
          >
const response = await fetch(
  "https://api.jsonbin.io/v3/b/692bdd54ae596e708f79af9d/latest",
  { headers: { "X-Access-Key": "${API_KEY}" } }
);
const data = await response.json();
console.log(data);
          </pre>
        </div>

        <div class="rounded-xl bg-white p-4 ring-1 ring-primary-100">
          <div class="text-sm font-semibold text-primary">Python example</div>
          <pre
            class="mt-2 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100"
          >
import requests

url = "https://api.jsonbin.io/v3/b/692bdd54ae596e708f79af9d/latest"
headers = {"X-Access-Key": "${API_KEY}"}

resp = requests.get(url, headers=headers)
resp.raise_for_status()
print(resp.json())
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>
