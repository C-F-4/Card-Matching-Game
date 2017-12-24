/*
 * Create a list that holds all of your cards
 */
$game = $('.game-container');
$deck = $game.find('.deck');
$moveControl = $game.find('.moves');
$starControl = $game.find('.stars');
$timerControl = $game.find('.timer');

$gameFinished = $('.game-finished');
$starRatingControl = $gameFinished.find('.starRating');
$movesCounterControl = $gameFinished.find('.movesCounter');
$completionTimeControl = $gameFinished.find('.completionTime');

var allCards = [];
var movesCount = 0;
var starRating = 3;
var isGameStarted = false;
var timer = null;
var timerId = undefined;

var click1 = {};
var click2 = {};
var matches = 0;

var gameStats = {
  timer: null,
  movesCount: 0,
  starRating: 3
};
var currentLevel;

/*
 * Game Initializer
 */
function initBoard(level) {
  currentLevel = level;
  resetGameStats();
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
    isGameStarted = false;
    timer = '00:00';
    generatePairs();
    initializeCards();
    initializeTimer();
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
  calculateStars();
  if (!isGameStarted) {
    isGameStarted = true;
    startGameTimer();
  }
  if (!isNumber(click1.index)) {
    movesCount ++;
    updateMoves();
    click1 = {'cardId': cardId, 'index': index};
    $deck.find('#' + cardId).addClass('show');
    return;
  } else if (!isNumber(click2.index) && click1.cardId != cardId) {
    movesCount ++;
    updateMoves();
    click2 = {'cardId': cardId, 'index': index};
    $deck.find('#' + cardId).addClass('show');
    if (isMatch(click1.index, click2.index)) {
      // keep flipped
      foundMatch();
      calculateStars(true);
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

function isFloat(data) {
  return Number(data) === data && data % 1 !== 0;
}

// Check if card at index1 and index2 has same className
function isMatch(index1, index2) {
  return (allCards[index1].className === allCards[index2].className) ? true : false;
}

function foundMatch() {
  $deck.find('#' + click1.cardId).addClass('match');
  $deck.find('#' + click2.cardId).addClass('match');
  $deck.find('#' + click1.cardId).unbind('click');
  $deck.find('#' + click2.cardId).unbind('click');
  click1 = {};
  click2 = {};
  matches += 2;
}

function hideUnmatchedCards() {
  setTimeout(function() {
    $deck.find('#' + click1.cardId).removeClass('show');
    $deck.find('#' + click2.cardId).removeClass('show');
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

function startGameTimer() {
  var startTime = new Date().getTime();

  timerId = setInterval(function() {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - startTime;

    var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    timer = minutes + ':' + seconds;

    $timerControl.text(timer);
  }, 1000);
}

function stopGameTimer() {
  if (timerId !== undefined && timerId !== null) {
    clearInterval(timerId);
  } else {
    console.log(errors.lost_timer);
  }
}

function reset() {
  allCards = [];
  matches = 0;
  movesCount = 0;
  starRating = 3;
  click1 = {};
  click2 = {};
  isGameStarted = false;
  timer = '00:00';
  stopGameTimer();
  timerId = undefined;
}

function resetGameStats() {
  gameStats = {
    timer: null,
    movesCount: 0,
    starRating: 3
  };
}

function initializeTimer() {
  $timerControl.text(timer);
}

function updateMoves() {
  $moveControl.text(movesCount);
}

function getSeconds(time) {
  var _time = time.split(':');
  return (Number(_time[0]) * 60 + Number(_time[1])) || 1;
}

function getMoves() {
  return movesCount || 1;
}

function calculateStars(isMatch = false) {
  if (starRating <= 0.5) {
    starRating = 0.5;
    console.log('{}');
    return;
  } else {
    // Update starRating using current matches, timer, moves and currentLevel['starRatingDivider']
    var timeFactor = (currentLevel.minimumTimeInSec/getSeconds(timer)) * 60;
    var moveFactor = (currentLevel.minimumMoves/getMoves());
    var score = (timeFactor * moveFactor);
    console.log(JSON.stringify({
      'score': score,
      'divider': currentLevel.divider,
      'starRating': starRating,
      'future': score / currentLevel.divider,
      'timeF': timeFactor,
      'moveF': moveFactor,
      'isMatch': isMatch
    }, null, 2));
    starRating = (score / currentLevel.divider);
    if (isMatch) {
      starRating += 0.5;
    }
    if (starRating > 3) {
      starRating = 3;
    }
    if (starRating <= 0.5) {
      starRating = 0.5;
    }
    updateStars();
    return;
  }
}

function updateStars() {
  const li_full_star = '<li><i class="fa fa-star"></i></li>';
  const li_half_star = '<li><i class="fa fa-star-half"></i></li>';
  $starControl.empty();
  if (isFloat(starRating)) {
    for (var star = 0; star < starRating - 1; star ++) {
      $starControl.append(li_full_star);
    }
    if (isFloat(starRating)) {
      $starControl.append(li_half_star);
    }
  } else {
    for (var star = 0; star < starRating; star ++) {
      $starControl.append(li_full_star);
    }
  }
}

function generateStars(_starRating) {
  $starRatingControl.empty();
  const ul = '<ul class="stars"></ul>';
  $starRatingControl.append(ul);
  $starRatingListControl = $starRatingControl.find('.stars');
  const li_full_star = '<li><i class="fa fa-star"></i></li>';
  const li_half_star = '<li><i class="fa fa-star-half"></i></li>';
  $starRatingListControl.empty();
  if (isFloat(_starRating)) {
    for (var star = 0; star < _starRating - 1; star ++) {
      $starRatingListControl.append(li_full_star);
    }
    $starRatingListControl.append(li_half_star);
  } else {
    for (var star = 0; star < _starRating; star ++) {
      $starRatingListControl.append(li_full_star);
    }
  }
}

function gameCompleted() {
  // save timer and movesCount before resetting
  gameStats = {
    timer: timer,
    movesCount: movesCount,
    starRating: starRating
  };
  reset();
  generateStars(gameStats.starRating);
  $movesCounterControl.text(gameStats.movesCount);
  $completionTimeControl.text(gameStats.timer);
  $rightControl.click();
  hideAllExcept('slide3');
}
