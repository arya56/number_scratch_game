function addCanvas(i, reset) {
  'use strict';
  let index = i;
  var loopOnce = 0;
  var isDrawing, lastPoint;
  canvas = Object.assign(document.createElement('canvas'), {
    className: 'canvas',
    id: `js-canvas${i}`,
    width: '70',
    height: '70',
  });
  document.getElementById(`js-container${i}`).appendChild(canvas);
  var container = document.getElementById(`js-container${i}`),
    canvas = document.getElementById(`js-canvas${i}`),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    ctx = canvas.getContext('2d'),
    image = new Image(),
    brush = new Image();

  image.src = 'images/silver.jpg';
  image.onload = function () {
    ctx.drawImage(image, 0, 0);
    // Show the form when Image is loaded.
  };

  brush.src = 'images/coin2.jpeg';

  canvas.addEventListener('mousedown', handleMouseDown, false);
  canvas.addEventListener('touchstart', handleMouseDown, false);
  canvas.addEventListener('mousemove', handleMouseMove, false);
  canvas.addEventListener('touchmove', handleMouseMove, false);
  canvas.addEventListener('mouseup', handleMouseUp, false);
  canvas.addEventListener('touchend', handleMouseUp, false);

  function distanceBetween(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  function angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  }

  // Only test every `stride` pixel. `stride`x faster,
  // but might lead to inaccuracy
  function getFilledInPixels(stride) {
    if (!stride || stride < 1) {
      stride = 1;
    }

    var pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
      pdata = pixels.data,
      l = pdata.length,
      total = l / stride,
      count = 0;

    // Iterate over all pixels
    for (var i = (count = 0); i < l; i += stride) {
      if (parseInt(pdata[i]) === 0) {
        count++;
      }
    }

    return Math.round((count / total) * 100);
  }

  function getMouse(e, canvas) {
    var offsetX = 0,
      offsetY = 0,
      mx,
      my;

    if (canvas.offsetParent !== undefined) {
      do {
        offsetX += canvas.offsetLeft;
        offsetY += canvas.offsetTop;
      } while ((canvas = canvas.offsetParent));
    }

    mx = (e.pageX || e.touches[0].clientX) - offsetX;
    my = (e.pageY || e.touches[0].clientY) - offsetY;

    return { x: mx, y: my };
  }

  function handlePercentage(filledInPixels) {
    filledInPixels = filledInPixels || 0;
    console.log(filledInPixels + '%');

    if (filledInPixels > 10) {
      if (!reset.includes(index)) {
        reset.push(index);
      }
      canvas.parentNode.removeChild(canvas);
    }
  }

  function handleMouseDown(e) {
    isDrawing = true;
    lastPoint = getMouse(e, canvas);
  }

  function handleMouseMove(e) {
    if (!isDrawing) {
      return;
    }
    if (reset.length === 8 && state.counter === 0) {
      if (!loopOnce) {
        handleFinalTry();
      }
      loopOnce++;
    }

    e.preventDefault();

    var currentPoint = getMouse(e, canvas),
      dist = distanceBetween(lastPoint, currentPoint),
      angle = angleBetween(lastPoint, currentPoint),
      x,
      y;

    for (var i = 0; i < dist; i++) {
      x = lastPoint.x + Math.sin(angle) * i - 25;
      y = lastPoint.y + Math.cos(angle) * i - 25;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(brush, x, y);
    }

    lastPoint = currentPoint;
    handlePercentage(getFilledInPixels(32));
  }

  function handleMouseUp(e) {
    isDrawing = false;
  }
}
// end of addCanvas

const handleFinalTry = () => {
  alertPrompt('congrats', 'Bingoo');
  displayWinnerNumbers();
  setTimeout(function () {
    popupCreator(`<div class="last_pop">
    <h1 class="y_won">CONGRATULATIONS, YOU WON!!</h1>
    <div class="div_750">
        <h2>$750 + 200 FREE SPINS</h2>
    </div>
    <p id="youAre">You are winner number 1 out of 201 players today!</p>
    <form action="https://vitamediagroup.com" method="get"> <label>Sign up to collect your
            winnings</label><input type="text" name="first_name" placeholder="Name" required="">
        <input type="tel" size="8" pattern="[1-9]{1}[0-9]{7}" name="phone" placeholder="Mobile" required="">
        <input type="email" name="email" placeholder="Email" required="">
        <button type="submit">Sign up</button>
    </form>
    </div>`);
  }, 2000);
};
function multiCanvas() {
  // alertPrompt('', '');
  // remove here was just 2 test
  let reset = [];
  for (let i = 1; i <= 9; i++) {
    addCanvas(i, reset);
  }
}

function scratchHanddler(numberGenerator, winnerGenerator) {
  //alertPrompt('', '');
  console.log('Scratch handdler', winnerGenerator);
  state.decrement();
  const attempts = document.getElementById('attempts_left');
  attempts.innerHTML = 'Scrach Cards Left:';
  scratch.innerHTML = 'Try Again';
  if (numberGenerator && winnerGenerator) {
    winnerGenerator();
    numberGenerator();
  } else {
    numberGenerator();
  }
  multiCanvas();
  showAttempt();
}

const displayWinnerNumbers = () => {
  const title2 = document.getElementById('winner_title');
  const winNumbers = document.getElementById('winner_text');
  title2.style.visibility = 'visible';
  winNumbers.style.visibility = 'visible';
};

const numbersCreator = () => {
  const numbers = [];
  const randomNumbers = randomGenerator(9);
  for (let i = 0; i < 9; i++) {
    numbers[i] = document.getElementById(`num_${i}`);
    numbers[i].innerHTML = randomNumbers[i];
  }
};

// create unique numbers[n]
const randomGenerator = total => {
  const randomNumbers = [];
  while (randomNumbers.length < total) {
    const random = Math.floor(Math.random() * 98) + 1;
    if (randomNumbers.indexOf(random) === -1) randomNumbers.push(random);
  }
  return randomNumbers;
};
// create also winner numbers for first 2 try
const winnerNumberCreator = () => {
  const numbers = [];
  const randomNumbers = randomGenerator(5);
  for (let i = 0; i < 5; i++) {
    numbers[i] = document.getElementById(`win_${i}`);
    numbers[i].innerHTML = randomNumbers[i];
  }
  return randomNumbers;
  // numbers.forEach(e => console.log(e.innerHTML));
};

const createWNumbers4LastTry = () => {
  const numbers = [];
  const randomRest = randomGenerator(9);
  const lastRandom = winnerNumberCreator();
  console.log('are u here?');
  for (let i = 0; i < 5; i++) {
    numbers[i] = document.getElementById(`num_${i}`);
    numbers[i].innerHTML = lastRandom[i];
  }
  for (let i = 5; i < 9; i++) {
    numbers[i] = document.getElementById(`num_${i}`);
    numbers[i].innerHTML = randomRest[i];
  }
};

function showAttempt() {
  let attemptCounter = document.getElementById('attempt_num');
  attemptCounter.innerText = state.counter;
}
const alertPrompt = (text, alert) => {
  const textBox = document.getElementById('text_here');
  textBox.style.visibility = 'visible';
  const title = document.getElementById('title');
  const promptText = document.getElementById('p_text');
  title.innerHTML = text;
  promptText.innerHTML = alert;
};

//                Main popcreator
const popupCreator = content => {
  state.increment();
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.classList.toggle('overlay');
  overlay.style.display = 'block';
  const popBox = document.createElement('div');
  popBox.classList.toggle('popup-onload');
  popBox.style.display = 'block';
  popBox.innerHTML = content;
  overlay.appendChild(popBox);
  document.body.appendChild(overlay);
  const button = content.includes('closer')
    ? document.getElementById('closer')
    : undefined;
  button?.addEventListener('click', function () {
    overlay.style.display = 'none';
    popBox.style.display = 'none';
  });
  console.log(overlay);
};

(function main() {
  state = {
    counter: 2,
    decrement: () => {
      setState(() => state.counter--);
    },
    guestNumber: 0,
    increment: () => {
      setState(() => state.guestNumber++);
    },
  };
  const setState = callback => {
    callback();
  };
  winnerNumberCreator();
  numbersCreator();

  window.addEventListener(
    'load',
    function () {
      popupCreator(`<div class="first_pop">
      <img src="images/coin-animation.gif"  alt="The Coin" class="spin_coin">
      <p>YOU HAVE 3 FREE SPINS</p>
      <button class="close" id="closer">START NOW!</button>
    </div>`);
    },
    false
  );
  ///  show number of try first time
  showAttempt();
  multiCanvas();
  // Handle 3 scratch & display alert if scratch hasn't down yet
  const clickHandler = () => {
    let hasMask = true;
    const refreshCanvas = document.getElementById('refresh');
    if (refreshCanvas.innerHTML.includes('<canvas')) {
      hasMask = false;
    }
    if (!hasMask) {
      alertPrompt('Alert', 'Please Scratch All Numbers');
      return;
    }

    switch (state.counter) {
      case 1:
        scratchHanddler(createWNumbers4LastTry);
        break;
      case 2:
        scratchHanddler(numbersCreator, winnerNumberCreator);
        break;
      case 0:
        // showAttempt(0);
        // alertPrompt('congrats', 'Bingoo');
        break;
      default:
        break;
    }
  };

  const scratch = document.getElementById('scratch');
  scratch.addEventListener('click', clickHandler, false);
})();
