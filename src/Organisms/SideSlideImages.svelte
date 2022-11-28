<script lang="ts">
  import Icon from '../Atoms/Icon.svelte';
  import nl2br from 'nl2br';
  import Input from '../Atoms/Input.svelte';
  import { supabase } from '../lib/supabase';
  import TextArea from '../Atoms/TextArea.svelte';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { UUID } from '../lib/uuid';
  import { dbStore } from '../lib/store';
  import { formatFileType } from 'attractions/utils';
  import Image from '../Atoms/Image.svelte';
  import MetaText from '../Atoms/MetaText.svelte';
  import LinkToFile from '../Atoms/LinkToFile.svelte';
  import { DateTime } from 'luxon';
  import { fade } from 'svelte/transition';
  import Thumbnail from '../Atoms/Thumbnail.svelte';
  export let files = [];
</script>

<div class="uk-overflow-auto">
  <div class="uk-text-nowrap" uk-lightbox="animation: slide">
    {#each files as file}
      <div style="display:inline">
        {#key file.path}
          <Image clickable={true} height={200} path={file.path} />
        {/key}
      </div>
    {/each}
  </div>
</div>
