const icons = [
    "🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🥝", "🥑"
];
let cardsInPlay = [];
let lockBoard = false;
let playerNames = [];
let currentPlayer = 0;
let moves = 0;
let matchCounts = [0, 0];
let totalPairs = icons.length;
let matchedPairs = 0;

// DOM elements
const userForm = document.getElementById('user-form');
const gameContainer = document.getElementById('game-container');
const playerTurn = document.getElementById('playerTurn');
const movesCount = document.getElementById('movesCount');
const board = document.getElementById('board');
const resultModal = document.getElementById('result-modal');
const resultDiv = document.getElementById('result');
const startGameBtn = document.getElementById('startGameBtn');
const restartBtn = document.getElementById('restartBtn');

startGameBtn.onclick = () => {
    const name1 = document.getElementById('player1').value.trim() || 'Player 1';
    const name2 = document.getElementById('player2').value.trim() || 'Player 2';
    playerNames = [name1, name2];
    startGame();
};

function startGame() {
    userForm.style.display = 'none';
    resultModal.style.display = 'none';
    gameContainer.style.display = 'block';
    currentPlayer = 0;
    moves = 0;
    matchCounts = [0, 0];
    matchedPairs = 0;
    updateInfo();
    // Generate board
    const iconSet = [...icons, ...icons]; // duplicate for pairs
    shuffle(iconSet);
    board.innerHTML = '';
    iconSet.forEach((icon, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.icon = icon;
        card.dataset.index = idx;
        card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${icon}</div>
      </div>
    `;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function updateInfo() {
    playerTurn.innerText = `Turn: ${playerNames[currentPlayer]}`;
    movesCount.innerText = `Moves: ${moves}`;
}

function flipCard(e) {
    if (lockBoard) return;
    const card = e.currentTarget;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    cardsInPlay.push(card);

    if (cardsInPlay.length === 2) {
        lockBoard = true;
        moves++;
        setTimeout(checkMatch, 900);
    }
}

function checkMatch() {
    const [card1, card2] = cardsInPlay;
    if (card1.dataset.icon === card2.dataset.icon) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchCounts[currentPlayer]++;
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            setTimeout(showResult, 400);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        // Switch to next player
        currentPlayer = (currentPlayer + 1) % 2;
    }
    cardsInPlay = [];
    lockBoard = false;
    updateInfo();
}

function showResult() {
    gameContainer.style.display = 'none';
    resultModal.style.display = 'block';
    let resultHtml = `<strong>Moves:</strong> ${moves}<br>`;
    resultHtml += `<strong>${playerNames} matches:</strong> ${matchCounts}<br>`;
    resultHtml += `<strong>${playerNames[18]} matches:</strong> ${matchCounts[18]}<br>`;
    if (matchCounts > matchCounts[18])
        resultHtml += `<h3>Winner: ${playerNames}</h3>`;
    else if (matchCounts[18] > matchCounts)
        resultHtml += `<h3>Winner: ${playerNames[18]}</h3>`;
    else
        resultHtml += `<h3>It's a tie!</h3>`;
    resultDiv.innerHTML = resultHtml;
}

restartBtn.onclick = restart;

function restart() {
    userForm.style.display = 'block';
    gameContainer.style.display = 'none';
    resultModal.style.display = 'none';
}

