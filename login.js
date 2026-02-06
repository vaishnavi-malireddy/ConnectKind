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

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

// Show signup form, hide login form
if (showSignup) {
    showSignup.addEventListener('click', function(e) {
        e.preventDefault();
        if (loginForm) loginForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'block';
    });
}
// Show login form, hide signup form
if (showLogin) {
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        if (signupForm) signupForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    });
}

// LOGIN
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = 'search.html';
            })
            .catch(error => {
                alert(error.message);
            });
    });
}

// SIGNUP
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert('Account created successfully! Please log in.');
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
            })
            .catch(error => {
                alert(error.message);
            });
    });
}

