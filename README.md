# Chatspear

Chatspear is a simple and anonymous real-time chatting platform. Built with Python, Flask, and WebSockets, it allows users to instantly create or join chat rooms without any registration. Just pick a room name, choose a nickname, and start talking.

## Features

*   **Anonymous Chatting:** No sign-up or personal information required.
*   **Custom Chat Rooms:** Create or join any room by simply navigating to its URL.
*   **Public Channels:** A pre-defined list of public channels is available on the homepage.
*   **Real-time Messaging:** Messages are delivered instantly using Flask-SocketIO.
*   **Online User List:** See who is currently active in your chat room.
*   **Admin Controls:** The first user to create a room becomes the admin and has the power to destroy it. If the admin leaves, a new admin is automatically assigned.
*   **User-Friendly Interface:** A clean and simple UI with options for sound notifications, clearing the chat view, and leaving the channel.

## Tech Stack

*   **Backend:** Python, Flask, Flask-SocketIO
*   **Frontend:** HTML, CSS, JavaScript, jQuery, Socket.IO

## Project Structure

```
chatspear/
├── index.py              # Main Flask application and WebSocket logic
├── templates/
│   ├── homepage.html     # Landing page for creating/joining rooms
│   └── page.html         # The chat room interface
└── static/
    ├── js/               # Client-side JavaScript
    │   ├── brain.js      # Core chat functionality & socket handling
    │   └── options.js    # UI options (notifications, leave, destroy)
    ├── style/            # CSS stylesheets
    │   ├── homepage-style.css
    │   └── style.css
    └── ...               # Images and other static assets
```

## Setup and Installation

Follow these steps to run Chatspear on your local machine.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/munsif-solkar/chatspear.git
    cd chatspear
    ```

2.  **Create and activate a virtual environment (recommended):**
    ```sh
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    venv\Scripts\activate
    ```

3.  **Install the required dependencies:**
    ```sh
    pip install Flask Flask-SocketIO
    ```

4.  **Run the application:**
    ```sh
    python index.py
    ```
    The application will start and print the local network URL (e.g., `http://192.168.1.X:5000`) to the console.

5.  **Access the application:**
    Open your web browser and navigate to the URL provided in the console.

## How to Use

1.  Navigate to the application's homepage in your browser.
2.  To create or join a custom room, type a desired name in the input field and click **"Join / Create"**.
3.  Alternatively, click on one of the public channels listed on the homepage to join it directly.
4.  Upon entering a room, you will be prompted to enter a nickname.
5.  Once you've set your nickname, you can start sending and receiving messages in real-time.
