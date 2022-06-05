<script lang="ts">
	import Paper, { Content } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { onMount } from 'svelte';
	import DataTable, {
		Head,
		Body,
		Row,
		Cell as TableCell,
		Label,
		Pagination,
	} from '@smui/data-table';
	import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button';
	import { browser } from '$app/env';

	let rowsPerPage = 2;
	let users = [];
	let currentPage = 0;
	let end = 0;
	let start = 0;
	let total = 0;

	$: isLastPage = currentPage === end;

	let stats: Promise<{ totalSignedUp: number; logins: number; weeklyLogins: number }> =
		new Promise<{
			totalSignedUp: number;
			logins: number;
			weeklyLogins: number;
		}>(() => {});

	const getStats = async () => {
		try {
			const res = await fetch('/api/stats');
			stats = res.json();
		} catch (err) {
			console.error(err);
		}
	};

	const handleFetchUsers = async () => {
		if (browser) {
			const res = await fetch(`/api/users?page=${currentPage}&perPage=${rowsPerPage}`);
			const { users: _users, total: _total, start: _start } = await res.json();
			users = _users;
			total = _total;
			start = _start;
			end = Math.ceil(total / rowsPerPage) - 1;
		}
	};

	const handlePrevious = async () => {
		currentPage--;
		return handleFetchUsers();
	};

	const handleNext = async () => {
		currentPage++;
		return handleFetchUsers();
	};

	const handleLastPage = async () => {
		currentPage = end;
		return handleFetchUsers();
	};

	const handleFirstPage = async () => {
		currentPage = 0;
		return handleFetchUsers();
	};

	$: {
		if (rowsPerPage) {
			currentPage = 0;
			end = 0;
			start = 0;
			total = 0;
			handleFetchUsers();
		}
	}

	onMount(() => {
		getStats();
	});
</script>

<div class="mdc-typography--headline3" style="margin: 1rem">Dashboard</div>

<Paper class="cms-dashboard__paper">
	<Content>
		<LayoutGrid>
			<Cell span="4">
				<div class="mdc-typography--headline6">Total sign up users</div>
				<div class="mdc-typography--subtitle1">
					{#await stats}
						Loading...
					{:then stats}
						{stats.totalSignedUp}
					{/await}
				</div>
			</Cell>
			<Cell span="4">
				<div class="mdc-typography--headline6">Total sign in users today</div>
				<div class="mdc-typography--subtitle1">
					{#await stats}
						Loading...
					{:then stats}
						{stats.logins}
					{/await}
				</div>
			</Cell>
			<Cell span="4">
				<div class="mdc-typography--headline6">Total weekly sign in users</div>
				<div class="mdc-typography--subtitle1">
					{#await stats}
						Loading...
					{:then stats}
						{stats.weeklyLogins}
					{/await}
				</div>
			</Cell>
		</LayoutGrid>
	</Content>
</Paper>

<Paper class="cms-dashboard__paper">
	<DataTable table$aria-label="user-data" style="width: 100%">
		<Head>
			<Row>
				<TableCell numeric columnId="no">
					<Label>No</Label>
				</TableCell>
				<TableCell columnId="user_id">
					<Label>User Id</Label>
				</TableCell>
				<TableCell columnId="nickname">
					<Label>Nickname</Label>
				</TableCell>
				<TableCell columnId="email">
					<Label>Email</Label>
				</TableCell>
				<TableCell columnId="created_at">
					<Label>Signup Date</Label>
				</TableCell>
				<TableCell columnId="last_login">
					<Label>Last Login</Label>
				</TableCell>
				<TableCell columnId="logins_count">
					<Label>Logins Count</Label>
				</TableCell>
			</Row>
		</Head>
		<Body>
			{#each users as user, i}
				<Row>
					<TableCell numeric columdId="no">
						{start + i + 1}
					</TableCell>
					<TableCell>
						{user.user_id.split('|')[1]}
					</TableCell>
					<TableCell>
						{user.nickname}
					</TableCell>
					<TableCell>
						{user.email}
					</TableCell>
					<TableCell>
						{user.created_at}
					</TableCell>
					<TableCell>
						{user.last_login}
					</TableCell>
					<TableCell>
						{user.logins_count}
					</TableCell>
				</Row>
			{/each}
		</Body>
		<Pagination slot="paginate">
			<svelte:fragment slot="rowsPerPage">
				<Label>Rows Per Page</Label>
				<Select variant="outlined" bind:value={rowsPerPage} noLabel>
					<Option value={2}>2</Option>
					<Option value={5}>5</Option>
					<Option value={10}>10</Option>
					<Option value={25}>25</Option>
					<Option value={100}>100</Option>
				</Select>
			</svelte:fragment>
			<svelte:fragment slot="total">
				{start + 1}-{users.length + start} of {total}
			</svelte:fragment>

			<IconButton
				class="material-icons"
				action="first-page"
				title="First page"
				on:click={handleFirstPage}
				disabled={currentPage === 0}>first_page</IconButton
			>
			<IconButton
				class="material-icons"
				action="prev-page"
				title="Prev page"
				on:click={handlePrevious}
				disabled={currentPage === 0}>chevron_left</IconButton
			>
			<IconButton
				class="material-icons"
				action="next-page"
				title="Next page"
				on:click={handleNext}
				disabled={isLastPage}>chevron_right</IconButton
			>
			<IconButton
				class="material-icons"
				action="last-page"
				title="Last page"
				on:click={handleLastPage}
				disabled={isLastPage}>last_page</IconButton
			>
		</Pagination>
	</DataTable>
</Paper>
