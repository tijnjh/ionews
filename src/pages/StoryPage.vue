<script setup lang="ts">
  import {
    IonAvatar,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonText,
    IonToolbar,
    IonIcon,
    IonSpinner,
    IonButton,
  } from "@ionic/vue";

  import { arrowUp, openOutline, chevronUp, chevronDown } from "ionicons/icons";
  import { computed, ref } from "vue";
  import { useRoute } from "vue-router";
  import { formatUrl, relativify } from "../lib/utils";
  import { Story } from "../lib/types";

  const route = useRoute();

  async function fetchStory(id: number) {
    const url = `https://node-hnapi.herokuapp.com/item/${id}`;
    const response = await (await fetch(url)).json();
    return response;
  }

  const story = ref<Story>();
  const collapsedThreads = ref<Set<number>>(new Set());
  const loading = ref<boolean>(true);

  async function loadStory(id: number) {
    loading.value = true;
    const storyData = await fetchStory(id);
    story.value = storyData;
    loading.value = false;
  }

  loadStory(Number(route.params.id));

  function toggleCollapse(commentId: number) {
    const newSet = new Set(collapsedThreads.value);
    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    collapsedThreads.value = newSet;
  }

  const isExternalLink = computed(() => story.value?.url?.startsWith("http"));
</script>

<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Frontpage" default-href="/"></ion-back-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button v-if="isExternalLink" :href="story?.url" target="_blank">
            {{ formatUrl(story?.url!) }}
            <ion-icon slot="end" :icon="openOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <ion-spinner
        v-if="loading"
        style="width: 100%; margin-block-start: 2rem"
      />

      <template v-if="story">
        <ion-list style="margin-bottom: 0.5rem">
          <ion-item
            :href="isExternalLink ? story.url! : undefined"
            target="_blank"
          >
            <ion-avatar
              aria-hidden="true"
              slot="start"
              style="--border-radius: 0.25rem"
            >
              <img
                alt=""
                :src="`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`"
              />
            </ion-avatar>
            <ion-label>
              <h2>{{ story.title }}</h2>
              <h3 style="display: flex; align-items: center">
                {{ story.points }}
                <ion-icon :icon="arrowUp" />
                <span style="margin-inline: 0.5rem">&bull;</span>
                <span style="flex-shrink: 0">{{ relativify(story.time) }}</span>
                <template v-if="isExternalLink">
                  <span style="margin-inline: 0.5rem">&bull;</span>
                  <span
                    style="
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    "
                  >
                    {{ formatUrl(story.url) }}
                  </span>
                </template>
              </h3>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-list
          v-for="comment in story.comments"
          :key="comment.id"
          style="margin-bottom: 0.5rem"
        >
          <ion-item>
            <ion-label>
              <p
                @click="toggleCollapse(comment.id)"
                style="display: flex; align-items: center; cursor: pointer"
              >
                {{ comment.user }}
                <span style="margin-inline: 0.5rem">&bull;</span>
                {{ relativify(comment.time) }}
                <span style="margin-left: auto">
                  <ion-icon
                    v-if="!collapsedThreads.has(comment.id)"
                    :icon="chevronUp"
                  />
                  <ion-icon v-else :icon="chevronDown" />
                </span>
              </p>
              <div
                class="comment-content"
                :class="{
                  collapsed: collapsedThreads.has(comment.id),
                  expanded: !collapsedThreads.has(comment.id),
                }"
              >
                <ion-text>
                  <div v-html="comment.content"></div>
                </ion-text>
              </div>
            </ion-label>
          </ion-item>
          <template v-if="!collapsedThreads.has(comment.id)">
            <ion-item
              v-for="reply in comment.comments"
              :key="reply.id"
              :style="{ paddingLeft: `${reply.level}rem` }"
            >
              <ion-label>
                <p style="display: flex; align-items: center">
                  {{ reply.user }}
                  <span style="margin-inline: 0.5rem">&bull;</span>
                  {{ relativify(reply.time) }}
                </p>

                <div
                  class="comment-content"
                  :class="{
                    collapsed: collapsedThreads.has(comment.id),
                    expanded: !collapsedThreads.has(comment.id),
                  }"
                >
                  <ion-text>
                    <div v-html="reply.content"></div>
                  </ion-text>
                </div>
              </ion-label>
            </ion-item>
          </template>
        </ion-list>
      </template>
      <template v-else>
        <p></p>
      </template>
    </ion-content>
  </ion-page>
</template>

<style scoped>
  .comment-content {
    transition: height 0.3s ease;
    overflow: hidden;
  }

  .comment-content.collapsed {
    height: 0;
  }

  .comment-content.expanded {
    height: calc-size(max-content, size);
  }
</style>
