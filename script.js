'use strict';

function card(value, name, suit, cardID) {
  this.value = value;
  this.name = name;
  this.suit = suit;
  this.cardID = cardID;
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
    'drawPile',
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

function dealCards(deck, drawPile, table) {
  for (let i = 0; i < table.length; i++) {
    for (let j = i; j < table.length; j++) {
      table[j].cards.push(deck.pop());
    }
  }
  drawPile.cards = deck;
}

function createCardElement(card, i) {
  let color = 'red';
  if (card.suit === 'spades' || card.suit === 'clubs') color = 'black';

  const div = document.createElement('div');
  div.className = `card`;
  div.draggable = 'true';
  div.id = card.cardID;
  div.style.zIndex = zIndex(i);
  div.innerHTML += `
      <div class="card__side card__side--back"></div>
      <div class="card__side card__side--front faceDown">
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

function setCardPosition(cards) {
  cards.forEach((card, i) => {
    card.element.style.top = `${i * 2}rem`;
  });
}

function zIndex(i) {
  return (i = i + 101);
}

function updateZIndex(cardPile) {
  cardPile.cards.forEach((card, i) => {
    card.element.style.zIndex = zIndex(i);
  });
}

function displayCards(cardPile) {
  cardPile.cards.forEach(card => {
    cardPile.element.appendChild(card.element);
  });
}

function flipCard(card) {
  const sides = card.element.children;
  for (let i = 0; i < sides.length; i++) {
    sides[i].classList.toggle('faceDown');
  }
  return card;
}

function updateCardPileVisuals(cardPile) {
  if (cardPile.cards.length === 0) {
    cardPile.element.classList.add('emptyPile');
    cardPile.element.classList.remove('fullPile');
    return;
  }

  if (cardPile.element.classList.contains('fullPile')) return;
  else {
    cardPile.element.classList.add('fullPile');
    cardPile.element.classList.remove('emptyPile');
  }
}

function testCheckAllCardPiles(cardPiles) {
  console.log(
    '-------------------------------------------------------------------------'
  );
  cardPiles.forEach(pile => {
    console.log(`Name: ${pile.name} | Lenght: ${pile.cards.length}`);
    // console.log(`Lenght: ${pile.cards.length}`);
  });
}

// MAIN PROGRAM
const myshuffledDeck = shuffelDeck(new deck());
const cardPiles = new buildCardPiles();
const table = cardPiles.slice(6);
const drawPile = cardPiles[0];
const waste = cardPiles[1];

dealCards(myshuffledDeck, drawPile, table);

cardPiles.forEach(cardPile => {
  cardPile.cards.forEach((card, i) => {
    createCardElement(card, i);
  });
});

table.forEach(cardPile => {
  setCardPosition(cardPile.cards);
});

cardPiles.forEach(cardPile => {
  displayCards(cardPile);
});

let originalCardPile = null;
let targetCardPile = null;
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

drawPile.element.addEventListener('click', cycleDrawPile);

function cycleDrawPile() {
  if (drawPile.cards.length === 0) {
    const cardCount = waste.cards.length;
    for (let i = 0; i < cardCount; i++) {
      drawPile.cards.push(flipCard(waste.cards.pop()));
      updateZIndex(drawPile);
      displayCards(drawPile);
    }
  } else {
    waste.cards.push(flipCard(drawPile.cards.pop()));
    updateZIndex(waste);
    displayCards(waste);
  }
  updateCardPileVisuals(drawPile);
  updateCardPileVisuals(waste);

  // testCheckAllCardPiles(cardPiles);
}

function switchCardPiles(oldCardPile, newCardPile) {
  newCardPile.push(oldCardPile.pop());
}

function dragStart() {
  cardPiles.forEach(cardPile => {
    if (cardPile.name === this.parentElement.id) {
      originalCardPile = cardPile;
      targetCardPile = cardPile;
    }
  });
  switchCardPiles(originalCardPile.cards, grabbedCard);
  updateCardPileVisuals(originalCardPile);
  setTimeout(() => this.classList.add('invisible'), 0);
}

function dragEnd() {
  switchCardPiles(grabbedCard, targetCardPile.cards);
  updateZIndex(targetCardPile);
  displayCards(targetCardPile);
  updateCardPileVisuals(targetCardPile);
  this.classList.remove('invisible');

  // testCheckAllCardPiles(cardPiles);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  cardPiles.forEach(cardPile => {
    if (cardPile.name === this.id) {
      targetCardPile = cardPile;
    }
  });
  this.classList.add('hover');
}

function dragLeave() {
  targetCardPile = originalCardPile;
  this.classList.remove('hover');
}

function dragDrop() {
  this.classList.remove('hover');

  // testCheckAllCardPiles(cardPiles);
}
