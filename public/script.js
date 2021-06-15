const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

//making empty object so that user can be find which user gets removed
const peers = {} 
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  //using this object to make stop and play audio and video buttons 
  myVideoStream = stream;
  //this is for my video to see on the screen and i am muted for myself as i don't want to hear my noise
  addVideoStream(myVideo, stream)

  // answering the call request from user it will send stream and we will add that on our screen
  myPeer.on('call', call => {
    // answer the call and send stream
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  // now we nee to connect to different users video stream that is why we use socket.on here
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

//myPeer.on will genrate unique userID for users it think we can omit this step of genrating different user id as when we will insert login credentials i think is directly us object id as user id so we need not to pass from client side to server side user id
myPeer.on('open', id => {
  //this will send singnal to server and it will catched where socket.on is used using same message i.e join-room
  socket.emit('join-room', ROOM_ID, id)
})


// function used connect to new user
function connectToNewUser(userId, stream) {
  //calling the user using userID and sending our video to that user
  const call = myPeer.call(userId, stream)

  const video = document.createElement('video')
  //this function will take argument that is video stream of that user and we will add that in our code 
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  //when user leaves the room ie will be used to remove the stream 
  call.on('close', () => {
    video.remove()
  })

  // storing the information of connected users 
  peers[userId] = call
}

function addVideoStream(video, stream) {
  //this will allow us to play our video
  video.srcObject = stream
  //this event is just once stream is loaded we need to play the video
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
