let chessboardElement = document.getElementById('main-chessboard');
let populationElement = document.getElementById('population');

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

function applyGeneticAlgorithm() {
    clearBoard()
    let population = generateRandomPopulation(50, 8);
    let result = geneticAlgorithm(population, 0.8);
    let resultState = result[0];
    visualizeState(resultState);
}

function visualizeState(state) {
    let chessboardRows = chessboardElement.getElementsByClassName('chessboard-row');
    for (let i = 0; i < state.length; i++) {
        chessboardRows[state[i]].children[i].textContent = 'Q';
    }
}

createChessBoard(chessboardElement, 8);