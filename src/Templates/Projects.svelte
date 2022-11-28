<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Button from '../Atoms/Button.svelte';
  import { supabase } from '../lib/supabase';
  import { dbStore, User } from '../lib/store';
  import Icon from '../Atoms/Icon.svelte';
  import RichTextarea from '../Atoms/RichTextarea.svelte';
  import { UUID } from '../lib/uuid';
  import { fade } from 'svelte/transition';
  import { DateTime } from 'luxon';
  import { navigate } from 'svelte-routing';
  $: myProjects = dbStore.list('myProjects');
  dbStore.subscribe((array) => {
    myProjects = dbStore.list('myProjects');
  });
  $: console.log(myProjects);
  onMount(async () => {
    let { data, error } = await supabase.from('Memberships').select('user,level,project(*)').eq('user', $User.id);
    let projects = data
      .map((membership) => {
        return { ...membership.project, level: membership.level || 'admin' };
      })
      .filter((project) => project);
    console.log(projects);
    projects.forEach((project) => {
      dbStore.add('myProjects', { ...project, myLevel: 'admin' });
    });
  });
  const create = async () => {
    UIkit.modal.prompt('title').then(async (title) => {
      if (!title) return;
      let res = await supabase.from('Projects').insert({ title }).select();
      let project = res.data[0];
      let res2 = await supabase.from('Memberships').insert({ project: res.data[0].id, user: $User.id, level: 'admin' }).select();
      project.myLevel = 'admin';
      let departmentRes = await supabase
        .from('Departments')
        .insert({
          project: project.id,
          title: 'Default Department',
        })
        .select();
      let department = departmentRes.data[0];
      let permissionRes = await supabase
        .from('Permissions')
        .insert({
          department: department.id,
          user: $User.id,
          status: 'member',
        })
        .select();
      let permission = permissionRes.data[0];
      dbStore.add('myProjects');
    });
  };
</script>

<section class="uk-section">
  <div class="uk-container">
    <h1>{$_('Projects')}</h1>
    <Button onclick={create}>
      <Icon align icon="plus" />
      {$_('Create')}
    </Button>
    {#if myProjects}
      <ul class="uk-list uk-list-divider">
        {#each myProjects as project}
          <li transition:fade>
            <div class="uk-flex uk-middle uk-position-relative">
              <div>
                <h2>
                  <a on:click={navigate(`/project/${project.id}`)}>
                    {project.title}
                  </a>
                </h2>
                <div class="uk-text-meta">
                  Created on
                  {DateTime.fromISO(project.created_at).toLocaleString()}
                </div>
              </div>
              <div class="uk-position-right">
                <span class="uk-label">
                  {project.myLevel}
                </span>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
