var socket = io.connect();
    var masterClass = document.getElementsByClassName('chats')[0];
    var chatBox = document.getElementsByClassName('chats')[0];
    function isElementScrolledToBottom(el) {
        if (el.scrollTop >= (el.scrollHeight - el.offsetHeight)) {
            return true;
        }
        return false;
      }
    function scroll(){
        chatBox.scrollTop = chatBox.scrollHeight; 
    }
    function Time(){
        const d = new Date();
        var hour = String(d.getHours());
        var minutes = String(d.getMinutes());
        var secs = String(d.getSeconds());
        hour = hour.padStart(2,'0');
        minutes = minutes.padStart(2,'0');
        secs = secs.padStart(2,'0');
        var tm = hour+':'+minutes+':'+secs;
        const time12 = new Date('2021-01-01T' + tm + 'Z').toLocaleTimeString('en-US',{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})
        return time12;
    }
    const createMessageBody = (mess,position,part='self')=>{
        var doScroll = isElementScrolledToBottom(chatBox);
        let receivedText = document.createElement("div");
        receivedText.setAttribute("class","message-body");
        receivedText.classList.add(position);
        var messageBodyElement = document.createElement("div");
        messageBodyElement.setAttribute('class','msgBody');
        messageBodyElement.innerText = mess;
        if(part != 'self'){
            let senderName = document.createElement('div');
            senderName.setAttribute('id','sender')
            senderName.innerText = part;
            receivedText.append(senderName);
        }
        var msgTime = document.createElement('div');
        msgTime.setAttribute('id','message_time');
        msgTime.innerText = Time();
        receivedText.append(messageBodyElement);
        receivedText.append(msgTime);
        masterClass.append(receivedText);
        if(doScroll){
            scroll();
        }
    }
    const room = ()=>{
        var grabRoomName = window.location.href;
        grabRoomName = grabRoomName.split('/');
        grabRoomName = grabRoomName[grabRoomName.length-2]
        return grabRoomName.toLowerCase();
    }
    var username = "".toLowerCase();
    do{
        username = prompt('Enter your Nickname');
    }
    while(!username);
    username = username.toLowerCase();
    console.log(username);
    socket.on('connect',(sock)=>{
        socket.emit(room(),{'memberOf':room(),'username':username});
    })
    const manage_user = (name,status)=>{
        var doScroll = isElementScrolledToBottom(chatBox);
        let newUser = document.createElement("span");
        newUser.setAttribute('id',status);
        newUser.innerText = name;
        masterClass.append(newUser)
        if(doScroll){
            scroll();
        }
    }
    socket.on((room()+'-user'),data=>{
    	console.log('jjjhjkj')
        manage_user(data,'joined_chat');
    })
    socket.on((room()+'-remove-user'),(data)=>{
        manage_user(data,'left_chat');
    })
    socket.on(('online-users-in-'+room()),data=>{

        users_list = data[0];
        room_meta = data[1];
        console.log(users_list);
        console.log('updated users list')
        var usersBox = "";
        var creepy = "<span id='fucking-alone'>Lonely</span>";
        $('#users_count').text(users_list.length)
        if(users_list.length > 1){
            creepy = ""
        }
        Array.from(users_list).forEach(user=>{
            usersBox = usersBox +`<div id='onlineUser' class='online_users_class'><div class='userOnline'></div>${creepy}</div>`;
        })
        //Highlight self
        $('.users_entries').html((index,old)=>{
            const admin = room_meta[0];
            const creator = room_meta[1];
            $setAdmin = $('#room_admin');
            $setAdmin.text(admin);
            if(admin == username){
                $setAdmin.text('You');
                $('.destroy-channel').removeAttr('hidden');
            }
            $('#room_creator').text(creator);
            return usersBox;
         })
         var filter_users = document.querySelectorAll('.userOnline');
         Array.from(filter_users).forEach((user,index)=>{
            $(user).text(users_list[index])
         })
         myNameIndex = users_list.indexOf(username);
         myId = document.querySelectorAll('.userOnline')[myNameIndex];
         myId.innerText = myId.innerText+" (you)";
    })
    socket.on(room(),function(data){
        var getSender = data['sender']
        var getMesssage = data['msg']
        var getMesssageTime = data['time'];
        createMessageBody(getMesssage,'left',part=getSender);
        if(!window_status){
            notification();
        }
    })
    // destroy room
    socket.on('destroy-'+room(),data=>{
        alert(`Room destroyed by Admin (${data})`);
        window.location.href = "/";
    })


    function toggleOnlineUsersBox(){
        $('.online_users').fadeToggle('fast');
    }
    function sendMessage(e=false){
        const inp = document.getElementById('message');
        if(inp.value.length > 0){
            if(e){e.preventDefault()};
            createMessageBody(inp.value,'right');
            socket.send({'msg':inp.value,'time':Time()});
            inp.value = '';
            $('.online_users').fadeOut('fast');
            scroll();
        }
    }
    document.addEventListener('submit',function(e){
        sendMessage(e=e);
    })
    $('#message').keypress(function(event){
        var kc = event.keyCode
        if(kc==13){
            event.preventDefault();
            sendMessage();
        }
    })
    $('.toggle_online_users').click(()=>{
        toggleOnlineUsersBox();
    });

