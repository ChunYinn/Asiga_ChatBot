const chatForm = document.querySelector('#chatForm');
const userInput = document.querySelector('.user-input');
const chatContainer = document.querySelector('.chat-container');
let isFirstMessage = true; 
const submitBtn = document.querySelector('#submit');

submitBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    await generateMsg();
});

const generateMsg = async() => {
    const userMessage = userInput.value;

    // Check for empty message
    if (userMessage.trim() === "") return;

    // Extract user ID
    const user_id = document.getElementById('user_id').value;

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

    // Add temporary chatbot message to indicate it's processing
    const tempChatbotMessageWrapper = document.createElement('div');
    tempChatbotMessageWrapper.className = 'chatbot-message-wrapper temp-response';
    const tempChatbotIcon = document.createElement('img');
    tempChatbotIcon.src = "/static/resource/robot.png";
    tempChatbotIcon.alt = "Robot Icon";
    tempChatbotIcon.className = "robot-icon";
    tempChatbotMessageWrapper.appendChild(tempChatbotIcon);
    const tempChatbotMessageDiv = document.createElement('div');
    tempChatbotMessageDiv.className = 'chatbot-message message';
    tempChatbotMessageDiv.innerHTML = `<p>Loading ...</p>`;
    tempChatbotMessageWrapper.appendChild(tempChatbotMessageDiv);
    chatContainer.appendChild(tempChatbotMessageWrapper);

    // Send message to backend
    const formData = new FormData(chatForm);
    // Clear the user input after you have made the formData
    userInput.value = "";

    const response = await fetch(`/chat/${user_id}/submit`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    const chatbotResponse = data.message;

    // Remove temporary chatbot message
    const tempResponse = document.querySelector('.temp-response');
    if (tempResponse) tempResponse.remove();

    // Create and append actual chatbot message to the chat container
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
};

//when isFirstMessage is true, start a new session
const startNewChatSession = async(user_id) => {
    const response = await fetch(`/start-session/${user_id}`, {
        method: 'POST'
    });

    const data = await response.json();
    if (data.error) {
        console.error(data.error);
        return null; 
    }

    // Create a new session element for the interface
    const historyContainer = document.querySelector('.history');
    const newSessionElement = document.createElement('div');
    newSessionElement.classList.add('history-item');
    newSessionElement.setAttribute('data-session-id', data.session_id);

    // Add session start timestamp
    const newSessionTimestamp = document.createElement('p');
    newSessionTimestamp.textContent = getReadableTime()
    newSessionElement.appendChild(newSessionTimestamp);

    // Add delete icon
    const deleteIcon = document.createElement('div');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '&#10006;';
    newSessionElement.appendChild(deleteIcon);

    // Append the new session to the top of the history container
    historyContainer.prepend(newSessionElement);

    return data.session_id;
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
        // collapseBtn.innerHTML = "<<<";
        openBtn.style.display = 'none';
    } else {
        // Collapse the sidebar
        sidebar.classList.add('collapsed');
        mainContent.classList.add('with-collapsed-sidebar');
        // collapseBtn.innerHTML = ">>>";
        openBtn.style.display = 'block';
    }
});

openBtn.addEventListener('click', function() {
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('with-collapsed-sidebar');
    // collapseBtn.innerHTML = "<<<";
    openBtn.style.display = 'none';
});

// New Chat btn -----------------------------------
const newChatBtn = document.querySelector('.new-chat-btn');

newChatBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    startNewChatInterface();
});

const startNewChatInterface = () => {
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

    enableInput();
}



//----------- history chat session onclicked & delete----------------------------

document.addEventListener('click', async function(e) {
    let historyItem = e.target.closest('.history-item');
    
    // If the direct target of the event is the delete icon, handle delete action
    if (e.target && e.target.classList.contains('delete-icon')) {
        e.stopPropagation();
    
        if (historyItem) {
            const sessionId = historyItem.getAttribute('data-session-id');
            const user_id = document.getElementById('user_id').value;
            
            if (sessionId && user_id) {
                try {
                    const response = await fetch(`/delete-session/${user_id}/${sessionId}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        historyItem.remove();
    
                        // Check if the deleted session is the current session
                        const currentSessionId = document.getElementById('session_id').value;
                        console.log("checking here!!!  "+(currentSessionId === sessionId));
                        if (currentSessionId === sessionId) {
                            startNewChatInterface();
                        }
                        
                    } else {
                        console.error("Failed to delete session from backend.");
                    }
                } catch (err) {
                    console.error("Error:", err);
                }
            }
        }
        return;
    }

    // View history Only: **Haven't deal with removing viewing history refresh chat window yet**
    if (historyItem && !e.target.classList.contains('delete-icon')) {
        const sessionId = historyItem.getAttribute('data-session-id');
        const user_id = document.getElementById('user_id').value;

        // Show the loading animation before fetching the data
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.innerHTML = '<div class="ring">Loading<span></span></div>';

        if (sessionId && user_id) {
            try {
                const response = await fetch(`/get-session/${user_id}/${sessionId}`, {
                    method: 'GET'
                });
                const data = await response.json();
                
                // Clear the loading animation now
                chatContainer.innerHTML = '';
                
                if (data && data.length > 0) {
                    populateChatHistory(data);
                } else {
                    console.error("No messages found for this session.");
                }
            } catch (err) {
                chatContainer.innerHTML = '<p>Error loading chat history.</p>';
                console.error("Error:", err);
            }
        }
        
        disableInput();
    }
});


// Function to populate the chat history
const populateChatHistory = (messages) => {
    chatContainer.innerHTML = ''; 
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = msg.sender === 'user' ? 'user-message message' : 'chatbot-message message';
        messageDiv.innerHTML = `<p>${msg.sender === 'user' ? '' : 'Asiga GPT: '}${msg.content}</p>`;
        chatContainer.appendChild(messageDiv);
    });
}


// enable and disable input & btn----------------
const disableInput = () => {
    document.querySelector(".user-input").disabled = true;
    document.querySelector(".user-input").style.cursor = "no-drop";
    document.getElementById("submit").disabled = true;
    document.getElementById("submit").style.cursor = "no-drop";
}

const enableInput = () => {
    document.querySelector(".user-input").disabled = false;
    document.querySelector(".user-input").style.cursor = '';
    document.getElementById("submit").disabled = false;
    document.getElementById("submit").style.cursor = 'pointer';
}


//create current date and time
const getReadableTime = () => {

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based in JavaScript
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    const readableTime = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
    return readableTime;
  }

