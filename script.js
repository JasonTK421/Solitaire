'use strict';

function card(value, name, suit) {
  this.value = value;
  this.name = name;
  this.suit = suit;
  this.location = 'hand';
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

function playFieldLocation(name, element, cards) {
  this.name = name;
  this.element = element;
  this.cards = cards;
}

function buildPlayFieldLocations() {
  this.name = [
    'hand',
    'waste',
    'foundation1',
    'foundation2',
    'foundation3',
    'foundation4',
    'table1',
    'table2',
    'table3',
    'table4',
    'table5',
    'table6',
    'table7',
  ];
  const locations = [];

  for (let i = 0; i < this.name.length; i++) {
    locations.push(
      new playFieldLocation(
        this.name[i],
        document.getElementById(this.name[i]),
        []
      )
    );
  }
  return locations;
}

function createHTMLCard(card, i) {
  let color = 'red';
  if (card.suit === 'spades' || card.suit === 'clubs') color = 'black';

  const div = document.createElement('div');
  div.className = `playfield__location--${card.location} card`;
  div.draggable = 'true';
  div.id = `card${i}`;
  div.style.zIndex = `${i + 100}`;
  div.innerHTML += `
  <div class="card__side card__side--back"></div>
  <div class="card__side card__side--front">
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
</div>`;
  return div;
}

function dealCards(myshuffledDeck) {
  const table = playFieldLocations.slice(6);

  for (let i = 0; i < table.length; i++) {
    for (let j = i; j < table.length; j++) {
      table[j].cards.push(myshuffledDeck.pop());
      table[j].cards[table[j].cards.length - 1].location = `table${j + 1}`;
    }
  }
  playFieldLocations[0].cards = myshuffledDeck;
}

function displayCards(cards) {
  const playField = document.getElementById('playfield');

  cards.forEach((card, i) => {
    playField.appendChild(createHTMLCard(card, i));
  });
}

// MAIN PROGRAM
const myshuffledDeck = shuffelDeck(new deck());
const playFieldLocations = new buildPlayFieldLocations();

dealCards(myshuffledDeck);

playFieldLocations.forEach(location => {
  displayCards(location.cards);
});

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
}

function dragEnd() {
  this.classList.remove('grabbed');
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
  grabbed.className = `playfield__location--${this.id} card`;
}
