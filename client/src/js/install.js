const butInstall = document.getElementById('buttonInstall');
let deferredPrompt;

// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  butInstall.style.display = 'block';
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  if (deferredPrompt) {
    butInstall.style.display = 'none';
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`accepted install prompt: ${outcome === 'accepted'}`);
    deferredPrompt = null;
  }
});

// Add a handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  console.log('installed successfull');
  butInstall.style.display = 'none';
});

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./src-sw.js') 
      .then((registration) => {
        console.log('Service Worker :', registration.scope);
      })
      .catch((error) => {
        console.error('registration failed:', error);
      });
  }
}