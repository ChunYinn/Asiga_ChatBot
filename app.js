const submitBtn = document.querySelector('#submit');
const userInput = document.querySelector('.user-input');
const chatContainer = document.querySelector('.chat-container');
let isFirstMessage = true;  

generateMsg = () => {
    const userMessage = userInput.value;

    //empty msg
    if (userMessage.trim() === "") return; 

    //date generator
    let currentDate = new Date();
    let formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

    // Append user message to main chat
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'user-message message';
    userMessageDiv.innerHTML = `<p>${userMessage}</p>`;
    chatContainer.appendChild(userMessageDiv);

    // Create wrapper for chatbot response
    const chatbotMessageWrapper = document.createElement('div');
    chatbotMessageWrapper.className = 'chatbot-message-wrapper';

    // Add robot icon to the wrapper
    const robotIcon = document.createElement('img');
    robotIcon.src = "resource/robot.png";
    robotIcon.alt = "Robot Icon";
    robotIcon.className = "robot-icon";
    chatbotMessageWrapper.appendChild(robotIcon);

    // Create and append chatbot message to the wrapper
    const chatbotMessageDiv = document.createElement('div');
    chatbotMessageDiv.className = 'chatbot-message message';
    chatbotMessageDiv.innerHTML = `<p>Testing!!!</p>`;
    chatbotMessageWrapper.appendChild(chatbotMessageDiv);

    // Append the wrapper to the chat container
    chatContainer.appendChild(chatbotMessageWrapper);

    // Clear input
    userInput.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Append to chat history
    if (isFirstMessage) {
        const historyContainer = document.querySelector('.history');
        const chatHistoryItem = document.createElement('div');
        chatHistoryItem.className = 'history-item';
        chatHistoryItem.innerHTML = `
            <p>${formattedDate}</p>
            <div class="delete-icon">&#10006;</div>
        `;

        // Check if there's any child in the historyContainer
        if (historyContainer.firstChild) {
            historyContainer.insertBefore(chatHistoryItem, historyContainer.firstChild);
        } else {
            historyContainer.appendChild(chatHistoryItem);
        }

        isFirstMessage = false; 
    }
}

submitBtn.addEventListener('click', generateMsg);



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
    robotIcon.src = "resource/robot.png";
    robotIcon.alt = "Robot Icon";
    robotIcon.className = "robot-icon";
    chatbotMessageWrapper.appendChild(robotIcon);

    const chatbotMessageDiv = document.createElement('div');
    chatbotMessageDiv.className = 'chatbot-message message';
    chatbotMessageDiv.innerHTML = `<p>Asiga GPT: How can I help you?</p>`;
    chatbotMessageWrapper.appendChild(chatbotMessageDiv);

    chatContainer.appendChild(chatbotMessageWrapper);
});
