<script>
  import { _ } from 'svelte-i18n';
  import Input from '../Atoms/Input.svelte';
  export let email = '';
  export let password = '';
</script>

{$_('Email')}
<Input bind:value={email} />
{$_('Password')}
<Input bind:value={password} type="password" />
