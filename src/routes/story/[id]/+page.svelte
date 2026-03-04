<script lang="ts">
	import { api } from '$lib/api';
	import CommentListing from '$lib/components/CommentListing.svelte';
	import type { Story } from '$lib/types';
	import { getReadableHtml } from '$lib/utils.remote';
	import { TextMorph } from '$lib/utils/torph';
	import type { PageProps } from './$types';
	import { resource } from 'runed';
	import { fly } from 'svelte/transition';

	const { params }: PageProps = $props();

	const story = $derived(await api<Story>(`/item/${params.id}`));

	const storyHtml = resource(
		() => `readable-${story.url}`,
		() => getReadableHtml(story.url)
	);

	const text = $derived.by(() => {
		if (storyHtml.loading) {
			return `Loading reader view`;
		} else if (storyHtml.error) {
			return `Failed to load reader view`;
		} else if (storyHtml.current) {
			return undefined;
		} else {
			return 'No URL available for this story.';
		}
	});
</script>

<div class="dark:prose-invert prose-neutral prose mx-auto w-full md:pt-16">
	<!--  eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={story.url} target="_blank" class="decoration-0 hover:decoration-2">
		<h1 class="w-fit" style="view-transition-name: story-title-{story.id}">{story.title}</h1>
	</a>

	{#if text}
		<div class="flex gap-2 items-center">
			{#if storyHtml.loading}
				<div
					class="size-3 border border-mist-200-800 border-t-mist-600-400 rounded-full animate-spin"
				></div>
			{/if}
			<TextMorph {text} />
		</div>
	{/if}

	{#if storyHtml.current}
		<div transition:fly={{ y: 50 }}>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html storyHtml.current.content}
		</div>
	{/if}
	<hr />
</div>

<div class="flex flex-col gap-8 max-w-[65ch] mx-auto w-full">
	{#each story.comments as comment (comment.time)}
		<CommentListing {comment} />
	{/each}
</div>
