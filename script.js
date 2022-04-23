'use strict';

function card(value, name, suit, color, cardID, isFaceUp) {
  this.value = value;
  this.name = name;
  this.suit = suit;
  this.color = color;
  this.cardID = cardID;
  this.element;
  this.isFaceUp = isFaceUp;
  this.placement = 0;
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
  this.suit = ['hearts', 'spades', 'diamonds', 'clubs'];
  this.color = ['red', 'black'];
  const cards = [];
  let cardID = 1;
  for (let i = 0; i < this.suit.length; i++) {
    for (let j = 0; j < this.name.length; j++) {
      cards.push(
        new card(
          j + 1,
          this.name[j],
          this.suit[i],
          this.color[i % 2],
          cardID,
          true
        )
      );
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

function cardPile(name, type, element, cards) {
  this.name = name;
  this.suit;
  this.type = type;
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
    let pileType;

    if (this.name[i].startsWith('foundation')) pileType = 'foundation';
    else if (this.name[i].startsWith('table')) pileType = 'table';
    else pileType = this.name[i];

    cardPiles.push(
      new cardPile(
        this.name[i],
        pileType,
        document.getElementById(this.name[i]),
        []
      )
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

      drawPile.cards.forEach((card, i) => {
        appendCardElement(drawPile, card, i);
      });

      hideCards(drawPile);
    }
  } else {
    const card = drawPile.cards.pop();
    card.element.style.visibility = 'visible';
    waste.cards.push(card);
    updateZIndex(waste);

    waste.cards.forEach((card, i) => {
      appendCardElement(waste, card, i);
    });
  }

  if (drawPile.cards.length === 0) {
    drawPile.element.classList.remove('cardBack');
  } else if (
    drawPile.cards.length > 0 &&
    !drawPile.element.classList.contains('cardBack')
  ) {
    drawPile.element.classList.add('cardBack');
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

function appendCardElement(pile, card, i) {
  card.element.style.top = `${card.placement}rem`;
  pile.element.appendChild(card.element);
  if (!card.isFaceUp) {
    card.element.style.visibility = 'hidden';
    const cardBack = document.createElement('div');
    cardBack.className = `cardBack`;
    cardBack.draggable = false;
    cardBack.style.zIndex = i;
    cardBack.style.top = card.element.style.top;
    pile.element.appendChild(cardBack);
  }
}

function setPileHeight(pile) {
  if (pile.cards.length > 0) {
    const topCardPosition = pile.cards[pile.cards.length - 1].element.offsetTop;
    const topCardHeight =
      pile.cards[pile.cards.length - 1].element.offsetHeight;
    pile.element.style.height = `${topCardPosition + topCardHeight}px`;
  } else {
    pile.element.style.height = 174;
  }
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

function moveCardIntoNewPile(grabbedCards, newPile) {
  newPile.cards.push(grabbedCards.pop());
}

function updateTablePile(currentPile) {
  if (currentPile.cards.length === 0) return;

  const topCard = currentPile.cards[currentPile.cards.length - 1];
  if (!topCard.isFaceUp) {
    topCard.isFaceUp = true;
    currentPile.element.lastChild.remove();
    topCard.element.style.visibility = 'visible';
  }
}

function updateZIndex(pile) {
  pile.cards.forEach((card, i) => {
    card.element.style.zIndex = SetZIndex(i);
  });
}

function setOffsetOfLastCardInPile(targePile) {
  let num = 0;
  if (targetPile.cards.length > 1 && targetPile.type === 'table') {
    if (targetPile.cards[targetPile.cards.length - 2].isFaceUp) {
      num = targetPile.cards[targetPile.cards.length - 2].placement + 4;
    } else {
      num = targetPile.cards[targetPile.cards.length - 2].placement + 1.5;
    }
  }
  targePile.cards[targePile.cards.length - 1].placement = num;
}

function BigFunction() {
  const grabbedCardsLength = grabbedCards.length;
  for (let i = 0; i < grabbedCardsLength; i++) {
    moveCardIntoNewPile(grabbedCards, targetPile);
    setOffsetOfLastCardInPile(targetPile);
    appendCardElement(
      targetPile,
      targetPile.cards[targetPile.cards.length - 1],
      targetPile.cards.length - 1
    );
    setPileHeight(targetPile);
  }
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
let targetPile = null;
let grabbedCards = [];

drawPile.element.addEventListener('click', cycleDrawPile);

dealCards(myshuffledDeck, drawPile, tablePiles);
createCardElements(cardPiles);
hideCards(drawPile);

tablePiles.forEach(pile => {
  pile.cards.forEach((card, i) => {
    card.placement = i * 1.5;
  });
});

cardPiles.forEach(pile => {
  pile.cards.forEach((card, i) => {
    appendCardElement(pile, card, i);
  });
});

tablePiles.forEach(pile => {
  setPileHeight(pile);
});

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.onmousedown = function (event) {
    let elementBelow = getElementBelow(event);
    let currentDroppable = null;

    // set current and target card piles
    cardPiles.forEach(cardPile => {
      if (elementBelow.closest(`#${cardPile.name}`)) {
        currentCardPile = cardPile;
        targetPile = cardPile;
      }
    });

    grabbedCards = pickUpCards(card.style.zIndex - 101, currentCardPile.cards);
    // grabbedCards.forEach(card => {
    //   grabbedCards[0].element.appendChild(card.element);
    // });
    setPileHeight(currentCardPile);
    updateCardPileVisuals(currentCardPile);
    card.classList.add('glow');

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
          targetPile = currentCardPile;
        }
        currentDroppable = droppableBelow;

        if (currentDroppable) {
          cardPiles.forEach(cardPile => {
            if (cardPile.name === currentDroppable.id) {
              targetPile = cardPile;
            }
          });
        }
      }
    }
    document.addEventListener('mousemove', onMouseMove);

    card.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      card.onmouseup = null;
      card.classList.remove('glow');

      // check target pile type
      if (targetPile.type === 'foundation') {
        // if only holding one card
        if (grabbedCards.length === 1) {
          //if pile is empty and card is an A
          if (targetPile.cards.length < 1 && grabbedCards[0].value === 1) {
            targetPile.suit = grabbedCards[0].suit;
            moveCardIntoNewPile(grabbedCards, targetPile);
            setOffsetOfLastCardInPile(targetPile);
            targetPile.cards[0].element.onmousedown = null;
            appendCardElement(
              targetPile,
              targetPile.cards[targetPile.cards.length - 1],
              targetPile.cards.length - 1
            );
            if (currentCardPile.type === 'table') {
              updateTablePile(currentCardPile);
            }
          } else if (
            // if pile is not empty and card is next card
            targetPile.suit === grabbedCards[0].suit &&
            grabbedCards[0].value ===
              targetPile.cards[targetPile.cards.length - 1].value + 1
          ) {
            moveCardIntoNewPile(grabbedCards, targetPile);
            setOffsetOfLastCardInPile(targetPile);
            appendCardElement(
              targetPile,
              targetPile.cards[targetPile.cards.length - 1],
              targetPile.cards.length - 1
            );
            if (currentCardPile.type === 'table') {
              updateTablePile(currentCardPile);
            }
          } else {
            targetPile = currentCardPile;
            moveCardIntoNewPile(grabbedCards, targetPile);
            appendCardElement(
              targetPile,
              targetPile.cards[targetPile.cards.length - 1],
              targetPile.cards.length - 1
            );
          }
        } else {
          // TODO send cards back to current pile
          console.log('too many cards');
        }
      } else if (targetPile.type === 'table') {
        const topCard = targetPile.cards[targetPile.cards.length - 1];
        const grabbedCard = grabbedCards.length - 1;
        if (targetPile.cards.length === 0) {
          if (grabbedCards[grabbedCard].value === 13) {
            BigFunction();
          } else {
            targetPile = currentCardPile;
            BigFunction();
          }
        } else if (
          topCard.color !== grabbedCards[grabbedCard].color &&
          topCard.value === grabbedCards[grabbedCard].value + 1
        ) {
          BigFunction();
        } else {
          targetPile = currentCardPile;
          BigFunction();
        }
        updateTablePile(currentCardPile);
      } else {
        targetPile = currentCardPile;
        BigFunction();
      }

      updateZIndex(targetPile);
      updateCardPileVisuals(targetPile);
      card.style.left = 0;

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
