let blackjackGame = {
  user: { scoreSpan: "#user-round-result", div: "#user-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-round-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStanding: false,
  turnsOver: false,
};

// declaring constants


const USER = blackjackGame["user"];
const DEALER = blackjackGame["dealer"];

const hitSound = new Audio("../sounds/swish.m4a");
const winningSound = new Audio("../sounds/cash.mp3");
const losingSound = new Audio("../sounds/aww.mp3");


/// hit button functionality


const hit = () => {
  if (blackjackGame["isStanding"] === false) {
    let card = randomCard();
    console.log(card);
    showCard(card, USER);
    updateScore(card, USER);
    showScore(USER);
  }
};
// image of the cards logic


const showCard = (card, activePlayer) => {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `../image/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
};

// deal button functionality


const deal = () => {
  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isStanding"] = false;
    let yourImages = document
      .querySelector("#user-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    USER["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector("#user-round-result").textContent = 0;
    document.querySelector("#dealer-round-result").textContent = 0;
    document.querySelector("#user-round-result").style.color = "#ffffff";
    document.querySelector("#dealer-round-result").style.color = "#ffffff";
    document.querySelector("#result-message").textContent = "Play now";
    document.querySelector("#result-message").style.color = "black";
    blackjackGame["turnsOver"] = true;
  }
};

// choosing random card each time

const randomCard = () => {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
};

// updating the score of both players

const updateScore = (card, activePlayer) => {
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
};


// showing the updated score 


const showScore = (activePlayer) => {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "#e50914";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
};


// the logic behind the bot

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bot() {
  blackjackGame["isStanding"] = true;

  while (DEALER["score"] < 16 && blackjackGame["isStanding"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await delay(1000);
  }

  blackjackGame["turnsOver"] = true;
  let winner = calcWinner();
  showResult(winner);
};


//   Events



document
  .querySelector("#hit-button")
  .addEventListener("click", hit);
document
  .querySelector("#deal-button")
  .addEventListener("click", deal);
document
  .querySelector("#stand-button")
  .addEventListener("click", bot);

// compare scores and return the winner of the round and update the table

const calcWinner = () => {
  let winner;
  if (USER["score"] <= 21) {
    if (USER["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]+= 1;
      winner = USER;
    } else if (USER["score"] < DEALER["score"]) {
      blackjackGame["losses"]+= 1;
      winner = DEALER;
    } else if (USER["score"] === DEALER["score"]) {
      blackjackGame["draws"]+= 1;
    }
  } else if (USER["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["losses"]+= 1;
    winner = DEALER;
  } else if (USER["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["draws"]+= 1;
  }
  return winner;
};


// showing the result and adding to the table



const showResult = (winner) => {
  let message, messageColor;

  if (blackjackGame["turnsOver"] === true) {
    if (winner === USER) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "winner winner chicken dinner";
      messageColor = "green";
      winningSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "You Lost go get your revenge";
      messageColor = "red";
      losingSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "Draw is not in your Dictionary i suppose";
      messageColor = "black";
    }

    document.querySelector("#result-message").textContent = message;
    document.querySelector("#result-message").style.color = messageColor;
  }
};

/// toggle functionality

const toggler = document.querySelector(".navbar-toggler");
const navbarMenu = document.querySelector(".navbar ul");
const navbarLinks = document.querySelectorAll(".navbar a");

toggler.addEventListener("click", togglerClick);

function togglerClick() {
  toggler.classList.toggle("open-navbar-toggler");
  navbarMenu.classList.toggle("open");
}



for(let i=0; i<navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", navbarLinkClick);
}

function navbarLinkClick(event) {

  smoothScroll(event); 

  if(navbarMenu.classList.contains("open")) {
    toggler.click();
  }

}

// Smooth-Scrolling


function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute("href")==="#" ? "header" : event.currentTarget.getAttribute("href");
  const targetPosition = document.querySelector(targetId).offsetTop;
  const startingPosition = window.pageYOffset;
  const distance = targetPosition - startingPosition;
  const duration = 1500;
  let start = null;
  
  window.requestAnimationFrame(jump);

  function jump(timeframe) {
    if (!start) start = timeframe;
    const progress = timeframe - start;
    window.scrollTo(0, easeInOutCubic(progress, startingPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(jump);
  }
}

// Easing Functions

function linear(t, b, c, d) {
	return c*t/d + b;
};

function easeInOutQuad(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

function easeInOutCubic(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};



