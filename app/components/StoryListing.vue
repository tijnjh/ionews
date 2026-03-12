<script setup lang="ts">
const { story } = defineProps<{ story: Story }>()
</script>

<template>
  <IonItem
    :draggable="false"
    detail
    button
    class="select-none"
    @click="navigateTo({
      path: `/story/${story.id}`,
      state: {
        story: {
          title: story.title,
          url: story.url,
          id: story.id,
          points: story.points,
          time_ago: story.time_ago,
          comments_count: story.comments_count,
          user: story.user,
          type: story.type,
          domain: story.domain,
          time: story.time,
          comments: [],
        } satisfies Partial<Story>,
      },
    })"
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
        <IonIcon :ios="ioniconsArrowUp" :md="ioniconsArrowUpSharp" />
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
