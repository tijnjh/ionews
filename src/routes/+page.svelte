<script lang="ts">
	import { api } from '$lib/api';
	import Header from '$lib/components/Header.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import StoryListing from '$lib/components/StoryListing.svelte';
	import type { Story } from '$lib/types';
	import { whenInView } from '$lib/utils';
	import TextMorph from '$lib/utils/torph/TextMorph.svelte';
	import { createInfiniteQuery } from '@tanstack/svelte-query';

	const query = createInfiniteQuery(() => ({
		queryKey: ['stories'],
		queryFn: async ({ pageParam }) => {
			return await api<Story[]>('/news', {
				params: { page: pageParam }
			});
		},
		initialPageParam: 1,
		getNextPageParam: (_, allPages) => allPages.length + 1
	}));

	const buttonText = $derived.by(() => {
		if (query.isFetchingNextPage) {
			return 'Loading more...';
		} else if (query.hasNextPage) {
			return 'Load more';
		} else {
			return 'No more stories';
		}
	});
</script>

<Header title="Frontpage" />

<main class="mt-12">
	{#each query.data?.pages as stories (stories[0].id)}
		{#each stories as story (story.id)}
			<StoryListing {story} />
		{/each}
	{/each}
</main>

<button
	class="h-12 flex items-center gap-2 mx-auto border border-mist-200-800 px-4 bg-mist-100-900 hover:bg-mist-200-800 cursor-pointer w-full"
	onclick={() => query.fetchNextPage()}
>
	<TextMorph text={buttonText} />
</button>

<!-- <div class="w-fit flex" onclick={() => query.fetchNextPage()}> -->
<!-- {#if query.isFetching}
		<Spinner />
		Fetching more...
	{/if} -->
<!-- </div> -->
