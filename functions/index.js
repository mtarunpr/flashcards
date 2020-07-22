const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getHomepage = functions.https.onCall(async (data, context) => {
  const homepageSnapshot = await admin
    .database()
    .ref('/homepage')
    .once('value');
  const homepage = homepageSnapshot.val();
  const uid = context.auth && context.auth.uid;
  const sanitized = {};
  Object.keys(homepage).forEach(deckId => {
    const deck = homepage[deckId];
    if (!deck.public && deck.owner !== uid) {
      return;
    }
    sanitized[deckId] = deck;
  });
  return sanitized;
});

exports.createDeck = functions.https.onCall(async (deck, context) => {
  if (!Array.isArray(deck.cards)) {
    return null;
  }

  const newDeckRef = admin.database().ref('/flashcards').push();
  const deckId = newDeckRef.key;

  const updates = {};
  updates[`/flashcards/${deckId}`] = deck;
  updates[`/homepage/${deckId}/name`] = deck.name;
  updates[`/homepage/${deckId}/description`] = deck.description;
  updates[`/homepage/${deckId}/public`] = deck.public;
  updates[`/homepage/${deckId}/owner`] = context.auth.uid;

  await admin.database().ref('/').update(updates);

  return deckId;
});
