<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { haptic } from 'ios-haptics'
import { useRoute } from 'vue-router'

const collapsedThreads = ref<Set<number>>(new Set())

const route = useRoute()
const storyId = computed(() => route.params.id as string)

function toggleCollapse(commentId: number) {
  haptic()
  const newSet = new Set(collapsedThreads.value)
  newSet[newSet.has(commentId) ? 'delete' : 'add'](commentId)
  collapsedThreads.value = newSet
}
const { $api } = useNuxtApp()

const {
  isPending,
  data: story,
  refetch,
} = useQuery({
  queryKey: ['story', storyId],
  queryFn: () => $api<Story>(`/item/${storyId.value}`),
})

const comments = computed(() => story.value?.comments || [])

const isExternalLink = computed(() => story.value?.url.startsWith('http'))
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton text="Frontpage" default-href="/" />
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
      <IonRefresher
        slot="fixed"
        @ion-refresh="
          async (e) => {
            await refetch();
            e.detail.complete();
          }
        "
      >
        <IonRefresherContent />
      </IonRefresher>

      <template v-if="story">
        <IonList class="mb-2">
          <IonItem
            :href="isExternalLink ? story.url : undefined"
            target="_blank"
          >
            <IonAvatar slot="start" aria-hidden="true">
              <img
                class="rounded-sm! bg-(--gray-5)"
                :src="`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`"
              >
            </IonAvatar>

            <IonLabel>
              <h2>{{ story.title }}</h2>
              <h3 class="flex items-center">
                {{ story.points }}
                <IonIcon :icon="ioniconsArrowUp" />
                <span class="mx-2"> &bull; </span>
                {{ story.user }}
                <span class="mx-2"> &bull; </span>
                <span class="shrink-0">
                  {{ story.time_ago }}
                </span>
                <template v-if="isExternalLink">
                  <span class="mx-2"> &bull; </span>
                  <span class="truncate"> {{ formatUrl(story.url) }} </span>
                </template>
              </h3>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonItem
            v-if="story.comments"
            :router-link="`/story/${story.id}/reader`"
          >
            <IonIcon slot="start" aria-hidden="true" color="primary" :icon="ioniconsReaderOutline" />
            <IonLabel color="primary">
              Open reader view
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList v-for="comment in comments" :key="comment.id">
          <CommentItem
            :comment="comment"
            :collapsed-threads="collapsedThreads"
            :toggle-collapse="toggleCollapse"
          />
        </IonList>
      </template>

      <IonSpinner v-if="isPending" class="my-8 w-full" />
    </IonContent>
  </IonPage>
</template>
