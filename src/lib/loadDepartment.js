import { dbStore, Department, Project } from './store';
import { supabaseFindMany, supabaseFindOne } from './supabase';

export const loadDepartment = async (departmentId) => {
  console.log(departmentId);
  let department = await supabaseFindOne('Departments', ['id', departmentId]);
  console.log({ department });
  Department.set(department);
  let project = await supabaseFindOne('Projects', ['id', department.project]);
  Project.set(project);
  var data = await supabaseFindMany('Decks', ['department', department.id]);
  dbStore.add('Decks', data);
  console.log({ data });
  var promises = [];
  data.forEach((deck) => {
    promises.push(supabaseFindMany('Cards', ['deck', deck.id], 'weight'));
  });
  var results = await Promise.all(promises);
  let cards = [];
  results.forEach((results) => {
    results.forEach((result) => {
      cards.push(result);
    });
  });
  dbStore.add('Cards', cards);
  var promises = [];
  cards.forEach((card) => {
    promises.push(supabaseFindMany('Attachments', ['attachedTo', card.id]));
  });
  var results = await Promise.all(promises);
  let attachments = [];
  results.forEach((results) => {
    results.forEach((result) => {
      attachments.push(result);
    });
  });
  dbStore.add('Attachments', attachments);
};
