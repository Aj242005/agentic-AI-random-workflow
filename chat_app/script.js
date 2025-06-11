document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const chatArea = document.querySelector('.chat-area');
    const roolSelector = document.getElementById('role');

    sendButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            // Create user message element
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'user-message');
            userMessageDiv.innerHTML = `<p>${messageText}</p>`;
            chatArea.appendChild(userMessageDiv);

            // Create AI message element (for testing purposes)
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.classList.add('message', 'ai-message');
            aiMessageDiv.innerHTML = `<p>AI response to: ${messageText}</p>`;
            chatArea.appendChild(aiMessageDiv);

            // Clear input
            messageInput.value = '';

            // Scroll to bottom of chat area
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    });
    sendButton.addEventListener("keypress",(event)=>{
        if(event.key == "enter"){
            const messageText = messageInput.value.trim();
            if (messageText !== '') {
            // Create user message element
                const userMessageDiv = document.createElement('div');
                userMessageDiv.classList.add('message', 'user-message');
                userMessageDiv.innerHTML = `<p>${messageText}</p>`;
                chatArea.appendChild(userMessageDiv);

                // Create AI message element (for testing purposes)
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.classList.add('message', 'ai-message');
                aiMessageDiv.innerHTML = `<p>AI response to: ${messageText}</p>`;
                chatArea.appendChild(aiMessageDiv);

            // Clear input
                messageInput.value = '';

            // Scroll to bottom of chat area
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        }
    })
});