import { writable } from 'svelte/store';
export const Department = writable({});
export const Project = writable({});
export const User = writable({});
export const DB = writable({
  myProjects: [],
  Cards: [],
  Decks: [],
  Favorites: [],
  Departments: [],
  Permissions: [],
  Bookmarks: [],
  Attachments: [],
});
let dbItems = {};

DB.subscribe((array) => {
  dbItems = array;
});
export const dbStore = {
  subscribe: DB.subscribe,
  list: (table, filters = []) => {
    let items = dbItems[table];
    filters.forEach((filter) => {
      let key = Object.keys(filter)[0];
      items = items.filter((item) => {
        return item[key] == filter[key];
      });
    });
    return items;
  },
  findOne: (table, filters = []) => {
    let items = dbItems[table];
    filters.forEach((filter) => {
      let key = Object.keys(filter)[0];
      items = items.filter((item) => {
        return item[key] == filter[key];
      });
    });
    return items[0];
  },
  get: (table, id) => {
    let items = dbItems[table];
    let item = items.find((item) => item.id == id);
    return item;
  },
  delete: (table, id) => {
    dbItems[table] = dbItems[table].filter((item) => item.id != id);
    DB.set(dbItems);
  },
  add: (table, data) => {
    if (Array.isArray(data)) {
      DB.update((old) => {
        data.forEach((d) => {
          if (old[table].some((item) => item.id == d.id)) {
            old[table] = old[table].map((item) => {
              if (item.id == d.id) {
                return { ...item, ...d };
              }
              return item;
            });
          } else {
            old[table].push(d);
          }
        });
        return old;
      });
    } else {
      if (dbItems[table].some((item) => item.id == data.id)) {
        dbItems[table] = dbItems[table].map((item) => {
          if (item.id == data.id) {
            return { ...item, ...data };
          }
          return item;
        });
      } else {
        dbItems[table].push(data);
      }
      DB.update((old) => {
        return dbItems;
      });
    }
  },
};
