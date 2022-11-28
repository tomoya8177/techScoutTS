<script lang="ts">
  import BookmarkButton from '../Atoms/BookmarkButton.svelte';

  import TitleDescription from '../Organisms/TitleDescription.svelte';

  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import nl2br from 'nl2br';
  import { _ } from 'svelte-i18n';
  import Button from '../Atoms/Button.svelte';
  import Icon from '../Atoms/Icon.svelte';
  import Card from '../Molecules/Card.svelte';
  import { dbStore, Project, Department } from '../lib/store';
  import { fade } from 'svelte/transition';
  import MetaText from '../Atoms/MetaText.svelte';
  import Input from '../Atoms/Input.svelte';
  import { DateTime } from 'luxon';
  import CardIcon from '../Molecules/CardIcon.svelte';
  import { loadDepartment } from '../lib/loadDepartment';
  export let departmentId: string = '';
  export let deckId: string | null = null;
  let editMode = false;

  let cards = [];
  let deck = {};
  let department = {};
  dbStore.subscribe((array) => {
    if (!deck) return;
    cards = dbStore.list('Cards', [{ deck: deckId }]).map((card) => {
      return card;
    });
  });
  onMount(async () => {
    deck = dbStore.get('Decks', deckId);
    if (!deck) {
      await loadDepartment(departmentId);
      deck = dbStore.get('Decks', deckId);
    }
  });
  const create = async () => {
    let { data, error } = await supabase
      .from('Cards')
      .insert({ deck: deckId, weight: cards.length + 1 })
      .select();
    dbStore.add('Cards', data[0]);
  };
  const save = async () => {
    deck.updated_at = DateTime.now().toISO();
    let { data, error } = await supabase.from('Decks').update(deck).eq('id', deck.id).select();
    editMode = false;
  };
</script>

<section class="uk-section">
  <div class="uk-container">
    <div>
      {#if deck}
        {$Project.title} | {$Department?.title}
        <div class="uk-text-right" style:height="26px">
          <BookmarkButton bind:targetId={deckId} />
        </div>
        <TitleDescription bind:title={deck.title} bind:description={deck.description} bind:editMode {save}>
          <MetaText>
            {cards.filter((card) => card.approved).length} / {cards.length} cards approved
            {#if deckId}
              | Last Updated: {DateTime.fromISO(deck.updated_at).toLocaleString(DateTime.DATETIME_SHORT)}
            {/if}
          </MetaText>
        </TitleDescription>
      {:else}
        {$_('Cards belonging to no stack')}
      {/if}
      <ul class="uk-list" uk-sortable="handle: .uk-sortable-handle" id={`${departmentId}_${deckId}`}>
        {#each cards as card}
          <li id={card.id} transition:fade>
            <Card bind:card />
          </li>
        {/each}
      </ul>
      <Button fullwidth small onclick={create}>
        <Icon icon="plus" align />
        {$_('Create Card')}</Button
      >
    </div>
  </div>
</section>
