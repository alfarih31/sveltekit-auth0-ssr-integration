<script lang="ts">
	export let drawerOpen = false;
</script>

<footer class={`Footer ${drawerOpen && 'DrawerOpen'}`}>
	<hr />
	<div class="FooterContent">This is footer</div>
</footer>
