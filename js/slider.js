var $slider = $('.slider');
var $slideBox = $slider.find('.slide-box');
var $leftControl = $slider.find('.slide-left');
var $rightControl = $slider.find('.slide-right');
var $easyControl = $slider.find('.easy');
var $mediumControl = $slider.find('.medium');
var $hardControl = $slider.find('.hard');
var $restartControl = $slider.find('.restart');
var $replayControl = $slider.find('.replay');
var $slides = $slider.find('.slide');
var numItems = $slider.find('.slide').length;
var position = 0;

var windowWidth = $(window).width();
$slides.width(windowWidth);
$leftControl.on('click', function () {
  var width = $slider.width();
  position = position - 1 >= 0 ? position - 1 : numItems - 1;
  if (position != numItems - 1) {
    $slider.find('.slide').eq(position + 1).css('margin-left', 0);
  } else {
    $slider.find('.slide:gt(0)').each(function (index) {
      $(this).css('margin-left', width * -1 + 'px');
    });
  }
});

$rightControl.on('click', function () {
  var width = $slider.width();
  position = position + 1 < numItems ? position + 1 : 0;
  if (position != 0) {
    $slider.find('.slide').eq(position).css('margin-left', width * -1 + 'px');
  } else {
    $slider.find('.slide').css('margin-left', 0);
  }
});

$(window).resize(function () {
  $slides.width($(window).width()).height($(window).height);
});

hideAllExcept = (className) => {
  $slides.each(function() {
    if (!$(this).hasClass(className)) {
      $(this).css('visibility', 'hidden');
    } else {
      // separate this from this loop for UI fixes
      $(this).css('visibility', 'visible');
    }
  });
}

$easyControl.on('click', function () {
  disableBtn(gameLevels.easy.class);
  $rightControl.click();
  initBoard(gameLevels.easy);
  hideAllExcept('slide2');
  setTimeout(()=>{enableBtn(gameLevels.easy.class)}, 1000);
});

$mediumControl.on('click', function () {
  disableBtn(gameLevels.medium.class);
  $rightControl.click();
  initBoard(gameLevels.medium);
  hideAllExcept('slide2');
  setTimeout(()=>{enableBtn(gameLevels.medium.class)}, 1000);
});

$hardControl.on('click', function () {
  disableBtn(gameLevels.hard.class);
  $rightControl.click();
  initBoard(gameLevels.hard);
  hideAllExcept('slide2');
  setTimeout(()=>{enableBtn(gameLevels.hard.class)}, 1000);
});

$restartControl.on('click', function () {
  disableBtn('restart');
  $leftControl.click();
  reset();
  hideAllExcept('slide1');
  setTimeout(()=>{enableBtn('restart')}, 1000);
});

$replayControl.on('click', function () {
  disableBtn('replay');
  $rightControl.click();
  resetGameStats();
  hideAllExcept('slide1');
  setTimeout(()=>{enableBtn('replay')}, 1000);
});

disableBtn = (className) => {
  $('.' + className).attr("disabled", "true");
}

enableBtn = (className) => {
  $('.' + className).removeAttr("disabled", "false");
}
