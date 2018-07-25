import './css/main.css'
import io from './js/socket.io'

let loginStatus = false;
let oLogin = document.getElementById('login-box');
let oLoginInput = document.getElementById('login-input');
let oLoginBtn = document.getElementById('login-btn')
let nickName = '';
let oMessageInput = document.getElementById('message-input');
let oMessageBtn = document.getElementById('message-btn');
let oListBox = document.getElementById('list-box');
let oUsersLength = document.getElementById('users-length');
let oUserBox = document.getElementById('user-box');
let socket = io('ws://localhost:3000');

//连接服务器
socket.on('connect',function(){
    console.log('ok');
})

//服务器事件
socket.on('login',function(data){
    if(data.status=='ok'){
        loginStatus = true;
        oLogin.style.display = 'none';
    }else{
        alert(data.text);
    }
})

socket.on('message',function(data){
    oListBox.innerHTML += `<li>
        <div class="name">${data.name}</div>
        <div class="message">${data.text}</div>
    </li>`;
    oListBox.scrollTop = oListBox.scrollHeight;
})

socket.on('sys',function(data){
    oUsersLength.innerText = data.count;
    oListBox.innerHTML += `<li class="sys">
        <div class="name">系统通知</div>
        <div class="message">${data.text}</div>
    </li>`;
    let oUser = '';
    data.users.forEach(el => {
        oUser += `<li>${el}</li>`;
    });
    oUserBox.innerHTML = oUser;
})

//登录事件
function userLogin(){
    console.log('login')
    let loginName = oLoginInput.value;
    if(loginName === ''){
        alert('请输入用户名');
    }else if(loginName.length>20){
        alert('用户名不能超过20个字符长度')
    }else{
        nickName = loginName;
        socket.emit('login',{
            name:nickName
        })
    }
}
oLoginBtn.addEventListener('click',userLogin);
oLoginInput.addEventListener('keydown',function(e){
    if(e.key === 'Enter'){
        userLogin();
    }
})

//发送消息
function sendMessage(){
    let oText = oMessageInput.value;
    if(oText === ''){
        alert('发送消息不能为空');
        return ;
    }else if(oText.length > 30){
        alert('内容不能超过30字符长度');
        return ;
    }
    socket.emit('message',{
        name:nickName,
        text:oText
    })
    oListBox.innerHTML += `<li class="my">
        <div class="name">${nickName}</div>
        <div class="message">${oText}</div>
    </li>`;
    oMessageInput.value = '';
    oListBox.scrollTop = oListBox.scrollHeight;
}
oMessageBtn.addEventListener('click',sendMessage);
oMessageInput.addEventListener('keydown',function(e){
    if(e.key === 'Enter'){
        sendMessage();
    }
})
