// // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// Firebase Config (Replace with your own)
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
    apiKey: "AIzaSyDSVREgQHxIgH1PztX8XppQDHFAi8gigBE",
    authDomain: "pro-to-pro-ef4a6.firebaseapp.com",
    projectId: "pro-to-pro-ef4a6",
    storageBucket: "pro-to-pro-ef4a6.firebasestorage.app",
    messagingSenderId: "637511125153",
    appId: "1:637511125153:web:838f564454ec24a4ba88e0",
    measurementId: "G-FRFJ25TBGM"
  };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = firebase.firestore();


// Task Management
function addTask() {
    const task = document.getElementById("taskInput").value;
    const time = document.getElementById("timeInput").value;
    if (task && time) {
        db.collection("tasks").add({
            task: task,
            time: parseInt(time),
            completed: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById("taskInput").value = "";
        document.getElementById("timeInput").value = "";
    }
}

db.collection("tasks").onSnapshot(snapshot => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${data.task} (${data.time} min)`;
        if (data.completed) li.style.textDecoration = "line-through";
        taskList.appendChild(li);
    });
    checkBadges(snapshot.size); // Check for badges
});

// Pomodoro Timer
let timeLeft = 25 * 60;
let timerId = null;

function startPomodoro() {
    if (!timerId) {
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                alert("Pomodoro complete!");
            }
        }, 1000);
    }
}

function resetPomodoro() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    updateTimer();
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Gamification (Badges)
function checkBadges(taskCount) {
    const badgeList = document.getElementById("badgeList");
    badgeList.innerHTML = "";
    if (taskCount >= 5) badgeList.innerHTML += "<p>🏆 5 Tasks Badge</p>";
    if (taskCount >= 10) badgeList.innerHTML += "<p>🏆 10 Tasks Badge</p>";
}

// Diary
function saveDiary() {
    const entry = document.getElementById("diaryEntry").value;
    if (entry) {
        db.collection("diary").add({
            entry: entry,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById("diaryEntry").value = "";
    }
}

db.collection("diary").onSnapshot(snapshot => {
    const diaryList = document.getElementById("diaryList");
    diaryList.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const p = document.createElement("p");
        p.textContent = `${new Date(data.timestamp.toDate()).toLocaleString()}: ${data.entry}`;
        diaryList.appendChild(p);
    });
});