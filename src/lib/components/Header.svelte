<script lang="ts">
	const { title }: { title: string } = $props();
</script>

<header
	class="fixed top-0 h-12 flex items-center inset-x-0 bg-mist-100-900/80 backdrop-blur border-b border-mist-200-800 z-50"
>
	<div class="max-w-[65ch] mx-auto px-4">
		<h1>{title}</h1>
	</div>
</header>
