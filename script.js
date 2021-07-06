'use strict';

function card(value, name, suit) {
  this.value = value;
  this.name = name;
  this.suit = suit;
  this.startingPosition = 'hand';
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

function shuffelDeck(deck) {
  const deckCopy = deck;
  let shuffledDeck = [];
  const loopNum = deck.length;
  for (let i = 0; i < loopNum; i++) {
    const randomCard = Math.floor(Math.random() * deckCopy.length);
    // console.log(`Card num: ${i}`, randomCard);
    shuffledDeck.push(deckCopy[randomCard]);
    deckCopy.splice(randomCard, 1);
    // console.log(`Shuffled deck: `, shuffledDeck);
    // console.log(`Deck copy: `, deckCopy);
  }
  return shuffledDeck;
}

// displayDeck(shuffelDeck(myDeck));

///////////////////////////////////////////////////////////////
// Game function

let hand = [];
let waste = [];
let foundation1 = [];
let foundation2 = [];
let foundation3 = [];
let foundation4 = [];
let table1 = [];
let table2 = [];
let table3 = [];
let table4 = [];
let table5 = [];
let table6 = [];
let table7 = [];
const table = [table1, table2, table3, table4, table5, table6, table7];

function dealCards(myshuffledDeck) {
  for (let i = 0; i < table.length; i++) {
    for (let j = i; j < table.length; j++) {
      table[j].push(myshuffledDeck.pop());
      table[j][table[j].length - 1].startingPosition = `table-${j + 1}`;
    }
  }
  hand = myshuffledDeck;
}

function assignStartingPositions(cards) {
  cards.forEach((card, i) => {});
}

function createHTMLCard(card, i) {
  let color = 'red';
  if (card.suit === 'spades' || card.suit === 'clubs') color = 'black';

  const div = document.createElement('div');
  div.className = `card`;
  div.draggable = 'true';
  div.id = `card${i}`;
  div.style.zIndex = `${i + 100}`;
  div.innerHTML += `<div class="card__side card__side--front">
  <h3 class="heading-3 card__side--front-num ${color}" draggable="false">${card.name}</h3>
  <img
    class="card__side--front-icon"
    draggable="false"
    src="images/icon-${card.suit}.svg"
    alt="${card.suit}"
  />
  <img
    class="card__side--front-suit"
    draggable="false"
    src="images/icon-${card.suit}.svg"
    alt="${card.suit}"
  />
</div>
`;
  return div;
}

function displayCards(cards) {
  const playField = document.getElementById('playfield');
  cards.forEach((card, i) => {
    playField.appendChild(createHTMLCard(card, i));
  });
}

// MAIN PROGRAM

const myDeck = new deck();
console.log('New deck: ', myDeck);

const myshuffledDeck = shuffelDeck(myDeck);
console.log('shuffled Deck: ', myshuffledDeck);

dealCards(myshuffledDeck);
// // console.log('Hand: ', hand);
// // console.log('Table: ', table);
displayCards(hand);

let grabbed = null;
const cards = document.querySelectorAll('.card');
const empties = document.querySelectorAll('.empty');

cards.forEach(card => {
  card.addEventListener('dragstart', dragStart);
  card.addEventListener('dragend', dragEnd);
});

empties.forEach(empty => {
  empty.addEventListener('dragover', dragOver);
  empty.addEventListener('dragenter', dragEnter);
  empty.addEventListener('dragleave', dragLeave);
  empty.addEventListener('drop', dragDrop);
});

function dragStart() {
  this.className += ' grabbed';
  grabbed = document.querySelector('.grabbed');
  setTimeout(() => (this.className = ' invisible'), 0);
}

function dragEnd() {
  this.className = 'card';
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.className += ' hover';
}

function dragLeave() {
  this.classList.remove('hover');
}

function dragDrop() {
  this.classList.remove('hover');
  this.append(grabbed);
}

// for (let i = 0; i < table.length; i++) {
//   displayCards(table[i]);
// }

// const cardToMove = document.getElementById('card51');

// cardToMove.onmousedown = function (event) {
//   cardToMove.style.position = 'absolute';
//   cardToMove.style.zIndex = 1000;

//   function moveAt(pageX, pageY) {
//     cardToMove.style.left = pageX - cardToMove.offsetWidth / 2 + 'px';
//     cardToMove.style.top = pageY - cardToMove.offsetHeight / 2 + 'px';
//   }
//   moveAt(event.pageX, event.pageY);

//   function onMouseMove(event) {
//     moveAt(event.pageX, event.pageY);
//   }

//   document.addEventListener('mousemove', onMouseMove);

//   cardToMove.onmouseup = function () {
//     document.removeEventListener('mousemove', this.onMouseMove);
//     cardToMove.onmouseup = null;
//   };
// };

// cardToMove.ondragstart = function () {
//   return false;
// };
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
