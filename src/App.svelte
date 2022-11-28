<script>
  import svelteLogo from './assets/svelte.svg';
  import Counter from './lib/Counter.svelte';
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './pages/Auth.svelte';
  import Auth from './pages/Auth.svelte';
  import { User } from './lib/store';
  import { supabase } from './lib/supabase';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Button from './Atoms/Button.svelte';
  import Projects from './Templates/Projects.svelte';
  import CreateCard from './pages/CreateCard.svelte';
  import DeckPage from './Templates/DeckPage.svelte';
  import Departments from './Templates/Departments.svelte';
  import Department from './Templates/Department.svelte';
  import { initAgora } from './lib/chatSDK';

  User.subscribe(async (user) => {
    if (user) {
    }
  });
  onMount(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      User.set({ loggedIn: false });
      //navigate('/auth');
      return;
    }
    console.log(data.user);
    if (!data.user.user_metadata?.cometChatUID) {
      data.user.user_metadata.cometChatUID == user.uid;
    }
    User.set({
      ...data.user,
      loggedIn: true,
    });
    let res = await initAgora(data.user.id);
  });
</script>

<main>
  <Router>
    <Route path="/auth/*" component={Auth} />
    {#if $User.loggedIn}
      <Route path="/projects" component={Projects} />
      <Route path="/project/:projectId" component={Departments} />
      <Route path="/department/:departmentId" component={Department} />
      <Route path="/deck/:departmentId/:deckId" component={DeckPage} />
      <Route path="/create-card/:projectId/:deckId" component={CreateCard} />
      <Route path="/create-card/:projectId" component={CreateCard} />
    {/if}
  </Router>
</main>
