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

let currentUser = null;
let selectedUserId = null;
let selectedUserName = null;
let unsubscribeMessages = null;

// Auth state handler
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  document.getElementById('nav-username').textContent = user.displayName || user.email || "User";
  loadUsers();
});

// Load users list
async function loadUsers() {
  try {
    const snapshot = await db.collection('profiles').get();
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    
    snapshot.forEach(doc => {
      if (doc.id !== currentUser.uid) {
        const userData = doc.data();
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.onclick = () => selectUser(doc.id, userData.name || 'User');
        userItem.innerHTML = `
          <div><strong>${userData.name || 'Anonymous'}</strong></div>
          <div style="font-size:0.9rem;color:#666;">${userData.location || 'Unknown location'}</div>
        `;
        usersList.appendChild(userItem);
      }
    });
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

// Select user to chat with
function selectUser(userId, userName) {
  selectedUserId = userId;
  selectedUserName = userName;
  document.getElementById('chat-partner-name').textContent = `Chat with ${userName}`;
  document.getElementById('message-input').disabled = false;
  document.getElementById('send-button').disabled = false;
  
  // Clear previous listener
  if (unsubscribeMessages) unsubscribeMessages();
  
  // Activate selected user
  document.querySelectorAll('.user-item').forEach(item => item.classList.remove('active'));
  event.currentTarget.classList.add('active');
  
  loadMessages();
}

// Load messages with composite index support
function loadMessages() {
  if (!selectedUserId || !currentUser) return;

  unsubscribeMessages = db.collection('messages')
    .where('participants', 'array-contains', currentUser.uid)
    .orderBy('timestamp', 'asc') // Must match index order
    .onSnapshot(snapshot => {
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = '';
      
      snapshot.forEach(doc => {
        const msg = doc.data();
        if ((msg.sender === currentUser.uid && msg.receiver === selectedUserId) ||
            (msg.sender === selectedUserId && msg.receiver === currentUser.uid)) {
          renderMessage(msg);
        }
      });
      
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, error => {
      console.error("Message listener error:", error);
    });
}

// Render individual message
function renderMessage(msg) {
  const isSent = msg.sender === currentUser.uid;
  const messageTime = msg.timestamp?.toDate().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
  messageDiv.innerHTML = `
    <div class="message-text">${msg.text}</div>
    <div class="message-time">${messageTime || 'Just now'}</div>
  `;
  
  document.getElementById('chat-messages').appendChild(messageDiv);
}

// Send message handler
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  if (message && currentUser && selectedUserId) {
    db.collection('messages').add({
      text: message,
      sender: currentUser.uid,
      receiver: selectedUserId,
      participants: [currentUser.uid, selectedUserId],
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(error => {
      console.error("Error sending message:", error);
      M.toast({html: 'Error sending message!', classes: 'red'});
    });
    messageInput.value = '';
  }
}

// Event listeners
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

document.getElementById('logout').addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => window.location.href = 'index.html');
});
