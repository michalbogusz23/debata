document.addEventListener('DOMContentLoaded', () => {
    const candidates = [
        {id: "4" ,name: "Artur Bartosiewicz", image: "artur.png" }, // Niebieski
        {id: "5" ,name: "Magdalena Biejat", image: "biejat.png" }, // Jasnoniebieski
        {id: "6" ,name: "Grzegorz Braun", image: "braun.png" }, // Ciemnozielony
        {id: "7" ,name: "Szymon Hołownia", image: "hołownia.png" }, // Turkusowy
        {id: "8" ,name: "Marek Jakubiak", image: "jakubiak.png" }, // Zielony
        {id: "9" ,name: "Maciej Maciak", image: "maciak.png" }, // Żółty
        {id: "10", name: "Sławomir Mentzen", image: "mentzen.png" }, // Pomarańczowy
        {id: "11", name: "Karol Nawrocki", image: "nawrocki.png" }, // Czerwony
        {id: "12", name: "Joanna Senyszyn", image: "senyszyn.png" }, // Ciemnoczerwony
        {id: "13", name: "Jakub Stanowski", image: "stanowski.png" }, // Różowy
        { id: "1", name: "Rafał Trzaskowski", image: "trzaskowski.png" }, // Fioletowy
        { id: "2", name: "Marek Woch", image: "woch.png" }, // Ciemnofioletowy

        // Potencjalny kandydat niezależny lub innej formacji
        { id: "3", name: "Adrian Zandberg", image: "zandberg.png" } // Szary (przykład, można zmienić)
    ];


    // Elementy DOM
    const introScreen = document.getElementById('intro-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const candidatesContainer = document.getElementById('candidates-container');
    const currentPairNum = document.getElementById('current-pair-num');
    const totalPairsNum = document.getElementById('total-pairs-num');
    const resultsList = document.getElementById('results-list');
    const progressBarFill = document.getElementById('progress-bar-fill');

    let allPairs = [];
    let currentPairIndex = 0;
    let candidateScores = {}; // Kluczem będzie candidate.id

    // Funkcja do generowania wszystkich unikalnych par i ich mieszania
    function generatePairs(cands) {
        const pairs = [];
        for (let i = 0; i < cands.length; i++) {
            for (let j = i + 1; j < cands.length; j++) {
                pairs.push([cands[i], cands[j]]);
            }
        }
        return pairs.sort(() => Math.random() - 0.5);
    }

    // Funkcja do inicjalizacji punktów dla każdego kandydata
    function initializeScores(cands) {
        candidateScores = {};
        cands.forEach(cand => {
            candidateScores[cand.id] = 0; // Używamy id jako klucza
        });
    }

    function updateProgressBar() {
        if (allPairs.length === 0) {
            progressBarFill.style.width = '0%';
            progressBarFill.textContent = '';
            return;
        }
        const progressPercentage = (currentPairIndex / allPairs.length) * 100;
        progressBarFill.style.width = `${progressPercentage}%`;
        if (progressPercentage > 5) {
            progressBarFill.textContent = `${Math.round(progressPercentage)}%`;
        } else {
            progressBarFill.textContent = '';
        }
    }

    function displayPair() {
        if (currentPairIndex >= allPairs.length) {
            showResults();
            return;
        }

        const [cand1, cand2] = allPairs[currentPairIndex];
        candidatesContainer.innerHTML = '';

        candidatesContainer.appendChild(createCandidateCard(cand1));
        candidatesContainer.appendChild(createCandidateCard(cand2));

        currentPairNum.textContent = currentPairIndex + 1;
        totalPairsNum.textContent = allPairs.length;
    }

    function createCandidateCard(candidate) {
        const card = document.createElement('div');
        card.classList.add('candidate-card');
        card.innerHTML = `
            <img src="${candidate.image}" alt="Zdjęcie ${candidate.name}">
            <h3>${candidate.name}</h3>
        `;
        card.addEventListener('click', () => handleSelection(candidate));
        return card;
    }

    function handleSelection(chosenCandidate) {
        candidateScores[chosenCandidate.id]++; // Używamy id jako klucza
        currentPairIndex++;
        updateProgressBar();
        displayPair();
    }

    // ZMODYFIKOWANA FUNKCJA showResults
    function showResults() {
        gameScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        resultsList.innerHTML = '';

        if (progressBarFill) {
            progressBarFill.style.width = '100%';
            progressBarFill.textContent = '100%';
        }

        // Konwertuj obiekt wyników na tablicę i posortuj malejąco
        const sortedResults = Object.entries(candidateScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

        sortedResults.forEach(([candidateId, score]) => {
            // Znajdź oryginalny obiekt kandydata, aby uzyskać jego imię i obrazek
            const candidateData = candidates.find(c => c.id === candidateId);
            if (!candidateData) return; // Na wszelki wypadek, gdyby coś poszło nie tak

            const listItem = document.createElement('li');

            // Utwórz element img dla miniaturki
            const imgElement = document.createElement('img');
            imgElement.src = candidateData.image;
            imgElement.alt = `Miniaturka ${candidateData.name}`;
            imgElement.classList.add('result-candidate-img');

            // Utwórz elementy dla nazwy i wyniku
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('candidate-name');
            nameSpan.textContent = candidateData.name;

            const scoreSpan = document.createElement('span');
            scoreSpan.classList.add('candidate-score');
            scoreSpan.textContent = `${score} zwycięstw`;

            // Dodaj elementy do listItem
            listItem.appendChild(imgElement);
            listItem.appendChild(nameSpan);
            listItem.appendChild(scoreSpan);

            resultsList.appendChild(listItem);
        });
    }

    function startGame() {
        if (candidates.length < 2) {
            alert("Potrzeba co najmniej dwóch kandydatów, aby rozpocząć grę!");
            return;
        }

        // Dodanie unikalnych ID do kandydatów, jeśli ich nie mają (ważne dla kluczy w scores)
        // Upewniamy się, że każdy kandydat ma unikalne ID. Jeśli nie, można wygenerować.
        // W tym przykładzie zakładamy, że `id` jest już zdefiniowane w tablicy `candidates`.
        // Jeśli nie, można dodać:
        // candidates.forEach((cand, index) => {
        //     if (!cand.id) cand.id = `cand-${index}-${Math.random().toString(36).substr(2, 5)}`;
        // });

        introScreen.classList.add('hidden');
        resultsScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        currentPairIndex = 0;
        initializeScores(candidates); // Inicjalizuje wyniki używając ID
        allPairs = generatePairs(candidates);

        updateProgressBar();
        displayPair();
    }

    startGameBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', startGame);
});