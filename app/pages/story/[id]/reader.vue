<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

const route = useRoute()

const storyId = computed(() => route.params.id as string)

const { $api } = useNuxtApp()

const {
  isPending: storyIsPending,
  data: story,
} = useQuery({
  queryKey: [`story-${route.params.id}`],
  queryFn: () => $api<Story>(`/item/${route.params.id}`),
})

const {
  isPending: readerIsPending,
  data: readableHtml,
} = useQuery({
  queryKey: [`story-${route.params.id}-reader`],
  queryFn: async () => {
    if (!story.value) {
      return
    }

    return await $fetch('/api/reader', {
      params: { url: story.value.url },
    })
  },
})

const isPending = computed(() => storyIsPending.value || readerIsPending.value)
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
      <ion-loading
        :is-open="isPending"
      />
      <div class="prose p-4 prose-neutral dark:prose-invert" v-html="readableHtml" />
    </IonContent>
  </IonPage>
</template>
