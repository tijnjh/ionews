<script lang="ts">
	import { api } from '$lib/api';
	import CommentItem from '$lib/components/CommentItem.svelte';
	import type { Story } from '$lib/types';
	import { getReadableHtml } from '$lib/utils.remote';
	import { TextMorph } from '$lib/utils/torph';
	import type { PageProps } from './$types';
	import { haptic } from 'ios-haptics';
	import { resource } from 'runed';
	import { fly } from 'svelte/transition';

	const { params }: PageProps = $props();

	const story = $derived(await api<Story>(`/item/${params.id}`));

	let collapsedThreads = $state(new Set<number>());

	function toggleCollapse(commentId: number) {
		haptic();
		const newSet = new Set(collapsedThreads);
		newSet[newSet.has(commentId) ? 'delete' : 'add'](commentId);
		collapsedThreads = newSet;
	}

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

<div class="grid grid-cols-1 md:grid-cols-[1fr_30rem] p-4 gap-8">
	<div class="dark:prose-invert prose-sl prose-neutral prose mx-auto w-full md:pt-16">
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
	</div>

	<div
		class="md:sticky md:top-4 md:max-h-[calc(100dvh-2rem)] overflow-auto p-4 rounded-xl bg-mist-100-900"
	>
		{#each story.comments as comment (comment.id)}
			<CommentItem {comment} {collapsedThreads} {toggleCollapse} />
		{/each}
	</div>
</div>
