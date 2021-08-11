'use strict';

function card(value, name, suit, cardID, isFaceUp) {
  this.value = value;
  this.name = name;
  this.suit = suit;
  this.cardID = cardID;
  this.element;
  this.isFaceUp = isFaceUp;
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
      cards.push(new card(j + 1, this.name[j], this.suit[i], cardID, true));
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

function cycleDrawPile() {
  if (drawPile.cards.length === 0) {
    const cardCount = waste.cards.length;
    for (let i = 0; i < cardCount; i++) {
      const card = waste.cards.pop();
      drawPile.cards.push(card);
      updateZIndex(drawPile);
      appendCard(drawPile);
      hideCards(drawPile);
    }
  } else {
    const card = drawPile.cards.pop();
    card.element.style.visibility = 'visible';
    waste.cards.push(card);
    updateZIndex(waste);
    appendCard(waste);
  }

  if (drawPile.cards.length === 0) {
    drawPile.element.classList.remove('card__back');
  } else if (
    drawPile.cards.length > 0 &&
    !drawPile.element.classList.contains('card__back')
  ) {
    drawPile.element.classList.add('card__back');
  }

  updateCardPileVisuals(drawPile);
  updateCardPileVisuals(waste);

  // testCheckAllCardPiles(cardPiles);
}

function dealCards(deck, drawPile, tablePiles) {
  for (let i = 0; i < tablePiles.length; i++) {
    for (let j = i; j < tablePiles.length; j++) {
      tablePiles[j].cards.push(deck.pop());
    }
  }
  tablePiles.forEach(pile => {
    pile.cards.forEach((card, i) => {
      if (i !== pile.cards.length - 1) {
        card.isFaceUp = false;
      }
    });
  });
  drawPile.cards = deck;
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
      div.style.zIndex = SetZIndex(i);
      div.innerHTML += `
      <div class="card__face">
          <h3 class="heading-3 card__face--num ${color}" draggable="false">${card.name}</h3>
          <img
            class="card__face--icon"
            draggable="false"
            src="images/icon-${card.suit}.svg"
            alt="${card.suit}"
          />
          <img
            class="card__face--suit"
            draggable="false"
            src="images/icon-${card.suit}.svg"
            alt="${card.suit}"
          />
        </div>
      </div>`;
      card.element = div;
    });
  });
}

function SetZIndex(i) {
  return (i = i + 101);
}

function hideCards(pile) {
  pile.cards.forEach(card => {
    card.element.style.visibility = 'hidden';
  });
}

function appendCard(pile) {
  pile.cards.forEach((card, i) => {
    if (!card.isFaceUp) {
      const cardBack = document.createElement('div');
      cardBack.className = `cardBack`;
      cardBack.draggable = false;
      cardBack.style.zIndex = i;
      cardBack.style.top = card.element.style.top;
      pile.element.appendChild(cardBack);
    } else {
      pile.element.appendChild(card.element);
    }
  });
}

function pickUpCards(index, currentCardPile) {
  const cards = [];
  for (let i = currentCardPile.length - 1; i >= index; i--) {
    cards.push(currentCardPile.pop());
  }
  return cards;
}

function updateCardPileVisuals(pile) {
  if (pile.cards.length === 0) {
    pile.element.classList.add('emptyPile');
    pile.element.classList.remove('fullPile');
    return;
  }

  if (pile.element.classList.contains('fullPile')) return;
  else {
    pile.element.classList.add('fullPile');
    pile.element.classList.remove('emptyPile');
  }
}

function toggleHover(currentDroppable) {
  if (currentDroppable.classList.contains('hover')) {
    currentDroppable.classList.remove('hover');
  } else {
    currentDroppable.classList.add('hover');
  }
}

function dropCards(currentCardPile, newCardPile) {
  const length = currentCardPile.length;
  for (let i = 0; i < length; i++) {
    newCardPile.push(currentCardPile.pop());
  }
}

function updateCardPile(pile) {}

function updateZIndex(pile) {
  pile.cards.forEach((card, i) => {
    card.element.style.zIndex = SetZIndex(i);
  });
}

// TODO remove when finished testing
function testCheckAllCardPiles(cardPiles) {
  console.log(
    '-------------------------------------------------------------------------'
  );
  cardPiles.forEach(pile => {
    console.log(`Name: ${pile.name} | Lenght: ${pile.cards.length}`);
    console.log(pile.cards);
  });
}

// MAIN PROGRAM
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const playField = document.getElementById('playfield');
const myshuffledDeck = shuffelDeck(new deck());
const cardPiles = new buildCardPiles();
const tablePiles = cardPiles.slice(6);
const drawPile = cardPiles[0];
const waste = cardPiles[1];

let currentCardPile = null;
let targetCardPile = null;
let grabbedCards = [];

drawPile.element.addEventListener('click', cycleDrawPile);

dealCards(myshuffledDeck, drawPile, tablePiles);
createCardElements(cardPiles);
hideCards(drawPile);

tablePiles.forEach(pile => {
  pile.cards.forEach((card, i) => {
    card.element.style.top = `${i * 2}rem`;
  });
});

cardPiles.forEach(pile => {
  appendCard(pile);
});

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.onmousedown = function (event) {
    let elementBelow = getElementBelow(event);
    let currentDroppable = null;

    cardPiles.forEach(cardPile => {
      if (elementBelow.closest(`#${cardPile.name}`)) {
        currentCardPile = cardPile;
        targetCardPile = cardPile;
      }
    });

    grabbedCards = pickUpCards(card.style.zIndex - 101, currentCardPile.cards);
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

      elementBelow = getElementBelow(event);

      if (!elementBelow) return;

      let droppableBelow = elementBelow.closest('.droppable');

      if (currentDroppable != droppableBelow) {
        if (currentDroppable) {
          targetCardPile = currentCardPile;
          toggleHover(currentDroppable);
        }
        currentDroppable = droppableBelow;

        if (currentDroppable) {
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
      updateCardPile(currentCardPile);
      updateCardPile(targetCardPile);
      updateZIndex(targetCardPile);
      appendCard(targetCardPile);
      updateCardPileVisuals(targetCardPile);
      card.style.left = 0;
      card.style.top = 0;

      if (currentDroppable) {
        toggleHover(currentDroppable);
      }
      // testCheckAllCardPiles(cardPiles);
    };
  };

  function getElementBelow(event) {
    card.hidden = true;
    let element = document.elementFromPoint(event.clientX, event.clientY);
    card.hidden = false;
    return element;
  }
});
