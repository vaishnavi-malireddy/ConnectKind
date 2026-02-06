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

let currentEditId = null;

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
  loadUserListings();
});

// Load user listings
function loadUserListings() {
  const user = auth.currentUser;
  if (!user) return;
  
  db.collection("listings")
    .where("userId", "==", user.uid)
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      const container = document.getElementById("your-listings");
      container.innerHTML = "";
      
      if (snapshot.empty) {
        container.innerHTML = '<p class="center grey-text">No listings yet.</p>';
        return;
      }
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = 'col s12 listing-card';
        card.innerHTML = `
          <div class="listing-title">${data.title}
            <span class="chip">${data.type}</span>
          </div>
          <div class="listing-description">${data.description}</div>
          <div class="listing-actions">
            <a href="#editModal" class="btn-floating blue modal-trigger edit-btn" data-id="${doc.id}">
              <i class="material-icons">edit</i>
            </a>
            <a class="btn-floating red delete-btn" data-id="${doc.id}">
              <i class="material-icons">delete</i>
            </a>
          </div>
        `;
        container.appendChild(card);
      });

      // Add event listeners
      addEventListeners();
    });
}

// Add event listeners for edit/delete
function addEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      currentEditId = e.currentTarget.dataset.id;
      const doc = await db.collection("listings").doc(currentEditId).get();
      const data = doc.data();
      
      document.getElementById("editTitle").value = data.title;
      document.getElementById("editDesc").value = data.description;
      document.getElementById("editType").value = data.type;
      M.updateTextFields();
      M.FormSelect.init(document.querySelectorAll('select'));
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm('Delete this listing?')) {
        db.collection("listings").doc(id).delete()
          .then(() => M.toast({html: 'Listing deleted!', classes: 'red'}))
          .catch(err => M.toast({html: 'Error deleting!', classes: 'red'}));
      }
    });
  });
}

// Add new listing
document.getElementById("listingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const title = document.getElementById("listingTitle").value.trim();
  const description = document.getElementById("listingDesc").value.trim();
  const type = document.getElementById("listingType").value;

  if (!title || !description || !type) {
    M.toast({html: 'Please fill all fields!', classes: 'red'});
    return;
  }

  try {
    await db.collection("listings").add({
      title,
      description,
      type,
      userId: user.uid,
      userEmail: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    document.getElementById("listingForm").reset();
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
    M.toast({html: 'Listing added!', classes: 'green'});
  } catch (error) {
    M.toast({html: 'Error adding listing!', classes: 'red'});
  }
});

// Edit listing
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentEditId) return;

  const title = document.getElementById("editTitle").value.trim();
  const description = document.getElementById("editDesc").value.trim();
  const type = document.getElementById("editType").value;

  if (!title || !description || !type) {
    M.toast({html: 'Please fill all fields!', classes: 'red'});
    return;
  }

  try {
    await db.collection("listings").doc(currentEditId).update({
      title,
      description,
      type
    });
    
    M.Modal.getInstance(document.getElementById("editModal")).close();
    M.toast({html: 'Listing updated!', classes: 'green'});
  } catch (error) {
    M.toast({html: 'Error updating listing!', classes: 'red'});
  }
});

// Logout
document.getElementById('logout').addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => window.location.href = 'index.html');
});
