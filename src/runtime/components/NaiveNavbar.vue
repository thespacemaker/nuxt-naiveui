<template>
  <nav
    :style="{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      padding: '0px 16px',
      height: '56px',
      position: _sticky,
      top: 0,
      zIndex: 100,
      boxShadow: '0px 0px 2px 0px #a3a3a3',
    }"
  >
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        flex: flexInnerSides,
        width: 'fit-content',
      }"
    >
      <n-button
        v-if="backIcon"
        class="mobileOrTablet"
        text
        tag="span"
        :focusable="false"
        @click="router.back"
      >
        <NaiveIcon
          name="ph:arrow-left"
          :size="backIconSize"
        />
      </n-button>

      <slot name="start" />
    </div>

    <div
      v-if="!isMobileOrTablet"
      class="notMobileOrTablet"
      :style="{
        flexGrow: 1,
        textAlign: menuPlacement,
      }"
    >
      <LazyNaiveMenuLink
        :inverted="menuInverted"
        mode="horizontal"
        :routes="routes"
      />
    </div>

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
        flex: flexInnerSides,
      }"
    >
      <slot name="end" />

      <n-button
        class="mobileOrTablet"
        text
        tag="span"
        :focusable="false"
        @click="drawerActive = true"
      >
        <slot name="toggle">
          <NaiveIcon
            :name="menuToggleIcon"
            :size="menuToggleIconSize"
          />
        </slot>
      </n-button>
    </div>
  </nav>

  <client-only>
    <n-drawer
      v-model:show="drawerActive"
      :placement="drawerPlacement"
      :width="drawerWidth"
    >
      <n-drawer-content
        title="Menu"
        :body-content-style="{ padding: 0 }"
        :header-style="{
          padding: '15px',
        }"
        :footer-style="{ justifyContent: 'start' }"
        :closable="drawerClosable"
      >
        <template #header>
          <slot name="drawer-header" />
        </template>

        <slot name="drawer-content" />

        <LazyNaiveMenuLink
          mode="vertical"
          :inverted="menuInverted"
          :routes="drawerRoutes"
        />

        <template #footer>
          <slot name="drawer-footer" />
        </template>
      </n-drawer-content>
    </n-drawer>
  </client-only>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  useRouter,
  useThemeVars,
  useNaiveDevice,
} from "#imports";
import { NaiveIcon, LazyNaiveMenuLink } from "#components";
import type { NavbarRoute } from "../types";

const drawerActive = ref(false);
const router = useRouter();
const naiveTheme = useThemeVars();
const { isMobileOrTablet } = useNaiveDevice();

router.afterEach(() => drawerActive.value = false)
 
const props = withDefaults(
  defineProps<{
    routes?: NavbarRoute[];
    drawerRoutes?: NavbarRoute[];
    menuToggleIcon?: string;
    menuToggleIconSize?: number;
    backIcon?: boolean;
    backIconSize?: number;
    menuInverted?: boolean;
    menuPlacement?: "right" | "left" | "center";
    drawerPlacement?: "top" | "right" | "bottom" | "left";
    sticky?: boolean;
    drawerClosable?: boolean;
    drawerWidth?: string | number;
  }>(),
  {
    routes: () => [],
    drawerRoutes: () => [],
    menuToggleIcon: "ph:equals",
    menuPlacement: "left",
    drawerPlacement: "left",
    menuInverted: false,
    sticky: true,
    menuToggleIconSize: 26,
    backIcon: false,
    backIconSize: 26,
    drawerWidth: "100%",
    drawerClosable: true,
  }
);

const _sticky = computed(() => (props.sticky ? "sticky" : "static"));
const backgroundColor = computed(() => naiveTheme.value.bodyColor);
const flexInnerSides = computed(() =>
  props.menuPlacement === "center" ? 1 : "inherited"
);
</script>

<style scoped>
nav {
  background-color: v-bind(backgroundColor);
}
</style>
