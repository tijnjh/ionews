<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import './layout.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	let { children } = $props();

	const queryClient = new QueryClient();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
