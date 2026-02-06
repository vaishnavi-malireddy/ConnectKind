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

// Initialize Materialize
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
});

// Show username in navbar
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('nav-username').textContent =
    user.displayName || user.email || "User";
});

// Fill edit form with current data
function fillEditForm() {
  document.getElementById('edit-name').value = document.getElementById('profile-name').textContent;
  document.getElementById('edit-location').value = document.getElementById('profile-location').textContent.replace('location_on', '').trim();
  document.getElementById('edit-bio').value = document.getElementById('profile-bio').textContent;
  
  const social = Array.from(document.getElementById('social-chips').children)
    .map(chip => chip.textContent).join(', ');
  document.getElementById('edit-social').value = social;

  M.updateTextFields();
}

// Render chips for social links
function renderSocialChips(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (Array.isArray(items)) {
    items.forEach(item => {
      if (item && item.trim()) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = item;
        container.appendChild(chip);
      }
    });
  }
}

// Render chips for listings
function renderListingChips(listings, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  listings.forEach(listing => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = listing.title;
    container.appendChild(chip);
  });
}

// Categorize listings
function renderListings(listings) {
  const skillsOffered = listings.filter(listing => listing.type === 'skill');
  const resourcesShared = listings.filter(listing => listing.type === 'resource');
  
  renderListingChips(skillsOffered, 'skills-offered-chips');
  renderListingChips(resourcesShared, 'resources-chips');
}

// Render profile data
function renderProfile(data) {
  document.getElementById('profile-name').textContent = data.name || 'Your Name';
  document.getElementById('profile-location').innerHTML = `<i class="material-icons tiny">location_on</i> ${data.location || ''}`;
  document.getElementById('profile-bio').textContent = data.bio || '';
  renderSocialChips(data.social || [], 'social-chips');
}

// Edit button event
document.getElementById('edit-profile-btn').addEventListener('click', fillEditForm);

// Save profile updates
document.getElementById('profile-edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;
  
  const profileData = {
    name: document.getElementById('edit-name').value,
    location: document.getElementById('edit-location').value,
    bio: document.getElementById('edit-bio').value,
    social: document.getElementById('edit-social').value.split(',').map(s => s.trim()).filter(Boolean)
  };

  try {
    await db.collection('profiles').doc(user.uid).set(profileData, { merge: true });
    M.Modal.getInstance(document.getElementById('profile-edit-modal')).close();
    M.toast({html: 'Profile updated!', classes: 'green'});
  } catch (err) {
    M.toast({html: 'Error updating profile!', classes: 'red'});
  }
});

// Real-time listeners
let unsubscribeProfile = null;
let unsubscribeListings = null;

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Profile data listener
  if (unsubscribeProfile) unsubscribeProfile();
  unsubscribeProfile = db.collection('profiles').doc(user.uid)
    .onSnapshot(doc => {
      if (doc.exists) renderProfile(doc.data());
    });

  // Listings listener
  if (unsubscribeListings) unsubscribeListings();
  unsubscribeListings = db.collection('listings')
    .where('userId', '==', user.uid)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      const listings = [];
      snapshot.forEach(doc => listings.push(doc.data()));
      renderListings(listings);
    });
});

// Logout
document.getElementById('logout').addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => window.location.href = 'index.html');
});
