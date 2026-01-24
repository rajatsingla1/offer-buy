import axios from "axios";
import { defineStore } from "pinia";

// const BaseUrl = "https://api.publicdomain.co.in";
const BaseUrl = "http://localhost:8000";
const API_URL = `${BaseUrl}/offers/website`;

export const useOffersStore = defineStore("offers", {
  state: () => ({
    offers: [],
    loading: false,
    error: "",
  }),
  actions: {
    async fetchOffers() {
      if (this.loading) return;

      this.loading = true;
      this.error = "";

      try {
        const response = await axios.get(API_URL);

        const payload = response.data;
        const remoteOffers = payload ?? [];

        this.offers = Array.isArray(remoteOffers) ? remoteOffers : [];
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : "Unexpected error fetching offers.";
        this.offers = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
