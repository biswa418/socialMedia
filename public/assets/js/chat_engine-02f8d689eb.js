class ChatEngine{constructor(e,t){this.chatBox=$(`#${e}`),this.userEmail=t,this.socket=io.connect("http://localhost:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(function(){console.log("connection from Front end using Sockets"),e.socket.emit("join_room",{user_email:e.userEmail,chatroom:"Codeial"})})),e.socket.on("user_joined",(function(e){let t=document.getElementById("chat-messages-list"),n=String(e.user_email).substring(0,String(e.user_email).search("@"));t.innerHTML+=`\n            <div class="joining_message">\n                ${n} joined\n            </div>`,document.getElementById("chat-messages-list").scrollTop=document.getElementById("chat-messages-list").getBoundingClientRect().height+100}));let t=document.getElementById("send-message"),n=function(t){t.preventDefault();let n=$("#chat-message-input").val();""!=n&&(console.log("data sent from front end"),e.socket.emit("send_message",{message:n,user_email:e.userEmail,chatroom:"Codeial"}))};t.addEventListener("click",(function(e){n(e)})),document.getElementById("chat-message-input").addEventListener("keydown",(function(e){"Enter"==e.key&&n(e)})),this.socket.on("msg_rcvd",(function(t){let n="other-message";t.user_email==e.userEmail&&(n="self-message");let s=document.getElementById("chat-messages-list"),i=`<li class="${n}">\n                <div class="info-container">\n                    <sub>\n                        ${String(t.user_email).substring(0,String(t.user_email).search("@"))}\n                    </sub>\n                    <span>\n                        ${t.message}\n                    </span>\n                    <sub>\n                        ${t.sentTime}\n                    <sub>\n                <div>\n\n            </li>`;s.innerHTML+=i,document.getElementById("chat-messages-list").scrollTop=document.getElementById("chat-messages-list").scrollHeight,document.getElementById("chat-message-input").value=""}))}}