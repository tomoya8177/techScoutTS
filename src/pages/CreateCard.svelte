<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Button from '../Atoms/Button.svelte';
  import Input from '../Atoms/Input.svelte';
  import MetaText from '../Atoms/MetaText.svelte';
  import TextArea from '../Atoms/TextArea.svelte';
  import { supabase } from '../lib/supabase';

  export let projectId: string;
  export let deckId: string;
  export let nextWeight: number;
  let card = {
    project: projectId,
    deck: deckId,
  };
  const create = async () => {
    let { data, error } = await supabase.from('Cards').insert(card).select();
    if (error) {
      UIkit.notification(error);
      return;
    }
  };
</script>

<section class="uk-section">
  <div class="uk-container" uk-margin>
    <h1>Create Card</h1>
    <div uk-margin>
      <div>
        <MetaText>{$_('Title')}</MetaText>
        <Input bind:value={card.title} />
      </div>
      <div>
        <MetaText>{$_('Description')}</MetaText>
        <TextArea bind:value={card.description} />
      </div>
    </div>
    <Button onclick={create}>{$_('Create')}</Button>
  </div>
</section>
