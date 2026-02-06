// ==== Firebase Config & Initialization ====
const firebaseConfig = {
  apiKey: "AIzaSyAH0OeZSFTXdeaGRty8gu-hPhYpn_1oLAw",
  authDomain: "communityexchange-hkv3224.firebaseapp.com",
  projectId: "communityexchange-hkv3224",
  storageBucket: "communityexchange-hkv3224.appspot.com",
  messagingSenderId: "580364290577",
  appId: "1:580364290577:web:3d97a7ffb588402d103fb0"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Materialize component initialization
document.addEventListener('DOMContentLoaded', function() {
    if (M.Sidenav) M.Sidenav.init(document.querySelectorAll('.sidenav'));
    if (M.Modal) M.Modal.init(document.querySelectorAll('.modal'));
    if (M.FormSelect) M.FormSelect.init(document.querySelectorAll('select'));
    if (M.updateTextFields) M.updateTextFields();
});

// ==== Loader Helpers ====
function showLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'block';
}
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
}

