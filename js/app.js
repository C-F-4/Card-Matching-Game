/*
 * Create a list that holds all of your cards
 */
$game = $('.game-container');
$deck = $game.find('.deck');
$moveControl = $game.find('.moves');
$starControl = $game.find('.stars');

var allCards = [];
var movesCount = 0;
var starRating = 3;

var click1 = {};
var click2 = {};
var matches = 0;

/*
 * Game Initializer
 */
function initBoard(level) {
  var maxLength = faClassList.length;
  var numberOfCards = level.pairs * 2;
  if (level.pairs <= maxLength) {
    // fill allCards with randomly selected (level.pairs) classes from faClassList
    var tempArray = shuffle(faClassList);
    tempArray = tempArray.slice(tempArray.length - level.pairs);
    tempArray.forEach(function (element) {
      allCards.push(
        {
          className: element,
          isOpen: false
        }
      );
    }, this);
    movesCount = 0;
    matches = 0;
    starRating = 3;
    generatePairs();
    initializeCards();
    updateMoves();
    updateStars();
  } else {
    console.log(errors.not_sufficient_cards.message);
  }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function openCard(index, cardId) {
  if (!isNumber(click1.index)) {
    movesCount ++;
    updateMoves();
    click1 = {'cardId': cardId, 'index': index};
    $deck.find('#' + cardId).css('font-size', 22);
    return;
  } else if (!isNumber(click2.index) && click1.cardId != cardId) {
    movesCount ++;
    updateMoves();
    click2 = {'cardId': cardId, 'index': index};
    $deck.find('#' + cardId).css('font-size', 22);
    if (isMatch(click1.index, click2.index)) {
      // keep flipped
      foundMatch();
    } else {
      // hide cards
      hideUnmatchedCards();
    }

    if (matches === allCards.length) {
      gameCompleted();
    }
  } else {
    // No idea how you got here
    // Maybe multiple clicks on already opened card
    return;
  }
}

// if data is valid number return true else false
function isNumber(data) {
  return typeof data === 'number' ? true : false;
}

// Check if card at index1 and index2 has same className
function isMatch(index1, index2) {
  return (allCards[index1].className === allCards[index2].className) ? true : false;
}

function foundMatch() {
  $deck.find('#' + click1.cardId).unbind('click');
  $deck.find('#' + click2.cardId).unbind('click');
  click1 = {};
  click2 = {};
  matches += 2;
}

function hideUnmatchedCards() {
  setTimeout(function() {
    $deck.find('#' + click1.cardId).css('font-size', 0);
    $deck.find('#' + click2.cardId).css('font-size', 0);
    click1 = {};
    click2 = {};
  }, 500);
}

// generate pairs of allCards
function generatePairs() {
  allCards = allCards.concat(allCards);
  allCards = shuffle(allCards);
}

function initializeCards() {
  $deck.empty();
  var iter = 0;
  allCards.forEach((card) => {
    var index = iter;
    var card_id = 'card' + index;
    var li_item = '<li class="card" id="' + card_id + '"><i class="fa ' + card.className + '"></i></li>';
    $deck.append(li_item);
    $('#' + card_id).bind('click', () => {
      openCard(index, card_id);
    });
    iter ++;
  });
}

function reset() {
  allCards = [];
  matches = 0;
  movesCount = 0;
  starRating = 3;
  click1 = {};
  click2 = {};
}

function updateMoves() {
  $moveControl.text(movesCount);
}

function updateStars() {
  const li_item = '<li><i class="fa fa-star"></i></li>';
  $starControl.empty();
  for (var star = 0; star < starRating; star ++) {
    $starControl.append(li_item);
  }
}

function gameCompleted() {
  reset();
  $rightControl.click();
  hideAllExcept('slide3');
}
