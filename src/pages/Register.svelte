<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Input from '../Atoms/Input.svelte';
  import { supabase } from '../lib/supabase';
  import { FormField, TextField } from 'attractions';
  import EmailAndPasswordInput from '../Organisms/EmailAndPasswordInput.svelte';
  let email = '';
  let password = '';

  const register = async () => {
    let { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      UIkit.notification(error);
      return;
    }
    console.log(data, error);
  };
</script>

<section class="uk-section">
  <div class="uk-container">
    <h1>
      {$_('Register')}
    </h1>
    <EmailAndPasswordInput bind:email bind:password />
    <div class="uk-margin">
      <button class="uk-button uk-button-default" on:click={register}>{$_('Register')}</button>
    </div>
  </div>
</section>
