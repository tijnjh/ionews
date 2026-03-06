<script setup lang="ts">
const { story } = defineProps<{ story: Story }>()
</script>

<template>
  <IonItem
    :router-link="`/story/${story.id}`"
    :draggable="false"
    detail
    class="select-none"
  >
    <IonAvatar slot="start" aria-hidden>
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
        <span class="mx-2">&bull;</span>
        <span class="shrink-0">{{ story.time_ago }}</span>
        <template v-if="story.url.startsWith('http')">
          <span class="mx-2">&bull;</span>
          <span class="truncate">
            {{ formatUrl(story.url) }}
          </span>
        </template>
      </h3>
    </IonLabel>
    <IonNote>{{ story.comments_count }}</IonNote>
  </IonItem>
</template>
