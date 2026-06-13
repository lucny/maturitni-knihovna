<script lang="ts">
	import { resolve } from '$app/paths';

	type NavigationItem = {
		href: '/' | '/books' | '/authors' | '/periods' | '/about';
		label: string;
	};

	const navigationItems: NavigationItem[] = [
		{ href: '/', label: 'Domu' },
		{ href: '/books', label: 'Knihy' },
		{ href: '/authors', label: 'Autori' },
		{ href: '/periods', label: 'Obdobi' },
		{ href: '/about', label: 'O projektu' }
	];
</script>

<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
	<div
		class="mx-auto flex min-h-[72px] max-w-7xl flex-col gap-3 px-4 py-4 sm:px-8 md:flex-row md:items-center md:justify-between md:py-0"
	>
		<a href={resolve('/')} class="text-lg font-semibold text-[var(--color-secondary)]"
			>Maturitni knihovna</a
		>

		<nav aria-label="Hlavni navigace" class="flex flex-wrap gap-1">
			{#each navigationItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</div>
</header>
