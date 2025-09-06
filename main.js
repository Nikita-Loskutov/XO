document.addEventListener('DOMContentLoaded', () => {
    const CELL_COUNT = 9;
    const cells = Array.from(document.querySelectorAll('.cell'));
    const marks = { o: 'null.png', x: 'krest.png' };

    const scoreOel = document.getElementById('scoreO');
    const scoreXel = document.getElementById('scoreX');
    const resultDialog = document.getElementById('resultDialog');
    const resultText = document.getElementById('resultText');
    const turnIndicator = document.getElementById('turnIndicator');

    let board = Array(CELL_COUNT).fill(null);
    let currentPlayer = 'o';
    let gameActive = true;
    let scoreO = 0, scoreX = 0;


  function onCellClick(e){
    if (!gameActive) return;
        const btn = e.currentTarget;
        const idx = Number(btn.dataset.index);

    if (board[idx] !== null) return;
        board[idx] = currentPlayer;
        renderCell(btn, currentPlayer);
        const winner = checkWinner();

    if (winner){
        gameActive = false;
        if (winner === 'x'){
            scoreX++;
            scoreXel.textContent = scoreX;
            resultText.textContent = 'Победил Крестик!';
        } else {
            scoreO++;
            scoreOel.textContent = scoreO;
            resultText.textContent = 'Победил Нолик!';
        }
        showResult();
        return;
    }

    if (board.every(v => v !== null)){
        gameActive = false;
        resultText.textContent = 'Ничья!';
        showResult();
        return;
    }

    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    updateTurn();
    }

    function renderCell(button, player){
        const img = button.querySelector('img.mark');
        img.src = marks[player];
        img.alt = player === 'x' ? 'Крестик' : 'Нолик';
        img.style.visibility = 'visible';
    }

    function clearCell(button){
        const img = button.querySelector('img.mark');
        img.src = '';
        img.alt = '';
        img.style.visibility = 'hidden';
    }

    function checkWinner(){
        const patterns = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        for (const [a,b,c] of patterns){
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return null;
    }

    function showResult(){
        if (typeof resultDialog.showModal === 'function') resultDialog.showModal();
        else resultDialog.style.display = 'block';
    }

    function closeResult(){
        if (typeof resultDialog.close === 'function') resultDialog.close();
        else resultDialog.style.display = 'none';
    }

    function updateTurn(){
        turnIndicator.textContent = currentPlayer === 'o' ? 'Ход: Нолик' : 'Ход: Крестик';
    }

    function startNewGame(){
        board.fill(null);
        cells.forEach(clearCell);
        currentPlayer = 'o';   
        gameActive = true;
        updateTurn();
    }

    cells.forEach(cell => {
        cell.addEventListener('click', onCellClick);
        cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCellClick({ currentTarget: cell });
        }
        });
    });

    document.getElementById('playAgain').addEventListener('click', () => {
        closeResult();
        startNewGame();
    });

    document.getElementById('closeResult').addEventListener('click', () => {
        closeResult();
    });

    document.getElementById('clearScores').addEventListener('click', () => {
        scoreO = 0; scoreX = 0;
        scoreOel.textContent = '0';
        scoreXel.textContent = '0';
    });

    document.getElementById('restartButtonFooter').addEventListener('click', () => {
        startNewGame();
    });

    startNewGame();
});
