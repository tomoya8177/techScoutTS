<script lang="ts">
  import { supabase } from '../lib/supabase';
  import { _ } from 'svelte-i18n';
  import Icon from './Icon.svelte';
  import { dbStore, User } from '../lib/store';
  export let targetId: string = '';
  let inBookmark: boolean = false;
  dbStore.subscribe((obj) => {
    let res = dbStore.findOne('Bookmarks', [{ user: $User.id }, { target: targetId }]);
    inBookmark = !!res;
  });
  const getInBookmark = async (user) => {
    let { data, error } = await supabase.from('Bookmarks').select().eq('target', targetId).eq('user', user.id);
    if (error) {
      UIkit.notification(error);
      return;
    }
    console.log(data);
    if (data.length) {
      dbStore.add('Bookmarks', data[0]);
    }
  };

  User.subscribe((user) => {
    if (user) {
      getInBookmark(user);
    }
  });
  const addToBookmark = async () => {
    let { data, error } = await supabase.from('Bookmarks').insert({ target: targetId, user: $User.id }).select();
    dbStore.add('Bookmarks', data[0]);
  };
  const removeFromBookmark = async (id) => {
    let res = dbStore.findOne('Bookmarks', [{ user: $User.id }, { target: targetId }]);
    let { data, error } = await supabase.from('Bookmarks').delete().eq('id', res.id);
    dbStore.delete('Bookmarks', res.id);
  };
</script>

{#if inBookmark}
  <a class="uk-icon-link" on:click={removeFromBookmark}>
    <span style="color:blue">
      <Icon icon="bookmark" />
    </span>
  </a>
{:else}
  <a class="uk-icon-link" on:click={addToBookmark}>
    <span>
      <Icon icon="bookmark" />
    </span>
  </a>
{/if}
