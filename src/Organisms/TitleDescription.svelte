<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import nl2br from 'nl2br';
  import { _ } from 'svelte-i18n';
  import Button from '../Atoms/Button.svelte';
  import Icon from '../Atoms/Icon.svelte';
  import Card from '../Molecules/Card.svelte';
  import { dbStore } from '../lib/store';
  import { fade } from 'svelte/transition';
  import MetaText from '../Atoms/MetaText.svelte';
  import Input from '../Atoms/Input.svelte';
  import { DateTime } from 'luxon';
  import CardIcon from '../Molecules/CardIcon.svelte';
  import { richText } from '../lib/richText';
  export let title: string = '';
  export let description: string = '';
  export let editMode: boolean = false;
  export let save: () => void = () => {};
</script>

<div class="uk-position-relative">
  <div class="uk-width-medium">
    {#if editMode}
      <Input bind:value={title} />
    {:else}
      <div class="uk-text-lead">
        {title || 'Untitled'}
      </div>
    {/if}
  </div>
  <slot />
  <div class="uk-margin">
    {#if editMode}
      <div class="uk-text-meta">
        {$_('Description')}
      </div>
      <textarea class="uk-textarea" bind:value={description} />
    {:else if description}
      <div class="uk-text-meta">
        {$_('Description')}
      </div>
      <div class="uk-text-small">
        {@html richText(description)}
      </div>
    {/if}
  </div>
  <ul class="uk-iconnav uk-position-top-right">
    {#if editMode}
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
