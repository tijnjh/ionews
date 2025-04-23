<script setup lang="ts">
import StoryListing from "../lib/components/StoryListing.vue";
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonButtons,
  IonButton,
  IonIcon,
  InfiniteScrollCustomEvent,
  RefresherCustomEvent,
} from "@ionic/vue";
import { logoGithub } from "ionicons/icons";
import { Story } from "../lib/types";
import { ref } from "vue";
import { onMounted } from "vue";
import { tryCatch } from "tsuite";

const STORIES_PER_PAGE = 25;

tryCatch;

async function fetchStoryIds(page: number, storiesPerPage: number) {
  const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
  const response = await (await fetch(url)).json();
  const start = (page - 1) * storiesPerPage;
  return response.slice(start, start + storiesPerPage);
}

async function fetchStories(ids: number[]) {
  const baseUrl = "https://hacker-news.firebaseio.com/v0/item/";
  const fetchPromises = ids.map((id) =>
    fetch(`${baseUrl}${id}.json`).then((res) => res.json())
  );
  return Promise.all(fetchPromises);
}

async function loadStories(page: number) {
  const [storyIds, err] = await tryCatch(fetchStoryIds(page, STORIES_PER_PAGE));

  if (!err) {
    const [fetchedStories, err] = await tryCatch(fetchStories(storyIds));
    if (!err && fetchedStories) {
      stories.value = [...stories.value, ...fetchedStories];
      showInitialSpinner.value = false;
    } else {
      console.error("Failed to load stories:", err);
    }
  } else {
    console.error("Failed to load story ids:", err);
  }
}

function handleRefresh(event: RefresherCustomEvent) {
  page.value = 1;
  stories.value = [];
  loadStories(1).then(() => {
    event.detail.complete();
  });
}

function loadMore(event: InfiniteScrollCustomEvent) {
  page.value++;
  loadStories(page.value + 1).then(() => {
    event.target.complete();
  });
}

const stories = ref<Story[]>([]);
const page = ref(1);
const showInitialSpinner = ref(true);

onMounted(() => {
  loadStories(page.value);
});
</script>

<template>
  <ion-page id="home-page">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button href="https://github.com/tijnjh/hn">
            <ion-icon :icon="logoGithub" slot="icon-only" />
          </ion-button>
        </ion-buttons>
        <ion-title>Frontpage</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Frontpage</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-spinner v-if="showInitialSpinner" class="initial-spinner" />

      <ion-list>
        <StoryListing v-for="story in stories" :key="story.id" :story="story" />
      </ion-list>

      <ion-infinite-scroll @ion-infinite="loadMore" threshold="100px">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.initial-spinner {
  width: 100%;
  margin-block-start: 2rem;
}
</style>
