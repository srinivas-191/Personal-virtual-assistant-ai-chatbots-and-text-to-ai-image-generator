const app = document.getElementById('app');
function showSignUpPage() {
    document.body.style.backgroundImage = "none"; // Add background
    app.innerHTML = `
    <div class="signup-container">
        <h2>Create Account</h2>
        <form id="signup-form">
            <label for="signup-username">Username:</label>
    <div class="input-container">
            <input type="text" id="signup-username" placeholder="Username" required>
                 <img src="microphone.svg" alt="Mic" class="mic-icon mic-username">
        </div>
            <label for="signup-email">E-mail(secret email which is known only to you): </label>
     <div class="input-container">
            <input type="email" id="signup-email" placeholder="Secret Email which is known only by you" required>
      <img src="microphone.svg" alt="Mic" class="mic-icon mic-email">
        </div>
    <label for="signup-password">Password:</label>
            <div class="password-field">
    <div class="input-container">
            <input type="password" id="signup-password" placeholder="password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-password">
        </div>
            <button type="button" class="toggle-password" data-target="signup-password">👁️</button>
           </div>
    <label for="signup-confirm-password">Confirm Password:</label>
            <div class="password-field">
    <div class="input-container">
            <input type="password" id="signup-confirm-password" placeholder="confirm-Password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-confirm-password">
        </div>
            <button type="button" class="toggle-password" data-target="signup-confirm-password">👁️</button>
        </div>
            <label for="security-question">Security Question:</label>
     <div class="input-container">
            <input type="text" id="security-question" placeholder="security question" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-security-question">
        </div>
    <label for="security-answer">Answer:</label>
    <div class="password-field">
    <div class="input-container">
            <input type="password" id="security-answer" placeholder="password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-security-answer">
    </div>
    <button type="button" class="toggle-password" data-target="security-answer">👁️</button>
    </div><br>
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
    initAllMicButtons();
}
function initMicForField(fieldId, micClass, promptMessage) {
    const micButton = document.querySelector(micClass);
    const inputField = document.getElementById(fieldId);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice input is not supported on your browser.");
        micButton.style.display = "none"; // Hide mic button if not supported
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {
        micButton.src = "microphone2.svg"; // Change mic image to active state
        speak(promptMessage, () => {
            recognition.start();
        });
    });

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim();

        // Special formatting for email input
        if (fieldId === "signup-email") {
            transcript = transcript
                .replace(/at the rate of/g, "@")
                .replace(/dot/g, ".")
                .replace(/underscore/g, "_")
                .replace(/dash/g, "-")
                .replace(/\s+/g, "");
        }

        inputField.value = transcript.toLowerCase();
    };

    recognition.onend = () => {
        micButton.src = "microphone.svg"; // Revert mic image after speech ends
    };

    recognition.onerror = (event) => {
        alert(`Error: ${event.error}`);
        micButton.src = "microphone.svg"; // Ensure image resets on error
    };
}

// Function to speak a message and execute a callback after speaking
function speak(message, callback) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.onend = () => {
        if (callback) callback(); // Start recognition after speech ends
    };

    synth.speak(utterance);
}

// Initialize mic buttons for all fields
function initAllMicButtons() {
    initMicForField("signup-username", ".mic-username", "Please say your username.");
    initMicForField("signup-email", ".mic-email", "Please say your email address.");
    initMicForField("signup-password", ".mic-password", "Please say your password.");
    initMicForField("signup-confirm-password", ".mic-confirm-password", "Please confirm your password.");
    initMicForField("security-question", ".mic-security-question", "Please say your security question.");
    initMicForField("security-answer", ".mic-security-answer", "Please say your security answer.");
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
    <label for="login-username">Username:</label>
    <div class="input-container">
            <input type="text" id="login-username" placeholder="username" required>
     <img src="microphone.svg" alt="Mic" class="mic-icon mic-login-username">
        </div>
    <label for="login-password">Password:</label>
            <div class="password-field">
    <div class="input-container">
            <input type="password" id="login-password" placeholder="Password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-login-password">
        </div>
            <button type="button" class="toggle-password" data-target="login-password">👁️</button>
            </div>
            <p>Forgot your password? <a class="link" id="reset-password-link" onclick="showForgotPasswordPage()">Reset it here</a></p>
            <br>
            <button type="submit" class="login-button">Login</button><br><br>
            <button type="button" id="voice-input">🎤 Speak</button> <!-- Voice input button -->
            <p id="voice-status">Press the button to start the signup process via voice.</p>
        </form>
        <p>Don't have an account? <a class="link" onclick="showSignUpPage()">Sign Up</a></p>
    </div>
`
    initLoginMicButtons();
initLoginPage();
initVoiceInputForLogin();
initPasswordToggle();
document.getElementById('reset-password-link').addEventListener('click', showForgotPasswordPage);
}
function initMicForLoginField(fieldId, micClass, promptMessage) {
    const micButton = document.querySelector(micClass);
    const inputField = document.getElementById(fieldId);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice input is not supported on your browser.");
        micButton.style.display = "none"; // Hide mic button if not supported
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {
        micButton.src = "microphone2.svg"; // Change mic image to active state
        speak(promptMessage, () => {
            recognition.start();
        });
    });

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim();
        inputField.value = transcript;
    };

    recognition.onend = () => {
        micButton.src = "microphone.svg"; // Revert mic image after speech ends
    };

    recognition.onerror = (event) => {
        alert(`Error: ${event.error}`);
        micButton.src = "microphone.svg"; // Ensure image resets on error
    };
}

// Function to speak a message and execute a callback after speaking
function speak(message, callback) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.onend = () => {
        if (callback) callback(); // Start recognition after speech ends
    };

    synth.speak(utterance);
}

// Initialize mic buttons for login fields
function initLoginMicButtons() {
    initMicForLoginField("login-username", ".mic-login-username", "Please say your username.");
    initMicForLoginField("login-password", ".mic-login-password", "Please say your password.");
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
    document.body.style.backgroundColor = "rgb(8, 30, 92)"; // Add background
    app.innerHTML = `
    <!-- Logout Page -->
<div class="logout-container" id="logout-container">
  <h1>Confirm Logout</h1>
  <form id="logout-form">
    <label for="logout-username">Username:</label>
    <div class="input-container">
    <input type="text" id="logout-username" placeholder="Enter Username" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-logout-username">
    </div>
    <div class="password-field">
    <div class="input-container">
    <input type="password" id="logout-password" placeholder="Enter Password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-logout-password">
    </div>
    <button type="button" class="toggle-password" data-target="logout-password">👁️</button>
    </div>
    <button type="submit" class="logout-button">Logout</button><br><br>
    <button type="button" id="voice-input">🎤 Speak</button> <!-- Voice input button -->
    <p id="voice-status">Press the button to start the signup process via voice.</p>
  </form>
  <p>Cancel logout? <span class="link" onclick="showPage3()">Back to previous page</span></p>
</div>
    `;
    initLogoutMicButtons();
    initLogoutPage();
    initVoiceInputForLogout();
    initPasswordToggle();
}
function initMicForLogoutField(fieldId, micClass, promptMessage) {
    const micButton = document.querySelector(micClass);
    const inputField = document.getElementById(fieldId);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice input is not supported on your browser.");
        micButton.style.display = "none"; // Hide mic button if not supported
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {
        micButton.src = "microphone2.svg"; // Change mic image to active state
        speak(promptMessage, () => {
            recognition.start();
        });
    });

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim();
        inputField.value = transcript;
    };

    recognition.onend = () => {
        micButton.src = "microphone.svg"; // Revert mic image after speech ends
    };

    recognition.onerror = (event) => {
        alert(`Error: ${event.error}`);
        micButton.src = "microphone.svg"; // Ensure image resets on error
    };
}

// Function to speak a message and execute a callback after speaking
function speak(message, callback) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.onend = () => {
        if (callback) callback(); // Start recognition after speech ends
    };

    synth.speak(utterance);
}

// Initialize mic buttons for logout fields
function initLogoutMicButtons() {
    initMicForLogoutField("logout-username", ".mic-logout-username", "Please say your username.");
    initMicForLogoutField("logout-password", ".mic-logout-password", "Please say your password.");
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
    document.body.style.backgroundImage = "url('Leonardo_Phoenix_A_visually_captivating_hightech_background_fo_3.jpg')"; // Add background
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
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
    let found = false;

    // Loop through saved commands to find if any command group contains the spoken command
    for (let key in savedCommands) {
        let commandArray = key.split(", ").map(cmd => cmd.trim().toLowerCase()); // Convert to array

        if (commandArray.includes(command.toLowerCase())) {
            found = true;
            if (savedCommands[key].url) {
                speak(`Opening ${command.replace("open ", "")}...`);
                window.open(savedCommands[key].url, "_blank");
            } else if (savedCommands[key].answer) {
                speak(savedCommands[key].answer);
            }
            break;
        }
    }

    // If command is not found, check if it's a search command
    if (!found) {
        if (command.startsWith("search for")) {
            const searchQuery = command.replace("search for", "").trim();
            if (searchQuery) {
                speak(`Searching Google for ${searchQuery}`);
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
            }
        } else {
            speak(`I don't recognize this command. Searching Google...`);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(command)}`, "_blank");
        }
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
    document.body.style.cssText = "text-align: center; padding: 20px;";
    app.innerHTML = `
        <h1>Manage Your AI Assistant Commands</h1>
        <div class="manage-container">
            <div id="commandInputs">
                <div class="command-input-container">
                    <button class="command-btn" onclick="addCommandInput()">+</button>
                    <input type="text" class="commandInput" placeholder="Enter command (e.g., Open GitHub)">
                    <button class="command-btn" onclick="removeCommandInput()">-</button>
                </div>
            </div>
            <input type="text" id="urlInput" placeholder="Enter URL (optional)">
            <input type="text" id="answerInput" placeholder="Enter answer (optional)">
        </div>
        <button onclick="addCommand()">Add Command</button><br>
        <button onclick="showPage1()">Back to virtual assistant chatbot page</button>

        <h2>Saved Commands</h2>
    <div id="commandListContainer">
        <table>
            <thead>
                <tr><th>Command</th><th>URL</th><th>Answer</th><th>Action</th></tr>
            </thead>
    <tbody id="commandList"></tbody>
        </table>
    </div>

        <button onclick="clearCommands()">Clear All Commands</button>
    `;

    displayCommands();
}
    function addCommandInput() {
    let commandInputs = document.getElementById("commandInputs");

    let newInputContainer = document.createElement("div");
    newInputContainer.className = "command-input-container";

    let plusButton = document.createElement("button");
    plusButton.innerText = "+";
    plusButton.className = "command-btn";
    plusButton.onclick = addCommandInput;

    let newInput = document.createElement("input");
    newInput.type = "text";
    newInput.className = "commandInput";
    newInput.placeholder = "Enter another command";

    let minusButton = document.createElement("button");
    minusButton.innerText = "-";
    minusButton.className = "command-btn";
    minusButton.onclick = removeCommandInput;

    newInputContainer.appendChild(plusButton);
    newInputContainer.appendChild(newInput);
    newInputContainer.appendChild(minusButton);

    commandInputs.appendChild(newInputContainer);
}

function removeCommandInput(event) {
    let commandInputs = document.getElementById("commandInputs");
    let inputContainer = event.target.parentElement; // Get the parent div of the button clicked

    if (commandInputs.children.length > 1) { 
        commandInputs.removeChild(inputContainer);
    }
}

function addCommand() {
    let commandElements = document.getElementsByClassName("commandInput");
    let url = document.getElementById("urlInput").value.trim();
    let answer = document.getElementById("answerInput").value.trim();

    if (!url && !answer) {
        alert("Either a URL or an answer must be provided!");
        return;
    }

    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    let newCommands = [];

    for (let input of commandElements) {
        let command = input.value.toLowerCase().trim();
        if (command) {
            newCommands.push(command);
        }
    }

    if (newCommands.length === 0) {
        alert("At least one command must be provided!");
        return;
    }

    // Check if any command already exists anywhere in the table
    for (let key in commands) {
        let existingCommands = key.split(", ").map(cmd => cmd.trim().toLowerCase());

        if (newCommands.some(cmd => existingCommands.includes(cmd))) {
            alert("One or more commands already exist in another row!");
            return;
        }
    }

    // Check if the URL or answer already exists
    let matchedKey = null;

    for (let key in commands) {
        if ((commands[key].url && commands[key].url === url) || 
            (commands[key].answer && commands[key].answer === answer)) {
            matchedKey = key;
            break;
        }
    }

    if (matchedKey) {
        // Allow adding new (non-matching) commands only within the same row
        let existingCommands = matchedKey.split(", ").map(cmd => cmd.trim().toLowerCase());
        let uniqueNewCommands = newCommands.filter(cmd => !existingCommands.includes(cmd));

        if (uniqueNewCommands.length === 0) {
            alert("One or more entered commands already exist in this row!");
            return;
        }

        let updatedKey = [...existingCommands, ...uniqueNewCommands].join(", ");
        let tempData = commands[matchedKey];
        delete commands[matchedKey]; // Remove old key
        commands[updatedKey] = tempData; // Save with updated key
    } else {
        // If no match is found, create a new entry
        commands[newCommands.join(", ")] = { url: url || null, answer: answer || null };
    }

    localStorage.setItem("customCommands", JSON.stringify(commands));
    displayCommands();
}
function displayCommands() {
    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    let commandList = document.getElementById("commandList");
    commandList.innerHTML = "";

    for (let key in commands) {
        let commandArray = key.split(", ");
        let commandHTML = commandArray.map(command => `
            <span class="command-item" id="command-${command}">
                <span class="command-text">${command}</span>
                <input type="text" class="edit-input" id="edit-${command}" value="${command}" style="display:none;">
                <button class="edit-btn" onclick="editCommand('${command}')">🖊️</button>
                <button class="save-btn" onclick="saveCommand('${command}', '${key}')" style="display:none;">💾</button>
                <button class="delete-command-btn" onclick="deleteSingleCommand('${command}', '${key}')">🗑️</button>
            </span>
        `).join(", ");

        let url = commands[key].url || "";
        let answer = commands[key].answer || "";

        let row = `<tr>
            <td>${commandHTML}</td>
            <td>
                <span class="url-text" id="url-text-${key}">${url || "-"}</span>
                <input type="text" id="edit-url-${key}" class="edit-input" value="${url}" style="display:none;">
                <button class="edit-btn" onclick="editURL('${key}')">🖊️</button>
                <button class="save-btn" onclick="saveURL('${key}')" style="display:none;">💾</button>
                <button class="delete-url-btn" onclick="deleteURL('${key}')">🗑️</button>
            </td>
            <td>
                <span class="answer-text" id="answer-text-${key}">${answer || "-"}</span>
                <input type="text" id="edit-answer-${key}" class="edit-input" value="${answer}" style="display:none;">
                <button class="edit-btn" onclick="editAnswer('${key}')">🖊️</button>
                <button class="save-btn" onclick="saveAnswer('${key}')" style="display:none;">💾</button>
                <button class="delete-answer-btn" onclick="deleteAnswer('${key}')">🗑️</button>
            </td>
            <td><button onclick="deleteCommand('${key}')">Delete</button></td>
        </tr>`;

        commandList.innerHTML += row;
    }
}

function editCommand(command) {
    // Use querySelector with an attribute selector for safety
    document.querySelector(`[id="edit-${command}"]`).style.display = "inline-block";
    document.querySelector(`#command-${CSS.escape(command)} .command-text`).style.display = "none";
    document.querySelector(`#command-${CSS.escape(command)} .edit-btn`).style.display = "none";
    document.querySelector(`#command-${CSS.escape(command)} .save-btn`).style.display = "inline-block";
}

function saveCommand(oldCommand, fullCommandKey) {
    let newCommand = document.querySelector(`[id="edit-${oldCommand}"]`).value.trim();

    // If no changes were made, simply refresh the edit option
    if (newCommand === oldCommand) {
        displayCommands(); // Refresh the table to show the edit option again
        return;
    }

    if (!newCommand) {
        alert("Command cannot be empty!");
        return;
    }

    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    if (!commands[fullCommandKey]) return;

    let commandArray = fullCommandKey.split(", ");
    let updatedCommands = commandArray.map(cmd => (cmd === oldCommand ? newCommand : cmd));

    let updatedKey = updatedCommands.join(", ");
    commands[updatedKey] = commands[fullCommandKey]; // Keep the same URL/Answer
    delete commands[fullCommandKey]; // Remove old key

    localStorage.setItem("customCommands", JSON.stringify(commands));
    displayCommands(); // Refresh the table
}
function deleteSingleCommand(commandToDelete, fullCommandKey) {
    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    
    if (!commands[fullCommandKey]) return;

    let commandArray = fullCommandKey.split(", ");
    let updatedCommands = commandArray.filter(cmd => cmd !== commandToDelete);
    
    if (updatedCommands.length === 0) {
        // If no commands are left, delete the entire entry
        delete commands[fullCommandKey];
    } 
    else {
        // Otherwise, update the key with the remaining commands
        let updatedKey = updatedCommands.join(", ");
        commands[updatedKey] = commands[fullCommandKey]; // Keep the same URL/Answer
        delete commands[fullCommandKey]; // Remove old key
    }

    localStorage.setItem("customCommands", JSON.stringify(commands));
    displayCommands(); // Refresh the table
}
function editURL(commandKey) {
    // Hide the text span and show the input field
    document.getElementById(`url-text-${commandKey}`).style.display = "none";
    document.getElementById(`edit-url-${commandKey}`).style.display = "inline-block";

    // Find the closest edit and save buttons within the same container
    let parentElement = document.getElementById(`edit-url-${commandKey}`).parentElement;
    
    parentElement.querySelector(".edit-btn").style.display = "none";  // Hide edit button
    parentElement.querySelector(".save-btn").style.display = "inline-block";  // Show save button
}

function saveURL(commandKey) {
    let urlInput = document.getElementById(`edit-url-${commandKey}`);
    let newURL = urlInput.value.trim();

    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    if (!commands[commandKey]) return;

    // If the new URL is the same as the existing one, just refresh the UI
    if (newURL === commands[commandKey].url) {
        displayCommands(); // Refresh UI
        return;
    }

    commands[commandKey].url = newURL || null; // Allow empty URL
    localStorage.setItem("customCommands", JSON.stringify(commands));
    displayCommands();
}
function deleteURL(commandKey) {
    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    if (commands[commandKey]) {
        commands[commandKey].url = null; // Remove URL only
        localStorage.setItem("customCommands", JSON.stringify(commands));
        displayCommands();
    }
}
function editAnswer(commandKey) {
    // Hide the text span and show the input field
    document.getElementById(`answer-text-${commandKey}`).style.display = "none";
    document.getElementById(`edit-answer-${commandKey}`).style.display = "inline-block";

    // Find the closest edit and save buttons within the same container
    let parentElement = document.getElementById(`edit-answer-${commandKey}`).parentElement;
    
    parentElement.querySelector(".edit-btn").style.display = "none";  // Hide edit button
    parentElement.querySelector(".save-btn").style.display = "inline-block";  // Show save button
}

function saveAnswer(commandKey) {
    let answerInput = document.getElementById(`edit-answer-${commandKey}`);
    let newAnswer = answerInput.value.trim();

    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    if (!commands[commandKey]) return;

    // If the new answer is the same as the existing one, just refresh the UI
    if (newAnswer === commands[commandKey].answer) {
        displayCommands(); // Refresh UI
        return;
    }

    commands[commandKey].answer = newAnswer || null; // Allow empty answer
    localStorage.setItem("customCommands", JSON.stringify(commands));
    displayCommands();
}
function deleteAnswer(commandKey) {
    let commands = JSON.parse(localStorage.getItem("customCommands")) || {};
    if (commands[commandKey]) {
        commands[commandKey].answer = null; // Remove answer only
        localStorage.setItem("customCommands", JSON.stringify(commands));
        displayCommands();
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
    document.body.style="background-color:rgb(45, 52, 59)";
    app.innerHTML = `
    <div class="chat-container" style="width: 100%; height: calc(100vh - 80px);">
    <div class="ai-chat-box"> 
    <img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area"> Hello ! I am here to provide user friendly chats , limited info and identifying images to my ability...
    How Can I Help you Today? </div> 
    </div> 
    </div>
    <div class="prompt-area">
    <input type="text" id="prompt" placeholder="Message...">
    <div class="button-group">
<button id="voice-to-voice-and-text"><img src="microphone.ico" alt=""><br>voice to voice and text</button>
    <button id="voice-to-text"><img src="microphone.ico" alt=""><br>voice to text</button>
    <button id="stop-voice"><img src="stop.ico" alt=""><br>stop</button>
       <button id="restart-voice"><img src="play.ico" alt=""><br>restart</button>
        <button id="image" style="position: relative;">
            <img src="img.svg" alt="" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <br><br>image
            <input type="file" accept="images/*" hidden>
        </button> 
    <button id="submit"><img src="submit.svg" alt=""><br>submit</button>
<button id="submit-text-to-voice-and-text"><img src="start.ico" alt=""><br>text to voice and text</button>
    </div>
</div>
    <div class="bottom-link"> <a href="#" id="link" onclick="showImagesAndCurrentInfoGenerationPage()">Go to Images and Current Info Generation Page</a></div>
    <div class="page-two-buttons">
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
    let image = document.querySelector("#image img"); 

    const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=Your_Gemini_API_Key";

    let user = { 
        message: null, 
        file: { 
            mime_type: null,
            data: null
        }
    };
    let resumeBtn = document.querySelector("#resume-voice");
    
    let speechInstance = null; // Store current speech instance
      let speechText = ""; // Full speech text
    let firstPart = ""; // Spoken part
    let secondPart = ""; // Remaining part

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
let voiceToTextBtnImg = voiceToTextBtn.querySelector("img"); // Select the image inside the button

voiceToTextBtn.addEventListener("click", () => {
    let greetingSpeech = new SpeechSynthesisUtterance("Hello, how can I help you?");
    speechInstance = greetingSpeech;
    window.speechSynthesis.speak(greetingSpeech);

    // Change mic icon to microphone2.ico when recording starts
    voiceToTextBtnImg.src = "microphone2.ico";

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

        recognition.onend = function() {
            // Restore mic icon after recording ends
            voiceToTextBtnImg.src = "microphone.ico";
        };
    };
}); 
    let voiceToTextButton = document.querySelector("#voice-to-text");
    let voiceToTextButtonImg = voiceToTextButton.querySelector("img"); // Select the image inside the button
    voiceToTextButton.addEventListener("click", () => {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = false;
        // Change mic icon to microphone2.ico when recording starts
    voiceToTextButtonImg.src = "microphone2.ico";
        recognition.start();
        recognition.onresult = function(event) {
            let userQuestion = event.results[0][0].transcript;
            prompt.value = userQuestion;
            handleChatResponse(userQuestion, false); // Text only
        };
        recognition.onend = function() {
            // Restore mic icon after recording ends
            voiceToTextButtonImg.src = "microphone.ico";
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
            let utterance = new SpeechSynthesisUtterance(apiResponse);
// Create the speech control UI
let speechControls = document.createElement("div");
speechControls.classList.add("speech-controls");

// Seek bar container
let seekContainer = document.createElement("div");
seekContainer.classList.add("seek-container");

let seekBar = document.createElement("input");
seekBar.type = "range";
seekBar.min = "0";
seekBar.max = "100";
seekBar.value = "0";
seekBar.classList.add("seek-bar");

// Speed control dropdown
let speedControl = document.createElement("select");
speedControl.classList.add("speed-control");
["0.5x", "1x", "1.5x", "2x"].forEach(speed => {
    let option = document.createElement("option");
    option.value = parseFloat(speed);
    option.textContent = speed;
    if (speed === "1x") option.selected = true;
    speedControl.appendChild(option);
});

// Play button
let playButton = document.createElement("button");
playButton.classList.add("control-btn");
playButton.innerHTML = "▶ Play";

// Append elements
seekContainer.appendChild(seekBar);
speechControls.appendChild(playButton);
speechControls.appendChild(seekContainer);
speechControls.appendChild(speedControl);
aiChatBox.appendChild(speechControls);
        
        let isPlaying = false;

// Update seek bar in real-time
utterance.onboundary = (event) => {
    let percent = Math.round((event.charIndex / apiResponse.length) * 100);
    seekBar.value = percent;
};
        
seekBar.addEventListener("input", () => {
    speechSynthesis.cancel();
    lastPosition = seekBar.value; // Store new position
    playButton.click(); // Restart from new position
});
        
// Handle speed change
speedControl.addEventListener("change", () => {
    speechSynthesis.cancel();
    utterance.rate = parseFloat(speedControl.value);
    speechSynthesis.speak(utterance);
});
        let isPaused = false;
let lastPosition = 0; // Store last spoken position

playButton.addEventListener("click", () => {
    if (!speechSynthesis.speaking || isPaused) {
        speechSynthesis.cancel(); // Stop any existing speech

        let startIndex = Math.floor((apiResponse.length * lastPosition) / 100);
        utterance = new SpeechSynthesisUtterance(apiResponse.slice(startIndex)); // Restart from last position

        utterance.rate = parseFloat(speedControl.value); // Maintain speed

        // Update seek bar as speech progresses
        utterance.onboundary = (event) => {
            let percent = Math.round((event.charIndex / apiResponse.length) * 100);
            seekBar.value = percent;
            lastPosition = percent; // Store last position
        };

        speechSynthesis.speak(utterance);
        isPaused = false;
        playButton.textContent = "⏸ Pause";
    } else {
        speechSynthesis.cancel(); // Stop speech completely
        isPaused = true;
        playButton.textContent = "▶ Play";
    }
});
       
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
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
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
            image.src=`data:${user.file.mime_type};base64,${user.file.data}`
            image.classList.add("choose")
        };
        reader.readAsDataURL(file);
    });

    imagebtn.addEventListener("click", () => {
        imagebtn.querySelector("input").click();
    });
}


function showImagesAndCurrentInfoGenerationPage() {
    document.body.style="background-color:rgb(45, 52, 59)";
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
    <div class="button-group">
<button id="voice-to-voice-and-text"><img src="microphone.ico" alt=""><br>voice to voice and text</button>
    <button id="voice-to-text"><img src="microphone.ico" alt=""><br>voice to text</button>
    <button id="stop-voice"><img src="stop.ico" alt=""><br>stop</button>
       <button id="restart-voice"><img src="play.ico" alt=""><br>restart</button>
    <button id="submit"><img src="submit.svg" alt=""><br>submit</button>
<button id="submit-text-to-voice-and-text"><img src="start.ico" alt=""><br>text to voice and text</button>
    </div>
</div>
<div class="current-info-bottom-link">
<a href="#" onclick="showPage2()">Back to Personal Chatbot Page</a>
</div>
<div class="page-two-buttons">
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
const GOOGLE_API_KEY = "Your_Google_API_key"; // Replace with your Google API Key
const SEARCH_ENGINE_ID = "Your_Search_Engine_ID"; // Replace with your Custom Search Engine ID
    
const APIs = {
    weather: "https://api.openweathermap.org/data/2.5/weather?q=", // Weather API
    news: "https://gnews.io/api/v4/search?q=", // GNews API
};
    
    const API_KEYS = {
    weather: " Your_Weather_API_Key", // Weather API Key
    news: "Your_GNews_API_Key", // GNews API Key
};
    
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};
    
let speechInstance = null;
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
    let voiceToTextBtnImg = voiceToTextBtn.querySelector("img"); // Select the image inside the button
    voiceToTextBtn.addEventListener("click", () => {
        let greetingSpeech = new SpeechSynthesisUtterance("Hello, how can I help you?");
        speechInstance = greetingSpeech;
        window.speechSynthesis.speak(greetingSpeech);
          // Change mic icon to microphone2.ico when recording starts
    voiceToTextBtnImg.src = "microphone2.ico";
        greetingSpeech.onend = function() {
            let recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.start();
            recognition.onresult = function(event) {
                let userQuestion = event.results[0][0].transcript;
                prompt.value = userQuestion;
                handleChatResponse(userQuestion, true); // Both text and speech
            };
            recognition.onend = function() {
            // Restore mic icon after recording ends
            voiceToTextBtnImg.src = "microphone.ico";
        };
        };
    });
    
    let voiceToTextButton = document.querySelector("#voice-to-text");
    let voiceToTextButtonImg = voiceToTextButton.querySelector("img"); // Select the image inside the button
    voiceToTextButton.addEventListener("click", () => {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = false;
          // Change mic icon to microphone2.ico when recording starts
    voiceToTextButtonImg.src = "microphone2.ico";
        recognition.start();
        recognition.onresult = function(event) {
            let userQuestion = event.results[0][0].transcript;
            prompt.value = userQuestion;
            handleChatResponse(userQuestion, false); // Text only
        };
        recognition.onend = function() {
            // Restore mic icon after recording ends
            voiceToTextButtonImg.src = "microphone.ico";
        };
    });

    let submitTextToVoiceAndTextButton = document.querySelector("#submit-text-to-voice-and-text");
    submitTextToVoiceAndTextButton.addEventListener("click", () => {
        let userMessage = prompt.value; 
        if (userMessage.trim() !== "") { 
            handleChatResponse(userMessage, true); // Both text and speech
        }
    });

    function addImageEventListeners() {
        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const url = e.target.closest('.image-wrapper').querySelector('img').src;
                downloadImage(url);
            });
        });
    
        document.querySelectorAll('.preview-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const url = e.target.closest('.image-wrapper').querySelector('img').src;
                previewImage(url);
            });
        });
    
        document.querySelectorAll('.share-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const imgSrc = e.target.closest('.image-wrapper').querySelector('img').src;
                shareImage(imgSrc);
            });
        });
    }
    
    function previewImage(url) {
        const modal = document.createElement('div');
        modal.id = 'preview-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
    
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.borderRadius = '10px';
    
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '20px';
        closeBtn.style.fontSize = '30px';
        closeBtn.style.color = 'white';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    
        modal.appendChild(img);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    }
    
    async function downloadImage(url, sourcePageUrl) {
    const corsProxy = "https://api.allorigins.win/raw?url="; // Reliable CORS proxy
    const proxyUrl = corsProxy + encodeURIComponent(url);

    // Show loading message
    const downloadButton = event.target; 
    downloadButton.textContent = "Downloading...";
    downloadButton.disabled = true;

    try {
        const response = await fetch(proxyUrl, { mode: "cors" });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const clonedResponse = response.clone(); // Clone to check content type
        const contentType = clonedResponse.headers.get("content-type");

        // If the content is not an image, redirect to the source page
        if (!contentType || !contentType.startsWith("image")) {
            throw new Error("Blocked image detected");
        }

        // Proceed with downloading
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "downloaded-image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000); // Cleanup

    } catch (error) {
        console.error("❌ Image download failed:", error.message);

        alert("⚠️ Unable to download the image. Redirecting to the image source page...");
        if (sourcePageUrl) {
            window.open(sourcePageUrl, "_blank");
        }
    } finally {
        // Restore button state
        downloadButton.textContent = "Download";
        downloadButton.disabled = false;
    }
}

    
    function shareImage(imgSrc) {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this image!',
                url: imgSrc
            }).catch(console.error);
        } else {
            alert('Sharing is not supported in this browser.');
        }
    }
    
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
                <div class="image-wrapper">
                        <img src="${item.link}" class="generated-image" style="width: 200px; height: 200px; object-fit: cover;" />
                        <div class="image-actions">
                            <button class="preview-btn">Preview</button>
                            <button class="download-btn">Download</button>
                            <button class="share-btn">Share</button>
                        </div>
                    </div>
            `).join("");
            text.innerHTML = imageHtml;
            addImageEventListeners();
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
            let utterance = new SpeechSynthesisUtterance(weatherInfo);
// Create the speech control UI
let speechControls = document.createElement("div");
speechControls.classList.add("speech-controls");

// Seek bar container
let seekContainer = document.createElement("div");
seekContainer.classList.add("seek-container");

let seekBar = document.createElement("input");
seekBar.type = "range";
seekBar.min = "0";
seekBar.max = "100";
seekBar.value = "0";
seekBar.classList.add("seek-bar");

// Speed control dropdown
let speedControl = document.createElement("select");
speedControl.classList.add("speed-control");
["0.5x", "1x", "1.5x", "2x"].forEach(speed => {
    let option = document.createElement("option");
    option.value = parseFloat(speed);
    option.textContent = speed;
    if (speed === "1x") option.selected = true;
    speedControl.appendChild(option);
});

// Play button
let playButton = document.createElement("button");
playButton.classList.add("control-btn");
playButton.innerHTML = "▶ Play";

// Append elements
seekContainer.appendChild(seekBar);
speechControls.appendChild(playButton);
speechControls.appendChild(seekContainer);
speechControls.appendChild(speedControl);
aiChatBox.appendChild(speechControls);
        
        let isPlaying = false;

// Update seek bar in real-time
utterance.onboundary = (event) => {
    let percent = Math.round((event.charIndex / weatherInfo.length) * 100);
    seekBar.value = percent;
};
        
seekBar.addEventListener("input", () => {
    speechSynthesis.cancel();
    lastPosition = seekBar.value; // Store new position
    playButton.click(); // Restart from new position
});
        
// Handle speed change
speedControl.addEventListener("change", () => {
    speechSynthesis.cancel();
    utterance.rate = parseFloat(speedControl.value);
    speechSynthesis.speak(utterance);
});
        let isPaused = false;
let lastPosition = 0; // Store last spoken position

playButton.addEventListener("click", () => {
    if (!speechSynthesis.speaking || isPaused) {
        speechSynthesis.cancel(); // Stop any existing speech

        let startIndex = Math.floor((weatherInfo.length * lastPosition) / 100);
        utterance = new SpeechSynthesisUtterance(weatherInfo.slice(startIndex)); // Restart from last position

        utterance.rate = parseFloat(speedControl.value); // Maintain speed

        // Update seek bar as speech progresses
        utterance.onboundary = (event) => {
            let percent = Math.round((event.charIndex / weatherInfo.length) * 100);
            seekBar.value = percent;
            lastPosition = percent; // Store last position
        };

        speechSynthesis.speak(utterance);
        isPaused = false;
        playButton.textContent = "⏸ Pause";
    } else {
        speechSynthesis.cancel(); // Stop speech completely
        isPaused = true;
        playButton.textContent = "▶ Play";
    }
});
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
                let utterance = new SpeechSynthesisUtterance(newsDetails);
// Create the speech control UI
let speechControls = document.createElement("div");
speechControls.classList.add("speech-controls");

// Seek bar container
let seekContainer = document.createElement("div");
seekContainer.classList.add("seek-container");

let seekBar = document.createElement("input");
seekBar.type = "range";
seekBar.min = "0";
seekBar.max = "100";
seekBar.value = "0";
seekBar.classList.add("seek-bar");

// Speed control dropdown
let speedControl = document.createElement("select");
speedControl.classList.add("speed-control");
["0.5x", "1x", "1.5x", "2x"].forEach(speed => {
    let option = document.createElement("option");
    option.value = parseFloat(speed);
    option.textContent = speed;
    if (speed === "1x") option.selected = true;
    speedControl.appendChild(option);
});

// Play button
let playButton = document.createElement("button");
playButton.classList.add("control-btn");
playButton.innerHTML = "▶ Play";

// Append elements
seekContainer.appendChild(seekBar);
speechControls.appendChild(playButton);
speechControls.appendChild(seekContainer);
speechControls.appendChild(speedControl);
aiChatBox.appendChild(speechControls);
        
        let isPlaying = false;

// Update seek bar in real-time
utterance.onboundary = (event) => {
    let percent = Math.round((event.charIndex / newsDetails.length) * 100);
    seekBar.value = percent;
};
        
seekBar.addEventListener("input", () => {
    speechSynthesis.cancel();
    lastPosition = seekBar.value; // Store new position
    playButton.click(); // Restart from new position
});
        
// Handle speed change
speedControl.addEventListener("change", () => {
    speechSynthesis.cancel();
    utterance.rate = parseFloat(speedControl.value);
    speechSynthesis.speak(utterance);
});
        let isPaused = false;
let lastPosition = 0; // Store last spoken position

playButton.addEventListener("click", () => {
    if (!speechSynthesis.speaking || isPaused) {
        speechSynthesis.cancel(); // Stop any existing speech

        let startIndex = Math.floor((newsDetails.length * lastPosition) / 100);
        utterance = new SpeechSynthesisUtterance(newsDetails.slice(startIndex)); // Restart from last position

        utterance.rate = parseFloat(speedControl.value); // Maintain speed

        // Update seek bar as speech progresses
        utterance.onboundary = (event) => {
            let percent = Math.round((event.charIndex / newsDetails.length) * 100);
            seekBar.value = percent;
            lastPosition = percent; // Store last position
        };

        speechSynthesis.speak(utterance);
        isPaused = false;
        playButton.textContent = "⏸ Pause";
    } else {
        speechSynthesis.cancel(); // Stop speech completely
        isPaused = true;
        playButton.textContent = "▶ Play";
    }
});
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
                let utterance = new SpeechSynthesisUtterance(fullInformation);
// Create the speech control UI
let speechControls = document.createElement("div");
speechControls.classList.add("speech-controls");

// Seek bar container
let seekContainer = document.createElement("div");
seekContainer.classList.add("seek-container");

let seekBar = document.createElement("input");
seekBar.type = "range";
seekBar.min = "0";
seekBar.max = "100";
seekBar.value = "0";
seekBar.classList.add("seek-bar");

// Speed control dropdown
let speedControl = document.createElement("select");
speedControl.classList.add("speed-control");
["0.5x", "1x", "1.5x", "2x"].forEach(speed => {
    let option = document.createElement("option");
    option.value = parseFloat(speed);
    option.textContent = speed;
    if (speed === "1x") option.selected = true;
    speedControl.appendChild(option);
});

// Play button
let playButton = document.createElement("button");
playButton.classList.add("control-btn");
playButton.innerHTML = "▶ Play";

// Append elements
seekContainer.appendChild(seekBar);
speechControls.appendChild(playButton);
speechControls.appendChild(seekContainer);
speechControls.appendChild(speedControl);
aiChatBox.appendChild(speechControls);
        
        let isPlaying = false;

// Update seek bar in real-time
utterance.onboundary = (event) => {
    let percent = Math.round((event.charIndex / fullInformation.length) * 100);
    seekBar.value = percent;
};
        
seekBar.addEventListener("input", () => {
    speechSynthesis.cancel();
    lastPosition = seekBar.value; // Store new position
    playButton.click(); // Restart from new position
});
        
// Handle speed change
speedControl.addEventListener("change", () => {
    speechSynthesis.cancel();
    utterance.rate = parseFloat(speedControl.value);
    speechSynthesis.speak(utterance);
});
        let isPaused = false;
let lastPosition = 0; // Store last spoken position

playButton.addEventListener("click", () => {
    if (!speechSynthesis.speaking || isPaused) {
        speechSynthesis.cancel(); // Stop any existing speech

        let startIndex = Math.floor((fullInformation.length * lastPosition) / 100);
        utterance = new SpeechSynthesisUtterance(fullInformation.slice(startIndex)); // Restart from last position

        utterance.rate = parseFloat(speedControl.value); // Maintain speed

        // Update seek bar as speech progresses
        utterance.onboundary = (event) => {
            let percent = Math.round((event.charIndex / fullInformation.length) * 100);
            seekBar.value = percent;
            lastPosition = percent; // Store last position
        };

        speechSynthesis.speak(utterance);
        isPaused = false;
        playButton.textContent = "⏸ Pause";
    } else {
        speechSynthesis.cancel(); // Stop speech completely
        isPaused = true;
        playButton.textContent = "▶ Play";
    }
});
                
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
    document.body.style="background-color: #B790B5";
    app.innerHTML = `
    <div class="buttons">
        <button onclick="showPage1()">Go to virtual assistant chatbot page</button>
        <button onclick="showPage2()">Go to personal chatbot page</button>
        <button onclick="showLogOutPage()" id="lgt-btn">Logout</button>
    </div>
    <div class="text-to-image-container">
    <h1>'AI' TEXT TO IMAGE GENERATOR</h1>
    <div class="input">
        <label for="">Create an image from Text prompt :
        </label>
    <div class="input-container">
        <input type="text" name="" id="input" placeholder="Enter a Text to Generate The Image">
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-input" id="third-page-mic-icon">
        </div>
        <button id="gbtn">Generate Image <img src="gen.svg" alt=""></button>
    </div>
    <div class="output">
       <div class="gimage"> 
        <img id="gimage" src="" alt="">
        <img  id="svg" src="image.svg" alt="">
        <img id="loading" src="load.webp" alt="">
    </div>
      
        <div class="dbtns">
            <button id="download">Download <img src="down.svg" alt=""></button>
            <button id="reset">Reset <img src="reset.svg" alt=""></button>
        </div>
    </div>
            `;
    initMicForTextToImage();
            initImageGeneration();
        }
function initMicForTextToImage() {
    initMicForField("input", ".mic-input", "Please say the text to generate an AI image.");
}

function initMicForField(fieldId, micClass, promptMessage) {
    const micButton = document.querySelector(micClass);
    const inputField = document.getElementById(fieldId);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice input is not supported on your browser.");
        micButton.style.display = "none"; // Hide mic button if not supported
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {
        micButton.src = "microphone2.svg"; // Change mic icon
        speak(promptMessage, () => {
            recognition.start();
        });
    });

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim();
        inputField.value = transcript;
    };

    recognition.onend = () => {
        micButton.src = "microphone.svg"; // Revert mic icon
    };

    recognition.onerror = (event) => {
        alert(`Error: ${event.error}`);
        micButton.src = "microphone.svg"; // Ensure icon resets on error
    };
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

GenBtn.addEventListener("click", () => {
    generate();
    svg.style.display = "none";
});

inputText.addEventListener( "keydown" , (e) =>{
    if(e.key == "Enter")
    {
     generate();
     svg.style.display="none"
    }
    
 })

function generate() {
    load.style.display = "block";
    query().then((response) => {
        const objectUrl = URL.createObjectURL(response);
        gimage.src = objectUrl;
        load.style.display = "none";

        // Update download button to only download the latest image
        downloadBtn.onclick = () => {
            download(objectUrl);
        };
    });
}
ResetBtn.addEventListener ("click" , () =>{
    inputText.value = ""
	window.location.reload=showPage3();
    
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
  const securityQuestionInput = document.getElementById("security-question")
  const securityAnswerInput = document.getElementById("security-answer")
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

       transcript = transcript
        .replace(/\s*at the rate of\s*/gi, "@")  // Handles "at the rate of"
        .replace(/\s*dot\s*/gi, ".")            // Handles "dot"
        .replace(/\s*underscore\s*/gi, "_")     // Handles "underscore"
        .replace(/\s*dash\s*/gi, "-")           // Handles "dash"

      switch (currentStep) {
          case 0:
              usernameInput.value = transcript;
              speak("Please say your email address.");
              currentStep++;
              break;
          case 1:
              emailInput.value = transcript.replace(/\s+/g, "");// Removes remaining spaces
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
                  confirmPasswordInput.value,
                  securityQuestionInput.value,
                  securityAnswerInput.value
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
    <label for="regisstered-email">Regisstered Email:</label>
    <div class="input-container">
            <input type="email" id="forgot-email" placeholder="Enter your email" required autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
            <img src="microphone.svg" alt="Mic" class="mic-icon mic-forgot-email">
    </div>
    <label for="security-question">Security Question:</label>
     <div class="input-container">
            <input type="text" id="security-question" placeholder="security question" readonly>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-security-question">
        </div>
    <label for="security-answer">Answer:</label>
    <div class="password-field">
    <div class="input-container">
            <input type="password" id="security-answer" placeholder="password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-security-answer">
    </div>
    <button type="button" class="toggle-password" data-target="security-answer">👁️</button>
    </div><br>
            <button type="submit" class="forgot-password-button">Send Reset Code</button><br><br>
    <button type="button" id="voice-input">🎤 Speak</button> <!-- Voice input button -->
            <p id="voice-status">Press the button to start the signup process via voice.</p>
        </form>
    <p>Cancel Forgot Password? <span class="link" onclick="showLoginPage()">Back to previous page</span></p>
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
    initForgotPasswordSpeakButton();
    initForgotPasswordForm(); // Initialize forgot password form logic
    initForgotPasswordMicButtons();
}
function initForgotPasswordSpeakButton() {
    const voiceInputButton = document.getElementById("voice-input");

    voiceInputButton.addEventListener("click", async () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        let user = null;

        // Step 1: Ask for the registered email
        speakText("Please say your registered email.");
        let spokenEmail = await recognizeSpeech();

        if (!spokenEmail) {
            speakText("I didn't hear anything. Try again.");
            return;
        }

        // Process spoken email input
        let processedEmail = processEmailInput(spokenEmail);
        document.getElementById("forgot-email").value = processedEmail; // Display processed email

        // Step 2: Check if email exists
        user = users.find((u) => u.email.toLowerCase() === processedEmail.toLowerCase());

        if (!user) {
            speakText("Email is wrong.");
            return;
        }

        // Step 3: Speak and display security question
        const securityQuestion = user.securityQuestion;
        speakText(`Your security question is: ${securityQuestion}`);
        document.getElementById("security-question").value = securityQuestion; // Display security question

        // Step 4: Ask for the security answer
        speakText("Please say the answer to your security question.");
        
        setTimeout(async () => {  // Ensuring speech synthesis completes before recognition
            let spokenAnswer = await recognizeSpeech();

            if (!spokenAnswer) {
                speakText("I didn't hear your answer. Try again.");
                return;
            }

            document.getElementById("security-answer").value = spokenAnswer; // Display spoken answer

            // Step 5: Check if the spoken answer is correct
            if (user.securityAnswer.toLowerCase() !== spokenAnswer.toLowerCase()) {
                speakText("Answer is wrong.");
                return;
            }

            // Step 6: Generate and display the reset token
            const resetToken = generateResetToken();
            document.getElementById("forgot-password-form").innerHTML += `<p>Your Reset Token: <strong>${resetToken}</strong></p>`;

            // Step 7: Speak the reset token slowly (one letter at a time)
            let slowTokenSpeech = resetToken.split("").join(" "); // Add space between letters
            await speakText(`Your reset token is: ${slowTokenSpeech}`);

            // Store the reset token
            localStorage.setItem("resetToken", resetToken);

            // Step 8: After speaking, go to showResetPasswordPage()
            showResetPasswordPage();

        }, 3000); // Added delay to avoid speech synthesis interfering with speech recognition
    });
}

// Function to process spoken email input (handling special characters)
function processEmailInput(spokenText) {
    return spokenText
        .toLowerCase()
        .replace(/\bat the rate of\b/g, "@")
        .replace(/\bdot\b/g, ".")
        .replace(/\bdash\b/g, "-")
        .replace(/\s+/g, ""); // Remove spaces
}

// Function to generate a random reset token
function generateResetToken() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Function to convert text to speech
function speakText(text) {
    return new Promise((resolve) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 0.7; // Slower speech rate for better clarity
        speech.onend = resolve;
        window.speechSynthesis.speak(speech);
    });
}

// Function to recognize speech input
function recognizeSpeech() {
    return new Promise((resolve) => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = () => {
            resolve("");
        };

        recognition.onend = () => {
            recognition.stop();
        };
    });
}
function initMicForForgotPasswordField(fieldId, micClass, promptMessage, isEmail = false) {
    const micButton = document.querySelector(micClass);
    const inputField = document.getElementById(fieldId);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice input is not supported on your browser.");
        micButton.style.display = "none"; // Hide mic button if not supported
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {
        micButton.src = "microphone2.svg"; // Change mic image to active state
        speak(promptMessage, () => {
            recognition.start();
        });
    });

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim();

        // Special formatting for email input
        if (fieldId === "forgot-email") {
            transcript = transcript
                .replace(/at the rate of/g, "@")
                .replace(/dot/g, ".")
                .replace(/underscore/g, "_")
                .replace(/dash/g, "-")
                .replace(/\s+/g, "");
        }

        inputField.value = transcript.toLowerCase();
    };

    recognition.onend = () => {
        micButton.src = "microphone.svg"; // Revert mic image after speech ends
    };

    recognition.onerror = (event) => {
        alert(`Error: ${event.error}`);
        micButton.src = "microphone.svg"; // Ensure image resets on error
    };
}
// Special function for security question (reads the displayed question)
function initMicForSecurityQuestion() {
    const micButton = document.querySelector(".mic-security-question");
    const questionInput = document.getElementById("security-question");

    if (!micButton || !questionInput) return;

    micButton.addEventListener("click", () => {
        const questionText = questionInput.value.trim();
        if (questionText) {
            speak(questionText); // Speak the security question
        } else {
            speak("No security question found.");
        }
    });
}

// Function to speak a message
function speak(message, callback) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.onend = () => {
        if (callback) callback(); // Start recognition after speech ends
    };

    synth.speak(utterance);
}

// Initialize mic buttons for forgot password fields
function initForgotPasswordMicButtons() {
    initMicForForgotPasswordField("forgot-email", ".mic-forgot-email", "Please say your registered email.");
    initMicForForgotPasswordField("security-answer", ".mic-security-answer", "Please say the answer to your security question.");
    initMicForSecurityQuestion(); // Security question should be spoken, not dictated
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
localStorage.setItem("resetToken", resetToken);  

// Show reset token in a prompt (copyable on mobile)
prompt("Here is your reset token. Copy it:", resetToken);

showResetPasswordPage();
            
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
    <label for="reset-token">Reset Token:</label>
            <input type="text" id="reset-token" placeholder="Enter your reset token" required><br>
    <label for="new-password">New Password:</label>
            <div class="password-field">
    <div class="input-container">
            <input type="password" id="new-password" placeholder="New Password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-new-password">
        </div>
            <button type="button" class="toggle-password" data-target="new-password">👁️</button>
           </div>
    <label for="confirm-new-password">Confirm New Password:</label>
            <div class="password-field">
    <div class="input-container">
            <input type="password" id="confirm-new-password" placeholder="Confirm New Password" required>
    <img src="microphone.svg" alt="Mic" class="mic-icon mic-confirm-new-password">
        </div>
            <button type="button" class="toggle-password" data-target="confirm-new-password">👁️</button>
        </div>
    <button type="submit" class="reset-password-button">Reset Password</button><br><br>
    <button type="button" id="voice-input">🎤 Speak</button> <!-- Voice input button -->
            <p id="voice-status">Press the button to start the signup process via voice.</p>
      
        </form>
    <p>Cancel Reset Password? <span class="link" onclick="showForgotPasswordPage()">Back to previous page</span></p>
    </div>
    `;
    initSpeakForResetPassword();
    initMicForResetPassword();
    initResetPasswordForm();  // Initialize reset password form logic
    initPasswordToggle();
}
function initSpeakForResetPassword() {
    const voiceInputButton = document.getElementById("voice-input");

    voiceInputButton.addEventListener("click", async () => {
        const storedToken = localStorage.getItem("resetToken"); // Get stored reset token

        // Step 1: Speak and take reset token input
        speakText("Please say your reset token.");
        let spokenToken = await recognizeSpeech();
        spokenToken = spokenToken.toLowerCase().trim().replace(/\s/g, "");// Convert to lowercase and remove spaces

        document.getElementById("reset-token").value = spokenToken; // Display spoken token

        // Step 2: Verify the reset token
        if (spokenToken !== storedToken.toLowerCase().trim()) {
            speakText("Reset token is incorrect.");
            return;
        }

        // Step 3: Speak and take new password input
        speakText("Please say your new password.");
        let spokenNewPassword = await recognizeSpeech();
        spokenNewPassword = spokenNewPassword.toLowerCase().trim().replace(/\s/g, "");;

        document.getElementById("new-password").value = spokenNewPassword;

        // Step 4: Speak and take confirm password input
        speakText("Please say confirm password.");
        let spokenConfirmPassword = await recognizeSpeech();
        spokenConfirmPassword = spokenConfirmPassword.toLowerCase().trim().replace(/\s/g, "");;

        document.getElementById("confirm-new-password").value = spokenConfirmPassword;

        // Step 5: Verify if passwords match
        if (spokenNewPassword !== spokenConfirmPassword) {
            speakText("Passwords do not match.");
            return;
        }

        // Step 6: Password successfully set
        speakText("Password set successfully.");
        
        // Redirect to login page
        setTimeout(() => {
            showLoginPage();
        }, 2000);
    });
}

// Function to convert text to speech
function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

// Function to recognize speech input
function recognizeSpeech() {
    return new Promise((resolve) => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = () => {
            resolve("");
        };

        recognition.onend = () => {
            recognition.stop();
        };
    });
}
function initMicForResetPassword() {
    initMicForField("new-password", ".mic-new-password", "Please say your new password.");
    initMicForField("confirm-new-password", ".mic-confirm-new-password", "Please say your new password again to confirm.");
}

function initMicForField(fieldId, micClass, promptMessage) {
    const micButton = document.querySelector(micClass);
    const inputField = document.getElementById(fieldId);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice input is not supported on your browser.");
        micButton.style.display = "none"; // Hide mic button if not supported
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {
        micButton.src = "microphone2.svg"; // Change mic icon
        speak(promptMessage, () => {
            recognition.start();
        });
    });

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim();
        inputField.value = transcript;
    };

    recognition.onend = () => {
        micButton.src = "microphone.svg"; // Revert mic icon
    };

    recognition.onerror = (event) => {
        alert(`Error: ${event.error}`);
        micButton.src = "microphone.svg"; // Ensure icon resets on error
    };
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

// Initial page load
showLoginPage();
