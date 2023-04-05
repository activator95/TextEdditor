import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Add logic to a method that accepts some content and adds it to the database
// Function to add content to the database
export const putDb = async (content) => {
  try {
    // Initialize the database
    const db = await initdb();

    // Start a transaction with the 'readwrite' mode
    const tx = db.transaction('jate', 'readwrite');

    // Get the object store
    const store = tx.objectStore('jate');

    // Put the content into the store
    await store.put({ content });

    // Complete the transaction
    await tx.done;

    // Return true to indicate success
    return true;
  } catch (error) {
    // Log the error and return false to indicate failure
    console.error('Error while adding content to the database:', error);
    return false;
  }
};

// Function to get all content from the database
export const getDb = async () => {
  try {
    // Initialize the database
    const db = await initdb();

    // Start a transaction with the 'readonly' mode
    const tx = db.transaction('jate', 'readonly');

    // Get the object store
    const store = tx.objectStore('jate');

    // Get all the content from the store
    const content = await store.getAll();

    // Complete the transaction
    await tx.done;

    // Return the content
    return content;
  } catch (error) {
    // Log the error and return null to indicate failure
    console.error('Error while retrieving content from the database:', error);
    return null;
  }
};

// Example usage:
(async () => {
  try {
    // Add some content to the database
    const isAdded = await putDb('Pizza Party!');

    // Log a message indicating whether the content was added successfully or not
    if (isAdded) {
      console.log('Content added to the database');
    } else {
      console.log('Failed to add to the database');
    }

    // Get all the content from the database
    const allContent = await getDb();

    // Log the content
    console.log('All content from the database:', allContent);
  } catch (error) {
    // Log any errors that occur
    console.error('Error:', error);
  }
})();
