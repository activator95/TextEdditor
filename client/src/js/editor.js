// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    class Editor {
      constructor() {
        // Create the editor instance
        this.editor = ace.edit('editor');
    
        // Initialize the editor
        this.initEditor();
      }
    
      async initEditor() {
        // When the editor is ready, set the value to whatever is stored in indexeddb.
        // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    
        // Get the content from the database
        const data = await getDb();
    
        // Get the most recent content (if there is any)
        const content = data.length > 0 ? data[data.length - 1].content : null;
    
        // Log a message indicating that data was loaded from indexedDB and injected into the editor
        console.info('Loaded data from IndexedDB, injecting into editor');
    
        // If the content is a string, set the editor's value to the content
        if (typeof content === 'string') {
          this.editor.setValue(content);
        } else {
          // If the content is not a string, try to get the content from localStorage
          const localData = localStorage.getItem('content');
    
          // If the localData is a string, set the editor's value to the localData
          if (typeof localData === 'string') {
            this.editor.setValue(localData);
          } else {
            // If neither indexedDB nor localStorage have any content, set the editor's value to a default header
            console.error('Data retrieved from IndexedDB is not a string:', content);
            this.editor.setValue(header);
          }
        }
    
        // Save the content of the editor to localStorage whenever the editor's value changes
        this.editor.on('change', () => {
          localStorage.setItem('content', this.editor.getValue());
        });
    
        // Save the content of the editor to the database whenever the editor loses focus
        this.editor.on('blur', () => {
          console.log('The editor has lost focus');
          putDb(localStorage.getItem('content'));
        });
      }
    }
