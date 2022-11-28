<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { Router, Route } from 'svelte-routing';
  import Button from '../Atoms/Button.svelte';
  import { User } from '../lib/store';
  import { supabase } from '../lib/supabase';
  import Login from './Login.svelte';
  import Register from './Register.svelte';
  import UpdateAuth from './UpdateAuth.svelte';
  let ConfirmationURL = 'https://narra.jp';
  onMount(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) return;
    User.set({
      ...data.user,
      loggedIn: true,
    });
  });
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      UIkit.notification(error);
      return;
    }
    User.set({ loggedIn: false });
  };
</script>

<Router>
  {#if !$User.loggedIn}
    <Route path="register/" component={Register} />
    <Route path="forgot-password/">forgot password</Route>
    <Route path="" component={Login} />
  {:else}
    <Route path="update" component={UpdateAuth} />
    <Button onclick={logout}>{$_('Logout')}</Button>
    logged In!
  {/if}
</Router>
