// Importing necessary libraries
import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";

// Framework7 shorthand
const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    // Put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    const booksRef = firebase.database().ref("books/" + sUser);

    booksRef.on("value", (snapshot) => {
        const oItems = snapshot.val();

        if (oItems) {
            const aKeys = Object.keys(oItems);
            $$("#bookList").html("");

            for (let n = 0; n < aKeys.length; n++) {
                let sCard = `
                <div class="card">
                <div class="data">
                <div class="card-content card-content-padding">Name of the Book: ${oItems[aKeys[n]].item}</div>
                <div class="card-content card-content-padding">Price: $ ${oItems[aKeys[n]].price}</div>
                <div class="card-content card-content-padding">Available Quantity: ${oItems[aKeys[n]].availableQuantity}</div>
                </div>
                <div class="button-group">
                    <button class="btn btn-success btn-sm bought-btn" data-id="${aKeys[n]}">I bought this</button>
                    <button class="btn btn-danger btn-sm dont-need-btn" data-id="${aKeys[n]}">I don't need this</button>
                </div>
                </div>
                `;
                $$("#bookList").append(sCard);
            }
        } else {
            // Handle the case where oItems is undefined or null
            $$("#bookList").html("<p>No books available.</p>");
        }
    });
});

$$(".my-sheet").on("submit", e => {
    // Submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("books/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});

// Handling the "I bought this" and "I don't need this" buttons
$$("#bookList").on("click", ".bought-btn", function () {
    const bookId = $$(this).data("id");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    const oData = { datePurchased: sId };

    firebase.database().ref("books/" + sUser + "/" + bookId).update(oData);
});

$$("#bookList").on("click", ".dont-need-btn", function () {
    const bookId = $$(this).data("id");
    const sUser = firebase.auth().currentUser.uid;

    firebase.database().ref("books/" + sUser + "/" + bookId).remove();
});
