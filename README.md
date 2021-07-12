# TeamsClone

Link of heroku app you can sign up and login if you already have account without account you user will not be authorised to join meeting 
https://collab-room-2902.herokuapp.com/

### Agile Methods Used

I engaged in a weekly sprints with mentors and active feedback loop was established. Based on live feedback, set of improvements and features were uptaken for my next sprint cycle
#### My sprints looked like

Sprint 1 was about design and prototype of collab room 

Sprint 2 was implementation of minimal vaible product 

Sprint 3 focused on improving accessibility and historical chat feature 

Spritn 4 was adding of Screen Share feature 

### Tech Stack
Node.js, Express, peer.js, socket.io, EJS, CSS, JavaScript, Heroku, git 

### Functional Features

1. User account creation data is stored on MongoDB Atlas.
2. Authorisation i.e without account you cannot join room.
3. Create room and Join room facilites and join room will only possible if there is valid room id in the database.
4. Chats are stored for perticular room id if user re-joins the room using same room id he or she can see the previous chats stored.
5. Partial Implementation of Screen Share Feature
 
### UI Features

1. Web app is responsive according to the screen width styling is different for mobile and desktop type systems.
2. Chat, Video, Audio enable disable option is working fine.
3. Added share room Id button that will copy room id directly to the clipboard so that sharing can be done without human errors.

### Improvements and Enhancements
1. Screen Share UI and auto focus and removal of screen when user stops screen share
2. Auto focus on the person speaking in the meet chainging size and width of video elements based on number of people in the meet

### Feature To Implement
1. Video Recording


### Screen Shots

#### Sign in
![Screenshot (27)](https://user-images.githubusercontent.com/55539066/125184217-8e19c980-e239-11eb-9308-3e88608a5ff2.png)

Input correct credential to and press sign in button if you already have account to go to home page

Click on sign up button in left top corner to go to sign up screen 

#### Sign up 
![Screenshot (28)](https://user-images.githubusercontent.com/55539066/125184236-ba354a80-e239-11eb-949f-486e9385ab12.png)

Enter Username, Email id and password, Username and Email id should be unique otherwise application will not allow user to ccreate account

#### Home Page
![Screenshot (29)](https://user-images.githubusercontent.com/55539066/125184310-2a43d080-e23a-11eb-8134-86b189d80fb1.png)

Create Room Button allow user to create new room and after that just share link or room id

Input room Id and click join room button to join the room and incorrect room id will not work because all room id are stored in database and checked from there

#### Video Chat Screen 
![Screenshot (30)](https://user-images.githubusercontent.com/55539066/125185714-f8d00280-e243-11eb-86a8-1f517f3ffff7.png)

1. Mute button allow to turn on and off your audio
2. stop video butoon allow to turn on and off your video 
3. Share Room id button will copy the room id to clipboard then you just have to share room id to other user that you want to join the meet 
4. Chat button allows to toggle the chat area
5. Screen share allows user to share his/her screen with other user that are currently present in the meeting