<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  export let file;
</script>

<a
  class="uk-inline"
  href={'#'}
  on:click={async () => {
    let { data, error } = await supabase.storage.from('card-attachments').createSignedUrl(file.path, 60);
    window.open(data.signedUrl, '_target');
  }}
>
  {file.title}
</a>
