const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
let myId;
let myStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

//making empty object so that user can be find which user gets removed
const peers = {} 
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  //using this object to make stop and play audio and video buttons 
  myStream = stream;
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
      const data = username + ": " + text.val() 
      socket.emit('message', data);
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><br/>${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

//myPeer.on will genrate unique userID for users it think we can omit this step of genrating different user id as when we will insert login credentials i think is directly us object id as user id so we need not to pass from client side to server side user id
myPeer.on('open', id => {
  myId = id;
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
    console.log("byeee");
    video.remove()
  })

  // storing the information of connected user 
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
  const enabled = myStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myStream.getVideoTracks()[0].enabled = false;
    
    setPlayVideo()
  } else {
    setStopVideo()
    myStream.getVideoTracks()[0].enabled = true;
    
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
  myVideo.style.display="block";
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  myVideo.style.display="none";
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const shareroomid = document.querySelector("#shareUrl")

shareroomid.addEventListener('click',()=>{
  var text = ROOM_ID;
  navigator.clipboard.writeText(text).then(function() {
    alert("room ID is copied")
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {  
    console.error('Async: Could not copy text: ', err);
  });
});

const chatIcon = document.querySelector(".chatIcon");
const chatRoom = document.querySelector(".main__right");
const videoRoom = document.querySelector(".main__left");
const closeChat = document.querySelector(".closeChat");
const shareScreen = document.querySelector(".shareScreen");

chatIcon.addEventListener('click',()=>{
  
  if (window.getComputedStyle(chatRoom).display === "none") {
    chatRoom.style.display = "flex";
  } else {
    chatRoom.style.display = "none";
  }
  chatRoom.classList.add("ChatClass")
  videoRoom.classList.add("VideoClass")
})

closeChat.addEventListener('click',()=>{
  chatRoom.classList.remove("ChatClass")
  videoRoom.classList.remove("VideoClass")
  chatRoom.style.display = "none";
})



const toggleControlMenu = () =>{
  const menu = document.querySelector(".menu")
  menu.classList.toggle('toggleClass')
}

shareScreen.addEventListener("click", () => {
  
  navigator.mediaDevices
  .getDisplayMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
   
    socket.emit("screenShare");     
    socket.on("callAllUser", (users) => {
      console.log('hii');
      for (let i = 0; i < users.length; i++) {
        if (users[i] == myId) {
          console.log('found user');
          continue;
        }
        const call = myPeer.call(users[i], stream);
        // const video = document.createElement("video");
        // call.on("stream", (userVideoStream) => {
        //   addVideoStream(video, userVideoStream);
        // });
        

        
      }
      myPeer.on("call", (call) => {
        call.answer();
        const video = document.createElement("video");
        video.style.CSSStyleDeclaration.webkitTransform = "scaleX(1)";
        video.style.transform = "scaleX(1)";
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
    });
  });
});