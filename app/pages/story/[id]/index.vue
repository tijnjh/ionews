<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useMediaQuery } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()

const storyId = computed(() => route.params.id as string)

const { $api } = useNuxtApp()

const {
  isLoading,
  data: story,
  refetch,
} = useQuery({
  queryKey: ['story', storyId],
  queryFn: () => $api<Story>(`/item/${storyId.value}`),
})

const isExternalLink = computed(() => story.value?.url.startsWith('http'))

const isWideScreen = useMediaQuery('(width >= 48rem)')
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
            <IonIcon slot="end" :ios="ioniconsOpenOutline" :md="ioniconsOpenSharp" />
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

      <IonSpinner v-if="isLoading" class="my-8 w-full" />

      <div v-else-if="story" class="md:grid md:grid-cols-2">
        <div class="md:sticky md:top-4">
          <IonList class="mb-2" inset>
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
                  <IonIcon :ios="ioniconsArrowUp" :md="ioniconsArrowUpSharp" class="shrink-0" />
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

          <IonList inset>
            <IonItem
              v-if="story.comments"
              :router-link="`/story/${story.id}/reader`"
            >
              <IonIcon
                slot="start"
                aria-hidden="true"
                color="primary"
                :ios="ioniconsReaderOutline"
                :md="ioniconsReaderSharp"
              />
              <IonLabel color="primary">
                Open reader view
              </IonLabel>
            </IonItem>
          </IonList>
        </div>

        <div v-if="story.comments">
          <template v-if="story.comments.length > 0">
            <IonListHeader>
              <IonLabel>{{ story.comments_count }} Comments</IonLabel>
            </IonListHeader>
            <IonList v-for="comment in story.comments" :key="comment.id" :inset="isWideScreen">
              <CommentItem :comment="comment" />
            </IonList>
          </template>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>
