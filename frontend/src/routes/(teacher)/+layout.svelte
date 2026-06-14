<script lang="ts">
	import type { Snippet } from 'svelte';

	import TeacherShell from '$lib/components/layout/teacher-shell.svelte';

	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<TeacherShell user={data.user}>
	{@render children()}
</TeacherShell>
