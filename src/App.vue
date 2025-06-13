<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { onMounted } from "vue";

onMounted(() => {
  const element = document.querySelector(".prevent-swipe-nav");

  element?.addEventListener("touchstart", (e) => {
    // prevent swipe to navigate gesture
    // @ts-expect-error
    if (e.pageX > 20 && e.pageX < window.innerWidth - 20) return;
    e.preventDefault();
  });
});
</script>

<template>
  <ion-app class="prevent-swipe-nav">
    <ion-router-outlet />
  </ion-app>
</template>
