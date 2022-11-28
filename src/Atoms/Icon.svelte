<script lang="ts">
  export let icon;
  export let align;
</script>

<span uk-icon={icon} style:vertical-align={align ? 'text-top' : ''} />
