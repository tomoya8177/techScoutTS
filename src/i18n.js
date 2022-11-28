import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

// en, en-US and pt are not available yet

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
