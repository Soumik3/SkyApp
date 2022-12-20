const socket = io('http://localhost:8000',
{transports:['websocket']})
//there maybe many sockets

//Get DOM elements in respective js variables
const form=document.getElementById("send-container");
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector(".container")

//Audio that will play in reciving messages
var audio=new Audio('ting.mp3');

//Function which will append event info to the container
const append=(message,position,a)=>{
    const messageElement=document.createElement('div');
    if(a==1){
        messageElement.innerHTML=`<b>${message}</b>`
    }
    else{

        messageElement.innerText=message;
    }
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

//Ask new user for his/her name and let the server know
const name=prompt("Enter your name to join");
//trigger an event
socket.emit('new-user-joined',name);

//if a new user joins,receive his/her name from the server
//listen an event
socket.on('user-joined',(name)=>{
    append(`${name} joined the chat`,'right',1);
})

//if server sends a message,receive it
socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'left');
})

//if a user leaves the chat,append the info to the container
socket.on('left',name=>{
    append(`${name} left the chat`,'right',1);
})

//if the form gets submitted,send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})