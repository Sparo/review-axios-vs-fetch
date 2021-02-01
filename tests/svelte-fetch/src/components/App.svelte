<script>
	// imports
	import { onMount } from "svelte/internal";
	import API from "../plugins/api";
	import Loader from "./Loader.svelte";

	export const userId = 1;

	// variables
	const api = new API();
	let todos = [];
	let timeout = false;
	let completedTodos = [];
	let newTodo = "";
	let todoSchema = {
		userId: null,
		id: null,
		title: "",
		completed: false,
	};
	let loader = false;

	// functions
	function updateToDo(event) {
		// cache element
		const elem = event.target;
		// update todos state and re-assing variable so we can have autoupdate
		todos = todos.map((todo) => {
			if (todo.id == elem.id) {
				todo.completed = elem.checked;
				api.put(`/todo/${todo.id}`, todo);
			}
			return todo;
		});
	}

	async function getCompleted(event) {
		event.preventDefault();
		loader = true;
		completedTodos = await api.get("/todos/completed");
		if (completedTodos.isError) {
			completedTodos = [];
			timeout = true;
		}
		loader = false;
	}

	function back() {
		window.history.back();
	}

	async function addNewTodo() {
		if (newTodo) {
			const data = Object.assign({}, todoSchema, {
				userId: userId,
				id: todos.length + 1,
				title: newTodo,
				completed: false,
			});

			todos[todos.length] = data;
			newTodo = "";
			await api.post("/todo", data);
		}
	}

	function submitHandler(event) {
		event.preventDefault();
		addNewTodo();

		document.getElementById("newTodo").focus();
	}

	// hooks
	onMount(async () => {
		todos = await api.get("/todos");
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
			<form action="" id="form" on:submit={submitHandler}>
				<input
					id="newTodo"
					bind:value={newTodo}
					type="text"
					placeholder="type in todo"
				/>
				<button type="submit">Add</button>

				<button on:click={getCompleted}> Get completed todos </button>
				{#if !timeout}
					<span>{completedTodos.map((item) => item.id)}</span>
				{:else}
					<span v-if="timeout" style="color: red">
						Timeout Abort...
					</span>
				{/if}
			</form>
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
