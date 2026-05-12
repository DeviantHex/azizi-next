<template>
  <ckeditor
    v-if="isLayoutReady && config"
    :model-value="modelValue"
    :editor="editor"
    :config="config"
    @update:model-value="(v: any) => emit('update:modelValue', v)"
  />
</template>

<script setup lang="ts">
import {
  AccessibilityHelp, AutoImage, Autoformat, Autosave, BlockQuote, Bold,
  ClassicEditor, CloudServices, Essentials, Heading, ImageBlock, ImageCaption,
  ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative,
  ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage,
  List, ListProperties, MediaEmbed, Paragraph, PasteFromOffice, SelectAll,
  Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties,
  TableToolbar, TextTransformation, TodoList, Underline, Undo,
  type EditorConfig,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isLayoutReady = ref(false)
const config = ref<EditorConfig>()
const editor = ref(ClassicEditor)

const initialConfig: EditorConfig = {
  toolbar: {
    items: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', '|',
      'link', 'mediaEmbed', 'insertTable', 'blockQuote', '|',
      'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'],
    shouldNotGroupWhenFull: false,
  },
  plugins: [AccessibilityHelp, Autoformat, AutoImage, Autosave, BlockQuote, Bold,
    CloudServices, Essentials, Heading, ImageBlock, ImageCaption, ImageInline,
    ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar,
    ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties,
    MediaEmbed, Paragraph, PasteFromOffice, SelectAll, Table, TableCaption,
    TableCellProperties, TableColumnResize, TableProperties, TableToolbar,
    TextTransformation, TodoList, Underline, Undo],
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
      { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
      { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
    ],
  },
  image: {
    toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline',
      'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage'],
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://',
    decorators: { toggleDownloadable: { mode: 'manual', label: 'Downloadable', attributes: { download: 'file' } } },
  },
  list: { properties: { styles: true, startIndex: true, reversed: true } },
  placeholder: 'Type or paste your content here!',
  table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'] },
}

onMounted(() => {
  config.value = initialConfig
  isLayoutReady.value = true
})
</script>
