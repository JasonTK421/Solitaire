'use strict';

function card(value, name, suit, cardID) {
  this.value = value;
  this.name = name;
  this.suit = suit;
  this.cardID = cardID;
  this.zIndex;
  this.element;
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
  let cardID = 1;
  for (let i = 0; i < this.suit.length; i++) {
    for (let j = 0; j < this.name.length; j++) {
      cards.push(new card(j + 1, this.name[j], this.suit[i], cardID));
      cardID++;
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
    shuffledDeck.push(deckCopy[randomCard]);
    deckCopy.splice(randomCard, 1);
  }
  return shuffledDeck;
}

function cardPile(name, element, cards) {
  this.name = name;
  this.element = element;
  this.cards = cards;
}

function buildCardPiles() {
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
  const cardPiles = [];

  for (let i = 0; i < this.name.length; i++) {
    cardPiles.push(
      new cardPile(this.name[i], document.getElementById(this.name[i]), [])
    );
  }
  return cardPiles;
}

function dealCards(myshuffledDeck, pile) {
  for (let i = 0; i < table.length; i++) {
    for (let j = i; j < table.length; j++) {
      table[j].cards.push(myshuffledDeck.pop());
    }
  }
  pile.cards = myshuffledDeck;
}

function createCardElement(card) {
  let color = 'red';
  if (card.suit === 'spades' || card.suit === 'clubs') color = 'black';

  const div = document.createElement('div');
  div.className = `dropable card`;
  div.draggable = 'true';
  div.id = card.cardID;
  div.style.zIndex = card.zIndex;
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
  card.element = div;
}

function setZIndex(card, i) {
  card.zIndex = i + 101;
}

function setCardPosition(cards) {
  cards.forEach((card, i) => {
    card.element.style.top = `${i * 2}rem`;
  });
}

function displayCards(pile) {
  pile.cards.forEach(card => {
    pile.element.appendChild(card.element);
  });
}

// MAIN PROGRAM
const myshuffledDeck = shuffelDeck(new deck());
const cardPiles = new buildCardPiles();
const table = cardPiles.slice(6);
const drawPile = cardPiles[0];
const waste = cardPiles[1];

dealCards(myshuffledDeck, drawPile);

cardPiles.forEach(pile => {
  pile.cards.forEach((card, i) => {
    setZIndex(card, i);
    createCardElement(card);
  });
});

table.forEach(pile => {
  setCardPosition(pile.cards);
});

cardPiles.forEach(pile => {
  displayCards(pile);
});

let grabbedElement = null;
let grabbedParent = null;
let grabbedCard = [];
const cards = document.querySelectorAll('.card');
const dropables = document.querySelectorAll('.dropable');

cards.forEach(card => {
  card.addEventListener('dragstart', dragStart);
  card.addEventListener('dragend', dragEnd);
});

dropables.forEach(dropable => {
  dropable.addEventListener('dragover', dragOver);
  dropable.addEventListener('dragenter', dragEnter);
  dropable.addEventListener('dragleave', dragLeave);
  dropable.addEventListener('drop', dragDrop);
});

drawPile.element.addEventListener('click', cycleCards);

function cycleCards() {
  if (drawPile.cards.length === 0) {
    const cardCount = waste.cards.length;
    for (let i = 0; i < cardCount; i++) {
      drawPile.cards.push(waste.cards.pop());
      displayCards(drawPile);
    }
  } else {
    waste.cards.push(drawPile.cards.pop());
    displayCards(waste);
  }
}

function dragStart() {
  grabbedElement = this;
  cardPiles.forEach(pile => {
    if (pile.name === grabbedElement.parentElement.id) {
      grabbedParent = pile;
    }
  });
  grabbedCard.push(grabbedParent.cards.pop());
  setTimeout(() => this.classList.add('invisible'), 0);
}

function dragEnd() {
  this.classList.remove('invisible');
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('hover');
}

function dragLeave() {
  this.classList.remove('hover');
}

function dragDrop() {
  this.classList.remove('hover');
  cardPiles.forEach(pile => {
    if (pile.name === this.id) {
      pile.cards.push(grabbedCard.pop());
      displayCards(pile);
    }
  });
}
