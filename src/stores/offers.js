import axios from "axios";
import { defineStore } from "pinia";

const API_URL = "https://api.jsonbin.io/v3/b/692bdd54ae596e708f79af9d/latest";
const API_KEY = "$2a$10$xRngXRe4FPWGJY7TyvzERO3idRIuDna0.GjNr0Aal8ZnTmFd7rHRK";

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
        const response = await axios.get(API_URL, {
          headers: {
            "X-Access-Key": API_KEY,
          },
        });

        const payload = response.data;
        const remoteOffers =
          payload?.record?.offers ?? payload?.record ?? payload?.offers ?? [];

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
