import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../utils/apiClient.ts";
import { useToast } from "primevue/usetoast";

export const useSubscribedUserStore = defineStore("subscribedUser", () => {
  const subscribedUser = ref(null);
  const toast = useToast();

  const getSubscribedUser = async (uuid: string) => {
    try {
      const response = await apiClient.root.get(`/subscribed-users/${uuid}`);
      subscribedUser.value = response.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error getting subscribed user",
        life: 3000,
      });
    }
  };

  const createSubscribedUser = async ({
    email,
    name,
    instantUpdates,
    schedulePreference,
  }: {
    email: string;
    name?: string;
    instantUpdates: boolean;
    schedulePreference: string;
  }) => {
    try {
      const response = await apiClient.root.post("/subscribed-users", {
        email,
        name,
        instantUpdates,
        schedulePreference,
      });
      return response.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error creating subscribed user",
        life: 3000,
      });
    }
  };

  return {
    subscribedUser,
    getSubscribedUser,
    createSubscribedUser,
  };
});
