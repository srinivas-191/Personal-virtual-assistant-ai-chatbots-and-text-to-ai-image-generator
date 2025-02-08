const app = document.getElementById('app');
function showSignUpPage() {
    document.body.style.backgroundImage = "none"; // Add background
    app.innerHTML = `
    <div class="signup-container">
        <h2>Create Account</h2>
        <form id="signup-form">
            <label for="signup-username">Username:</label>
            <input type="text" id="signup-username" placeholder="Username" required>
            <label for="signup-email">E-mail(secret email which is known only to you): </label>
            <input type="email" id="signup-email" placeholder="Secret Email which is known only by you" required>
            <div class="password-field">
            <input type="password" id="signup-password" placeholder="password" required>
            <button type="button" class="toggle-password" data-target="signup-password">👁️</button>
            </div>
            <div class="password-field">
            <input type="password" id="signup-confirm-password" placeholder="confirm-Password" required>
            <button type="button" class="toggle-password" data-target="signup-confirm-password">👁️</button>
            </div>
            <label for="security-question">Security Question:</label>
            <input type="text" id="security-question" placeholder="security question" required><br><br>
            <div class="password-field">
            <label for="security-answer">Answer:</label>
            <input type="password" id="security-answer" placeholder="Answer" required>
            <button type="button" class="toggle-password" data-target="security-answer">👁️</button>
            </div><br><br>
            <button type="submit" class="signup-button">Sign Up</button> <br><br>
            <button type="button" id="voice-input">🎤 Speak</button> <!-- Voice input button -->
            <p id="voice-status">Press the button to start the signup process via voice.</p>
        </form>
        <br>
        <p>Already have an account? <a class="link" onclick="showLoginPage()">Login</a></p>
    </div>`
initSignUpForm();
initVoiceInputForSignUp();
initPasswordToggle(); 
}
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const target = document.getElementById(button.getAttribute('data-target'));
            if (target.type === 'password') {
                target.type = 'text';
                button.textContent = '🙈'; // Change icon to hide
            } else {
                target.type = 'password';
                button.textContent = '👁️'; // Change icon to show
            }
        });
    });
}
function initSignUpForm(){
    document.getElementById('signup-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Fetch the latest users array from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value; 
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const securityQuestion = document.getElementById("security-question").value;
  const securityAnswer = document.getElementById("security-answer").value;
  
  // Check if password and confirm password match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Check if username already exists
  if (users.some((user) => user.username === username)) {
    alert("Username already exists!");
    return;
  }

  // check if email already exists
  if (users.some((user) => user.username === username || user.email === email)) {
    alert("Username or Email already exists!");
    return;
}

// check if any user exist
if (users && users.length > 0) {
    alert(
      `This application is already registered to ${users.length} user(s).`
    );
    return;
  }

  //check if security question and answer are provided
  if(!securityQuestion || !securityAnswer){
        alert("please provide security question and answer");
        return;
  }

  // Add the new user to the users array
  users.push({ username,email, password, securityQuestion, securityAnswer });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful!");
  showLoginPage();
    });
}

function showLoginPage() {
    document.body.style.backgroundImage = "none"; // Add background
    app.innerHTML = `
    <div class="login-container">
        <h2>Login</h2>
        <form id="login-form">
            <input type="text" id="login-username" placeholder="username" required><br>
            <div class="password-field">
            <input type="password" id="login-password" placeholder="Password" required>
            <button type="button" class="toggle-password" data-target="login-password">👁️</button>
            </div><br>
            <p>Forgot your password? <a class="link" id="reset-password-link" onclick="showForgotPasswordPage()">Reset it here</a></p>
            <br>
            <button type="submit" class="login-button">Login</button><br><br>
            <button type="button" id="voice-input">🎤 Speak</button> <!-- Voice input button -->
            <p id="voice-status">Press the button to start the signup process via voice.</p>
        </form>
        <p>Don't have an account? <a class="link" onclick="showSignUpPage()">Sign Up</a></p>
    </div>
`
initLoginPage();
initVoiceInputForLogin();
initPasswordToggle();
document.getElementById('reset-password-link').addEventListener('click', showForgotPasswordPage);
}
function initLoginPage(){
    document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.username === username && user.password === password);
        // Check if no users are registered
        if (!users || users.length === 0) {
            alert("No one has registered the application yet. You are eligible to register now.");
            return;
        }
    if(user){
        alert("Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        showPage1();
    }
    else{
        alert("Invalid credentials! Please check your username and password.");
    }
});
}
function showLogOutPage() {
    document.body.style.backgroundImage = "none"; // Add background
    app.innerHTML = `
    <!-- Logout Page -->
<div class="logout-container" id="logout-container">
  <h1>Confirm Logout</h1>
  <form id="logout-form">
    <input type="text" id="logout-username" placeholder="Enter Username" required>
    <div class="password-field">
    <input type="password" id="logout-password" placeholder="Enter Password" required>
    <button type="button" class="toggle-password" data-target="logout-password">👁️</button>
    </div>
    <button type="submit" class="logout-button">Logout</button><br><br>
    <button type="button" id="voice-input">🎤 Speak</button> <!-- Voice input button -->
    <p id="voice-status">Press the button to start the signup process via voice.</p>
  </form>
  <p>Cancel logout? <span class="link" onclick="showPage3()">Back to previous page</span></p>
</div>
    `;
    initLogoutPage();
    initVoiceInputForLogout();
    initPasswordToggle();
}

function initLogoutPage(){
    document.getElementById('logout-container').addEventListener('submit', function(event) {
        event.preventDefault();
        const enteredUsername = document.getElementById("logout-username").value;
        const enteredPassword = document.getElementById("logout-password").value;
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
        // Check if the entered username and password match the current logged-in user
        if (loggedInUser && loggedInUser.username === enteredUsername && loggedInUser.password === enteredPassword) {
          if (confirm("Are you sure you want to logout?")) {
            // Clear the logged-in user data and show login page
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("users");
            alert("Logout successful!");
            showLoginPage();
          } else {
            // Redirect back to the welcome page
            showPage3();
          }
        } else {
          alert("Invalid Credentials!");
        }
      });
}

function showPage1() {
    document.body.style.backgroundImage = "url('./Leonardo_Phoenix_A_visually_captivating_hightech_background_fo_3.jpeg')"; // Add background
    app.innerHTML = `
        <div class="container">
            <h1>Your AI Assistant</h1>
            <p>Press the button and say a command (e.g., "Open YouTube")</p>
            <button id="listen-btn" class="btn">🎙️ Start Listening</button>
    <button id="manage-btn" class="btn" onclick="showManageCommandsPage()">Manage Commands</button>
        </div>
        <div class="buttons">
            <button onclick="showPage2()">Go to pesonal chatbot page</button>
            <button onclick="showPage3()">Go to text to ai image generator page</button>
        </div>
    `;
    initSpeechRecognition();
}

// Initialize speech recognition and button functionality
function initSpeechRecognition() {
// Speech recognition setup
const recognition = new (window.SpeechRecognition ||
window.webkitSpeechRecognition)();
recognition.lang = "en-US";
const btn = document.querySelector("#listen-btn");

// Attach click event listener to the button
btn.addEventListener("click", function () {
  // Function to convert text to speech
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  function handleCommand(command) {
    let savedCommands = JSON.parse(localStorage.getItem("customCommands")) || {};

    if (savedCommands[command]) {
        if (savedCommands[command].url) {
            speak(`Opening ${command.replace("open ", "")}...`);
            window.open(savedCommands[command].url, "_blank");
        } else if (savedCommands[command].answer) {
            speak(savedCommands[command].answer);
        }
    } 
    else if (command.startsWith("search for")) {
        const searchQuery = command.replace("search for", "").trim();
        if (searchQuery) {
            speak(`Searching Google for ${searchQuery}`);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
        }
    }
    else {
        speak(`I don't recognize this command. Searching Google...`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(command)}`, "_blank");
    }
}
    
  // Greet the user and then start listening
  speak("Hello, how can I help you?");

  // Delay to ensure greeting completes before starting recognition
  setTimeout(() => {
    btn.innerHTML = "Listening...👂";
    btn.classList.add("listening");
    recognition.start();
  }, 2500);

  // When a result is received
  recognition.onresult = (event) => {
    console.log(event);
    const command = event.results[0][0].transcript.toLowerCase();
    handleCommand(command);
  };

  // When recognition ends
  recognition.onend = () => {
    btn.innerHTML = "Start Listening";
    btn.classList.remove("listening");
  };
});

}

function showManageCommandsPage() {
    document.body.style.backgroundImage = "url('./Leonardo_Phoenix_A_visually_captivating_hightech_background_fo_3.jpeg')" // Add background
    app.innerHTML = `
        <h1>Manage Your AI Assistant Commands</h1>
    <div class="manage-container">
    <input type="text" id="commandInput" placeholder="Enter command (e.g., Open GitHub)">
    <input type="text" id="urlInput" placeholder="Enter URL (optional)">
    <input type="text" id="answerInput" placeholder="Enter answer (optional)">
    </div>
    <button onclick="addCommand()">Add Command</button><br>
    <button onclick="showPage1()">Back to virtual assistant chatbot page</button>

    <h2>Saved Commands</h2>
    <table>
        <thead>
            <tr><th>Command</th><th>URL</th><th>Answer</th><th>Action</th></tr>
        </thead>
        <tbody id="commandList"></tbody>
    </table>

    <button onclick="clearCommands()">Clear All Commands</button>

    `
displayCommands();
}
    function addCommand() {
            let command = document.getElementById("commandInput").value.toLowerCase().trim();
            let url = document.getElementById("urlInput").value.trim();
            let answer = document.getElementById("answerInput").value.trim();

            if (!command) {
                alert("Command is required!");
                return;
            }

            if (!url && !answer) {
                alert("Either a URL or an answer must be provided!");
                return;
            }

            let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
            commands[command] = { url: url || null, answer: answer || null };
            localStorage.setItem("customCommands", JSON.stringify(commands));

            document.getElementById("commandInput").value = "";
            document.getElementById("urlInput").value = "";
            document.getElementById("answerInput").value = "";

            displayCommands();
        }

        function displayCommands() {
            let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
            let commandList = document.getElementById("commandList");
            commandList.innerHTML = "";

            for (let key in commands) {
                let command = key; // Preserve original case for display
               let row = `<tr>
                    <td>${command}</td>
                    <td>${commands[command].url || "-"}</td>
                    <td>${commands[command].answer || "-"}</td>
                    <td><button onclick="deleteCommand('${command}')">Delete</button></td>
                </tr>`;
                commandList.innerHTML += row;
            }
        }

        function deleteCommand(command) {
    let commands = JSON.parse(localStorage.getItem("customCommands"));
    for (let key in commands) {
        if (key.toLowerCase() === command.toLowerCase()) {
            delete commands[key];
            break;
        }
    }
    localStorage.setItem("customCommands", JSON.stringify(commands));
    displayCommands();
}

        function clearCommands() {
            localStorage.removeItem("customCommands");
            displayCommands();
        }

        window.onload = displayCommands;

function showPage2() {
    document.body.style.backgroundImage = "none";
    app.innerHTML = `
    <div class="chat-container" style="width: 100%; height: calc(100vh - 80px);">
    <div class="ai-chat-box"> 
    <img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area"> Hello! How Can I Help you Today? </div> 
    </div> 
    </div>
    <div class="prompt-area"> 
    <input type="text" id="prompt" placeholder="Message..."> 
<button id="voice-to-voice-and-text"><img src="img.svg.svg" alt="">v2vat</button>
    <button id="voice-to-text"><img src="img.svg.svg" alt="">v2t</button>
    <button id="stop-voice"><img src="img.svg" alt=""> Stop</button>
<button id="restart-voice"><img src="img.svg" alt=""> Restart</button>
        <button id="image"><img src="img.svg" alt=""> <input type="file" accept="images/*" hidden> </button> 
    <button id="submit"><img src="submit.svg" alt=""></button>
<button id="submit-text-to-voice-and-text"><img src="img.svg" alt="">t2vat</button>
</div>
    <div class="bottom-link"> <a href="#" onclick="showImagesAndCurrentInfoGenerationPage()">Go to Images and Current Info Generation Page</a></div>
    <div class="buttons"> 
    <button onclick="showPage1()">Go to virtual assistant chatbot page</button> 
    <button onclick="showPage3()">Go to text to ai image generator page</button> 
    </div>`;
    
    initTextImageRecognition(); 
}

function initTextImageRecognition() { 
    let prompt = document.querySelector("#prompt"); 
    let submitbtn = document.querySelector("#submit"); 
    let chatContainer = document.querySelector(".chat-container"); 
    let imagebtn = document.querySelector("#image"); 
    let imageinput = document.querySelector("#image input"); 
    let previewImage = document.querySelector("#previewImage"); 

    const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=your-gemini-key";

    let user = { 
        message: null, 
        file: { 
            mime_type: null,
            data: null
        }
    };
    
    let speechInstance = null; // Store current speech instance

    let stopBtn = document.querySelector("#stop-voice");
    let restartBtn = document.querySelector("#restart-voice");

    function stopSpeech() {
        if (speechInstance) {
            window.speechSynthesis.cancel(); // Stop speech
        }
    }

    function restartSpeech() {
        if (speechInstance) {
            window.speechSynthesis.speak(speechInstance); // Resume speech
        }
    }
// Attach event listeners
stopBtn.addEventListener("click", stopSpeech);
restartBtn.addEventListener("click", restartSpeech);
    
    let voiceToTextBtn = document.querySelector("#voice-to-voice-and-text");
voiceToTextBtn.addEventListener("click", () => {
    let greetingSpeech = new SpeechSynthesisUtterance("Hello, how can I help you?");
    speechInstance = greetingSpeech;
    window.speechSynthesis.speak(greetingSpeech);

    greetingSpeech.onend = function() {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US"; 
        recognition.continuous = false; 
        recognition.start();

        recognition.onresult = function(event) {
            let userQuestion = event.results[0][0].transcript;
            prompt.value = userQuestion;
            handleChatResponse(userQuestion, true); // Both text and speech
        };
    };
});
    
    let voiceToTextButton = document.querySelector("#voice-to-text");
    voiceToTextButton.addEventListener("click", () => {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.start();

        recognition.onresult = function(event) {
            let userQuestion = event.results[0][0].transcript;
            prompt.value = userQuestion;
            handleChatResponse(userQuestion, false); // Text only
        };
    });

    let submitTextToVoiceAndTextButton = document.querySelector("#submit-text-to-voice-and-text");
    submitTextToVoiceAndTextButton.addEventListener("click", () => {
        let userMessage = prompt.value;
        handleChatResponse(userMessage, true); // Both text and speech
    });

    
async function generateResponse(aiChatBox, enableSpeech) {
        let text = aiChatBox.querySelector(".ai-chat-area");
        let requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            { "text": user.message },
                            ...(user.file.data ? [{ "inline_data": user.file }] : []) 
                        ]
                    }
                ]
            })
        };

        try {
            let response = await fetch(Api_Url, requestOptions);
            let data = await response.json();
            let apiResponse = data.candidates[0]?.content?.parts[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim() || "No details found.";
            text.innerHTML = apiResponse;

            // Speak response only if enabled
            if (enableSpeech) {
                let speech = new SpeechSynthesisUtterance(apiResponse);
                speechInstance = speech;
                window.speechSynthesis.speak(speech);
            }
        } catch (error) {
            console.log(error);
            text.innerHTML = "Error fetching response.";
        } finally {
            scrollToBottom();
            user.file = {}; 
        }
    }

    function createChatBox(html, classes) {
        let div = document.createElement("div");
        div.innerHTML = html;
        div.classList.add(classes);
        return div;
    }

    function scrollToBottom() {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }

    function handleChatResponse(userMessage, enableSpeech) {
        user.message = userMessage;
        let html = `<img src="user.png" alt="" id="userImage" width="8%">
        <div class="user-chat-area">
        ${user.message}
        ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
        </div>`;
        prompt.value = "";
        let userChatBox = createChatBox(html, "user-chat-box");
        chatContainer.appendChild(userChatBox);

        scrollToBottom();

        setTimeout(() => {
            let html = `<img src="ai.png" alt="" id="aiImage" width="10%">
            <div class="ai-chat-area">
            <img src="loading.webp" alt="" class="load" width="50px">
            </div>`;
            let aiChatBox = createChatBox(html, "ai-chat-box");
            chatContainer.appendChild(aiChatBox);
            generateResponse(aiChatBox, enableSpeech);
        }, 600);
    }

    submitbtn.addEventListener("click", () => {
        handleChatResponse(prompt.value, false); // Text only
    });

    prompt.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && prompt.value.trim() !== "") {
            handleChatResponse(prompt.value, false); // Text only
        }
    });

    imageinput.addEventListener("change", () => {
        const file = imageinput.files[0];
        if (!file) return;
        let reader = new FileReader();
        reader.onload = (e) => {
            let base64string = e.target.result.split(",")[1];
            user.file = {
                mime_type: file.type,
                data: base64string
            };
            previewImage.src = `data:${user.file.mime_type};base64,${user.file.data}`;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    });

    imagebtn.addEventListener("click", () => {
        imageinput.click();
    });
}


function showImagesAndCurrentInfoGenerationPage() {
    app.innerHTML = `
        <div class="chat-container" style="width: 100%; height: calc(100vh - 80px);">
<div class="ai-chat-box">
<img src="ai.png" alt="" id="aiImage" width="10%">
<div class="ai-chat-area">
Hello ! I am here to provide current info and images...How Can I Help you Today?
</div>
</div>
</div>
<div class="prompt-area">
<input type="text" id="prompt" placeholder="Message...">
<button id="voice-to-voice-and-text"><img src="img.svg.svg" alt="">v2vat</button>
    <button id="voice-to-text"><img src="img.svg.svg" alt="">v2t</button>
    <button id="stop-voice"><img src="img.svg.svg" alt="">stop</button>
    <button id="resume-voice"><img src="img.svg.svg" alt="">resume</button>
 <button id="submit"><img src="submit.svg" alt=""></button>
<button id="submit-text-to-voice-and-text"><img src="img.svg" alt="">t2vat</button>
</div>
<div class="bottom-link">
<a href="#" onclick="showPage2()">Back to Personal Chatbot Page</a>
</div>
<div class="buttons">
<button onclick="showPage1()">Go to virtual assistant chatbot page</button>
<button onclick="showPage3()">Go to text to ai image generator page</button>
</div>
    `;
    initImagesAndCurrrentInfoGeneration();
}
function initImagesAndCurrrentInfoGeneration(){
    let prompt = document.querySelector("#prompt"); 
    let submitbtn = document.querySelector("#submit"); 
    let chatContainer = document.querySelector(".chat-container");
    // Your Google API Key and Custom Search Engine ID
const GOOGLE_API_KEY = "your_google_api_key"; // Replace with your Google API Key
const SEARCH_ENGINE_ID = "your_google_search_engine_id"; // Replace with your Custom Search Engine ID
    
const APIs = {
    weather: "https://api.openweathermap.org/data/2.5/weather?q=", // Weather API
    news: "https://gnews.io/api/v4/search?q=", // GNews API
};
    
    const API_KEYS = {
    weather: "your_Weather_API_Key", // Weather API Key
    news: "/your_GNews_API_Key", // GNews API Key
};
    
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};
    let speechInstance = null; // Store current speech instance

    let stopBtn = document.querySelector("#stop-voice");
    let resumeBtn = document.querySelector("#resume-voice");

    function stopSpeech() {
        if (speechInstance) {
            window.speechSynthesis.cancel(); // Stop speech
        }
    }

    function resumeSpeech() {
        if (speechInstance) {
            window.speechSynthesis.speak(speechInstance); // Resume speech
        }
    }

    stopBtn.addEventListener("click", stopSpeech);
    resumeBtn.addEventListener("click", resumeSpeech);
    
    
    let voiceToTextBtn = document.querySelector("#voice-to-voice-and-text");
    voiceToTextBtn.addEventListener("click", () => {
        let greetingSpeech = new SpeechSynthesisUtterance("Hello, how can I help you?");
        speechInstance = greetingSpeech;
        window.speechSynthesis.speak(greetingSpeech);

        greetingSpeech.onend = function() {
            let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US"; 
            recognition.continuous = false; 
            recognition.start();

            recognition.onresult = function(event) {
                let userQuestion = event.results[0][0].transcript;
                prompt.value = userQuestion;
                handleChatResponse(userQuestion, true); // Both text and speech
            };
        };
    });
    
    let voiceToTextButton = document.querySelector("#voice-to-text");
    voiceToTextButton.addEventListener("click", () => {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.start();

        recognition.onresult = function(event) {
            let userQuestion = event.results[0][0].transcript;
            prompt.value = userQuestion;
            handleChatResponse(userQuestion, false); // Text only
        };
    });

    let submitTextToVoiceAndTextButton = document.querySelector("#submit-text-to-voice-and-text");
    submitTextToVoiceAndTextButton.addEventListener("click", () => {
        let userMessage = prompt.value; 
        if (userMessage.trim() !== "") { 
            handleChatResponse(userMessage, true); // Both text and speech
        }
    });

    
// Function to fetch data from any given API
async function fetchAPIData(url, options = {}) {
    try {
        let response = await fetch(url, options);
        return await response.json();
    }catch (error) {
        console.error("API Fetch Error:", error);
        return null;
    }
}

// Function to generate response
async function generateResponse(aiChatBox,enableSpeech) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    const query = user.message;
    // Check if the query includes "images" (Google Image Search)
if (query.includes("image") || query.includes("photo") || query.includes("picture") || query.includes("photos") || query.includes("images")) {
    console.log("User requested images. Calling Google API...");

    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image&num=6`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.items && data.items.length > 0) {
            let imageHtml = data.items.map(item => `
                <img src="${item.link}" class="generated-image" style="width: 200px; height: 200px; object-fit: cover;" />
            `).join("");
            text.innerHTML = imageHtml;
        } else {
            text.innerHTML = "Sorry, I couldn't find any relevant images.";
            if (enableSpeech) {
                window.speechSynthesis.speak("Sorry, I couldn't find any relevant images.");
            }
        }
    } catch (error) {
        console.error(error);
        text.innerHTML = "An error occurred while fetching the images.";
        if (enableSpeech) {
                window.speechSynthesis.speak("An error occurred while fetching the images.");
            }
    }
}
    // Check for weather-related queries
    else if (user.message.toLowerCase().includes("weather")) {
    const locationQuery = user.message.replace("weather", "").trim();
    if (!locationQuery) {
        text.innerHTML = "Please provide a location for the weather.";
        return;
    }

    const url = `${APIs.weather}${encodeURIComponent(locationQuery)}&appid=${API_KEYS.weather}&units=metric&lang=en`;

    try {
        let data = await fetchAPIData(url);
        if (data && data.cod === 200) {
            let weatherInfo = `
                Weather in ${data.name}:
                Description: ${data.weather[0].description}
                Temperature: ${data.main.temp.toFixed(1)}°C
                Humidity: ${data.main.humidity}%
                Wind Speed: ${data.wind.speed} m/s
                Pressure: ${data.main.pressure} hPa
            `;
            text.innerHTML = weatherInfo;
            if (enableSpeech) {
                let speech = new SpeechSynthesisUtterance(weatherInfo);
                speechInstance = speech;
                window.speechSynthesis.speak(speech);
            }
        } else {
            text.innerHTML = data?.message || "Weather data not available.";
            if (enableSpeech) {
                window.speechSynthesis.speak("Weather data not available.");
            }
        }
    } catch (error) {
        console.error("Weather API Error:", error);
        text.innerHTML = "An error occurred while fetching the weather details.";
        if (enableSpeech) {
            window.speechSynthesis.speak("An error occurred while fetching the weather details.");
        }
    }
}
    // Check for news-related queries
    else if (user.message.toLowerCase().includes("news")) {
        const newsQuery = user.message.replace("news", "").trim();
        const url = `${APIs.news}${encodeURIComponent(newsQuery)}&token=${API_KEYS.news}`;
    
        try {
            let data = await fetchAPIData(url);
            if (data && data.articles && data.articles.length > 0) {
                let newsDetails = data.articles.slice(0, 5) // Fetch up to 5 news articles
                    .map(article => `
                        ${article.title}
                        ${article.description}
                        <a href="${article.url}" target="_blank">Read more</a><br><br>
                    `).join("");
                text.innerHTML = newsDetails || "No news details found.";
                if (enableSpeech) {
                    let speech = new SpeechSynthesisUtterance(newsDetails);
                    speechInstance = speech;
                    window.speechSynthesis.speak(speech);
               }
            } else {
                text.innerHTML = "No news details found.";
                if (enableSpeech) {
                    window.speechSynthesis.speak("No news details found.");
            }
               
            }
            
        } catch (error) {
            console.error(error);
            text.innerHTML = "An error occurred while fetching the news.";
            if (enableSpeech) {
                    window.speechSynthesis.speak("An error occurred while fetching the news details.");
            }
        }
        
    }
    // For general text queries (Wikipedia)
    else {
        const url = `https://www.googleapis.com/customsearch/v1?q=${query}+site:en.wikipedia.org&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&num=3`;

        try {
            let response = await fetch(url);
            let data = await response.json();

            if (data.items && data.items.length > 0) {
                let fullInformation = '';
                for (let i = 0; i < data.items.length; i++) {
                    fullInformation += data.items[i].snippet + ' ';
                }
                text.innerHTML = fullInformation || "Sorry, I couldn't find detailed information.";
                if (enableSpeech) {
                    let speech = new SpeechSynthesisUtterance(fullInformation);
                    speechInstance = speech;
                    window.speechSynthesis.speak(speech);
               }
            } else {
                text.innerHTML = "Sorry, I couldn't find relevant information.";
                if (enableSpeech) {
                    window.speechSynthesis.speak("Sorry, I couldn't find relevant information.");
            }
            }
        } catch (error) {
            console.error(error);
            text.innerHTML = "An error occurred while fetching the data.";
            if (enableSpeech) {
                    window.speechSynthesis.speak("An error occurred while fetching the data.");
            }
        }
    }
    
}
    
    
    
function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}
    
    function scrollToBottom() {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
    
    function handleChatResponse(userMessage, enableSpeech) {
    user.message = userMessage;

    let html = `<img src="user.png" alt="" id="userImage" width="8%">
    <div class="user-chat-area">
    ${user.message}
    ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
    </div>`;

    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let html = `<img src="ai.png" alt="" id="aiImage" width="10%">
        <div class="ai-chat-area">
        <img src="loading.webp" alt="" class="load" width="50px">
        </div>`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox, enableSpeech);
    }, 600);
}
    submitbtn.addEventListener("click", () => {
        handleChatResponse(prompt.value, false); // Text only
    });
    
    
 
prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handleChatResponse(prompt.value, false);
    }
});
    
}




// Render the page with Button 1 and Button 2
function showPage3() {
    document.body.style.backgroundImage = "none";
    app.innerHTML = `
    <div class="buttons">
        <button onclick="showPage1()">Go to virtual assistant chatbot page</button>
        <button onclick="showPage2()">Go to personal chatbot page</button>
        <button onclick="showLogOutPage()" id="lgt-btn">Logout</button>"
    </div>
    <div class="text-to-image-container">
    <h1>'AI' TEXT TO IMAGE GENERATOR</h1>
    <div class="input">
        <label for="">Create an image from Text prompt :
        </label>
        <input type="text" name="" id="input" placeholder="Enter a Text to Generate The Image">
        <button id="gbtn">Generate Image <img src="gen.svg" alt=""></button>
    </div>
    <div class="output">
       <div class="gimage"> 
        <img id="gimage" src="" alt="">
        <img  id="svg" src="image.svg" alt="">
        <img id="loading" src="https://media1.giphy.com/media/uIJBFZoOaifHf52MER/200w.gif?cid=6c09b952krmmhrqbfpwoyypd75hfoa8xddg0g311s8ygzy8i&ep=v1_gifs_search&rid=200w.gif&ct=g" alt="">
    </div>
      
        <div class="dbtns">
            <button id="download">Download <img src="down.svg" alt=""></button>
            <button id="reset">Reset <img src="reset.svg" alt=""></button>
        </div>
    </div>
            `;
            initImageGeneration();
        }
        // image recognition
function initImageGeneration(){
const key = "your_hugging_face_api_key";
const inputText = document.getElementById("input");
const image = document.getElementById("gimage");
const GenBtn = document.getElementById("gbtn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
		{
			headers: {
				Authorization:`Bearer ${key}`
				
			},
			method: "POST",
			body: JSON.stringify({"inputs": inputText.value}),
		}
	);
	const result = await response.blob();
	image.style.display="block";
	load.style.display="none";
	return result;
}
async function  generate() {
	
 load.style.display="block";
query().then((response) => {
	const objectUrl = URL.createObjectURL(response);
	gimage.src = objectUrl;
	downloadBtn.addEventListener("click" , ()=>{
		download(objectUrl)
	})

	
});
}

GenBtn.addEventListener( "click" , () =>{
	generate();
		svg.style.display="none"

});

inputText.addEventListener( "keydown" , (e) =>{
   if(e.key == "Enter")
   {
	generate();
	svg.style.display="none"
   }
   
})
ResetBtn.addEventListener ("click" , () =>{
    inputText.value = ""
	window.location.reload();

})
 function download(objectUrl){


 fetch(objectUrl).then(res=>res.blob())
 .then(file=>{
	let a = document.createElement("a");
	a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
	a.click();
 })
 .catch(()=> alert("failed Download"));
}

}
function initVoiceInputForSignUp() {
  const voiceButton = document.getElementById("voice-input");
  const usernameInput = document.getElementById("signup-username");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmPasswordInput = document.getElementById("signup-confirm-password");
  const securityQuestionInput = document.getElementById("security-question").value;
  const securityAnswerInput = document.getElementById("security-answer").value;
  const voiceStatus = document.getElementById("voice-status");
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
      voiceStatus.textContent = "Voice input not supported on your browser.";
      voiceButton.disabled = true;
      return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  let currentStep = 0;

  // Start voice input
  voiceButton.addEventListener("click", () => {
      if (currentStep === 0) {
          speak("Please say your username.");
      }
      voiceStatus.textContent = "Listening...";
      recognition.start();
  });

  recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript.toLowerCase().trim();

      // Handle symbol replacements for email
      transcript = transcript
          .replace(/at the rate of/g, "@")
          .replace(/dot/g, ".")
          .replace(/underscore/g, "_")
          .replace(/dash/g, "-");

      switch (currentStep) {
          case 0:
              usernameInput.value = transcript;
              speak("Please say your email address.");
              currentStep++;
              break;
          case 1:
              emailInput.value = transcript;
              speak("Please say your password.");
              currentStep++;
              break;
          case 2:
              passwordInput.value = transcript;
              speak("Please confirm your password.");
              currentStep++;
              break;
          case 3:
              confirmPasswordInput.value = transcript;
              speak("please say security question?");
              currentStep++;
              break;
              case 4:
                securityQuestionInput.value = transcript;
                speak("please say security answer.");
                currentStep++;
                break;
              case 5:
                securityAnswerInput.value = transcript;
                speak("checking your information....");
                validateSignUp(
                  usernameInput.value,
                  emailInput.value,
                  passwordInput.value,
                  confirmPasswordInput.value
              );
            
              currentStep = 0; // Reset for next user
              break;
          default:
              break;
      }
      voiceStatus.textContent = "Voice input completed.";
  };

  recognition.onerror = (event) => {
      voiceStatus.textContent = `Error: ${event.error}`;
  };

  function speak(message) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(message);
      synth.speak(utterance);
  }

  function validateSignUp(username, email, password, confirmPassword) {
      const users = JSON.parse(localStorage.getItem("users")) || [];


      // Check if password and confirm password match
      if (password !== confirmPassword) {
          speak("Passwords do not match.");
          alert("Passwords do not match!");
          return;
      }


      // Single user limitation
      if (users.length > 0) {
          speak(`This application is already registered to ${users.length} user.`);
          alert("Only one user can register in this application.");
          return;
      }

      // Add the new user
      users.push({ username, email, password, securityQuestionInput, securityAnswerInput });
      localStorage.setItem("users", JSON.stringify(users));
      speak("Signup successful!");
      alert("Signup successful!");
      showLoginPage(); // Redirect to login page
  }
}

function initVoiceInputForLogin() {
    const voiceButton = document.getElementById("voice-input");
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");
    const voiceStatus = document.getElementById("voice-status");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceStatus.textContent = "Voice input not supported on your browser.";
        voiceButton.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    let currentStep = 0;  // Track which field we're at (username, password)
    let hasStarted = false; // Track if the process has already started


    // Start speech recognition when the button is clicked
    voiceButton.addEventListener('click', () => {
        if (!hasStarted) {
            voiceStatus.textContent = "Listening...";
            speak("Please say your username.");
            recognition.start();
            hasStarted = true;
        }
    });

    // Start speech recognition when the button is clicked
    voiceButton.addEventListener('click', () => {
        voiceStatus.textContent = "Listening...";
        recognition.start();
    });

    // Speech recognition result handler
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        switch (currentStep) {
            case 0:
                // Ask for username
                usernameInput.value = transcript.trim();
                speak("Please say your password.");
                currentStep++;
                break;
            case 1:
                // Ask for password
                passwordInput.value = transcript.trim();
                speak("Verifying your login information...");
                validateLogin(usernameInput.value, passwordInput.value);
                currentStep++;
                break;
            default:
                break;
        }
        voiceStatus.textContent = "Voice input completed.";
    };

    recognition.onerror = (event) => {
        voiceStatus.textContent = `Error: ${event.error}`;
    };

    function speak(message) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        synth.speak(utterance);
    }

    function validateLogin(username, password) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((user) => user.username === username && user.password === password);
        
        if (user) {
            speak("Login successful!");
            alert("Login successful!");
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            showPage1();
        } 
        // Check if no users are registered
        else if (!users || users.length===0){
            speak("No one has registered the application yet. You are eligible to register now.");
            alert("No one has registered the application yet. You are eligible to register now.");
            return;
        }
        else {
            speak("Invalid credentials. Please check your username and password.");
            alert("Invalid credentials!");
        }
    }
}

function initVoiceInputForLogout() {
    const voiceButton = document.getElementById("voice-input");
    const usernameInput = document.getElementById("logout-username");
    const passwordInput = document.getElementById("logout-password");
    const voiceStatus = document.getElementById("voice-status");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceStatus.textContent = "Voice input not supported on your browser.";
        voiceButton.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    let currentStep = 0;  // Track which field we're at (username, password)
    let hasStarted = false; // Track if the process has already started


    // Start speech recognition when the button is clicked
    voiceButton.addEventListener('click', () => {
        if (!hasStarted) {
            voiceStatus.textContent = "Listening...";
            speak("Please say your username.");
            recognition.start();
            hasStarted = true;
        }
    });


    // Start speech recognition when the button is clicked
    voiceButton.addEventListener('click', () => {
        voiceStatus.textContent = "Listening...";
        recognition.start();
    });

    // Speech recognition result handler
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        switch (currentStep) {
            case 0:
                // Ask for username
                usernameInput.value = transcript.trim();
                speak("Please say your password.");
                currentStep++;
                break;
            case 1:
                // Ask for password
                passwordInput.value = transcript.trim();
                speak("Are you sure you want to logout?");
                validateLogout(usernameInput.value, passwordInput.value);
                currentStep++;
                break;
            default:
                break;
        }
        voiceStatus.textContent = "Voice input completed.";
    };

    recognition.onerror = (event) => {
        voiceStatus.textContent = `Error: ${event.error}`;
    };

    function speak(message) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        synth.speak(utterance);
    }

    function validateLogout(username, password) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser && loggedInUser.username === username && loggedInUser.password === password) {
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("loggedInUser");
                alert("Logout successful!");
                speak("Logout successful.");
                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("users");
                
                showLoginPage();
            }
        } else {
            speak("Invalid credentials. Please check your username and password.");
            alert("Invalid credentials!");
        }
    }
}
function showForgotPasswordPage() {
    document.body.style.backgroundImage = "none"; // Add background
    app.innerHTML = `
    <div class="forgot-password-container">
        <h2>Forgot Password</h2>
        <form id="forgot-password-form">
            <input type="email" id="forgot-email" placeholder="Enter your email" required><br>
            <label for="security-question">Security Question:</label>
            <input type="text" id="security-question" placeholder="Security Question" readonly><br><br>
            <div class="password-field">
            <label for="security-answer">Answer:</label>
            <input type="password" id="security-answer" placeholder="Enter your answer" required>
            <button type="button" class="toggle-password" data-target="security-answer">👁️</button>
            </div><br><br>
            <button type="submit" class="forgot-password-button">Send Reset Link</button>
        </form>
    </div>
    `;
    initPasswordToggle();
    document.getElementById('forgot-email').addEventListener('input', function() {
        const email = this.value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((user) => user.email === email);
        const securityQuestionInput = document.getElementById('security-question');
        
        if (user) {
            securityQuestionInput.value = user.securityQuestion;
        } else {
            securityQuestionInput.value = '';
        }
    });
    initForgotPasswordForm(); // Initialize forgot password form logic
}
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const target = document.getElementById(button.getAttribute('data-target'));
            if (target.type === 'password') {
                target.type = 'text';
                button.textContent = '🙈'; // Change icon to hide
            } else {
                target.type = 'password';
                button.textContent = '👁️'; // Change icon to show
            }
        });
    });
}

function initForgotPasswordForm() {
    document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById("forgot-email").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const securityAnswerInput = document.getElementById("security-answer").value;
        const user = users.find((user) => user.email === email);  // Check if email exists

        if(user) {
            // Generate a reset token (in a real-world app, send a reset link via email)
            const resetToken = Math.random().toString(36).substr(2, 8);  // Simulated token
            localStorage.setItem("resetToken", resetToken);
            
            if (user.securityAnswer.toLowerCase() !== securityAnswerInput.toLowerCase()) {
                alert("Incorrect security answer!");
                return;
            }
            localStorage.setItem("resetEmail", email); // Store email for later use

            alert(`A password reset link is. (Reset Token: ${resetToken})`);

            showResetPasswordPage();  // Show the Reset Password Page
            showResetPasswordPage();  // Show the Reset Password Page
        } else {
            alert("Email not found!");
        }
    });
}

function showResetPasswordPage() {
    document.body.style.backgroundImage = "none"; // Add background
    app.innerHTML = `
    <div class="reset-password-container">
        <h2>Reset Your Password</h2>
        <form id="reset-password-form">
            <input type="text" id="reset-token" placeholder="Enter your reset token" required><br>
            <input type="password" id="new-password" placeholder="New Password" required><br>
            <input type="password" id="confirm-new-password" placeholder="Confirm New Password" required><br>
            <button type="submit" class="reset-password-button">Reset Password</button>
        </form>
    </div>
    `;
    initResetPasswordForm();  // Initialize reset password form logic
}

function initResetPasswordForm() {
    document.getElementById('reset-password-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const resetToken = document.getElementById("reset-token").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmNewPassword = document.getElementById("confirm-new-password").value;

        const storedToken = localStorage.getItem("resetToken");
        const email = localStorage.getItem("resetEmail"); // Get the stored email

        if (resetToken === storedToken) {
            // Check if the new passwords match
            if (newPassword === confirmNewPassword) {
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const user = users.find((user) => user.email === email); // Find the user by email

                if (user) {
                    user.password = newPassword; // Update password
                    const index = users.indexOf(user);
                    if (index > -1) {
                        users[index] = user;
                    }
                    localStorage.setItem("users", JSON.stringify(users)); // Save updated users list

                    localStorage.removeItem("resetToken"); // Remove reset token after successful reset
                    localStorage.removeItem("resetEmail"); // Remove stored email

                    alert("Password reset successfully!");
                    showLoginPage();  // Show Login Page
                } else {
                    alert("User not found.");
                }
            } else {
                alert("Passwords do not match! Please try again.");
            }
        } else {
            alert("Invalid reset token!");
        }
    });
}
async function sendResetEmail() {
    const emailData = {
      to: 'recipient@example.com',  // The recipient email
      from: 'your-email@example.com',  // Your email address (must be verified in Mailjet)
      subject: 'Password Reset Request',
      text: 'Click here to reset your password: <reset-link>',  // Update with the actual reset link
    };
  
    try {
      const response = await fetch('/send-email', {  // Your server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
// Initial page load
showLoginPage();
