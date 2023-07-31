function toggleView(view) {
    const timerDiv = document.querySelector('.timer');
    const stopwatchDiv = document.querySelector('.stopwatch');
    const timerBtn = document.getElementById('timer');
    const stopwatchBtn = document.getElementById('switch');

    if (view === 'timer') {
      timerDiv.style.marginLeft = '0';
      stopwatchDiv.style.marginLeft = '-100%';
      timerBtn.classList.add('active');
      stopwatchBtn.classList.remove('active');
    } else if (view === 'stopwatch') {
      timerDiv.style.marginLeft = '100%';
      stopwatchDiv.style.marginLeft = '0';
      timerBtn.classList.remove('active');
      stopwatchBtn.classList.add('active');
    }
  }

const stopwatchDisplay = document.getElementById("stp");
const startButton = document.getElementById("ctrl");
const resetButton = document.getElementById("reset-stp");

let intervalId;
let startTime = 0;
let isRunning = false;

function formatTime(ms) {
    const date = new Date(ms);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function startStopwatch() {
    if (!isRunning) {
        startTime = localStorage.getItem("startTime") ?
            parseInt(localStorage.getItem("startTime")) : Date.now();
        intervalId = setInterval(updateStopwatch, 1000);
        isRunning = true;
        startButton.textContent = "Pause";
    } else {
        clearInterval(intervalId);
        isRunning = false;
        startButton.textContent = "Start";
        localStorage.setItem("startTime", startTime);
    }
}

function updateStopwatch() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    stopwatchDisplay.textContent = formatTime(elapsedTime);
    localStorage.setItem("startTime", startTime);
}

function resetStopwatch() {
    clearInterval(intervalId);
    startTime = 0;
    isRunning = false;
    stopwatchDisplay.textContent = "00:00:00";
    startButton.textContent = "Start";
    localStorage.removeItem("startTime");
}

startButton.addEventListener("click", startStopwatch);
resetButton.addEventListener("click", resetStopwatch);

const timerDisplay = document.getElementById("tim");
const playButton = document.getElementById("play-tim");
const resetButtonTim = document.getElementById("reset-tim");
const settingsButton = document.getElementById("settings-tim");
const alarmAudio = document.getElementById("alarmAudio");

let intervalIdTim;
let countdownValue = 0;
let startTimeTim = 0;
let endTime = 0;
let isCountdownActive = false;
let isPlayButtonActive = false;


function formatTimeTim(seconds) {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const secs = date.getUTCSeconds();
    if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else if (minutes > 0) {
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
        return `${secs.toString().padStart(2, "0")}`;
    }
}


function setCountdown(value) {
    clearInterval(intervalIdTim);
    countdownValue = value;
    if (isCountdownActive) {
        startTimeTim = Date.now();
        endTime = startTimeTim + countdownValue * 1000;
    }
    timerDisplay.textContent = formatTimeTim(countdownValue);
    localStorage.setItem("countdownValue", countdownValue);
    if (countdownValue > 0) {
        playButton.classList.remove("disabled");
    } else {
        playButton.classList.add("disabled");
    }
}

function startCountdown() {
    if (!isCountdownActive && countdownValue > 0) {
        // If countdown is not active and there is time remaining
        startTimeTim = Date.now(); // Set the start time to the current time
        endTime = startTimeTim + countdownValue * 1000; // Calculate the new end time
        intervalIdTim = setInterval(updateCountdown, 1000);
        isCountdownActive = true;
        isPlayButtonActive = true; // Update the play/pause button status to true (playing)
        playButton.children[0].src = "img/pause.png";
        // Save the updated countdownValue, endTime, and play/pause button status to local storage
        localStorage.setItem("countdownValue", countdownValue);
        localStorage.setItem("endTime", endTime);
        localStorage.setItem("isPlayButtonActive", isPlayButtonActive);
    } else {
        // If countdown is active, pause it
        clearInterval(intervalIdTim);
        isCountdownActive = false;
        isPlayButtonActive = false; // Update the play/pause button status to false (paused)
        playButton.children[0].src = "img/play.png";
        // Calculate the remaining time and update the countdownValue
        countdownValue = Math.ceil((endTime - Date.now()) / 1000);
        // Save the updated countdownValue, endTime, and play/pause button status to local storage
        localStorage.setItem("countdownValue", countdownValue);
        localStorage.setItem("endTime", endTime);
        localStorage.setItem("isPlayButtonActive", isPlayButtonActive);
    }
}

function updateCountdown() {
    const currentTime = Date.now();
    if (currentTime >= endTime) {
        clearInterval(intervalIdTim);
        isCountdownActive = false;
        playButton.children[0].src = "img/play.png";
        localStorage.removeItem("countdownValue");
        localStorage.removeItem("startTimeTim");
        localStorage.removeItem("endTime");
        alarmAudio.play(); // Play the audio when the countdown ends
        swal({
            title: "Time's Up!",
            text: "Your timer has ended",
            icon: "success",
        });
        timerDisplay.textContent = formatTimeTim(0);
        return;
    }
    const remainingTime = Math.ceil((endTime - currentTime) / 1000);
    countdownValue = remainingTime;
    timerDisplay.textContent = formatTimeTim(countdownValue);
    localStorage.setItem("countdownValue", countdownValue);
}

function resetCountdown() {
    clearInterval(intervalIdTim);
    countdownValue = 0;
    startTimeTim = 0;
    endTime = 0;
    timerDisplay.textContent = "00:00:00";
    isCountdownActive = false;
    playButton.children[0].src = "img/play.png";
    localStorage.removeItem("countdownValue");
    playButton.classList.add("disabled");
}

function handleSettings() {
    swal({
        text: "Enter countdown time (hh:mm:ss, mm:ss, or ss):",
        content: "input",
    }).then((value) => {
        const trimmedValue = value.trim();
        if (trimmedValue !== "") {
            const timeArray = trimmedValue.split(":").map(Number);
            if (timeArray.length === 3 && timeArray.every((num) => !isNaN(num))) {
                const timeInSeconds = timeArray[0] * 3600 + timeArray[1] * 60 + timeArray[2];
                setCountdown(timeInSeconds);
            } else if (timeArray.length === 2 && timeArray.every((num) => !isNaN(num))) {
                const timeInSeconds = timeArray[0] * 60 + timeArray[1];
                setCountdown(timeInSeconds);
            } else if (timeArray.length === 1 && !isNaN(timeArray[0])) {
                const timeInSeconds = timeArray[0];
                setCountdown(timeInSeconds);
            } else {
                swal({
                    title: "Error!",
                    text: "Invalid input, enter according to the format",
                    icon: "error",
                });
            }
        } else {
            swal({
                title: "Error!",
                text: "Please enter a valid time value",
                icon: "error",
            });
        }
    });
}

function discardCountdownData() {
    clearInterval(intervalIdTim);
    countdownValue = 0;
    startTimeTim = 0;
    endTime = 0;
    timerDisplay.textContent = "00:00:00";
    isCountdownActive = false;
    isPlayButtonActive = false;
    playButton.children[0].src = "img/play.png";
    localStorage.removeItem("countdownValue");
    localStorage.removeItem("endTime");
    localStorage.removeItem("isPlayButtonActive");
    swal({
        title: "Countdown Finished!",
        text: "The timer has reached its end",
        icon: "info",
    });
}

playButton.addEventListener("click", () => {
    if (isCountdownActive) {
        startCountdown(); // If countdown is active, pause it
    } else {
        startCountdown(); // If countdown is not active, start it
    }
});
resetButtonTim.addEventListener("click", resetCountdown);
settingsButton.addEventListener("click", handleSettings);

// On page load, check if there was a countdown in progress and continue it if needed
window.addEventListener("load", () => {
    const storedCountdownValue = localStorage.getItem("countdownValue");
    const storedEndTime = localStorage.getItem("endTime");
    const storedIsPlayButtonActive = localStorage.getItem("isPlayButtonActive");

    if (localStorage.getItem("startTime") && !isRunning) {
        startTime = parseInt(localStorage.getItem("startTime"));
        intervalId = setInterval(updateStopwatch, 1000);
        isRunning = true;
        startButton.textContent = "Pause";
    }

    if (storedCountdownValue && storedEndTime && storedIsPlayButtonActive) {
        setCountdown(Number(storedCountdownValue));
        endTime = Number(storedEndTime);
        isPlayButtonActive = JSON.parse(storedIsPlayButtonActive);

        if (Number(storedCountdownValue) > 0) {
            // If there is time remaining
            if (isPlayButtonActive) {
                // If the play button was active, start the countdown
                startCountdown();
            } else {
                // If the play button was paused, update the button image to 'play.png'
                playButton.children[0].src = "img/play.png";
            }
        }
    }
});

// When the countdown finishes, discard locally stored data and reset the timer

alarmAudio.addEventListener("ended", () => {
    discardCountdownData();
});
