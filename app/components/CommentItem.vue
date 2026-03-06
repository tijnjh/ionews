<script setup lang="ts">
export interface CommentItemProps {
  comment: Story['comments'][0]
  collapsedThreads: Set<number>
  toggleCollapse: (commentId: number) => void
  level?: number
}

const {
  comment,
  collapsedThreads,
  toggleCollapse,
  level = 0,
} = defineProps<CommentItemProps>()

const isCollapsed = computed(() => collapsedThreads.has(comment.id))
const depthColor = computed(() => `var(--rainbow-depth-${level % 7})`)
</script>

<template>
  <IonItem
    :style="{
      'paddingInlineStart': `${level * 0.75}rem`,
      '--padding-start': 0,
      '--padding-end': 0,
      '--inner-padding-start': 0,
      '--inner-padding-end': 0,
    }"
  >
    <div
      class="top-2 absolute rounded-full w-0.5 h-[calc(100%-1rem)]"
      :style="{
        backgroundColor: depthColor,
      }"
    />

    <div class="px-4 py-2 w-full">
      <IonLabel>
        <p
          class="flex items-center cursor-pointer"
          @click="toggleCollapse(comment.id)"
        >
          {{ comment.user }}

          <span class="mx-2">&bull;</span>

          {{ comment.time_ago }}
          <span class="ml-auto">
            <IonIcon
              :icon="!isCollapsed ? ioniconsChevronUp : ioniconsChevronDown"
            />
          </span>
        </p>
        <div v-if="!isCollapsed">
          <IonText>
            <div
              class="text-[0.875rem] flex flex-col gap-[1lh]"
              v-html="preprocessHtml(comment.content)"
            />
          </IonText>
        </div>
      </IonLabel>
    </div>
  </IonItem>

  <template v-if="!isCollapsed">
    <CommentItem
      v-for="reply in comment.comments"
      :key="reply.id"
      :comment="reply"
      :collapsed-threads="collapsedThreads"
      :toggle-collapse="toggleCollapse"
      :level="level + 1"
    />
  </template>
</template>

<style>
:root {
  --light-rainbow-depth-1: #f34336;
  --light-rainbow-depth-2: #ff912f;
  --light-rainbow-depth-3: #fad141;
  --light-rainbow-depth-4: #2d714c;
  --light-rainbow-depth-5: #0d74db;
  --light-rainbow-depth-6: #234688;
  --light-rainbow-depth-7: #643c95;

  --dark-rainbow-depth-1: #af2e28;
  --dark-rainbow-depth-2: #b15610;
  --dark-rainbow-depth-3: #967727;
  --dark-rainbow-depth-4: #2d714c;
  --dark-rainbow-depth-5: #1f67b1;
  --dark-rainbow-depth-6: #234688;
  --dark-rainbow-depth-7: #643c95;
}

:root {
  --rainbow-depth-1: var(--light-rainbow-depth-1);
  --rainbow-depth-2: var(--light-rainbow-depth-2);
  --rainbow-depth-3: var(--light-rainbow-depth-3);
  --rainbow-depth-4: var(--light-rainbow-depth-4);
  --rainbow-depth-5: var(--light-rainbow-depth-5);
  --rainbow-depth-6: var(--light-rainbow-depth-6);
  --rainbow-depth-7: var(--light-rainbow-depth-7);
}

@media (prefers-color-scheme: dark) {
  :root {
    --rainbow-depth-1: var(--dark-rainbow-depth-1);
    --rainbow-depth-2: var(--dark-rainbow-depth-2);
    --rainbow-depth-3: var(--dark-rainbow-depth-3);
    --rainbow-depth-4: var(--dark-rainbow-depth-4);
    --rainbow-depth-5: var(--dark-rainbow-depth-5);
    --rainbow-depth-6: var(--dark-rainbow-depth-6);
    --rainbow-depth-7: var(--dark-rainbow-depth-7);
  }
}
</style>
