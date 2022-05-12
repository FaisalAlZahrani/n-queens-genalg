let chessboardElement = document.getElementById('main-chessboard');
let populationElement = document.getElementById('population');
let running = false;
let chessboardSize = 8;

createChessBoard(chessboardElement, 8);

function createChessBoard(parent, size=8) {
    for (let i = 0; i < size; i++) {
        let chessboardRow = document.createElement('div');
        chessboardRow.classList.add('chessboard-row');
        for (let j = 0; j < size; j++) {
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
        let [populationSize, mRate, iterations] = getInputs();
        let correct = checkInputs(populationSize, mRate, iterations);
        if (correct) {
            running = true;
            let initialPopulation = generateRandomPopulation(populationSize, chessboardSize);
            let result = await geneticAlgorithm(initialPopulation, mRate, iterations);
            let resultState = result[0];
            visualizeState(resultState);
            running = false;
        }
    }
    else {
        alert("The algorithm is currently running. If you want to reset, refresh the page, or wait for the algorithm to finish.");
    }
}

function getInputs() {
    let populationSize = Number(document.getElementById('population-field').value) ?? 0;
    let mRate = Number(document.getElementById('mutation-field').value) ?? 0;
    let iterations = Number(document.getElementById('iterations-field').value) ?? 0;
    return [populationSize, mRate, iterations];
}

function checkInputs(populationSize, mRate, iterations) {
    if (populationSize <= 0) {
        alert("Population size cannot be less than or equal to 0.");
        return false;
    }
    else if (populationSize > 1000) {
        alert("Population size should not be greater than 1000 due to slow runtime.");
        return false;
    }
    else if (mRate <= 0 || mRate > 1) {
        alert("Mutation rate should be between 0 and 1.");
        return false;
    }
    else if (iterations <= 0) {
        alert("Number of generations should be greater than zero.");
        return false;
    }
    else {
        return true;
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
        stateStatusElement.textContent = 'Status: Correct';
    }
    else {
        stateStatusElement.textContent = 'Status: Incorrect';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateChessboard() {
    if (!running) {
        chessboardSize = Number(document.getElementById('chessboard-field').value);
        chessboardElement.innerHTML = "";
        createChessBoard(chessboardElement, chessboardSize);
    }
}