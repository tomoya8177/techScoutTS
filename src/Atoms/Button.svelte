<script lang="ts">
  export let onclick;
  export let fullwidth: boolean = false;
  export let small: boolean = false;
</script>

<button class:uk-button-small={small} class:uk-width-expand={fullwidth} on:click={onclick} class=" uk-button uk-button-default">
  <slot />
</button>
