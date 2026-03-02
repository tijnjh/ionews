<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Story } from '$lib/types';

	const { story }: { story: Story } = $props();
</script>

<a
	href={resolve('/story/[id]', { id: story.id.toString() })}
	class="rounded-2xl p-4 mb-2 grid grid-cols-[auto_1fr] gap-x-4 grid-rows-2 bg-mist-700"
>
	<img
		alt="favicon"
		class="rounded row-span-2 size-12"
		src={`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`}
	/>

	<div class="title" style="view-transition-name: story-title-{story.id}">{story.title}</div>
	<div>
		<span>{story.points} points</span>
		<span>{story.comments_count} comments</span>
	</div>
</a>
