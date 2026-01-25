import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const CustomGreenTheme = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: {
                primary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#028e4b', 
                    600: '#027a42',
                    700: '#026639',
                    800: '#01522f',
                    900: '#013e25',
                    950: '#012a1a'
                }
            }
        }
    }
});

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: CustomGreenTheme,
        options: {
            darkModeSelector: false,
        }
    }
});
app.use(ToastService);
app.use(createPinia());
app.use(router);

app.mount("#app");
