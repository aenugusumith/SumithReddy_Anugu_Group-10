import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";
import "./bookstore.js";

firebase.initializeApp({
    apiKey: "AIzaSyD2Kdg8PxYWyxu9-F8FbSreAmUNM7nnlUk",
    authDomain: "book-8b9e1.firebaseapp.com",
    databaseURL: "https://book-8b9e1-default-rtdb.firebaseio.com",
    projectId: "book-8b9e1",
    storageBucket: "book-8b9e1.appspot.com",
    messagingSenderId: "665817489673",
    appId: "1:665817489673:web:d72e2ce42f211b146d33d8"
  }
);
const $$ = Dom7;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        app.tab.show("#tab2", true);
        console.log(user);
    } else {
        app.tab.show("#tab1", true);
        console.log("logged out");
    }
});

$$("#loginForm").on("submit", (evt) => {
    evt.preventDefault();
    var formData = app.form.convertToData('#loginForm');
    firebase.auth().signInWithEmailAndPassword(formData.username, formData.password).then(
        () => {
            // could save extra info in a profile here I think.
            app.loginScreen.close(".loginYes", true);
        }
    ).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $$("#signInError").html(errorCode + " error " + errorMessage)
        console.log(errorCode + " error " + errorMessage);
        // ...
    });

});

$$("#signUpForm").on("submit", (evt) => {
    evt.preventDefault();
    var formData = app.form.convertToData('#signUpForm');
    //alert("clicked Sign Up: " + JSON.stringify(formData));
    firebase.auth().createUserWithEmailAndPassword(formData.username, formData.password).then(
        () => {
            // could save extra info in a profile here I think.
            app.loginScreen.close(".signupYes", true);
        }
    ).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $$("#signUpError").html(errorCode + " error " + errorMessage)
        console.log(errorCode + " error " + errorMessage);
        // ...
    });

});

$$("#logout").on("click", () => {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch(() => {
        // An error happened.
    });
});

$$("#googleSignupButton").on("click", () => {
    signInWithGoogle();
});

$$("#googleLoginButton").on("click", () => {
    signInWithGoogle();
});

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        
        // get the result when logged in
        const user = result.user;
        app.loginScreen.close(".loginYes", true);
        app.loginScreen.close(".signupYes", true);
        console.log("google signin successful:", user);
    }).catch((error) => {
        
        const errorMessage = error.message;
        console.error("google signin error:",errorMessage);
    });
}