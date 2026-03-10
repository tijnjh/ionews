<script setup lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query'
import { useMediaQuery } from '@vueuse/core'

const { $api } = useNuxtApp()

const { isPending, data, refetch, fetchNextPage } = useInfiniteQuery({
  queryKey: ['stories'],
  queryFn: ({ pageParam }) =>
    $api<Story[]>('/news', {
      params: { page: pageParam },
    }),
  initialPageParam: 1,
  getNextPageParam: (_, allPages) => allPages.length + 1,
})

const isWideScreen = useMediaQuery('(width >= 48rem)')
</script>

<template>
  <IonPage>
    <IonHeader translucent>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton href="https://tijn.dev/ionews" target="_blank">
            <IonIcon :icon="ioniconsLogoGithub" />
          </IonButton>
        </IonButtons>
        <IonTitle>
          Frontpage
        </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen :color="isWideScreen ? 'light' : undefined">
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

      <IonHeader collapse="condense">
        <IonToolbar :color="isWideScreen ? 'light' : undefined">
          <IonTitle size="large">
            Frontpage
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonSpinner v-if="isPending" class="my-8 w-full" />

      <IonList :inset="isWideScreen">
        <template v-for="stories in data?.pages">
          <StoryListing
            v-for="story in stories"
            :key="story.id"
            :story="story"
          />
        </template>
      </IonList>

      <IonInfiniteScroll
        threshold="100px"
        @ion-infinite="
          (e) => {
            fetchNextPage().finally(() => {
              e.target.complete();
            });
          }
        "
      >
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>
    </IonContent>
  </IonPage>
</template>
