<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { UUID } from '../lib/uuid';
  export let value: string = '';
  export let id;
  onMount(() => {
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      //[{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      //[{ direction: 'rtl' }], // text direction

      //[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      // [{ font: [] }],
      [{ align: [] }],

      //['clean'], // remove formatting button
    ];
    var editor = new Quill(document.getElementById(id), {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
    });
    editor.setContents(value);
    editor.on('text-change', function (delta, oldDelta, source) {
      if (source == 'api') {
        console.log('An API call triggered this change.');
      } else if (source == 'user') {
        console.log('A user action triggered this change.');
      }
      value = editor.getContents();
    });
  });
</script>

<div {id} />
