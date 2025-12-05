<script lang="ts">
    import { db } from "$lib/db";
    let form: HTMLFormElement;
    async function handleSubmit(
        evt: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);
        const url = formData.get("url") as string;
        const id = await db.queue.add({ url });
        console.log(`New Queue id ${id}`);
        form.reset();
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="/blog">blog</a></p>
<p>Visit <a href="/dynamic">dynamic page</a></p>

<form bind:this={form} action="" method="POST" onsubmit={handleSubmit}>
    <input type="text" placeholder="url" name="url" />
    <button>Save</button>
</form>

<p>you are {navigator.onLine ? "online" : "offline"}</p>
