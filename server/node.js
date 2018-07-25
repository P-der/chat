var app = require('http').createServer();
var io  = require('socket.io')(app);
var users = [];
io.on('connection',function(socket){
    socket.on('login',function(data){
        if(users.indexOf(data.name)>=0){
            console.log(data.name+'已有重名');
            socket.emit('login',{
                status:'err',
                text:'重名，给老子重输'
            })
        }else{
            users.push(data.name);
            socket.nickName = data.name;
            console.log(users)
            io.emit('sys',{
                text:socket.nickName+'进入房间',
                count:users.length,
                users:users
            })
            socket.emit('login',{
                status:'ok'
            })
        }
    })

    socket.on('message',function(data){
        socket.broadcast.emit('message',data)
    })

    socket.on('disconnect',function(){
        let index =  users.indexOf(socket.nickName);
        if(index>=0){
            users.splice(index,1);
        }
        io.emit('sys',{
            text:socket.nickName+'离开',
            count:users.length,
            users:users
        })
        console.log('离开')
    })
})

app.listen(3000,function(){
    console.log('启动端口3000')
})