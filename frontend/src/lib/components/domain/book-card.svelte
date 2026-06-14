<script lang="ts">
	import { resolve } from '$app/paths';

	export type BookCardData = {
		slug: string;
		title: string;
		authorName: string;
		literaryPeriodTitle?: string;
		coverUrl?: string;
	};

	let { book }: { book: BookCardData } = $props();

	function createBookHref(slug: string): `/books/${string}` {
		return `/books/${slug}`;
	}
</script>

<a
	href={resolve(createBookHref(book.slug))}
	class="block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
>
	<article
		class="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300"
	>
		<div class="aspect-[2/3] bg-slate-100">
			{#if book.coverUrl}
				<img
					src={book.coverUrl}
					alt={`Obalka knihy ${book.title}`}
					loading="lazy"
					decoding="async"
					width="400"
					height="600"
					class="h-full w-full object-cover"
				/>
			{:else}
				<div
					class="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500"
				>
					Obalka neni k dispozici
				</div>
			{/if}
		</div>

		<div class="flex flex-1 flex-col gap-3 p-4">
			<div>
				<h2 class="text-xl font-medium text-[var(--color-secondary)]">{book.title}</h2>
				<p class="mt-2 text-sm leading-6 text-slate-600">{book.authorName}</p>
			</div>

			{#if book.literaryPeriodTitle}
				<p
					class="mt-auto w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
				>
					{book.literaryPeriodTitle}
				</p>
			{/if}
		</div>
	</article>
</a>
