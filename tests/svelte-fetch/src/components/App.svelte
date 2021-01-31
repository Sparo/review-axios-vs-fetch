<script>
	// imports
	import { onMount } from "svelte/internal";
	import API from "../plugins/api";
	import Loader from "./Loader.svelte";

	// variables
	const api = new API();
	let todos = [];

	// functions
	function updateToDo(event) {
		// cache element
		const elem = event.target;
		// update todos state and re-assing variable so we can have autoupdate
		todos = todos.map((todo) => {
			if (todo.id == elem.id) {
				todo.completed = elem.checked;
			}
			return todo;
		});
	}

	function back() {
		window.history.back();
	}

	// hooks
	onMount(async () => {
		todos = await api.fetch("/todos");
	});

	// computed
	$: done = todos.filter((item) => item.completed).length;
	$: showLoader = todos.length === 0;
	// $: console.log("TODOS incoming:", todos);
</script>

<main>
	<button on:click={back}>Back</button>

	{#if showLoader}
		<Loader />
	{:else}
		<div>
			<h3>
				Done {done} of {todos.length}
				<i>&#8592; this is reactive heading</i>
			</h3>
			<ul>
				{#each todos as todo}
					<li>
						<input
							type="checkbox"
							id={todo.id}
							checked={todo.completed}
							on:change={updateToDo}
						/>
						<label for={todo.id} class={todo.completed && "strike"}>
							{todo.title}
						</label>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</main>

<style>
	h3 > i {
		font-weight: 200;
		color: orange;
	}

	ul {
		list-style-type: none;
	}
	li {
		padding: 5px;
		display: flex;
		align-items: center;
		line-height: 2em;
	}
	li:hover {
		background-color: aliceblue;
		cursor: pointer;
	}
	input {
		margin: 0.51em;
	}
	label {
		cursor: pointer;
	}

	.strike {
		text-decoration: line-through;
		color: lightgray;
	}
</style>
