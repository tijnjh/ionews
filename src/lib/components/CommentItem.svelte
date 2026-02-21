<script lang="ts">
	import type { Story } from '$lib/types';
	import { preprocessHtml } from '$lib/utils';
	import '../assets/rainbox.css';
	import CommentItem from './CommentItem.svelte';

	interface CommentItemProps {
		comment: Story['comments'][0];
		collapsedThreads: Set<number>;
		toggleCollapse: (commentId: number) => void;
		level?: number;
	}

	const { comment, collapsedThreads, toggleCollapse, level = 0 }: CommentItemProps = $props();

	const isCollapsed = $derived(collapsedThreads.has(comment.id));
	const depthColor = $derived(`var(--rainbow-depth-${level % 7})`);
</script>

<div style="padding-inline-start: {level * 0.75}rem;" class="relative">
	<div
		class="top-2 absolute rounded-full w-0.5 h-[calc(100%-1rem)]"
		style="background-color: {depthColor}"
	></div>

	<div class="px-4 py-2 w-full">
		<button onclick={() => toggleCollapse(comment.id)} class="flex items-center cursor-pointer">
			{comment.user}
			<span class="mx-2"> &bull; </span>
			{comment.time_ago}
			<span class="ml-auto">
				<!-- <IonIcon icon={!isCollapsed ? chevronUp : chevronDown} /> -->
			</span>
		</button>
		{#if !isCollapsed}
			<div class="text-[0.875rem] flex flex-col gap-[1lh]">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html preprocessHtml(comment.content)}
			</div>
		{/if}
	</div>
</div>

{#if !isCollapsed}
	{#each comment.comments as reply (reply.id)}
		<CommentItem comment={reply} {collapsedThreads} {toggleCollapse} level={level + 1} />
	{/each}
{/if}
