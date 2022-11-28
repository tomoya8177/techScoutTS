<script lang="ts">
  import { onMount } from 'svelte';
  import { link } from 'svelte-routing';
  import { bind } from 'svelte/internal';
  import { Project } from '../lib/store';
  import { supabase, supabaseFindOne } from '../lib/supabase';
  import TitleDescription from '../Organisms/TitleDescription.svelte';
  import { _ } from 'svelte-i18n';

  export let projectId: string;
  let departments: Array<{
    id: string;
    title: string;
    description: string;
    created_at: string;
  }> = [];
  let editMode = false;
  onMount(async () => {
    let project = await supabaseFindOne('Projects', ['id', projectId]);
    Project.set(project);
    let { data, error } = await supabase.from('Departments').select().eq('project', projectId);
    if (error) {
      UIkit.notification(error);
      return;
    }
    console.log(data);
    departments = data;
  });
  const save = async () => {
    await supabase.from('Projects').update($Project).eq('id', $Project.id);
    editMode = false;
    UIkit.notification($_('Saved'));
  };
</script>

<section class="uk-section">
  <div class="uk-container">
    <TitleDescription bind:title={$Project.title} bind:description={$Project.description} {save} bind:editMode />
    <ul class="uk-list uk-list-divider">
      {#each departments as department}
        <li>
          <a href={`/department/${department.id}`} use:link>
            {department.title}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>
