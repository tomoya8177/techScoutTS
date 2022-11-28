<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  export let height: number = 200;
  export let path: string = '';
  export let clickable: boolean = true;
  let src = '';
  onMount(async () => {
    const { data, error } = await supabase.storage.from('card-attachments').createSignedUrl(path, 3600);
    console.log({ data });
    src = data.signedUrl;
  });
</script>

{#if clickable}
  <a class="uk-inline" href={src}>
    <img {src} style:height={height + 'px'} />
  </a>
{:else}
  <img {src} style:height={height + 'px'} />
{/if}
