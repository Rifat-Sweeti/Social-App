import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-uVSquBfu15sgRBg3MNUOTW6xOD9Pk6o",
    authDomain: "social-app-dcab9.firebaseapp.com",
    projectId: "social-app-dcab9",
    storageBucket: "social-app-dcab9.firebasestorage.app",
    messagingSenderId: "1050289692340",
    appId: "1:1050289692340:web:5269279a96ba1ff17e41e1",
    measurementId: "G-VEZHK9QP69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const postForm = document.getElementById("postForm");
const postsGrid = document.getElementById("postsGrid");
const logoutButton = document.getElementById("logoutButton");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const googleLoginButton = document.getElementById("googleLoginButton");

// Toggle Login and Register Forms
document.getElementById("showRegister").addEventListener("click", () => {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
});

// Login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            Swal.fire("Success", "Logged in successfully!", "success");
        })
        .catch((err) => Swal.fire("Error", err.message, "error"));
});

// Google Sign-In
googleLoginButton.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then(() => Swal.fire("Success", "Logged in with Google!", "success"))
        .catch((err) => Swal.fire("Error", err.message, "error"));
});

// Forgot Password
forgotPasswordLink.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    if (!email) {
        Swal.fire("Warning", "Please enter your email to reset your password!", "warning");
        return;
    }
    sendPasswordResetEmail(auth, email)
        .then(() => Swal.fire("Success", "Password reset email sent!", "success"))
        .catch((err) => Swal.fire("Error", err.message, "error"));
});

// Registration
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => Swal.fire("Success", "Account created successfully!", "success"))
        .catch((err) => Swal.fire("Error", err.message, "error"));
});

// Add Post
postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const caption = document.getElementById("caption").value.trim();
    const pictureURL = document.getElementById("pictureURL").value.trim();
    const fileInput = document.getElementById("fileInput").files[0]; // Get the selected file

    let imageURL = pictureURL; // Default to the URL provided

    // If a file is selected, upload it and display the preview
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageURL = event.target.result; // Set imageURL to the file data
            createPost(caption, imageURL); // Create post after the file is loaded
        };
        reader.readAsDataURL(fileInput); // Read the file
    } else if (pictureURL) {
        createPost(caption, imageURL); // Create post directly if URL is provided
    } else {
        Swal.fire("Warning", "Please fill out all fields!", "warning");
    }
});

// Function to create a post (called from above)
function createPost(caption, imageURL) {
    const postHTML = `
        <div class="post">
            <p>${caption}</p>
            <img src="${imageURL}" alt="${caption}" />
        </div>
    `;
    postsGrid.innerHTML += postHTML;
    document.getElementById("noPostsMessage").style.display = "none";
    postForm.reset();
}


// Logout
logoutButton.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            Swal.fire("Success", "Logged out successfully!", "success");
        })
        .catch((err) => Swal.fire("Error", err.message, "error"));
});

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("authSection").style.display = "none";
        document.getElementById("homeSection").style.display = "block";
    } else {
        document.getElementById("authSection").style.display = "block";
        document.getElementById("homeSection").style.display = "none";
        postsGrid.innerHTML = '<p id="noPostsMessage" style="text-align: center;">No posts yet.</p>';
    }
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is logged in, show posts
        displayPosts();
    } else {
        // User is logged out, hide posts
        document.getElementById("postsContainer").innerHTML = "Please log in to see posts.";
    }
});