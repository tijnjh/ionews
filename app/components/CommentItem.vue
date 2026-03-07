<script setup lang="ts">
import { haptic } from 'ios-haptics'
import AnimateHeight from 'vue-animate-height'

const {
  comment,
  level = 0,
} = defineProps<CommentItemProps>()

export interface CommentItemProps {
  comment: Story['comments'][0]
  level?: number
}

const isCollapsed = ref(false)
const depthColor = computed(() => `var(--rainbow-depth-${level % 7})`)

const height = ref<string | number>('auto')

watch(isCollapsed, () => {
  height.value = isCollapsed.value ? 0 : 'auto'
})

const animateDuration = 256

function toggleCollapse() {
  haptic()

  setTimeout(() => {
    haptic()
  }, 300)

  isCollapsed.value = !isCollapsed.value
}
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
          @click="toggleCollapse()"
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
        <AnimateHeight
          :height="height"
          :duration="animateDuration"
        >
          <IonText>
            <div
              class="text-[0.875rem] flex flex-col gap-[1lh]"
              v-html="preprocessHtml(comment.content)"
            />
          </IonText>
        </AnimateHeight>
      </IonLabel>
    </div>
  </IonItem>

  <AnimateHeight
    v-for="reply in comment.comments"
    :key="reply.id"
    :height="height"
    :duration="animateDuration"
  >
    <CommentItem
      :comment="reply"
      :level="level + 1"
    />
  </AnimateHeight>
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
