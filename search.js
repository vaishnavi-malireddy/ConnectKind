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

// Set username in navbar and handle logout
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('nav-username').textContent = user.displayName || user.email || "User";
  document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => window.location.href = 'index.html');
  });
});

// Search functionality - FIXED VERSION
document.getElementById('search-bar').addEventListener('input', async function() {
  const query = this.value.trim().toLowerCase();
  const resultsDiv = document.getElementById('search-results');
  resultsDiv.innerHTML = '';
  
  if (!query) return;

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    console.log('Searching for:', query); // Debug log
    
    // Get ALL listings first, then filter out current user's
    const listingsSnapshot = await db.collection('listings').get();
    
    console.log('Total listings found:', listingsSnapshot.size); // Debug log
    
    let found = false;
    const userProfiles = new Map(); // Cache user profiles

    for (const doc of listingsSnapshot.docs) {
      const data = doc.data();
      
      // Skip current user's listings
      if (data.userId === currentUser.uid) continue;
      
      // Check if query matches title, description, or type
      if (
        (data.title && data.title.toLowerCase().includes(query)) ||
        (data.description && data.description.toLowerCase().includes(query)) ||
        (data.type && data.type.toLowerCase().includes(query))
      ) {
        found = true;
        console.log('Match found:', data.title); // Debug log
        
        // Get user profile if not already cached
        if (!userProfiles.has(data.userId)) {
          try {
            const profileDoc = await db.collection('profiles').doc(data.userId).get();
            userProfiles.set(data.userId, profileDoc.exists ? profileDoc.data() : {});
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            userProfiles.set(data.userId, {});
          }
        }
        
        const userProfile = userProfiles.get(data.userId);
        const result = document.createElement('div');
        result.className = 'result-card';
        result.innerHTML = `
          <div class="result-header">
            <strong>${data.title}</strong> 
            <span class="result-type chip">${data.type}</span>
          </div>
          <div class="result-description">${data.description}</div>
          <div class="result-owner">
            <i class="material-icons tiny">person</i> 
            Offered by: ${userProfile.name || data.userEmail || 'Anonymous'}
          </div>
          <div class="result-location">
            <i class="material-icons tiny">location_on</i> 
            ${userProfile.location || 'Location not specified'}
          </div>
          <a href="chat.html?userId=${data.userId}" class="btn blue waves-effect waves-light">
            <i class="material-icons left">chat</i>Chat with Owner
          </a>
        `;
        resultsDiv.appendChild(result);
      }
    }
    
    if (!found) {
      resultsDiv.innerHTML = `<div class="center grey-text" style="margin-top:2rem;">No results found for "${query}".</div>`;
    }
  } catch (error) {
    console.error('Search error:', error);
    resultsDiv.innerHTML = `<div class="center red-text" style="margin-top:2rem;">Error searching. Check console for details.</div>`;
  }
});
