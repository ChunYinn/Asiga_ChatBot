const chatForm = document.querySelector('#chatForm');
const userInput = document.querySelector('.user-input');
const chatContainer = document.querySelector('.chat-container');
let isFirstMessage = true; 
const submitBtn = document.querySelector('#submit'); // Ensure you have a reference to the submit button

submitBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    await generateMsg();
});

generateMsg = async() => {
    const userMessage = userInput.value;

    // Check for empty message
    if (userMessage.trim() === "") return;

    // Extract user ID
    const user_id = document.getElementById('user_id').value;
    console.log(user_id);
    // start a session
    if(isFirstMessage) {
        const newSessionId = await startNewChatSession(user_id);
        if (newSessionId) {
            document.getElementById('session_id').value = newSessionId; // Set the hidden input value
        }
        isFirstMessage = false;
    }

    // user msg
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'user-message message';
    userMessageDiv.innerHTML = `<p>${userMessage}</p>`;
    chatContainer.appendChild(userMessageDiv);

    //get current session_id
    //const session_id = document.getElementById('session_id').value;
    //iget the session_id from the hidden input now how to use it for backend

    // Send message to backend
    const formData = new FormData(chatForm);
    const response = await fetch(`/chat/${user_id}/submit`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    const chatbotResponse = data.message;

    // Create and append chatbot message to the chat container
    const chatbotMessageWrapper = document.createElement('div');
    chatbotMessageWrapper.className = 'chatbot-message-wrapper';
    const chatbotIcon = document.createElement('img');
    chatbotIcon.src = "/static/resource/robot.png";
    chatbotIcon.alt = "Robot Icon";
    chatbotIcon.className = "robot-icon";
    chatbotMessageWrapper.appendChild(chatbotIcon);
    const chatbotMessageDiv = document.createElement('div');
    chatbotMessageDiv.className = 'chatbot-message message';
    chatbotMessageDiv.innerHTML = `<p>Asiga GPT: ${chatbotResponse}</p>`;
    chatbotMessageWrapper.appendChild(chatbotMessageDiv);
    chatContainer.appendChild(chatbotMessageWrapper);


    chatContainer.scrollTop = chatContainer.scrollHeight;
    // Clear the user input
    userInput.value = "";


};

startNewChatSession = async(user_id) => {

    const response = await fetch(`/start-session/${user_id}`, {
        method: 'POST'
    });

    const data = await response.json();
    if (data.error) {
        console.error(data.error);
        // Handle error, maybe display an error message to the user or retry
        return null; // return null if there's an error
    }
    return data.session_id; // Return the session_id from the function
};





//---------------------user-input text area---------------------------------------

//text area adjustions
userInput.addEventListener('keydown', function(event) {
  // If Enter key is pressed and Shift key is not pressed
  if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      generateMsg();
      this.style.height = '50px'; 
  }
});

// adjust textarea height function
userInput.addEventListener('input', function(e) {
  if (this.scrollHeight > this.clientHeight) {
      this.style.height = 'auto'; 
      this.style.height = (this.scrollHeight) + 'px';
  }
});

// Adjust textarea height on Shift+Enter
userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.shiftKey) {
      this.style.height = 'auto'; 
      this.style.height = (this.scrollHeight) + 'px';
  }
});

//------------Collapse btn---------------------------
const sidebar = document.querySelector('.side-bar');
const mainContent = document.querySelector('.main');
const collapseBtn = document.getElementById('collapseBtn');
const openBtn = document.getElementById('openBtn');

collapseBtn.addEventListener('click', function() {
    if (sidebar.classList.contains('collapsed')) {
        // Expand the sidebar
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('with-collapsed-sidebar');
        collapseBtn.innerHTML = "<<<";
        openBtn.style.display = 'none';
    } else {
        // Collapse the sidebar
        sidebar.classList.add('collapsed');
        mainContent.classList.add('with-collapsed-sidebar');
        collapseBtn.innerHTML = ">>>";
        openBtn.style.display = 'block';
    }
});

openBtn.addEventListener('click', function() {
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('with-collapsed-sidebar');
    collapseBtn.innerHTML = "<<<";
    openBtn.style.display = 'none';
});

//----media < 850px------------

// still figuring


// delete icon for history chat----------
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('delete-icon')) {
        let historyItem = e.target.closest('.history-item');
        if (historyItem) {
            historyItem.remove();
        }
    }
});

// New Chat btn -----------------------------------
const newChatBtn = document.querySelector('.new-chat-btn');

newChatBtn.addEventListener('click', function() {
    // Clear chat messages
    chatContainer.innerHTML = '';

    // Reset isFirstMessage flag
    isFirstMessage = true;

    // Add the initial chatbot message again.
    const chatbotMessageWrapper = document.createElement('div');
    chatbotMessageWrapper.className = 'chatbot-message-wrapper';

    const robotIcon = document.createElement('img');
    robotIcon.src = "/static/resource/robot.png";
    robotIcon.alt = "Robot Icon";
    robotIcon.className = "robot-icon";
    chatbotMessageWrapper.appendChild(robotIcon);

    const chatbotMessageDiv = document.createElement('div');
    chatbotMessageDiv.className = 'chatbot-message message';
    chatbotMessageDiv.innerHTML = `<p>Asiga GPT: How can I help you?</p>`;
    chatbotMessageWrapper.appendChild(chatbotMessageDiv);

    chatContainer.appendChild(chatbotMessageWrapper);
});

// session handler--------------------------
// let currentSession = null;

// document.addEventListener('DOMContentLoaded', async () => {
//     const historyContainer = document.querySelector('.history');
    
//     try {
//         const response = await fetch('/sessions/');
//         const sessions = await response.json();
        
//         sessions.reverse().forEach(session => {
//             const chatHistoryItem = document.createElement('div');
//             chatHistoryItem.className = 'history-item';
//             chatHistoryItem.dataset.sessionId = session.id;
//             chatHistoryItem.innerHTML = `
//                 <p>${session.start_timestamp}</p>
//                 <div class="delete-icon" onclick="deleteSession(${session.id})">&#10006;</div>
//             `;
//             historyContainer.appendChild(chatHistoryItem);
//         });
//     } catch (error) {
//         console.error('Failed to fetch sessions:', error);
//     }
// });

// //new session
// async function startNewSession() {
//     if (!currentSession) {
//         await startNewSession();
//     }

//     try {
//         const response = await fetch('/start-session/', {
//             method: 'POST'
//         });
//         const session = await response.json();
//         currentSession = session;  // Set the current session
        
//         const chatHistoryItem = document.createElement('div');
//         chatHistoryItem.className = 'history-item';
//         chatHistoryItem.dataset.sessionId = session.id;
//         chatHistoryItem.innerHTML = `
//             <p>${session.start_timestamp}</p>
//             <div class="delete-icon" onclick="deleteSession(${session.id})">&#10006;</div>
//         `;
//         historyContainer.insertBefore(chatHistoryItem, historyContainer.firstChild);
        
//     } catch (error) {
//         console.error('Failed to start new session:', error);
//     }
// }


// //delete session
// async function deleteSession(sessionId) {
//     try {
//         await fetch(`/sessions/${sessionId}`, {
//             method: 'DELETE'
//         });
        
//         const sessionDiv = document.querySelector(`[data-session-id="${sessionId}"]`);
//         if (sessionDiv) {
//             sessionDiv.remove();
//         }
//     } catch (error) {
//         console.error('Failed to delete session:', error);
//     }
// }