'use strict';

function card(value, name, suit) {
  this.value = value;
  this.name = name;
  this.suit = suit;
}

function deck() {
  this.name = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  this.suit = ['hearts', 'diamonds', 'spades', 'clubs'];
  const cards = [];

  for (let i = 0; i < this.suit.length; i++) {
    for (let j = 0; j < this.name.length; j++) {
      cards.push(new card(j + 1, this.name[j], this.suit[i]));
    }
  }
  return cards;
}

const myDeck = new deck();
console.log(myDeck);

function createCard(card) {
  let color = 'red';
  if (card.suit === 'spades' || card.suit === 'clubs') color = 'black';

  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML += `<h3 class="heading-3 card__num ${color}">${card.name}</h3>
  <img class="card__icon" src="images/icon-${card.suit}.svg" alt="${card.suit}" />
  <img class="card__suit" src="images/icon-${card.suit}.svg" alt="${card.suit}" />`;
  return div;
}

function displayDeck(deck) {
  const playField = document.getElementById('playfield');
  deck.forEach(card => {
    playField.appendChild(createCard(card));
  });
}

function shuffelDeck(deck) {
  const deckCopy = deck;
  let shuffledDeck = [];
  const loopNum = deck.length;
  for (let i = 0; i < loopNum; i++) {
    const randomCard = Math.floor(Math.random() * deckCopy.length);
    console.log(`Card num: ${i}`, randomCard);
    shuffledDeck.push(deckCopy[randomCard]);
    deckCopy.splice(randomCard, 1);
    console.log(`Shuffled deck: `, shuffledDeck);
    console.log(`Deck copy: `, deckCopy);
  }
  return shuffledDeck;
}

displayDeck(shuffelDeck(myDeck));

// const playField = document.getElementById('playfield');
// playField.appendChild(displayCard(myDeck[0]));
// playField.appendChild(displayCard(myDeck[1]));
// playField.appendChild(displayCard(myDeck[47]));

// window.onload = function () {
//   let div = document.createElement('div');
//   div.className = 'card';
// };
// const displayDeck = function (myDeck) {
//   myDeck.forEach(function (card, i) {

//   });
// };
