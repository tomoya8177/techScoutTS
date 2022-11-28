<script lang="ts">
  export let value;
  export let type: string = 'text';
</script>

{#if type == 'password'}
  <input class="uk-input" type="password" bind:value />
{:else}
  <input class="uk-input" type="text" bind:value />
{/if}
