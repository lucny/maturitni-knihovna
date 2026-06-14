<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	type StudentNavigationItem = {
		href: '/student' | '/student/books' | '/student/notes' | '/profile';
		label: string;
	};

	const navigationItems: StudentNavigationItem[] = [
		{ href: '/student', label: 'Prehled' },
		{ href: '/student/books', label: 'Moje knihy' },
		{ href: '/student/notes', label: 'Poznamky' },
		{ href: '/profile', label: 'Profil' }
	];
</script>

<div class="min-h-screen bg-slate-50 text-slate-950">
	<header class="border-b border-slate-200 bg-white">
		<div
			class="mx-auto flex min-h-[72px] max-w-7xl flex-col gap-3 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-0"
		>
			<div class="flex flex-col gap-1">
				<a href={resolve('/')} class="text-lg font-semibold text-[var(--color-secondary)]">
					Maturitni knihovna
				</a>
				<p class="text-sm text-slate-600">{data.user.displayName}</p>
			</div>

			<div class="flex flex-col gap-3 md:flex-row md:items-center">
				<nav aria-label="Studentska navigace" class="flex flex-wrap gap-1">
					{#each navigationItems as item (item.href)}
						<a
							href={resolve(item.href)}
							class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
						>
							{item.label}
						</a>
					{/each}
				</nav>

				<form action={resolve('/logout')} method="POST">
					<button
						type="submit"
						class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
					>
						Odhlasit
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
		{@render children()}
	</main>
</div>
