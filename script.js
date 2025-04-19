const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let player1Hand = [];
let player2Hand = [];

// Create full deck
function createDeck() {
	deck = [];
	for (let suit of suits) {
		for (let value of values) {
			deck.push({ suit, value });
		}
	}
}

// Fisher-Yates Shuffle + Animation
function shuffleDeck() {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}

	playSound('shuffleSound');

	const deckDiv = document.getElementById('deck');
	deckDiv.classList.add('shuffle');

	setTimeout(() => {
		deckDiv.classList.remove('shuffle');
	}, 500); // Match with CSS animation time

	renderDeck();
	renderHands();
	enableButtons();
}

// Render deck (just the back of one card)
function renderDeck() {
	const deckDiv = document.getElementById('deck');
	deckDiv.innerHTML = '';
	if (deck.length > 0) {
		const backCard = createCardElement(null, true);
		deckDiv.appendChild(backCard);
	}
}

// Render player hands
function renderHands() {
	const p1Div = document.getElementById('player1');
	const p2Div = document.getElementById('player2');
	p1Div.innerHTML = '';
	p2Div.innerHTML = '';

	player1Hand.forEach(card => {
		const el = createCardElement(card);
		el.classList.add('flip-in');
		p1Div.appendChild(el);
	});
	player2Hand.forEach(card => {
		const el = createCardElement(card);
		el.classList.add('flip-in');
		p2Div.appendChild(el);
	});

	checkGameOver();
}

// Create card DOM
function createCardElement(card, isFaceDown = false) {
	const cardDiv = document.createElement('div');
	cardDiv.className = 'card';

	if (isFaceDown) {
		cardDiv.classList.add('back');
	} else {
		cardDiv.textContent = `${card.value}${card.suit}`;
		if (card.suit === '♥' || card.suit === '♦') {
			cardDiv.classList.add('red');
		}
	}

	return cardDiv;
}

// Deal one card to each
function dealCard() {
	if (deck.length < 2) return alert("Not enough cards!");

	player1Hand.push(deck.pop());
	player2Hand.push(deck.pop());

	renderHands();
	playSound('dealSound');
	renderDeck();
}

// War round
function playWar() {
	if (deck.length < 2) return alert("Not enough cards!");

	startCountdown(() => {
		const card1 = deck.pop();
		const card2 = deck.pop();

		const p1Div = document.getElementById('player1');
		const p2Div = document.getElementById('player2');
		p1Div.innerHTML = '';
		p2Div.innerHTML = '';

		p1Div.appendChild(createCardElement(card1));
		p2Div.appendChild(createCardElement(card2));

		const winner = compareCards(card1, card2);

		if (winner === 1) {
			triggerVictory('Player 1 wins this round!');
		} else if (winner === 2) {
			triggerVictory('Player 2 wins this round!');
		} else {
			alert('War! It’s a tie.');
		}

		renderDeck();
	});
}

// Compare cards based on value order
function compareCards(card1, card2) {
	const v1 = values.indexOf(card1.value);
	const v2 = values.indexOf(card2.value);
	if (v1 > v2) return 1;
	if (v2 > v1) return 2;
	return 0;
}

// Reset game
function resetDeck() {
	player1Hand = [];
	player2Hand = [];
	createDeck();
	renderHands();
	renderDeck();
	enableButtons();
}

// Victory banner
function triggerVictory(message) {
	const banner = document.getElementById('victory-animation');
	banner.textContent = `🎉 ${message} 🎉`;
	banner.classList.remove('hidden');
	playSound('winSound');

	setTimeout(() => {
		banner.classList.add('hidden');
	}, 2000);
}

// Sound
function playSound(id) {
	const sound = document.getElementById(id);
	if (sound) {
		sound.currentTime = 0;
		sound.play();
	}
}

// Countdown
function startCountdown(callback) {
	const countdown = document.getElementById('countdown');
	let count = 3;
	countdown.textContent = count;
	countdown.style.opacity = 1;
	countdown.classList.remove('hidden');

	const interval = setInterval(() => {
		count--;
		if (count === 0) {
			clearInterval(interval);
			countdown.classList.add('hidden');
			callback();
		} else {
			countdown.textContent = count;
		}
	}, 1000);
}

// Buttons
function disableButtons() {
	document.querySelector('button[onclick="dealCard()"]').disabled = true;
	document.querySelector('button[onclick="playWar()"]').disabled = true;
}

function enableButtons() {
	document.querySelector('button[onclick="dealCard()"]').disabled = false;
	document.querySelector('button[onclick="playWar()"]').disabled = false;
}

// Game over check
function checkGameOver() {
	if (deck.length === 0) {
		if (player1Hand.length > player2Hand.length) {
			alert("Game Over! Player 1 wins!");
		} else if (player2Hand.length > player1Hand.length) {
			alert("Game Over! Player 2 wins!");
		} else {
			alert("Game Over! It's a tie!");
		}
		disableButtons();
	}
}

// Init
createDeck();
renderDeck();
