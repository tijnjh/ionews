<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

const route = useRoute()
const storyId = computed(() => route.params.id as string)

const { $api } = useNuxtApp()

const {
  isLoading: storyIsLoading,
  data: story,
} = useQuery({
  queryKey: ['story', storyId],
  queryFn: () => $api<Story>(`/item/${storyId.value}`),
})

const {
  isLoading: readerIsLoading,
  data: readableHtml,
} = useQuery({
  queryKey: ['reader', storyId, story.value?.url],
  queryFn: async () => {
    if (!story.value) {
      return
    }

    return await $fetch('/api/reader', {
      params: {
        url: story.value.url,
      },
    })
  },
  enabled: () => !!story.value?.url,
})

const isPending = computed(() => storyIsLoading.value || readerIsLoading.value)
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
            <IonIcon slot="end" :ios="ioniconsOpenOutline" :md="ioniconsOpenSharp" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent color="light">
      <IonSpinner v-if="isPending" class="my-8 w-full" />
      <div class="prose p-4 prose-neutral dark:prose-invert mx-auto" v-html="readableHtml" />
    </IonContent>
  </IonPage>
</template>
