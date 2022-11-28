<script lang="ts">
  import { supabase } from '../lib/supabase';
  import { _ } from 'svelte-i18n';
  import Icon from './Icon.svelte';
  import { dbStore, User } from '../lib/store';
  export let targetId: string = '';
  let inFavorite: boolean = false;
  let count: number = 0;
  dbStore.subscribe((obj) => {
    let res = dbStore.list('Favorites', [{ target: targetId }]);
    count = res.length;
    res = res.filter((re) => re.user == $User.id).length;
    inFavorite = !!res;
  });
  const getInFavorite = async (user) => {
    let { data, error } = await supabase.from('Favorites').select().eq('target', targetId);
    if (error) {
      UIkit.notification(error);
      return;
    }
    count = data.length;
    data = data.filter((favorite) => favorite.user == $User.id);
    if (data.length) {
      dbStore.add('Favorites', data[0]);
    }
  };

  User.subscribe((user) => {
    if (user) {
      getInFavorite(user);
    }
  });
  const addToFavotire = async () => {
    let { data, error } = await supabase.from('Favorites').insert({ target: targetId, user: $User.id }).select();
    dbStore.add('Favorites', data[0]);
  };
  const removeFromFavotire = async (id) => {
    let res = dbStore.findOne('Favorites', [{ user: $User.id }, { target: targetId }]);
    let { data, error } = await supabase.from('Favorites').delete().eq('id', res.id);
    dbStore.delete('Favorites', res.id);
  };
</script>

{#if inFavorite}
  <a class="uk-icon-link" on:click={removeFromFavotire}>
    <span style="color:red">
      <Icon icon="heart" />
      {count}
    </span>
  </a>
{:else}
  <a class="uk-icon-link" on:click={addToFavotire}>
    <span>
      <Icon icon="heart" />
      {count}
    </span>
  </a>
{/if}
