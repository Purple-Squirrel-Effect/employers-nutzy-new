<script lang="ts">
  import Editor from '@tinymce/tinymce-svelte';
</script>

<Editor
  cssClass="w-full"
  apiKey="gmhrpkmne8dgp1nr5ece5gv06jmfzgwvtpgwon69c2eaeu1z"
  conf={{
    height: 400,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
  
  }}
/>
