<script lang="ts">
	import { resolve } from '$app/paths';

	export type LiteraryPeriodCardData = {
		slug: string;
		title: string;
		yearRange?: string;
		description?: string;
	};

	let { period }: { period: LiteraryPeriodCardData } = $props();

	function createPeriodHref(slug: string): `/periods/${string}` {
		return `/periods/${slug}`;
	}
</script>

<a
	href={resolve(createPeriodHref(period.slug))}
	class="block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
>
	<article
		class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
	>
		<div>
			<h2 class="text-xl font-medium text-[var(--color-secondary)]">{period.title}</h2>

			{#if period.yearRange}
				<p class="mt-2 text-sm font-medium text-[var(--color-primary)]">{period.yearRange}</p>
			{/if}
		</div>

		{#if period.description}
			<p class="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">{period.description}</p>
		{/if}
	</article>
</a>
