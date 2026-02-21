<script lang="ts">
	import { api } from '$lib/api';
	import StoryListing from '$lib/components/StoryListing.svelte';
	import type { Story } from '$lib/types';
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
</script>

<main class="max-w-xl mx-auto p-4">
	{#each query.data?.pages as stories (stories[0].id)}
		{#each stories as story (story.id)}
			<StoryListing {story} />
		{/each}
	{/each}
</main>
