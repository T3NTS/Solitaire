'use strict';

let pbPoints = JSON.parse(localStorage.getItem('points')) || 0;
let pbMoves = JSON.parse(localStorage.getItem('moves')) || 0;
let pbTime = JSON.parse(localStorage.getItem('time')) || '00:00:00';


const pbPointsElement = document.querySelector('.pb-points');
pbPointsElement.innerHTML = pbPoints;
const pbMovesElement = document.querySelector('.pb-moves');
pbMovesElement.innerHTML = pbMoves;
const pbTimeElement = document.querySelector('.pb-time');
pbTimeElement.innerHTML = pbTime;

let draggingElementsPos;
let finalContainerIdTemp;
let cardInfo = [];
let pointsElement = document.querySelector('.points');
let points = 0;
let timeElement = document.querySelector('.time');
let movesElement = document.querySelector('.moves');
let moves = 0;

let draggingElements = [];
let undoStack = [];
let hasClickedResetButton = false;

const cardDeckDiv = document.querySelector('.deck');
let cardDeck = [];
const trashCardsDiv = document.querySelector('.trash');
let trashCards = [];

const trashBin = document.querySelector('.trash-bin');

const card = {
  number: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  suit: [1000, 2000, 3000, 4000]
};

const shuffledDeck = [];
const cardDeckUnshuffled = [];
const rowCards = [
  [],
  [],
  [],
  [],
  [],
  [],
  []
]
const finalCards = [
  [],
  [],
  [],
  []
]



function makeDeck(array) {
  array.number.forEach((numberValue) => {
    array.suit.forEach((suitValue) => {
      let realCard = numberValue + suitValue;
      cardDeckUnshuffled.push(realCard);
    })
  })
  return cardDeckUnshuffled;
}

function shuffleDeck(array) {
  for (let i = 0; i < 52; i++) {
    let randomNumber = Math.random();
    let position = Math.floor(array.length * randomNumber);
    shuffledDeck.push(array[position]);
    array.splice(position, 1);
  }
  return shuffledDeck;
}

makeDeck(card);
shuffleDeck(cardDeckUnshuffled);
/*
function giveCardRowBlank(number) {
  const givenCard = shuffledDeck.pop();
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.classList.add('draggable')
  cardElement.draggable = false;
  const frontCardElement = document.createElement('div');
  frontCardElement.classList.add('card-front'); 
  cardElement.appendChild(frontCardElement);
  const frontImg = document.createElement('img');
  frontImg.classList.add('dimension')
  frontImg.src = `cards/${givenCard}.png`;
  frontCardElement.appendChild(frontImg);
  const backCardElement = document.createElement('div');
  backCardElement.classList.add('card-back');
  cardElement.appendChild(backCardElement);
  const backImg = document.createElement('img');
  backImg.classList.add('dimension')
  backImg.src = `cards/5000_1.png`;
  backImg.draggable = false;
  backCardElement.appendChild(backImg);
  giveSuit(givenCard, cardElement);
  cardElement.id = givenCard;
  pushCard(cardElement, number);
  rowCards[number].push(givenCard);
  return cardElement;
}

function giveCardNormal(number) {
  const givenCard = shuffledDeck.pop();
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.classList.add('draggable')
  cardElement.draggable = false;
  cardElement.classList.add('correct');
  const backCardElement = document.createElement('div');
  backCardElement.classList.add('card-back');
  cardElement.appendChild(backCardElement);
  const backImg = document.createElement('img');
  backImg.classList.add('dimension')
  backImg.src = `cards/5000_1.png`;
  backImg.draggable = false;
  backCardElement.appendChild(backImg);
  const frontCardElement = document.createElement('div');
  frontCardElement.classList.add('card-front'); 
  cardElement.appendChild(frontCardElement);
  const frontImg = document.createElement('img');
  frontImg.classList.add('dimension')
  frontImg.src = `cards/${givenCard}.png`;
  frontCardElement.appendChild(frontImg);
  giveSuit(givenCard, cardElement);
  cardElement.id = givenCard;
  pushCard(cardElement, number);
  rowCards[number].push(givenCard);
  return cardElement;
}*/

function giveSuit(value, element) {
  if (value < 1015) {
    element.classList.add('spades')
  } else if (value < 2015 && value > 1015) {
    element.classList.add('clubs')
  } else if (value < 3015 && value > 2015) { 
    element.classList.add('hearts')
  } else if (value > 3015) { 
    element.classList.add('diamonds')
  }
}

function pushCard(element, number) {
  const containerElement = document.getElementById(`${number}`);
  containerElement.appendChild(element);
}

for (let i = 0; i < 7; i++) {
  for (let j = 0; j < (i + 1); j++) {
    if (j == i) {
      giveCard((document.getElementById(`${i}`)), rowCards[i], 1);
    } else {
      giveCard((document.getElementById(`${i}`)), rowCards[i], 0);
    }
  }
}

function getDraggablePos(number, value, arr) {
  for (let i = 0; i < arr[number].length; i++) {
    if (arr[number][i] == value) {
      return i;
    }
  }
}

for (let i = 0; i < 24; i++) {
  const cardElement = giveCard(cardDeckDiv, cardDeck, 0);
  cardElement.style.marginBottom = '0px';
  cardElement.classList.add('trash');
}

function giveCard(div, arr, rotation) {
  const givenCard = shuffledDeck.pop();
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.classList.add('draggable')
  const frontCardElement = document.createElement('div');
  frontCardElement.classList.add('card-front');
  const frontImg = document.createElement('img');
  frontImg.classList.add('dimension')
  frontImg.src = `cards/${givenCard}.png`;
  frontCardElement.appendChild(frontImg);
  const backCardElement = document.createElement('div');
  backCardElement.classList.add('card-back');
  const backImg = document.createElement('img');
  backImg.src = `cards/5000_1.png`;
  backImg.classList.add('dimension');
  backImg.draggable = false;
  backCardElement.appendChild(backImg);
  if (rotation === 1) {
    cardElement.appendChild(backCardElement);
    cardElement.appendChild(frontCardElement);
    cardElement.classList.add('correct');
    cardElement.draggable = true;
  } else if (rotation === 0) {
    cardElement.appendChild(frontCardElement);
    cardElement.appendChild(backCardElement);
    cardElement.draggable = false;
  }
  giveSuit(givenCard, cardElement);
  cardElement.id = givenCard;
  div.appendChild(cardElement);
  arr.push(givenCard);
  return cardElement;
}

let resetButton = document.createElement('button');
resetButton.classList.add('reset-button');
resetButton.innerHTML = 'RESET';
cardDeckDiv.appendChild(resetButton);
console.log(cardDeck)

function updateMoves() {
  moves += 1;
  movesElement.innerHTML = moves;
}

function formatTime(time) {
  const date = new Date(time);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

let startingTime;
let intervalID;
let intervalID2;

function updateTime() {
  let elapsedTime = Date.now() - startingTime;
  let time = formatTime(elapsedTime);
  timeElement.innerHTML = time;
}

function startTime() {
  startingTime = Date.now();
  intervalID = setInterval(updateTime, 1000);
  intervalID2 = setInterval(() => {
    points -= 2;
    pointsElement.innerHTML = points;
  }, 10000);
}

function stopTime() {
  clearInterval(intervalID);
  clearInterval(intervalID2);
}

startTime();

cardDeckDiv.addEventListener('click', () => {
  if (cardDeck.length > 0) {
    updateMoves();
    let cardElement = cardDeckDiv.firstElementChild;
    cardElement.classList.add('correct');
    const backCardElement = cardElement.lastElementChild;
    cardElement.draggable = true;
    trashCardsDiv.appendChild(cardElement);
    setTimeout(() => {
      backCardElement.classList.add('flip');
    }, 20);
    trashCards.unshift(Number(cardElement.id));
    cardDeck.shift();
    if (cardDeckDiv.childElementCount === 0) {
      console.log('hi')
      setTimeout(() => {
        trashBin.removeChild(resetButton);
        resetButton.classList.remove('disabled');
        cardDeckDiv.appendChild(resetButton);
      }, 10);
    }
  }
})

resetButton.addEventListener('click', () => {
  if (trashCards.length !== 0) {
    const parent = resetButton.parentElement;
    parent.removeChild(resetButton);
    trashBin.appendChild(resetButton);
    resetButton.classList.add('disabled');
    setTimeout(() => {
      updateMoves();
      hasClickedResetButton ? points -= 100 : hasClickedResetButton = true;
      pointsElement.innerHTML = points;
      let num = trashCards.length;
      for (let i = 0; i < num; i++) {
        let cardValue = trashCards.shift();
        cardDeck.unshift(cardValue);
        const cardElement = trashCardsDiv.firstElementChild;
        cardElement.classList.remove('correct');
        const frontCardElement = cardElement.firstElementChild;
        const backCardElement = cardElement.lastElementChild;
        cardElement.draggable = false;
        backCardElement.classList.remove('flip');
        cardDeckDiv.appendChild(cardElement);
      }
    }, 10)
  }
})

let draggableElements = document.querySelectorAll('.draggable');
draggableElements.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggingElements = [];
    cardInfo = [];
    finalContainerIdTemp = false;
    let pos = findPosition(rowCards, Number(draggable.id));
    if (trashCards.includes(Number(draggable.id))) {
      console.log(trashCards)
      const lastChild = trashCardsDiv.lastElementChild;
      trashCards.shift();
      lastChild.classList.add('dragging');
      draggingElements.push(lastChild);
      console.log(draggingElements)
    } else if (pos == null) {
      pos = findPosition(finalCards, Number(draggable.id));
      draggingElementsPos = pos;
      console.log(pos)
      const parentDiv = document.getElementById(`${pos + 100}`);
      console.log(parentDiv)
      const lastChild = parentDiv.lastElementChild;
      cardInfo.push(draggingElementsPos);
      finalCards[pos].pop();
      lastChild.classList.add('dragging');
      lastChild.classList.add('final');
      draggingElements.push(lastChild);
      console.log(draggingElements)
      console.log(finalCards)
    } else {
      draggingElementsPos = pos;
      console.log(pos)
      const parentDiv = document.getElementById(`${pos}`);
      console.log(parentDiv)
      const child = parentDiv.children;
      const draggablePos = getDraggablePos(pos, draggable.id, rowCards); 
      let rowCardsLength = rowCards[pos].length;
      cardInfo.push(draggingElementsPos);
      for (let i = draggablePos; i < rowCardsLength; i++) {
        rowCards[pos].pop(i, 1);
        child[i].classList.add('dragging');
        draggingElements.push(child[i]);
      }
      console.log(trashCards)
      console.log(draggingElements)
      console.log(rowCards)
    }
  })

  draggable.addEventListener('dragend', () => {
  const pos = findPosition(rowCards, Number(draggable.id));
  draggingElementsPos = pos;
  const parentDiv = document.getElementById(`${pos}`);
  const finalParentDiv = document.getElementById(`${finalContainerIdTemp}`);
  const trashCheck = trashCards.includes(Number(draggable.id));
  console.log(parentDiv, finalParentDiv, trashCheck);
  if (parentDiv == null && finalParentDiv == null && !trashCheck) {
    console.log(draggingElements);
    console.log(cardInfo);
    for (let i = 0; i < draggingElements.length; i++) {
      if (draggingElements[i].classList.contains('trash')) {
        console.log('yo')
        console.log(draggingElements)
        trashCards.unshift(Number(draggingElements[i].id));
        trashCardsDiv.appendChild(draggingElements[i]);
        draggingElements[i].classList.remove('dragging');
      }
      else if (draggingElements[i].classList.contains('final')) {
        finalCards[cardInfo[0]].push(Number(draggingElements[i].id));
        let container = document.getElementById(`${cardInfo[0] + 100}`);
        container.appendChild(draggingElements[i]);
        draggingElements[i].classList.remove('dragging');
      } else {
        rowCards[cardInfo[0]].push(Number(draggingElements[i].id));
        let container = document.getElementById(`${cardInfo[0]}`);
        container.appendChild(draggingElements[i]);
        draggingElements[i].classList.remove('dragging');
      }
    }
    console.log(trashCards);
    console.log(finalCards)
  }
  console.log(rowCards)
  })
})

const containers = document.querySelectorAll('.container');
containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault();
  })
  container.addEventListener('drop', () => {
    const lastElement = container.lastElementChild;
    console.log(draggingElements[0]);
    console.log(draggingElements[0].lastElementChild);
    console.log(draggingElements[0].firstElementChild);
    if (rowCards[Number(container.id)].length !== 0) {
      if (checkNumber(lastElement, draggingElements[0])) {
        const firstElement = container.firstElementChild;
        if (container.children.length > 0 && firstElement.classList.contains('row-div-full')) {
          for (let i = 0; i < container.children.length; i++) {
            container.children[i].classList.remove('row-div-full');
          }
        }
        for (let i = 0; i < draggingElements.length; i++) {
          const backCardElement = draggingElements[i].lastElementChild;
          const frontCardElement = draggingElements[i].firstElementChild;
          container.appendChild(draggingElements[i]);
          rowCards[Number(container.id)].push(Number(draggingElements[i].id));
          draggingElements[i].style.removeProperty("margin");
          draggingElements[i].classList.add('in-row');
          draggingElements[i].classList.remove('css-compact');
          draggingElements[i].classList.remove('dragging');
          if (draggingElements[i].classList.contains('final')) {
            draggingElements[i].classList.remove('final');
            points -= 15;
            pointsElement.innerHTML = points;
          } else if (draggingElements[i].classList.contains('trash')) {
            draggingElements[i].classList.remove('trash');
            points += 5;
            pointsElement.innerHTML = points;
          }
        }
        if (rowCards[Number(container.id)].length >= 12) {
          console.log(container.children.length);
          for (let i = 0; i < container.children.length; i++) {
            const element = container.children[i];
            element.classList.add('row-div-full');
          }
        }
        updateMoves();
        revealRowCard();
      }
    } else if ([1013, 2013, 3013, 4013].includes(Number(draggingElements[0].id))) {
      for (let i = 0; i < draggingElements.length; i++) {
        container.appendChild(draggingElements[i]);
        draggingElements[i].classList.add('in-row');
        draggingElements[i].classList.remove('css-compact');
        rowCards[Number(container.id)].push(Number(draggingElements[i].id));
        draggingElements[i].style.removeProperty("margin");
        draggingElements[i].classList.remove('dragging');
        if (draggingElements[i].classList.contains('final')) {
          draggingElements[i].classList.remove('final');
          points -= 15;
          pointsElement.innerHTML = points;
        } else if (draggingElements[i].classList.contains('trash')) {
          draggingElements[i].classList.remove('trash');
          points += 5;
          pointsElement.innerHTML = points;
        }
      }
      updateMoves();
      revealRowCard();
    }
  })
})

const modalElement = document.querySelector('.modal');
const pointsTextElement = document.querySelector('.points-text');
const movesTextElement = document.querySelector('.moves-text');
const spanElement = document.querySelector('.close');

spanElement.addEventListener('click', () => {
  modalElement.style.display = "none";
})

const finalContainers = document.querySelectorAll('.final-container');
finalContainers.forEach(finalContainer => {
  finalContainer.addEventListener('dragover', e => {
    e.preventDefault();
  })
  finalContainer.addEventListener('drop', () => {
    let lastElement = finalContainer.lastElementChild;
    if (finalCards[Number(finalContainer.id) - 100].length === 0) {
      if ([1001, 2001, 3001, 4001].includes(Number(draggingElements[0].id)) && haveSameClass(finalContainer, draggingElements[0])) {
        console.log(draggingElements[0]);
        console.log(finalContainer);
        if (!draggingElements[0].classList.contains('trash')) {
          const container = document.getElementById(`${draggingElementsPos}`);
          const firstElement = container.firstElementChild;
          if (container.children.length > 0 && firstElement.classList.contains('row-div-full')) {
            for (let i = 0; i < container.children.length; i++) {
              container.children[i].classList.remove('row-div-full');
            }
          }
        }
        finalContainer.appendChild(draggingElements[0]);
        draggingElements[0].classList.add('css-compact');
        finalCards[(Number(finalContainer.id) - 100)].push(Number(draggingElements[0].id));
        draggingElements[0].classList.remove('dragging');
        draggingElements[0].classList.contains('trash') ? draggingElements[0].classList.remove('trash') & (points += 5) : console.log('nada');
        console.log(finalCards)
        finalContainerIdTemp = Number(finalContainer.id);
        points += 10;
        pointsElement.innerHTML = points;
        updateMoves();
        revealRowCard();
      }
    } else {
      console.log(Number(lastElement.id))
      console.log(Number(draggingElements[0].id))
      if (checkNumberFinal(Number(lastElement.id), Number(draggingElements[0].id)) && haveSameClass(lastElement, draggingElements[0]) && !(draggingElements.length > 1)) {
        console.log('FGDFSFSD');
        if (!draggingElements[0].classList.contains('trash')) {
          const container = document.getElementById(`${draggingElementsPos}`);
          const firstElement = container.firstElementChild;
          if (container.children.length > 0 && firstElement.classList.contains('row-div-full')) {
            for (let i = 0; i < container.children.length; i++) {
              container.children[i].classList.remove('row-div-full');
            }
          }
        }
        finalContainer.appendChild(draggingElements[0]);
        draggingElements[0].classList.add('css-compact');
        draggingElements[0].classList.contains('trash') ? draggingElements[0].classList.remove('trash') & (points += 5) : console.log('nada');
        finalCards[(Number(finalContainer.id) - 100)].push(Number(draggingElements[0].id));
        draggingElements[0].classList.remove('dragging');
        console.log(finalCards);
        finalContainerIdTemp = Number(finalContainer.id);
        points += 10;
        pointsElement.innerHTML = points;
        updateMoves();
        revealRowCard();
      }
    }
    console.log(finalCards[0].length)
    console.log(finalCards[1].length)
    console.log(finalCards[2].length)
    console.log(finalCards[3].length)
    if (finalCards[0].length === 13 && finalCards[1].length === 13 && finalCards[2].length === 13 && finalCards[3].length === 13) {
      pointsTextElement.innerHTML = points;
      movesTextElement.innerHTML = moves;
      modalElement.style.display = "block";
      stopTime();
      localStorage.setItem('points', JSON.stringify(points));
      localStorage.setItem('moves', JSON.stringify(moves));
      const timeNumber = timeElement.innerHTML;
      localStorage.setItem('time', JSON.stringify(timeNumber));
    }
  })
})

function revealRowCard() {
  const parentDiv = document.getElementById(`${draggingElementsPos}`);
  const lastElement = parentDiv.lastElementChild;
  if (rowCards[draggingElementsPos].length > 0 && !lastElement.classList.contains('correct')) {
    lastElement.classList.add('correct');
    const lastCardElement = lastElement.lastElementChild;
      setTimeout(() => {
        lastCardElement.classList.add('flip');
      }, 10)
    lastElement.draggable = true;
    points += 5;
    pointsElement.innerHTML = points;
  }
}

function checkNumberFinal(a, b) {
  const result = (a - b);
  if (Math.abs(result) === 1) {
    return true;
  } else {
    return false;
  }
}

function haveSameClass(el1, el2) {
  const arr = ['spades', 'clubs', 'diamonds', 'hearts'];
  for (let i = 0; i < arr.length; i++) {
    if (el1.classList.contains(arr[i]) && el2.classList.contains(arr[i])) {
      return true;
    }
  }
  return false;
}

function checkNumber(a, b) {
  if (checkColor(a, b) === 0) {
    if ([1001, 2001, 3001].includes(Math.abs(Number(a.id) - Number(b.id)))) {
      return true;
    } else {
      return false;
    };
  } else if (checkColor(a, b) === 1) {
    if ([999, 1999, 2999].includes(Math.abs(Number(a.id) - Number(b.id)))) {
      return true;
    } else {
      return false;
    };
  } else {
    return false;
  }
}

function checkColor(a, b) {
  if (a.classList.contains('spades') || a.classList.contains('clubs')) {
    a.classList.add('black');
  } else {
    a.classList.add('red')
  }
  if (b.classList.contains('spades') || b.classList.contains('clubs')) {
    b.classList.add('black');
  } else {
    b.classList.add('red')
  }
  if (a.classList.contains('red') && b.classList.contains('black')) {
    a.classList.remove('red');
    b.classList.remove('black');
   return 0;
  } else if (a.classList.contains('black') && b.classList.contains('red')) {
    a.classList.remove('black');
    b.classList.remove('red');
   return 1;
  } else {
    a.classList.contains('red') ? a.classList.remove('red') : a.classList.remove('black');
    b.classList.contains('red') ? b.classList.remove('red') : b.classList.remove('black');
   return false;
  }
}

function findPosition(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === value) {
        return i;
      }
    }
  }
}