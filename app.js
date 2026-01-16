const USERS={
 fan:{pw:"fan"},
 seorin:{pw:"1234",role:"artist"},
 hari:{pw:"1234",role:"artist"},
 rossy:{pw:"1234",role:"artist"},
 dana:{pw:"1234",role:"artist"},
 loyd:{pw:"1234",role:"artist"},
 admin:{pw:"admin",role:"admin"}
}

let currentUser=null
let currentRoom="seorin"

const rooms=["seorin","hari","rosy","dana","group"]

const DB={
 chat: JSON.parse(localStorage.getItem("chat")||"{}"),
 posts: JSON.parse(localStorage.getItem("posts")||"[]"),
 notice: localStorage.getItem("notice")||"",
 live: localStorage.getItem("live")||"OFF"
}

/* LOGIN */

function login(){
 const id=loginId.value
 const pw=loginPw.value

 if(!USERS[id]||USERS[id].pw!==pw) return alert("로그인 실패")

 currentUser={id,role:USERS[id].role||"fan"}
 localStorage.setItem("session",JSON.stringify(currentUser))

 loginScreen.classList.add("hidden")
 app.classList.remove("hidden")

 if(currentUser.role==="admin") adminBtn.classList.remove("hidden")

 loadHome()
 loadRooms()
 loadCommunity()
 loadMy()
}

/* NAV */

function openTab(tab){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"))

 document.getElementById(tab+"Page").classList.add("active")
 event.currentTarget.classList.add("active")

 pageTitle.innerText=tab.toUpperCase()
}

/* HOME */

function loadHome(){
 homePage.innerHTML=`
 <div class="post">📢 ${DB.notice||"공지 없음"}</div>
 <div class="post">🔴 LIVE : ${DB.live}</div>
 `
}

/* CHAT */

function loadRooms(){
 chatPage.innerHTML=`<div class="room-list"></div>`
 const list=chatPage.querySelector(".room-list")

 rooms.forEach(r=>{
  const div=document.createElement("div")
  div.innerText=r==="group"?"LOYD 단체":r
  div.onclick=()=>openRoom(r)
  list.appendChild(div)
 })
}

function openRoom(room){
 currentRoom=room
 chatPage.innerHTML=`
 <div class="chat-room" id="chatRoom"></div>
 ${ inputAllowed()?`
 <div class="chat-input">
  <input id="msg">
  <button onclick="sendMsg()">➤</button>
 </div>`:""}
 loadChat()
}

function inputAllowed(){
 if(currentRoom==="group" && currentUser.role==="fan") return false
 return true
}

function loadChat(){
 const box=document.getElementById("chatRoom")
 box.innerHTML=""

 const data=DB.chat[currentRoom]||[]

 data.forEach(m=>{
  const div=document.createElement("div")
  div.className=`bubble ${m.from==="fan"?"fan":"artist"}`
  div.innerHTML=m.text

  if(m.from==="fan" && currentUser.role!=="fan"){
   const r=document.createElement("div")
   r.className="reply-btn"
   r.innerText="↩ reply"
   r.onclick=()=>reply(m.text)
   div.appendChild(r)
  }

  box.appendChild(div)
 })
}

function sendMsg(){
 const text=msg.value
 if(!text) return

 if(!DB.chat[currentRoom]) DB.chat[currentRoom]=[]

 DB.chat[currentRoom].push({
  from: currentUser.role==="fan"?"fan":"artist",
  text:text
 })

 saveChat()
 msg.value=""
 loadChat()
}

function reply(target){
 msg.value="↳ "+target+" : "
}

/* COMMUNITY */

function loadCommunity(){
 communityPage.innerHTML=`
 ${ currentUser.role==="admin"?
 `<button onclick="writePost()">글쓰기</button>`:""}
 <div id="postList"></div>
 `
 renderPosts()
}

function writePost(){
 const t=prompt("내용")
 if(!t) return

 DB.posts.unshift({text:t,comments:[]})
 savePosts()
 renderPosts()
}

function renderPosts(){
 const box=document.getElementById("postList")
 box.innerHTML=""

 DB.posts.forEach((p,i)=>{
  const div=document.createElement("div")
  div.className="post"
  div.innerHTML=`
   ${p.text}
   <button onclick="comment(${i})">댓글</button>
  `
  p.comments.forEach(c=>{
   const cc=document.createElement("div")
   cc.className="comment"
   cc.innerText="↳ "+c
   div.appendChild(cc)
  })
  box.appendChild(div)
 })
}

function comment(i){
 const t=prompt("댓글")
 if(!t) return

 DB.posts[i].comments.push(t)
 savePosts()
 renderPosts()
}

/* MY */

function loadMy(){
 myPage.innerHTML=`
 <h3>MY</h3>
 <p>ID: ${currentUser.id}</p>
 <button onclick="logout()">로그아웃</button>
 `
}

/* ADMIN */

function openAdmin(){
 noticeModal.classList.remove("hidden")
}

function saveNotice(){
 DB.notice=noticeText.value
 localStorage.setItem("notice",DB.notice)
 noticeModal.classList.add("hidden")
 loadHome()
}

/* SAVE */

function saveChat(){
 localStorage.setItem("chat",JSON.stringify(DB.chat))
}

function savePosts(){
 localStorage.setItem("posts",JSON.stringify(DB.posts))
}

function logout(){
 localStorage.clear()
 location.reload()
}
