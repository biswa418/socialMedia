class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function () {
            console.log('connection from Front end using Sockets');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'Codeial'
            });

        });

        self.socket.on('user_joined', function (data) {
            // console.log('A user joined', data);
            let chatBox = document.getElementById('chat-messages-list');
            let userName = String(data.user_email).substring(0, String(data.user_email).search('@'));

            chatBox.innerHTML += `
            <div class="joining_message">
                ${userName} joined
            </div>`;

            document.getElementById('chat-messages-list').scrollTop = document.getElementById('chat-messages-list').getBoundingClientRect().height + 100;

        });

        let chatSend = document.getElementById('send-message');


        let event = function (e) {
            e.preventDefault();

            let msg = $('#chat-message-input').val();

            if (msg != '') {
                console.log('data sent from front end');
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'Codeial'
                });
            }
        };

        chatSend.addEventListener('click', function (e) {
            event(e);
        });

        document.getElementById('chat-message-input').addEventListener('keydown', function (e) {
            if (e.key == 'Enter') {
                event(e);
            }
        });

        this.socket.on('msg_rcvd', function (data) {
            // console.log('message received', data);
            let messageType = 'other-message';

            if (data.user_email == self.userEmail) {
                messageType = 'self-message';
            }

            let ulElement = document.getElementById('chat-messages-list');
            let userName = String(data.user_email).substring(0, String(data.user_email).search('@'));
            let newElement = `<li class="${messageType}">
                <div class="info-container">
                    <sub>
                        ${userName}
                    </sub>
                    <span>
                        ${data.message}
                    </span>
                    <sub>
                        ${data.sentTime}
                    <sub>
                <div>

            </li>`;

            ulElement.innerHTML += newElement;
            document.getElementById('chat-messages-list').scrollTop = document.getElementById('chat-messages-list').scrollHeight;
            document.getElementById('chat-message-input').value = '';
        });

    }
}