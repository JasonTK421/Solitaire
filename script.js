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
  // console.log(...cards);
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

function dealCards(deck, drawPile, tablePiles) {
  for (let i = 0; i < tablePiles.length; i++) {
    for (let j = i; j < tablePiles.length; j++) {
      tablePiles[j].cards.push(deck.pop());
    }
  }
  tablePiles.forEach(pile => {
    pile.cards.forEach((card, i) => {
      if (card[i] === pile.cards.length - 1) {
        flipCard(card);
      }
    });
  });
  drawPile.cards = deck;
}

function toggleDraggable(card) {
  if (card.element.draggable === false) {
    card.element.draggable = true;
  } else {
    card.element.draggable = false;
  }
}

function createCardElements(cardPiles) {
  cardPiles.forEach(cardPile => {
    cardPile.cards.forEach((card, i) => {
      let color = 'red';
      if (card.suit === 'spades' || card.suit === 'clubs') color = 'black';

      const div = document.createElement('div');
      div.className = `card`;
      div.draggable = false;
      div.id = card.cardID;
      div.style.zIndex = zIndex(i);
      div.innerHTML += `
          <div class="card__side card__side--back"></div>
          <div class="card__side card__side--front ">
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
    });
  });
}

function setCardPosition(cards) {
  cards.forEach((card, i) => {
    card.element.style.top = `${i * 2}rem`;
  });
}

function zIndex(i) {
  return (i = i + 101);
}

function getIndex(element) {
  return element.style.zIndex - 101;
}

function pickUpCards(index, currentCardPile) {
  const cards = [];
  for (let i = currentCardPile.length - 1; i >= index; i--) {
    cards.push(currentCardPile.pop());
  }
  return cards;
}

function dropCards(currentCardPile, newCardPile) {
  const length = currentCardPile.length;
  for (let i = 0; i < length; i++) {
    newCardPile.push(currentCardPile.pop());
  }
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

function updateCardPileVisuals(cardPile) {
  console.log(cardPile.cards.length);
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

function flipCard(card) {
  const sides = card.element.children;
  for (let i = 0; i < sides.length; i++) {
    sides[i].classList.toggle('faceDown');
  }
  return card;
}

function testCheckAllCardPiles(cardPiles) {
  console.log(
    '-------------------------------------------------------------------------'
  );
  cardPiles.forEach(pile => {
    console.log(`Name: ${pile.name} | Lenght: ${pile.cards.length}`);
    console.log(pile.cards);
    // console.log(`Lenght: ${pile.cards.length}`);
  });
}

// MAIN PROGRAM
const playField = document.getElementById('playfield');
const myshuffledDeck = shuffelDeck(new deck());
const cardPiles = new buildCardPiles();
const tablePiles = cardPiles.slice(6);
const drawPile = cardPiles[0];
const waste = cardPiles[1];

dealCards(myshuffledDeck, drawPile, tablePiles);
createCardElements(cardPiles);

drawPile.cards.forEach(card => {
  toggleDraggable(card);
});

tablePiles.forEach(cardPile => {
  setCardPosition(cardPile.cards);
});

cardPiles.forEach(cardPile => {
  displayCards(cardPile);
});

let currentCardPile = null;
let targetCardPile = null;
let grabbedCards = [];
const cards = document.querySelectorAll('.card');
const droppables = document.querySelectorAll('.droppable');

cards.forEach(card => {
  card.onmousedown = function (event) {
    let elementBelow = getElementBelow();
    let currentDroppable = null;

    cardPiles.forEach(cardPile => {
      if (elementBelow.closest(`#${cardPile.name}`)) {
        currentCardPile = cardPile;
        targetCardPile = cardPile;
      }
    });
    console.log(currentCardPile);
    console.log(getIndex(card));
    grabbedCards = pickUpCards(getIndex(card), currentCardPile.cards);
    updateCardPileVisuals(currentCardPile);

    playField.append(card);
    card.style.zIndex = 1000;

    function moveAt(pageX, pageY) {
      card.style.left = pageX - card.offsetWidth / 2 + 'px';
      card.style.top = pageY - card.offsetHeight / 2 + 'px';
    }

    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);

      elementBelow = getElementBelow();

      if (!elementBelow) return;

      let droppableBelow = elementBelow.closest('.droppable');

      if (currentDroppable != droppableBelow) {
        if (currentDroppable) {
          // leaveDroppable(currentDroppable);
          targetCardPile = currentCardPile;
          toggleHover(currentDroppable);
        }
        currentDroppable = droppableBelow;

        if (currentDroppable) {
          // enterDroppable(currentDroppable);
          cardPiles.forEach(cardPile => {
            if (cardPile.name === currentDroppable.id) {
              targetCardPile = cardPile;
            }
          });
          toggleHover(currentDroppable);
        }
      }
    }
    document.addEventListener('mousemove', onMouseMove);

    card.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      card.onmouseup = null;

      dropCards(grabbedCards, targetCardPile.cards);
      // pickUpCards(getIndex(this), grabbedCards, targetCardPile.cards);
      updateZIndex(targetCardPile);
      displayCards(targetCardPile);
      updateCardPileVisuals(targetCardPile);
      card.style.left = 0;
      card.style.top = 0;

      if (currentDroppable) {
        toggleHover(currentDroppable);
      }
      testCheckAllCardPiles(cardPiles);
    };
  };
  function getElementBelow() {
    card.hidden = true;
    let element = document.elementFromPoint(event.clientX, event.clientY);
    card.hidden = false;
    return element;
  }
  // card.addEventListener('dragstart', dragStart);
  // card.addEventListener('dragend', dragEnd);
});

droppables.forEach(droppable => {
  droppable.addEventListener('dragover', dragOver);
  droppable.addEventListener('dragenter', dragEnter);
  droppable.addEventListener('dragleave', dragLeave);
  droppable.addEventListener('drop', dragDrop);
});

drawPile.element.addEventListener('click', cycleDrawPile);

function toggleHover(currentDroppable) {
  if (currentDroppable.classList.contains('hover')) {
    currentDroppable.classList.remove('hover');
  } else {
    currentDroppable.classList.add('hover');
  }
}

function cycleDrawPile() {
  if (drawPile.cards.length === 0) {
    const cardCount = waste.cards.length;
    for (let i = 0; i < cardCount; i++) {
      const card = waste.cards.pop();
      flipCard(card);
      toggleDraggable(card);
      drawPile.cards.push(card);
      updateZIndex(drawPile);
      displayCards(drawPile);
    }
  } else {
    const card = drawPile.cards.pop();
    flipCard(card);
    toggleDraggable(card);
    waste.cards.push(card);
    updateZIndex(waste);
    displayCards(waste);
  }
  updateCardPileVisuals(drawPile);
  updateCardPileVisuals(waste);

  // testCheckAllCardPiles(cardPiles);
}

// function dragStart() {
//   cardPiles.forEach(cardPile => {
//     if (this.closest(`#${cardPile.name}`)) {
//       currentCardPile = cardPile;
//       targetCardPile = cardPile;
//     }
//   });

//   grabbedCards = pickUpCards(getIndex(this), currentCardPile.cards);
//   updateCardPileVisuals(currentCardPile);
//   setTimeout(() => this.classList.add('invisible'), 0);
// }

function dragEnd() {
  dropCards(grabbedCards, targetCardPile.cards);
  // pickUpCards(getIndex(this), grabbedCards, targetCardPile.cards);
  updateZIndex(targetCardPile);
  displayCards(targetCardPile);
  updateCardPileVisuals(targetCardPile);
  this.classList.remove('invisible');

  testCheckAllCardPiles(cardPiles);
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
  targetCardPile = currentCardPile;
  this.classList.remove('hover');
}

function dragDrop() {
  this.classList.remove('hover');
}
