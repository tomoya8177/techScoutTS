<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import RichTextarea from '../Atoms/RichTextarea.svelte';
  import { dbStore, Department, Project } from '../lib/store';
  import { supabase, supabaseFindMany, supabaseFindOne } from '../lib/supabase';
  import { UUID } from '../lib/uuid';
  import { _ } from 'svelte-i18n';
  import Button from '../Atoms/Button.svelte';
  import Projects from './Projects.svelte';
  import Input from '../Atoms/Input.svelte';
  import nl2br from 'nl2br';
  import { navigate } from 'svelte-routing';
  import Deck from '../Molecules/Deck.svelte';
  import DeckPage from './DeckPage.svelte';
  import { fade } from 'svelte/transition';
  import TitleDescription from '../Organisms/TitleDescription.svelte';
  import { errorNotification } from '../lib/errorNotification';
  import Card from '../Molecules/Card.svelte';
  import { loadDepartment } from '../lib/loadDepartment';

  let editMode: boolean = false;
  let decks = [];
  dbStore.subscribe((obj) => {
    if ($Department.id) {
      decks = dbStore.list('Decks', [{ department: $Department.id }]);
    }
  });
  export let departmentId;
  console.log(departmentId);
  onMount(async () => {
    loadDepartment(departmentId);
  });
  const save = async () => {
    let res = await supabase.from('Departments').update($Department).eq('id', $Department.id).select();
    console.log(res);
    UIkit.notification($_('Saved'));
    editMode = false;
  };
  const createDeck = async () => {
    let { data, error } = await supabase.from('Decks').insert({ department: departmentId }).select();
    if (error) {
      UIkit.notification(error);
      return;
    }
    console.log(data);
  };
</script>

<section class="uk-section">
  <div class="uk-container">
    {$Project.title}
    <TitleDescription bind:title={$Department.title} bind:description={$Department.description} {save} bind:editMode />
    <Deck projectId={$Department.id} />
    <ul class="uk-list uk-list-smal uk-list-divider">
      {#each decks as deck, i}
        <li>
          <Deck {deck} />
        </li>
      {/each}
    </ul>
    <div class="uk-margin">
      <Button fullwidth onclick={createDeck}>{$_('Create Deck')}</Button>
    </div>
  </div>
</section>
