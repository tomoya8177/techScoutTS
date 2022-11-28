<script lang="ts">
  import SortableFileList from './SortableFileList.svelte';

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
  import { richText } from '../lib/richText';
  import BookmarkButton from '../Atoms/BookmarkButton.svelte';
  import FavoriteButton from '../Atoms/FavoriteButton.svelte';
  export let card;
  let editMode = false;
  const save = async () => {
    console.log(card);
    let res = await supabase.from('Cards').update(card).eq('id', card.id);
    editMode = false;
    UIkit.notification($_('Saved'));
    if (card.deck) {
      let res = await supabase.from('Decks').update({ updated_at: DateTime.now().toISO() }).eq('id', card.deck);
    }
  };
  const approve = () => {
    card.approved = !card.approved;
    save();
  };
  onMount(async () => {
    await loadAttachments();
    if (attachments.length) {
      document.getElementById(`${card.id}_attachments`).addEventListener('moved', (event) => {
        let children = event.target.children;
        let promises = [];
        Array.from(children).forEach((fileEl, i) => {
          promises.push(supabase.from('Attachments').update({ weight: i }).eq('id', fileEl.id).select());
        });
        Promise.all(promises).then(async (results) => {
          console.log({ results });
          let arr = results.map((result) => {
            return result.data[0];
          });
          imageAttachments = arr.filter((file) => file.filetype.indexOf('image') > -1);
          //await loadAttachments();
        });
      });
    }
  });
  let attachments = [];
  $: console.log({ attachments });
  let imageAttachments = [];
  const loadAttachments = async () => {
    let { data, error } = await supabase.from('Attachments').select().eq('attachedTo', card.id).order('weight');
    let promises = [];
    data.forEach((file) => {
      promises.push(supabase.storage.from('card-attachments').createSignedUrl(file.path, 600));
    });
    let results = await Promise.all(promises);
    results.forEach((result, i) => {
      console.log({ result });
      data[i].signedUrl = result.data.signedUrl;
    });
    promises = [];

    attachments = data;
    imageAttachments = attachments.filter((file) => file.filetype.indexOf('image') > -1);
  };
  const upload = async (event) => {
    let promises = [];
    Array.from(event.target.files).forEach((file) => {
      console.log({ file });
      let extension = file.name.split('.').pop();
      promises.push(
        supabase.storage.from('card-attachments').upload('/' + card.deck + '/' + UUID() + '.' + extension, file, {
          cacheControl: '3600',
          upsert: true,
        })
      );
    });
    Promise.all(promises).then((results) => {
      let promises2 = [];
      results.forEach((result, i) => {
        let file = event.target.files[i];
        console.log(result.data, result.error);
        promises2.push(
          supabase
            .from('Attachments')
            .insert({
              path: result.data.path,
              title: file.name,
              attachedTo: card.id,
              filetype: file.type,
              filesize: file.size,
              weight: attachments.length + 1,
            })
            .select()
        );
      });
      Promise.all(promises2).then((results) => {
        console.log(results);
        results.forEach((result) => {
          attachments.push(result.data[0]);
        });
        attachments = attachments;
        imageAttachments = attachments.filter((file) => file.filetype.indexOf('image') > -1);
      });
    });
  };
  let id = UUID();
  const remove = async () => {
    let { error } = await supabase.from('Cards').delete().eq('id', card.id);
    dbStore.delete('Cards', card.id);
  };
  const removeAttachment = async (id) => {
    let { error } = await supabase.from('Attachments').delete().eq('id', id);
    attachments = attachments.filter((attachment) => attachment.id != id);
    imageAttachments = attachments.filter((file) => file.filetype.indexOf('image') > -1);
  };
</script>

<div class="uk-card  uk-card-hover uk-card-default uk-overflow-hidden uk-border-rounded" style:background-color={card.approved ? '#d3f8d3' : editMode ? 'lightyellow' : ''}>
  <div class="uk-card-media-top">
    <SideSlideImages files={imageAttachments} />
  </div>
  <div class="uk-card-body uk-text-small uk-position-relative" uk-margin>
    {#if editMode}
      <div class="uk-width-medium">
        <Input bind:value={card.title} />
      </div>
    {:else}
      <h3>
        <span class="uk-sortable-handle uk-margin-small-right uk-text-center">
          <Icon icon="menu" />
          {card.title}
        </span>
      </h3>
    {/if}
    <div class="uk-position-right uk-padding-small">
      <ul class="uk-iconnav">
        <li>
          <BookmarkButton targetId={card.id} />
        </li>
        <li>
          <FavoriteButton targetId={card.id} />
        </li>
        <li>
          <a on:click={approve}>
            <span style="color:lightgreen">
              <Icon icon="star" />
            </span>
          </a>
        </li>
      </ul>
    </div>
    <div>
      {#if editMode}
        <MetaText>
          {$_('Description')}
        </MetaText>
        <TextArea bind:value={card.description} />
      {:else if card.description}
        {#if card.description}
          <MetaText>
            {$_('Description')}
          </MetaText>
        {/if}
        <div>
          {@html richText(card.description)}
        </div>
      {/if}
    </div>

    {#if attachments.length}
      <div>
        <MetaText>
          {$_('Files')}
        </MetaText>
        <SortableFileList bind:files={attachments} id={`${card.id}_attachments`} remove={removeAttachment} {editMode} />
      </div>
    {/if}
    <ul class="uk-iconnav uk-position-bottom-right" style="padding:5px">
      <li>
        <input type="file" on:change={upload} hidden {id} multiple />
        <a
          on:click={() => {
            document.getElementById(id).click();
          }}
        >
          <Icon icon="cloud-upload" />
        </a>
      </li>
      {#if editMode}
        <li>
          <a on:click={remove}>
            <Icon icon="trash" />
          </a>
        </li>
        <li>
          <a on:click={save}>
            <Icon icon="check" />
          </a>
        </li>
      {:else}
        <li>
          <a
            on:click={() => {
              editMode = true;
            }}
          >
            <Icon icon="pencil" />
          </a>
        </li>
      {/if}
    </ul>
  </div>
</div>
