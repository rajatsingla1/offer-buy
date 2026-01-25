import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../utils/apiClient.ts";

export const useSubscribedUserStore = defineStore("subscribedUser", () => {
  const subscribedUser = ref(null);

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
    const response = await apiClient.root.post("/subscribed-users", {
      email,
      name,
      instantUpdates,
      schedulePreference,
    });
    subscribedUser.value = response.data;
  };

  return {
    subscribedUser,
    createSubscribedUser,
  };
});
