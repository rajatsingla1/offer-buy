<script setup>
const offers = [
  {
    id: "A-1001",
    serialId: "SERIAL-2024-00000000000000000000000",
    offerId: "OFFER-4521",
    year: 2024,
    quantity: 1200,
    price: 1280,
    total: 1536000,
  },
  {
    id: "B-2040",
    serialId: "SN-908812-4401",
    offerId: "OFFER-9090",
    year: 2025,
    quantity: 800,
    price: 1450,
    total: 1160000,
  },
  {
    id: "C-3307",
    serialId: "SN-771210-5523",
    offerId: "OFFER-1113",
    year: 2025,
    quantity: 460,
    price: 1725,
    total: 793500,
  },
  {
    id: "D-4122",
    serialId: "SN-662101-1982",
    offerId: "OFFER-7701",
    year: 2026,
    quantity: 1050,
    price: 1190,
    total: 1249500,
  },
];
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white via-surface to-primary-50"
  >
    <header
      class="sticky top-0 z-10 border-b border-primary-100 bg-white/80 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
      >
        <div class="flex items-center gap-1">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-soft"
          >
            <img
              src="https://www.alliedoffsets.com/wp-content/uploads/2022/07/faviconalllied.png"
              height="25"
              width="25"
            />
          </div>
          <div>
            <div class="text-lg font-semibold text-primary">AlliedOffsets</div>
          </div>
        </div>
        <nav
          class="flex items-center gap-6 text-sm font-semibold text-slate-700"
        >
          <a
            href="#"
            class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
            >About</a
          >
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <section class="card relative overflow-hidden p-8">
        <div
          class="absolute right-10 top-10 h-24 w-24 rounded-full bg-primary-100 blur-3xl"
        ></div>
        <div
          class="absolute -bottom-6 left-6 h-20 w-20 rounded-full bg-primary-50 blur-2xl"
        ></div>
        <div class="flex flex-col gap-4">
          <p
            class="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 ring-1 ring-primary-100"
          >
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            Live offers
          </p>
          <div class="space-y-3">
            <h1 class="text-3xl font-semibold text-ink sm:text-4xl">
              Premium offers on Credits
            </h1>
            <p class="max-w-3xl text-lg text-slate-600">
              Review curated opportunities with clear pricing, quantities. Each
              offer is ready to buy with a single click.
            </p>
          </div>
          <!-- <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div
              class="flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-primary-100"
            >
              <span class="h-2 w-2 rounded-full bg-primary"></span>
              Instant confirmation on purchase
            </div>
            <div
              class="flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-primary-100"
            >
              <span class="h-2 w-2 rounded-full bg-primary"></span>
              Transparent totals and savings
            </div>
          </div> -->
        </div>
      </section>

      <section class="mt-10 card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-primary-100">
            <thead class="table-header">
              <tr>
                <th scope="col" class="px-6 py-3 text-left">Id</th>
                <th scope="col" class="px-6 py-3 text-left">Year</th>
                <th scope="col" class="px-6 py-3 text-left">Quantity</th>
                <th scope="col" class="px-6 py-3 text-left">Price</th>
                <th scope="col" class="px-6 py-3 text-left">Total value</th>
                <th scope="col" class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary-50 bg-white">
              <tr
                v-for="offer in offers"
                :key="offer.id"
                class="hover:bg-primary-50/40"
              >
                <td class="table-cell">
                  <div class="text-sm font-semibold text-ink">
                    {{ offer.id }}
                  </div>
                  <p class="mt-1 text-xs text-slate-600">
                    Serial ID {{ offer.serialId }}
                  </p>
                </td>
                <td class="table-cell">{{ offer.year }}</td>
                <td class="table-cell">
                  {{ offer.quantity.toLocaleString() }}
                </td>
                <td class="table-cell">${{ offer.price.toLocaleString() }}</td>
                <td class="table-cell font-semibold text-primary">
                  ${{ offer.total.toLocaleString() }}
                </td>
                <td class="table-cell text-right">
                  <button type="button" class="button-primary">Buy</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>
