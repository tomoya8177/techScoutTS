<script lang="ts">
  import Icon from '../Atoms/Icon.svelte';
  import nl2br from 'nl2br';
  import Input from '../Atoms/Input.svelte';
  import { supabase } from '../lib/supabase';
  import TextArea from '../Atoms/TextArea.svelte';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import Project from '../Templates/Department.svelte';
  import { UUID } from '../lib/uuid';
  import { dbStore } from '../lib/store';
  import { formatFileType } from 'attractions/utils';
  import Image from '../Atoms/Image.svelte';
  import MetaText from '../Atoms/MetaText.svelte';
  import LinkToFile from '../Atoms/LinkToFile.svelte';
  import { DateTime } from 'luxon';
  import { fade } from 'svelte/transition';
  import Thumbnail from '../Atoms/Thumbnail.svelte';

  export let card;
  let editMode = false;

  onMount(async () => {
    await loadAttachments();
  });
  let attachments = [];
  $: console.log({ attachments });
  $: imageAttachments = attachments.filter((file) => file.filetype.indexOf('image') > -1);
  $: otherAttachments = attachments.filter((file) => file.filetype.indexOf('image') == -1);
  const loadAttachments = async () => {
    let { data, error } = await supabase.from('Attachments').select().eq('attachedTo', card.id).order('weight');
    attachments = data;
  };
</script>

<div class="uk-card  uk-card-hover uk-card-default uk-overflow-hidden uk-border-rounded" style="width:44px;height:44px" style:padding={'2px'} style:background-color={card.approved ? '#d3f8d3' : ''}>
  <div class="uk-card-media-top">
    {#if imageAttachments.length}
      {@const file = imageAttachments[0]}
      {#key file.path}
        <Thumbnail height={40} path={file.path} />
      {/key}
    {:else}
      <div class="uk-position-center uk-text-center uk-text-small ">
        {card.title}
      </div>
    {/if}
  </div>
</div>
