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

<div class="uk-cover-container uk-border-rounded" style="width:{height}px;height:{height}px">
  <img {src} style:height={height + 'px'} class="uk-border-rounded" uk-cover />
</div>
