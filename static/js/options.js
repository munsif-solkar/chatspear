//window managment
var window_status = true;
function destroy_cluster(){
   window_status = true;
   document.title = `${room()} - Chatspear`;
   notification_count = 0;
}
function seteye(){
    $(window).blur(()=>{
        window_status = false;
    })
    $(window).focus(()=>{
        destroy_cluster();
    })
}
window.onload = seteye;
//notification sound
var notification_count = 0;
function notification(){
   var notification_switch = $('.notification-switch').is(':checked');
   if(notification_switch){
       //sound
       notification_sound = new Audio('../static/when-604.mp3');
       notification_sound.play();
   }
   //increment messages count
   notification_count++;
   var default_title = `${room()} - Chatspear`;
   document.title = `(${notification_count}) ${default_title}`;
}
//box
var hide_options = ()=>{$('.options-box').fadeToggle('fast');}
$('.toggle-options').click(hide_options);
//clear chats
const clear_chats = ()=>{
    $('.chats').text('');
    hide_options();
}
$('.clear-chatbox').click(clear_chats);
//leave channel
function leave_channel(){
    socket.disconnect();
    if(socket.disconnected){
        window.location.href='/';
    }
}
$('.leave-channel').click(leave_channel);
function destroy_channel(){
    if(confirm("You really wanna end this?")){
        socket.emit('destroy_room',room(),()=>{
            window.location.href="/";
        });
    }
}
$('.destroy-channel').click(destroy_channel);