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
  this.suit = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
  let cards = [];

  for (let i = 0; i < this.suit.length; i++) {
    for (let j = 0; j < this.name.length; j++) {
      cards.push(new card(j + 1, this.name[j], this.suit[i]));
    }
  }
  return cards;
}

const myDeck = new deck();
console.log(myDeck);
// window.onload = function () {
//   let div = document.createElement('div');
//   div.className = 'card';
// };
// const displayDeck = function (myDeck) {
//   myDeck.forEach(function (card, i) {

//   });
// };
