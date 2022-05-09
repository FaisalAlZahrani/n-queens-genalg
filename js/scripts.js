let chessboardElement = document.getElementById('main-chessboard');
let populationElement = document.getElementById('population');
let running = false;

function createChessBoard(parent, size=8) {
    for (let i = 0; i < size; i++) {
        let chessboardRow = document.createElement('div');
        chessboardRow.classList.add('chessboard-row');
        for (let j = 0; j < 8; j++) {
            let chessboardBlock = document.createElement('div');
            chessboardBlock.classList.add('chessboard-block');
            if ((i + j) % 2 != 0) {
                chessboardBlock.classList.add('offset-background');
            }
            chessboardRow.appendChild(chessboardBlock);
        }
        parent.appendChild(chessboardRow);
    }
    return parent;
}

function clearBoard() {
    let chessboardBlocks = document.getElementsByClassName('chessboard-block');
    for (let i = 0; i < chessboardBlocks.length; i++) {
        chessboardBlocks[i].textContent = '';
    }
}

function generateRandomState(size=8) {
    let state = [];
    for (let i = 0; i < size; i++) {
        state.push(Math.floor(Math.random() * size));     
    }
    return state;
}

function generateRandomPopulation(populationSize=5, stateSize=8) {
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        population.push(generateRandomState(stateSize));        
    }
    return population;
}

async function applyGeneticAlgorithm() {
    if (!running) {
        running = true
        let mRate = Number(document.getElementById('mutation-field').value);
        let iterations = Number(document.getElementById('iterations-field').value);
        let population = generateRandomPopulation(50, 8);
        let result = await geneticAlgorithm(population, mRate, iterations);
        let resultState = result[0];
        visualizeState(resultState);
        running = false
    }
    else {
        alert("The algorithm is currently running.")
    }
}

function visualizeState(state) {
    clearBoard();
    let chessboardRows = chessboardElement.getElementsByClassName('chessboard-row');
    for (let i = 0; i < state.length; i++) {
        chessboardRows[state[i]].children[i].textContent = 'Q';
    }
    updateStatus(state);
}

function updateGeneration(number) {
    let generationCountElement = document.getElementById('generation-count');
    generationCountElement.textContent = 'Generation: ' + number;
}

function updateStatus(state) {
    let stateStatusElement = document.getElementById('state-status');
    if (isGoal(state)) {
        stateStatusElement.textContent = 'State Status: Correct';
    }
    else {
        stateStatusElement.textContent = 'State Status: Incorrect';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

createChessBoard(chessboardElement, 8);