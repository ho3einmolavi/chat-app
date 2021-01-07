const socket = io()
const chatForm = document.getElementById('chat-form')

//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//Join chatRoom
socket.emit('joinChat' , {username, room})

socket.on('message', message => {
    outputMessage(message)
})


socket.on('roomUsers' , ({room, users}) => {
    outputRoomInfo({room, users})
})


//submit message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value

    //Emitting a message to server
    socket.emit('chatMessage', msg)

    //clear input
    e.target.elements.msg.value = ''
})


function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
        ${message.text}
        </p>`

    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomInfo(room) {
    const h2 = document.getElementById('room-name')
    h2.innerText = room.room
    const ul = document.getElementById('users')
    ul.innerHTML = ''
    room.users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        document.getElementById('users').appendChild(li)
    })
}

