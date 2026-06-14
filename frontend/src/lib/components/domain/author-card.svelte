<script lang="ts">
	import { resolve } from '$app/paths';

	export type AuthorCardData = {
		slug: string;
		fullName: string;
		portraitUrl?: string;
		nationality?: string;
		lifeYears?: string;
	};

	let { author }: { author: AuthorCardData } = $props();

	function createAuthorHref(slug: string): `/authors/${string}` {
		return `/authors/${slug}`;
	}
</script>

<a
	href={resolve(createAuthorHref(author.slug))}
	class="block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
>
	<article
		class="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300"
	>
		<div class="aspect-[4/3] bg-slate-100">
			{#if author.portraitUrl}
				<img
					src={author.portraitUrl}
					alt={`Portret autora ${author.fullName}`}
					loading="lazy"
					decoding="async"
					width="400"
					height="300"
					class="h-full w-full object-cover"
				/>
			{:else}
				<div
					class="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500"
				>
					Portret neni k dispozici
				</div>
			{/if}
		</div>

		<div class="flex flex-1 flex-col gap-3 p-4">
			<h2 class="text-xl font-medium text-[var(--color-secondary)]">{author.fullName}</h2>

			<div class="mt-auto space-y-1 text-sm leading-6 text-slate-600">
				{#if author.nationality}
					<p>{author.nationality}</p>
				{/if}

				{#if author.lifeYears}
					<p>{author.lifeYears}</p>
				{/if}
			</div>
		</div>
	</article>
</a>
