import { defineNuxtPlugin, useNaiveColorMode, useRouter } from "#imports";
import type { ColorMode } from "../types";

export default defineNuxtPlugin((nuxtApp) => {
  const {colorModePreference, colorModeForced } = useNaiveColorMode();

  const colorModePage = useRouter().currentRoute.value.meta.colorMode as ColorMode;
  colorModeForced.value = colorModePage || false;

  colorModePreference.sync();

  nuxtApp.hook("page:finish", () => colorModePreference.sync());

  useRouter().afterEach((to) => {
    const colorModePage = to.meta.colorMode as ColorMode;
    colorModeForced.value = colorModePage || false;
  });

  nuxtApp.hook("app:mounted", () => {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden === false) {
        colorModePreference.sync();
      }
    });
  });
});
