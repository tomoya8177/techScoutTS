<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Input from '../Atoms/Input.svelte';
  import { supabase } from '../lib/supabase';
  import { FormField, TextField } from 'attractions';
  import EmailAndPasswordInput from '../Organisms/EmailAndPasswordInput.svelte';
  import { User } from '../lib/store';
  import { navigate } from 'svelte-routing';
  let email = '';
  let password = '';

  const login = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data, error);
    if (error) {
      UIkit.notification(error);
      return;
    }

    User.set({
      ...data.user,
      loggedIn: true,
    });
    console.log(data.session.access_token);
    navigate('/projects');
  };
</script>

<section class="uk-section">
  <div class="uk-container">
    <h1>
      {$_('Login')}
    </h1>
    <EmailAndPasswordInput bind:email bind:password />
    <div class="uk-margin">
      <button class="uk-button uk-button-default" on:click={login}>{$_('Login')}</button>
    </div>
  </div>
</section>
