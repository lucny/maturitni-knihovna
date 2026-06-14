<script lang="ts">
	import type { Snippet } from 'svelte';

	import StudentShell from '$lib/components/layout/student-shell.svelte';

	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<StudentShell user={data.user}>
	{@render children()}
</StudentShell>
