<script setup lang="ts">
import StoryListing from "../lib/components/StoryListing.vue";
import {
  InfiniteScrollCustomEvent,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from "@ionic/vue";
import { logoGithub } from "ionicons/icons";
import { Story } from "../lib/types";
import { ref } from "vue";
import { onMounted } from "vue";
import { effetch } from "tsuite";
import { tryCatch } from "typecatch";

const STORIES_PER_PAGE = 25;

async function fetchStoryIds(page: number, storiesPerPage: number) {
  const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
  const response = await effetch<number[]>(url);
  const start = (page - 1) * storiesPerPage;
  return response.slice(start, start + storiesPerPage);
}

async function fetchStories(ids: number[]) {
  const baseUrl = "https://hacker-news.firebaseio.com/v0/item/";
  const fetchPromises = ids.map(
    async (id) => await effetch<Story>(`${baseUrl}${id}.json`),
  );

  return Promise.all(fetchPromises);
}

async function loadStories(page: number) {
  const { data: storyIds, error } = await tryCatch(
    fetchStoryIds(page, STORIES_PER_PAGE),
  );

  if (!error) {
    const { data: fetchedStories, error } = await tryCatch(
      fetchStories(storyIds!),
    );
    if (!error && fetchedStories) {
      stories.value = [...stories.value, ...fetchedStories];
      showInitialSpinner.value = false;
    } else {
      console.error("Failed to load stories:", error);
    }
  } else {
    console.error("Failed to load story ids:", error);
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
          <ion-button href="https://tijn.dev/hn">
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
        <ion-infinite-scroll-content />
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
