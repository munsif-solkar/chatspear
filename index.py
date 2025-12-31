from flask import Flask,render_template,request,session,redirect
from flask_socketio import SocketIO,send
import socket
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(('8.8.8.8',80))
host = s.getsockname()[0]


public_channels=['science','technology','entertainment','moviesandshows','astronomy']
users = {'science': {}, 'technology': {}, 'entertainment': {}, 'moviesandshows': {}, 'astronomy': {}}
room_stats = {'science': {'admin': 'chatspear', 'creator': 'chatspear'},
                'technology': {'admin': 'chatspear', 'creator': 'chatspear'},
                'entertainment': {'admin': 'chatspear', 'creator': 'chatspear'},
                'moviesandshows': {'admin': 'chatspear', 'creator': 'chatspear'},
                'astronomy': {'admin': 'chatspear', 'creator': 'chatspear'}}
lastUser = ''
    
def switch_admin(room,room_mems):
    if room_mems:
        newAdmin = list(room_mems.keys())[0]
        if newAdmin != room_stats[room]['admin']:
            room_stats[room]['admin'] = newAdmin
            print('New admin:',users[room][newAdmin],'for',room)
            updateUsersList(room)
            socketio.emit(f'{room}-remove-user',f'{users[room][newAdmin ]} is now an Admin', include_self=False)


def updateUsersList(from_room):
    online_users = []
    for user in users[from_room]:
        uname = users[from_room][user]
        online_users.append(uname)
    if len(users[from_room]) < 1 and from_room not in public_channels:
        users.pop(from_room)
        room_stats.pop(from_room)
        return 0
    if from_room not in public_channels:    
        current_admin = users[from_room][room_stats[from_room]['admin']]
    current_admin = 'chatspear'
    creator = room_stats[from_room]['creator']
    room_meta = [current_admin,creator]
    socketio.emit(f'online-users-in-{from_room}',[online_users,room_meta])


def genRandomUsername():
    username_combo = 'qwertyuiopasdfghjklzxcvbnm1234567890'
    random_username = "".join(random.sample(username_combo,6))
    return random_username

def sanitize_roomname(name):
	def sanitize(a):
		esc = { " ": "%20", "<": "%3C", ">": "%3E", "#": "%23", "%": "%25", "+": "%2B", "{": "%7B", "}": "%7D", "|": "%7C", "^": "%5E", "~": "%7E", "[": "%5B", "]": "%5D", "‘": "%60", ";": "%3B", "/": "%2F", "?": "%3F", ":": "%3A", "@": "%40", "=": "%3D", "&": "%26", "$": "%24" }
		if a in esc:
			a = a.replace(a,esc[a])
		return a
      
	x = map(sanitize, list(name))
	x = "".join(list(x)).lower()
	return x

@app.route('/')
def home():
    science_channel_users = users['science']
    tech_channel_user = users['technology']
    entertainment_channel_users = users['entertainment']
    moviesandshows_channel_users = users['moviesandshows']
    astronomy_channel_users = users['astronomy']
    return render_template('homepage.html',science_channel_users=science_channel_users,
                                            tech_channel_user=tech_channel_user,
                                            entertainment_channel_users=entertainment_channel_users,
                                            moviesandshows_channel_users=moviesandshows_channel_users,
                                            astronomy_channel_users=astronomy_channel_users)

@app.route('/<roomName>/')
def rooms(roomName):
    true_roomname = roomName
    roomName = sanitize_roomname(roomName)
    session['room'] = roomName
    print(session)
    print(roomName)
    admin = False
    if roomName not in users:
        admin = True
    @socketio.on(roomName)
    def manage_room(data):
        global admin
        sid = request.sid
        session['session_id'] = sid
        userName = data['username'].lower().strip().strip()
        print(userName)
        RandUserName = "user_"+genRandomUsername()
        if not userName:
            userName = RandUserName
        if roomName not in users:
            users[roomName] = {}
            room_stats[roomName] = {}
            room_stats[roomName]['admin'] = sid
            room_stats[roomName]['creator'] = userName
        if userName in users[roomName].values():
            userName = RandUserName
        users[roomName][sid] = userName
        print(users)
        socketio.emit(f'{roomName}-user',f'{userName} Joined the chat', include_self=False)
        print("gotcha")
        updateUsersList(roomName)
        room_stats[roomName]['lastMessageBy'] = ''
    return render_template('page.html',roomName=true_roomname,admin=admin)


@socketio.on('connect')
def connection(socket):
    lastUser = request.sid


@socketio.on('message')
def handle_message(data):
    sid = request.sid
    messageText = data['msg']
    messageTime = data['time']
    room = session['room']
    messageFrom = users[room][sid]
    if messageFrom == room_stats[room]['lastMessageBy']:
        messageFrom = ''
    print(messageFrom+": " + messageText)
    socketio.emit(room,{'msg':messageText,'sender':messageFrom,'time':messageTime},include_self=False)
    room_stats[room]['lastMessageBy'] = users[room][sid]

@socketio.on('destroy_room')
def destroy(data):
    room = data
    sid = request.sid
    isAdmin = sid == room_stats[room]['admin']
    admin_name = users[room][sid]
    print(admin_name)
    if isAdmin:
        socketio.emit('destroy-'+room,admin_name,include_self=False)

    
    

@socketio.on('disconnect')
def leave():
    sid = request.sid
    room = session['room']
    if room in users:
        room_stats[room]['lastMessageBy'] = ''
        socketio.emit(f'{room}-remove-user',f'{users[room][sid]} Left the chat', include_self=False)
        users[room].pop(sid)
        if room not in public_channels:
            switch_admin(room,users[room])
        updateUsersList(room)
        return
    print("No room found!")
    


if __name__ == '__main__':
    socketio.run(app,debug=True,host=host)
