<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import nl2br from 'nl2br';
  import { _ } from 'svelte-i18n';
  import Button from '../Atoms/Button.svelte';
  import Icon from '../Atoms/Icon.svelte';
  import Card from './Card.svelte';
  import { dbStore } from '../lib/store';
  import { fade } from 'svelte/transition';
  import MetaText from '../Atoms/MetaText.svelte';
  import Input from '../Atoms/Input.svelte';
  import { DateTime } from 'luxon';
  import CardIcon from './CardIcon.svelte';
  import { navigate, link } from 'svelte-routing';
  export let deck;
  let cards = [];
  dbStore.subscribe((obj) => {
    if (!deck) return;
    cards = dbStore.list('Cards', [{ deck: deck.id }]);
  });
  let editMode = false;
  const create = async () => {
    let { data, error } = await supabase.from('Cards').insert({ project: deck.department, deck: deck.id, weight: cards.length }).select();
    dbStore.add('Cards', data[0]);
  };
  const save = async () => {
    deck.updated_at = DateTime.now().toISO();
    let { data, error } = await supabase.from('Decks').update(deck).eq('id', deck.id).select();
    editMode = false;
  };
</script>

{#if deck}
  <div class="uk-position-relative">
    <div class="uk-text-lead">
      <a use:link href={'/deck/' + deck.department + '/' + deck.id}>
        {deck.title || 'Untitled'}
      </a>
    </div>
    <MetaText>
      {cards.filter((card) => card.approved).length} / {cards.length} cards approved | Last Updated: {DateTime.fromISO(deck.updated_at).toLocaleString(DateTime.DATETIME_SHORT)}
    </MetaText>

    <div class="uk-grid-match uk-grid-collapse" uk-grid>
      {#each cards as card}
        <div class="uk-margin-small-right">
          <CardIcon bind:card />
        </div>
      {/each}
    </div>
  </div>
{/if}
