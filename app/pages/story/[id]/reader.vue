<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const storyId = computed(() => route.params.id as string)

const { $api } = useNuxtApp()

const { data: story } = await useAsyncData(`story-${storyId.value}`, () => $api<Story>(`/item/${storyId.value}`))

const { data: readableHtml } = await useAsyncData(
  `${story.value?.id}-reader`,
  async () => {
    if (!story.value) {
      return
    }

    return await $fetch(`/api/reader?url=${encodeURIComponent(story.value.url)}`)
  },
)

const isExternalLink = computed(() => story.value?.url.startsWith('http'))
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton text="Comments" :default-href="`/story/${storyId}`" />
        </IonButtons>

        <IonButtons slot="end">
          <IonButton v-if="isExternalLink" :href="story?.url" target="_blank">
            {{ story?.url && formatUrl(story.url) }}
            <IonIcon slot="end" :icon="ioniconsOpenOutline" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent color="light">
      <div class="prose p-4 prose-neutral dark:prose-invert" v-html="readableHtml" />
    </IonContent>
  </IonPage>
</template>
