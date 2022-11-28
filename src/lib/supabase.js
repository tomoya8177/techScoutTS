import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../../env';
import { DB, dbStore } from './store';
import { _ } from 'svelte-i18n';
import { errorNotification } from './errorNotification';
const options = {
  schema: 'public',
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};
export const supabase = createClient(supabaseUrl, supabaseKey, options);
supabase
  .channel('*')
  .on('postgres_changes', { event: '*', schema: '*' }, async (data) => {
    console.log('Change received!', data.eventType, data);
    let res = await supabase.auth.getUser();
    switch (data.eventType) {
      case 'INSERT':
        switch (data.table) {
          case 'Memberships':
            if (data.new.user == res.data.user.id) {
              let res2 = await supabase.from('Projects').select().eq('id', data.new.project);
              let project = res2.data[0];
              dbStore.add('myProjects', project);
              UIkit.notification('Your Project Added');
            }
            break;
        }
        break;
      case 'UPDATE':
        switch (data.table) {
          case 'Projects':
            console.log({ data, list: dbStore.list('myProjects', [{ id: data.new.id }]) });
            if (dbStore.list('myProjects', [{ id: data.new.id }]).length) {
              //exists
              console.log('exists');
              dbStore.add('myProjects', data.new);
            }
            break;
          case 'Decks':
            console.log({ data, list: dbStore.list('Decks', [{ id: data.new.id }]) });
            if (dbStore.list('Decks', [{ id: data.new.id }]).length) {
              //exists
              console.log('exists');
              dbStore.add('Decks', data.new);
            }
            break;
        }
        break;
    }
  })
  .subscribe();
export const supabaseFindOne = async (table, filter) => {
  var { data, error } = await supabase.from(table).select().eq(filter[0], filter[1]);
  if (errorNotification(error)) return;
  return data[0];
};
export const supabaseFindMany = async (table, filter, order = false, ascending = true) => {
  if (order) {
    if (ascending) {
      var { data, error } = await supabase.from(table).select().eq(filter[0], filter[1]).order(order);
    } else {
      var { data, error } = await supabase.from(table).select().eq(filter[0], filter[1]).order(order, { ascending: false });
    }
  } else {
    var { data, error } = await supabase.from(table).select().eq(filter[0], filter[1]);
  }
  if (errorNotification(error)) return;
  return data;
};
