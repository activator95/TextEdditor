const butInstall = document.getElementById('buttonInstall');
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  butInstall.style.display = 'block';
});
// Implement a click event handler on the `butInstall` element so when you click it will do what you click on
butInstall.addEventListener('click', async () => {
  if (deferredPrompt) {
    butInstall.style.display = 'none';
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User accepted the install prompt: ${outcome === 'accepted'}`);
    deferredPrompt = null;
  }
});
window.addEventListener('appinstalled', (event) => {
  console.log('App installed successfully');
  butInstall.style.display = 'none';
});
if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
}