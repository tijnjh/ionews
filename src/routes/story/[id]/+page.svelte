<script lang="ts">
	import { api } from '$lib/api';
	import CommentItem from '$lib/components/CommentItem.svelte';
	import type { Story } from '$lib/types';
	import { getReadableHtml } from '$lib/utils.remote';
	import type { PageProps } from './$types';
	import { haptic } from 'ios-haptics';

	const { params }: PageProps = $props();

	const story = $derived(await api<Story>(`/item/${params.id}`));

	let collapsedThreads = $state(new Set<number>());

	function toggleCollapse(commentId: number) {
		haptic();
		const newSet = new Set(collapsedThreads);
		newSet[newSet.has(commentId) ? 'delete' : 'add'](commentId);
		collapsedThreads = newSet;
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-[1fr_30rem] p-4 gap-8">
	<div class="prose-invert prose-sl prose-neutral prose mx-auto">
		<hgroup class="mt-16">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={story.url} target="_blank">
				<h1>{story.title}</h1>
			</a>
		</hgroup>

		{#await getReadableHtml(story.url)}
			<div
				class="w-full px-3 py-4 flex items-center justify-center gap-4 rounded-md animate-pulse bg-mist-700"
			>
				<div class="size-4 border-2 border-dashed animate-spin rounded-full"></div>
				Fetching reader view...
			</div>
		{:then storyHtml}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html storyHtml?.content}
		{/await}
	</div>

	<div
		class="md:sticky md:top-4 md:max-h-[calc(100dvh-2rem)] overflow-auto p-4 rounded-xl bg-mist-900"
	>
		{#each story.comments as comment (comment.id)}
			<CommentItem {comment} {collapsedThreads} {toggleCollapse} />
		{/each}
	</div>
</div>
