<script lang="ts">
  import SideSlideImages from '../Organisms/SideSlideImages.svelte';

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
  import { Modal } from 'attractions';
  export let files = [];
  export let id = '';
  export let remove = () => {};
  export let editMode = false;
</script>

<ul class="uk-margin-remove-top uk-list uk-list-divider uk-list-collapse" uk-sortable="handle: .uk-sortable-handle" {id}>
  {#each files as file}
    <li id={file.id}>
      <div class="uk-position-relative uk-flex uk-flex-middle" style="margin-bottom:2px;margin-top:2px">
        {#if editMode}
          <div style="min-width:30px">
            <span class="uk-sortable-handle uk-margin-small-right uk-text-center">
              <Icon icon="menu" />
            </span>
          </div>
        {/if}
        {#if file.filetype.indexOf('image') > -1}
          <div class="uk-margin-small-right">
            {#key file.path}
              <Thumbnail height={40} path={file.path} />
            {/key}
          </div>
        {/if}
        <div class="uk-text-truncate uk-margin-small-right uk-width-expand">
          <LinkToFile {file} />
        </div>
        <div class=" uk-flex uk-flex-middle">
          <div class="uk-margin-small-right">
            <a
              class="uk-icon-link"
              href={'#'}
              on:click={async () => {
                UIkit.modal.confirm('this will make this file accessible by anyone who knows the url for the next 30 days. Are you Okay??').then(
                  async function () {
                    let { data, error } = await supabase.storage.from('card-attachments').createSignedUrl(file.path, 60 * 60 * 24 * 30);
                    console.log({ data });
                    UIkit.modal.prompt('URL', data.signedUrl).then(() => {});
                  },
                  function () {}
                );
              }}
            >
              <Icon icon="link" />
            </a>
          </div>
          <div class="uk-margin-small-right">
            <a
              class="uk-icon-link"
              href={'#'}
              on:click={async () => {
                const { data, error } = await supabase.storage.from('card-attachments').download(file.path);
                var downLoadLink = document.createElement('a');
                downLoadLink.download = file.title;
                downLoadLink.href = URL.createObjectURL(new Blob([data], { type: data.type }));
                downLoadLink.dataset.downloadurl = [data.type, downLoadLink.download, downLoadLink.href].join(':');
                downLoadLink.click();
              }}
            >
              <Icon icon="cloud-download" />
            </a>
          </div>
          <MetaText>
            {file.filesize > 1000000 ? Math.round(file.filesize / 100000) / 10 + 'mb' : Math.round(file.filesize / 1000) + 'kb' || '?'}
            {DateTime.fromISO(file.created_at).toLocaleString(DateTime.DATE_SHORT)}
          </MetaText>
          {#if editMode}
            <div class="uk-margin-small-left">
              <a
                on:click={() => {
                  remove(file.id);
                }}
                class="uk-icon-link"
              >
                <Icon icon="trash" />
              </a>
            </div>
          {/if}
        </div>
      </div>
    </li>
  {/each}
</ul>
