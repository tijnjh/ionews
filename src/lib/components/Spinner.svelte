<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { match } from 'ts-pattern';

	interface SpinnerProps extends HTMLAttributes<HTMLElement> {
		size?: 'sm' | 'md' | 'lg';
	}

	const { class: className, size = 'md', ...props }: SpinnerProps = $props();

	const sizeClass = $derived(() =>
		match(size)
			.with('sm', () => 'size-3 border')
			.with('md', () => 'size-4 border-2')
			.with('lg', () => 'size-5 border-4')
			.exhaustive()
	);
</script>

<div
	{...props}
	class={[
		sizeClass,
		'border-mist-200-800 border-t-mist-600-400 rounded-full animate-spin',
		className
	]}
></div>
