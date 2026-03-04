<script lang="ts">
	import type { Comment } from '$lib/types';
	import { preprocessHtml } from '$lib/utils';
	import CommentListing from './CommentListing.svelte';
	import { haptic } from 'ios-haptics';

	const { comment }: { comment: Comment } = $props();

	let isCollapsed = $state(false);
</script>

<div class="max-w-[65ch] overflow-hidden">
	<button
		class="flex items-center gap-2 mb-2 w-full cursor-pointer"
		onclick={() => {
			haptic();
			isCollapsed = !isCollapsed;
		}}
	>
		<span class="font-medium">{comment.user}</span>
		<span class="text-sm text-mist-600-400">{comment.time_ago}</span>
	</button>
	{#if !isCollapsed}
		<div
			class="bg-mist-200-800 p-4 prose prose-neutral w-full dark:prose-invert rounded-2xl rounded-tl-md"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html preprocessHtml(comment.content)}
		</div>

		{#each comment.comments as subComment (subComment.id)}
			<div class="pl-4 border-l-2 border-mist-200-800 mt-4">
				<CommentListing comment={subComment} />
			</div>
		{/each}
	{/if}
</div>
