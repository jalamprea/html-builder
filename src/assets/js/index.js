/**
 * Put here your script or multiple JS files in the same folder.
 *
 * Remove this file or replace it with your real development files.
 **/

// Productive tip:
// Never use jquery document ready or other jquery method to start your app.
// Use this listener beacuse it will start after make sure everything is loaded.
// Since the javscript will be loaded defered, this will ensure everything starts in the perfect moment.
// If you want to use jquery or any other thing you can do it inside the init function
window.addEventListener('load', initApp);
function initApp() {
  const example = "hello world!";
  console.log('FROM JS:', example);
}
