function fitness(state) {
    let nonAttacking = 0;
    for (let i = 0; i < state.length; i++) {
        let numberOfAttacks = 0;
        for (let j = 0; j < state.length; j++) {
            if (i != j && (state[i] == state[j] || (Math.abs(j - i) == Math.abs(state[i] - state[j])))) {
                numberOfAttacks++;
            }
        }
        nonAttacking += state.length - numberOfAttacks - 1;   
    }
    return nonAttacking / 2;
}

function isGoal(state) {
    let n = state.length;
    return (fitness(state) == (n * (n - 1) / 2) ? true : false);
}

function fitnessProbs(population) {
    let fitnessValues = [];
    let fitnessSum = 0;
    population.forEach(state => {
        let stateFitness = fitness(state);
        fitnessValues.push(stateFitness);
        fitnessSum += stateFitness;
    });

    let listOfProbs = [];
    fitnessValues.forEach(fitnessvalue => {
        listOfProbs.push(fitnessvalue / fitnessSum);
    });

    return listOfProbs;
}

function weightedRandom(list, probs) {
    let summedWeights = [];
    for (let i = 0; i < probs.length; i++) {
        summedWeights[i] = probs[i] + (probs[i - 1] || 0);
    }
    
    let random = Math.random() * summedWeights[summedWeights.length - 1];
    for (let i = 0; i < summedWeights.length; i++) {
        if (summedWeights[i] > random)
            return list[i];
    }
}

function selectParents(population, probs) {
    let parent1 = weightedRandom(population, probs);
    let parent2 = weightedRandom(population, probs);
    return [parent1, parent2];
}

function reproduce(parent1, parent2) {
    let n = parent1.length;
    let c = Math.floor(Math.random() * n);
    return parent1.slice(0, c).concat(parent2.slice(c));
}

function mutate(state, mRate=0.1) {
    let randomFloat = Math.random();
    if (randomFloat > mRate) {
        return state;
    }
    else {
        let n = state.length;
        let firstSample = Math.floor(Math.random() * n);
        let secondSample = Math.floor(Math.random() * n);
        let newState = Array.from(state);
        newState[firstSample] = secondSample;
        return newState;
    }
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

async function geneticAlgorithm(population, mRate=0.1, max_iters=10000) {
    let iterations = 0;
    while (true) {
        iterations++;
        let newPopulation = [];
        let probs = fitnessProbs(population);
        let state = []; // For visualization
        for (let i = 0; i < population.length; i++) {
            let parents = selectParents(population, probs);
            let individual = reproduce(parents[0], parents[1]);
            individual = mutate(individual, mRate=mRate);
            if (isGoal(individual)) {
                return [individual, iterations];
            }
            newPopulation.push(individual);
            state = individual; // For visualization
        }

        await sleep(0.2); // For visualization
        visualizeState(state); // For visualization
        updateGeneration(iterations); // For visualization

        population = newPopulation;
        if (iterations == max_iters) {
            probs = fitnessProbs(population);
            return [population[indexOfMax(probs)], iterations];
        }
    }
}

function testGeneticAlgorithm() {
    let randState = [4, 4, 0, 4, 5, 2, 5, 5];
    console.log(randState);
    console.log(fitness(randState));
    console.log(isGoal(randState));

    let goalState = [2,0,3,1];
    console.log(fitness(goalState));
    console.log(isGoal(goalState));
    console.log('_______________________________________________________________________');

    let population = [
        [2,6,3,0,3,5,0,4],
        [6,6,2,2,7,0,4,2],
        [7,1,2,4,7,4,0,6],
        [0,2,1,3,3,4,1,5],
        [6,6,2,5,7,7,6,2],
    ];
    console.log(population);
    let probs = [];
    population.forEach(state => {
        probs.push(fitness(state));
    });
    console.log(probs);
    let popProbs = fitnessProbs(population);
    console.log(popProbs);
    console.log('_______________________________________________________________________');

    let parents = selectParents(population, popProbs);
    let child = reproduce(parents[0], parents[1]);
    let mChild = mutate(child, 0.8);
    console.log(parents);
    console.log(child);
    console.log(mChild);
    console.log('_______________________________________________________________________');

    let result = geneticAlgorithm(population, 0.1, 100000);
    let bestIndividual = result[0];
    let numIters = result[1];
    console.log('Best individual: ', bestIndividual);
    console.log('Best individual fitness: ', fitness(bestIndividual));
    console.log('Best individual isGoal?: ', isGoal(bestIndividual));
    console.log('# iterations: ', numIters);
}