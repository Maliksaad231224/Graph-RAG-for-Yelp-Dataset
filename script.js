// Chat Application Script

// DOM Elements
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messagesContainer');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const themeToggle = document.getElementById('themeToggle');
const newChatBtn = document.getElementById('newChatBtn');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
});

function initializeEventListeners() {
  // Send button click event
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  // Enter key in message input
  if (messageInput) {
    messageInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  // Sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // New chat button
  if (newChatBtn) {
    newChatBtn.addEventListener('click', startNewChat);
  }
}

/**
 * Send message to the API and display response
 */
async function sendMessage() {
  const message = messageInput.value.trim();

  if (!message) {
    alert('Please enter a message');
    return;
  }

  // Display user message
  displayMessage(message, 'user');
  messageInput.value = '';

  try {
    // Send data to API
    const apiResponse = await sendDataToAPI('https://api.example.com/chat', {
      message: message,
      timestamp: new Date().toISOString(),
    });

    // Display bot response
    const botReply = apiResponse.reply || 'I received your message but couldn\'t generate a response.';
    displayMessage(botReply, 'bot');
  } catch (error) {
    console.error('Error sending message:', error);
    displayMessage('Sorry, I encountered an error processing your request. Please try again.', 'bot');
  }
}

/**
 * Display message in the chat container
 * @param {string} messageText - The message content
 * @param {string} sender - 'user' or 'bot'
 */
function displayMessage(messageText, sender) {
  const messageGroup = document.createElement('div');
  messageGroup.className = `message-group ${sender}-message`;

  const messageAvatar = document.createElement('div');
  messageAvatar.className = `message-avatar ${sender}`;

  if (sender === 'user') {
    messageAvatar.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    `;
  } else {
    messageAvatar.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      </svg>
    `;
  }

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = `<p>${escapeHtml(messageText)}</p>`;

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = formatTime(new Date());

  messageContent.appendChild(messageDiv);
  messageContent.appendChild(messageTime);

  messageGroup.appendChild(messageAvatar);
  messageGroup.appendChild(messageContent);

  messagesContainer.appendChild(messageGroup);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Escape HTML special characters
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format time for message display
 * @param {Date} date - The date to format
 * @returns {string} - Formatted time
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
  if (sidebar) {
    sidebar.classList.toggle('active');
    if (sidebarOverlay) {
      sidebarOverlay.classList.toggle('active');
    }
  }
}

/**
 * Close sidebar
 */
function closeSidebar() {
  if (sidebar) {
    sidebar.classList.remove('active');
  }
  if (sidebarOverlay) {
    sidebarOverlay.classList.remove('active');
  }
}

/**
 * Toggle theme (light/dark mode)
 */
function toggleTheme() {
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

/**
 * Start a new chat
 */
function startNewChat() {
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div class="message-group bot-message">
        <div class="message-avatar bot">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message bot">
            <p>Welcome to CRM Assistant! 👋 I'm here to help you manage customer relationships, track sales, and optimize your business. What can I help you with?</p>
          </div>
          <span class="message-time">just now</span>
        </div>
      </div>
    `;
  }
  closeSidebar();
}

/**
 * Send data to API using POST method
 * @param {string} apiUrl - The API endpoint URL
 * @param {object} data - The data to send to the API
 * @returns {Promise<object>} - The response from the API
 */
async function sendDataToAPI(apiUrl, data) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('API Response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending data to API:', error);
    throw error;
  }
}

/**
 * Get data from API using GET method
 * @param {string} apiUrl - The API endpoint URL
 * @returns {Promise<object>} - The response from the API
 */
async function getDataFromAPI(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('API Response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}
