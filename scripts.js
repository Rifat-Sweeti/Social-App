import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-uVSquBfu15sgRBg3MNUOTW6xOD9Pk6o",
    authDomain: "social-app-dcab9.firebaseapp.com",
    projectId: "social-app-dcab9",
    storageBucket: "social-app-dcab9.firebasestorage.app",
    messagingSenderId: "1050289692340",
    appId: "1:1050289692340:web:5269279a96ba1ff17e41e1",
    measurementId: "G-VEZHK9QP69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submitButton');
const toggleFormText = document.getElementById('toggleFormText');
const toggleFormLink = document.getElementById('toggleForm');
const forgotPasswordLink = document.getElementById('forgotPassword');
const logoutButton = document.getElementById('logoutButton');
const googleSignInButton = document.getElementById('googleSignIn'); // Google Sign-In button

// State
let isLogin = true;

// Toggle form between login and register
toggleFormLink.addEventListener('click', () => {
    isLogin = !isLogin;
    updateForm();
});

// Update the form based on whether it's login or register
function updateForm() {
    if (isLogin) {
        formTitle.innerText = "Login";
        submitButton.innerText = "Login";
        toggleFormText.innerHTML = "Don't have an account? <a id='toggleForm'>Register</a>";
    } else {
        formTitle.innerText = "Register";
        submitButton.innerText = "Register";
        toggleFormText.innerHTML = "Already have an account? <a id='toggleForm'>Login</a>";
    }

    // Reattach event listener for the new toggle link after update
    document.getElementById('toggleForm').addEventListener('click', () => {
        isLogin = !isLogin;
        updateForm();
    });
}

// Submit form
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        if (isLogin) {
            // Login user
            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire("Success", "Logged in successfully!", "success");
            showHomePage();
        } else {
            // Register user
            await createUserWithEmailAndPassword(auth, email, password);
            Swal.fire("Success", "Registered successfully! Please log in.", "success");
            updateForm(); // Switch to login form after successful registration
        }
    } catch (error) {
        Swal.fire("Error", error.message, "error");
    }
});

// Forgot password
forgotPasswordLink.addEventListener('click', async () => {
    const email = await Swal.fire({
        title: 'Enter your email for password reset',
        input: 'email',
        inputPlaceholder: 'Enter your email',
        showCancelButton: true
    });

    if (email.isConfirmed && email.value) {
        try {
            await sendPasswordResetEmail(auth, email.value);
            Swal.fire("Success", "Password reset email sent!", "success");
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    }
});

// Google Sign-In
googleSignInButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        Swal.fire("Success", `Logged in with Google: ${user.displayName}`, "success");
        showHomePage();
    } catch (error) {
        Swal.fire("Error", error.message, "error");
    }
});

// Logout
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        Swal.fire("Success", "Logged out successfully!", "success");
        showLoginForm();
    } catch (error) {
        Swal.fire("Error", error.message, "error");
    }
});

// Show home page
function showHomePage() {
    formTitle.innerText = "Home Page";
    authForm.style.display = "none";
    toggleFormText.style.display = "none";
    forgotPasswordLink.style.display = "none";
    logoutButton.style.display = "block";
    googleSignInButton.style.display = "none";
}

// Show login form
function showLoginForm() {
    formTitle.innerText = "Login";
    submitButton.innerText = "Login";
    isLogin = true;
    authForm.style.display = "block";
    toggleFormText.style.display = "block";
    forgotPasswordLink.style.display = "block";
    logoutButton.style.display = "none";
    googleSignInButton.style.display = "block";
    emailInput.value = '';
    passwordInput.value = '';
}

// Initial check for auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        showHomePage();
    } else {
        showLoginForm();
    }
});
