<script lang="ts">
	import { resolve } from '$app/paths';

	import type { CurrentUser } from '$lib/auth/user';

	type NavigationItem = {
		href: '/' | '/books' | '/authors' | '/periods' | '/materials' | '/about';
		label: string;
	};

	let { user }: { user: CurrentUser | null } = $props();

	const navigationItems: NavigationItem[] = [
		{ href: '/', label: 'Domu' },
		{ href: '/books', label: 'Knihy' },
		{ href: '/authors', label: 'Autori' },
		{ href: '/periods', label: 'Obdobi' },
		{ href: '/materials', label: 'Materialy' },
		{ href: '/about', label: 'O projektu' }
	];
</script>

<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
	<div
		class="mx-auto flex min-h-[72px] max-w-7xl flex-col gap-3 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-0"
	>
		<a href={resolve('/')} class="text-lg font-semibold text-[var(--color-secondary)]"
			>Maturitni knihovna</a
		>

		<div class="flex flex-col gap-3 md:flex-row md:items-center">
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

			<form action={resolve('/search')} method="GET" class="flex w-full gap-2 md:w-72">
				<label for="public-search" class="sr-only">Vyhledavani</label>
				<input
					id="public-search"
					name="q"
					type="search"
					maxlength="80"
					placeholder="Hledat"
					class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
				/>
				<button
					type="submit"
					class="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
				>
					Hledat
				</button>
			</form>

			{#if user}
				<div class="flex items-center gap-2">
					<span class="max-w-44 truncate text-sm font-medium text-slate-700">
						{user.displayName}
					</span>
					<form action={resolve('/logout')} method="POST">
						<button
							type="submit"
							class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
						>
							Odhlasit
						</button>
					</form>
				</div>
			{:else}
				<a
					href={resolve('/login')}
					class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					Prihlaseni
				</a>
			{/if}
		</div>
	</div>
</header>
