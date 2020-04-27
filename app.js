document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div');
  const resultDisplay = document.querySelector('#result');
  let width = 15;
  let currentShooterIndex = 202;
  let currentInvadersIndex = 0;
  let alienInvadersTakenDown = [];
  let result = 0
  let direction = 1;
  let invaderId;

  //define the alien invaders
  const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
  ];

  // draw the alien invaders
  alienInvaders.forEach(invader => squares[currentInvadersIndex + invader].classList.add('invader'));

  // draw the shooter
  squares[currentShooterIndex].classList.add('shooter');

  // move the shooter along a line
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.key) {
      case "ArrowLeft":
        if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
        break;
      case "ArrowRight":
        if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
        break;
    }
    squares[currentShooterIndex].classList.add('shooter');
  }

  document.addEventListener('keydown', moveShooter);

  //move the alien invaders
  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
      direction = width;

    } else if (direction === width) {
      if (leftEdge) direction = 1;
      else direction = -1;
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      squares[alienInvaders[i]].classList.remove('invader');
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      alienInvaders[i] += direction;
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (!alienInvadersTakenDown.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader');
      }
    }

    //decide a game is over
    if (squares[currentShooterIndex].classList.contains('invader')) {
      resultDisplay.textContent = 'Game Over';
      squares[currentShooterIndex].classList.add('boom');
      clearInterval(invaderId);
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (alienInvaders[i] > (squares.length - (width - 1))) {
        resultDisplay.textContent = 'Game Over';
        clearInterval(invaderId)
      }
    }

    // decide a win
    if (alienInvadersTakenDown.length === alienInvaders.length) {
      resultDisplay.textContent = 'You Win';
      clearInterval(invaderId);
    }
  }
  invaderId = setInterval(moveInvaders, 500);

  // shoot at aliens
  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    // move the laser from the shooter to the alien invader
    function moveLaser() {
      squares[currentLaserIndex].classList.remove('laser');
      currentLaserIndex -= width;
      squares[currentLaserIndex].classList.add('laser');

      if (squares[currentLaserIndex].classList.contains('invader')) {
        squares[currentLaserIndex].classList.remove('laser');
        squares[currentLaserIndex].classList.remove('invader');
        squares[currentLaserIndex].classList.add('boom');

        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
        clearInterval(laserId);

        const alienTakeDown = alienInvaders.indexOf(currentLaserIndex);
        alienInvadersTakenDown.push(alienTakeDown);
        result++;
        resultDisplay.textContent = result;
      }

      if (currentLaserIndex < width) {
        clearInterval(laserId);
        setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
      }
    }

    /*document.addEventListener('keyup', e => {
      if (e.key === " ") {
        laserId = setInterval(moveLaser, 100);
      }
    });*/

    switch (e.key) {
      case " ":
        laserId = setInterval(moveLaser, 100);
        break;
    }
  }

  document.addEventListener('keyup', shoot);
});