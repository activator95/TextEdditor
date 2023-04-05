// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';

// Import header from './header.js'
import { header } from './header';

// Create a default export for the class
export default class {

  // Create a constructor function
  constructor() {

    // Get any content saved in localStorage
    const localData = localStorage.getItem('content');

    // Check if CodeMirror is loaded, if not throw an error
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    // Create a new CodeMirror editor instance
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
     // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((data) => {
      const content = data.length > 0 ? data[data.length - 1].content : null;
      console.info('Loaded data from IndexedDB, injecting into editor');

      if (typeof content === 'string') {
        this.editor.setValue(content);
      } else if (typeof localData === 'string') {
        this.editor.setValue(localData);
      } else {
        console.error('Data retrieved from IndexedDB is not a string:', content);
        this.editor.setValue(header);
      }
    });

    // Save the content of the editor to localStorage when it changes
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor to indexedDB when it loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });
  }
}
