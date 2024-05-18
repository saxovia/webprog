let score = 0;

timeremaining = 28;
let elapsedtimeseason = 1;
let currenttile = "";
let season = "0";
const questtypes = ['A', 'B', 'C', 'D'];
let matrix = [];
let endgame = false;
let springpoints = 0;
let summerpoints = 0;
let autumnpoints = 0;
let winterpoints = 0;
let gameIsInSession = false;
const water = {
    src: './tiles/water_tile.png'
};
const forest = {
    src: './tiles/forest_tile.png',
};
const village = {
    src: './tiles/village_tile.png',
};
const plains = {
    src: './tiles/plains_tile.png',
};
const mountain = {
    src: './tiles/mountain_tile.png',
};

let missions =
{
    "basic": [
        {
            "title": "Az erdő széle",
            "description": "A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz.",
            "src": "url(./missions_hun/azerdo.png)"
        },
        {
            "title": "Álmos-völgy",
            "description": "Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz.",
            "src": "url(./missions_hun/almos.png)"
        },
        {
            "title": "Krumpliöntözés",
            "description": "A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz.",
            "src": "url(./missions_hun/krumpli.png)"
        },
        {
            "title": "Határvidék",
            "description": "Minden teli sorért vagy oszlopért 6-6 pontot kapsz.",
            "src": "url(./missions_hun/hatar.png)"
        },
        {
            "title": "Fasor",
            "description": "A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz. Két azonos hosszúságú esetén csak az egyikért.",
            "src": "url(./missions_hun/fasor.png)"
        },
        {
            "title": "Gazdag város",
            "description": "A legalább három különböző tereptípussal szomszédos falurégióidért három-három pontot kapsz.",
            "src": "url(./missions_hun/gazdagvaros.png)"
        },
        {
            "title": "Öntözőcsatorna",
            "description": "Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz. Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.",
            "src": "url(./missions_hun/ontozes.png)"
        },
        {
            "title": "Mágusok völgye",
            "description": "A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.",
            "src": "url(./missions_hun/magusok.png)"
        },
        {
            "title": "Üres telek",
            "description": "A városmezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.",
            "src": "url(./missions_hun/ures.png)"
        },
        {
            "title": "Sorház",
            "description": "A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz.",
            "src": "url(./missions_hun/sorhaz.png)"
        },
        {
            "title": "Páratlan silók",
            "description": "Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.",
            "src": "url(./missions_hun/paratlan.png)"
        },
        {
            "title": "Gazdag vidék",
            "description": "Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz.",
            "src": "url(./missions_hun/gazdagvidek.png)"
        }
    ]
}
for (let i = 0; i < 11; i++) {
    let row = [];
    for (let j = 0; j < 11; j++) {
        row.push("none");
    }
    matrix.push(row);
}

function findByType(typestring) {
    if (typestring === "water") { return water.src; }
    else if (typestring === "forest") { return forest.src; }
    else if (typestring === "village" || typestring === "town") { return village.src; }
    else if (typestring === "plains" || typestring === "farm") { return plains.src; }
    else if (typestring === "mountain") { return mountain.src; }
    else { return './tiles/base_tile.png'; }
}

function updateCell(rowtofind, coltofind, updateby) {
    //checks and finds the cell in the html, updates it
    let found = false;
    for (let i = 0; i < 12; i++) {
        if (i === rowtofind) {
            for (let j = 0; j < 12; j++) {
                if (j === coltofind) {
                    let id = "cell-" + rowtofind + "-" + coltofind;
                    let el = document.getElementById(id);
                    el.style.backgroundImage = "url(" + findByType(updateby) + ")";
                    matrix[i - 1][j - 1] = updateby;
                    found = true;
                    break;
                }
            }
        }
        if (found) { break; }
    }
}

function updateTileCell(mat) {
    //checks and finds the cell in the html, updates it
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            if (mat.shape[i][j] == 1) {
                k = i + 1;
                l = j + 1;

                let id = "cellimg-" + k + "-" + l;
                let el = document.getElementById(id);
                el.style.backgroundImage = "url(" + findByType(mat.type) + ")";
            }
            else {
                k = i + 1;
                l = j + 1;
                let id = "cellimg-" + k + "-" + l;
                let el = document.getElementById(id);
                el.style.backgroundImage = "url(" + "./tiles/base_tile.png" + ")";
            }
        }
    }
}

//tile cells are for the smaller matrix
function rotateMatrix(mat) {
    let result = [];
    for (let i = 0; i < 3; i++) {
        result[i] = [];
        for (let j = 0; j < 3; j++) {
            result[i][j] = mat.shape[3 - j - 1][i];
        }
    }
    if (mat.rotation === 3) {
        mat.rotation = 0;
    } else { mat.rotation++; }
    mat.shape = result;
    updateTileCell(mat);

}
function mirrorMatrix(mat) {
    let result = [];

    for (let i = 0; i < mat.shape.length; i++) {
        result[i] = [];
        for (let j = 0; j < mat.shape[i].length; j++) {
            if (j === 0) {
                result[i][j] = mat.shape[i][2];
            } else if (j === 2) {
                result[i][j] = mat.shape[i][0];
            } else {
                result[i][j] = mat.shape[i][j];
            }
        }
    }
    if (mat.mirrored) { mat.mirrored = true; }
    else { mat.mirrored = false; }
    mat.shape = result;
    updateTileCell(mat);
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//predefined mountains
updateCell(2, 2, "mountain");
updateCell(4, 9, "mountain");
updateCell(6, 4, "mountain");
updateCell(9, 10, "mountain");
updateCell(10, 6, "mountain");
occupiedtiles = [[2, 2, "mountain"], [4, 9, "mountain"], [6, 4, "mountain"], [9, 10, "mountain"], [10, 6, "mountain"]];
let elements = [
    {
        time: 2,
        type: 'water',
        shape: [[1, 1, 1],
        [0, 0, 0],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'town',
        shape: [[1, 1, 1],
        [0, 0, 0],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1, 1, 1],
        [0, 0, 1],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1, 1, 1],
        [0, 0, 1],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'town',
        shape: [[1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'town',
        shape: [[1, 1, 0],
        [1, 0, 0],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'town',
        shape: [[1, 1, 1],
        [1, 1, 0],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'farm',
        shape: [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'farm',
        shape: [[0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'water',
        shape: [[1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'water',
        shape: [[1, 0, 0],
        [1, 1, 1],
        [1, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 1]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'water',
        shape: [[1, 1, 0],
        [1, 1, 0],
        [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },

]
let index = 0;


function assignMission(arr) {
    let assignedData = [];
    for (let i = 0; i < 4; i++) {
        if (questtypes.length === 0) {
            questtypes.push('A', 'B', 'C', 'D');
        }
        const randomIndex = Math.floor(Math.random() * questtypes.length);
        const selectedData = questtypes.splice(randomIndex, 1)[0];
        const questId = `quest${i + 1}`;
        arr[i].data = selectedData;
        arr[i].id = questId;
        arr[i].point = 0;
        assignedData.push(selectedData);
    }

    return arr;
}

let chosenMissions = {


}
function start() {
    if (localStorage.getItem("saveSessionStatus") === null) {
        gameIsInSession = true;
        shuffleArray(missions.basic);
        assignMission(missions.basic);
        shuffleArray(elements);
        updateTileCell(elements[index]);
        document.getElementById('currentSeason').textContent = season;
        document.getElementById('timeCost').textContent = elements[index].time;
        initQuest();
        updateSeason();

    }
    else {
        matrix = JSON.parse(localStorage.getItem('saveMatrix'));
        season = localStorage.getItem("saveSeason");
        points = parseInt(localStorage.getItem("savePoints"));
        elapsedtimeseason = parseInt(localStorage.getItem("saveSeasonTime"));
        missions = JSON.parse(localStorage.getItem('saveQuests'));
        index = localStorage.getItem("saveIndex");
        elements = JSON.parse(localStorage.getItem('saveElements'));
        timeremaining = parseInt(localStorage.getItem("saveTimeRemaining"));
        springpoints = parseInt(localStorage.getItem("saveSpring"));
        summerpoints = parseInt(localStorage.getItem("saveSummer"));
        autumnpoints = parseInt(localStorage.getItem("saveAutumn"));
        winterpoints = parseInt(localStorage.getItem("saveWinter"));
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                updateCell(i + 1, j + 1, matrix[i][j]);
            }
        }
        document.getElementById('currentSeason').textContent = season;
        updateTileCell(elements[index]);
        initQuest();

        document.getElementById('timeremainingseason').textContent = elapsedtimeseason;

        document.getElementById('showpoints').textContent = "Összesen: " + points;
        updateTileCell(elements[index]);
        document.getElementById('timeCost').textContent = elements[index].time;
        document.getElementById('spring-point').textContent = springpoints;
        document.getElementById('summer-point').textContent = summerpoints;
        document.getElementById('autumn-point').textContent = autumnpoints;
        document.getElementById('winter-point').textContent = winterpoints;
        if (season === "Spring (AB)") {
            highlightQuest('A', 'B');
        }
        else if (season === "Summer (BC)") {
            highlightQuest('B', 'C');
        }
        else if (season === "Autumn (CD)") {
            highlightQuest('C', 'D')
        }
        else {
            highlightQuest('A', 'D');
        }
    }
}

let points = 0;
function gameLoop() {
    if (!endgame) {

        elapsedtimeseason += elements[index].time;
        timeremaining -= elements[index].time;
        document.getElementById('timeremainingseason').textContent = elapsedtimeseason;

        if (elapsedtimeseason >= 7) {
            elapsedtimeseason = elapsedtimeseason % 7;
            updateSeason();
            points = springpoints + summerpoints + autumnpoints + winterpoints;
            document.getElementById('showpoints').textContent = "Összesen: " + points;
        }
        localStorage.setItem("saveMatrix", JSON.stringify(matrix));
        localStorage.setItem("saveSeason", season);
        localStorage.setItem("savePoints", points);
        localStorage.setItem('saveQuests', JSON.stringify(missions));
        localStorage.setItem("saveSessionStatus", gameIsInSession);

        localStorage.setItem("saveSpring", springpoints);
        localStorage.setItem("saveSummer", summerpoints);
        localStorage.setItem("saveAutumn", autumnpoints);
        localStorage.setItem("saveWinter", winterpoints);
        localStorage.setItem("saveElements", JSON.stringify(elements));
        localStorage.setItem("saveTimeRemaining", timeremaining);
        localStorage.setItem("saveSeasonTime", elapsedtimeseason);
        checkIfGameEnded();
        index++;
        updateTileCell(elements[index]);
        localStorage.setItem("saveIndex", index);
        document.getElementById('timeCost').textContent = elements[index].time;

    }

}
function checkIfGameEnded() {
    if (timeremaining <= 1) {
        elements.push({
            time: 0,
            type: 'none',
            shape: [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        })
        points += checkIfMountainCornered();
        endgame = true;
        localStorage.clear();
        document.getElementById('showpoints').textContent = "Your total points: " + points;
    }
}
function initQuest() {

    let questtemp = "";

    for (let i = 0; i < 4; i++) {
        let temp = 'quest' + (i + 1);
        document.getElementById(temp).style.backgroundImage = missions.basic[i].src;
        document.getElementById(temp).textContent = missions.basic[i].data;
        let temp2 = missions.basic[i].id + "time";
        document.getElementById(temp2).textContent = missions.basic[i].point;
    }

}

function updateSeason() {
    if (season === "0") {
        season = "Spring (AB)";
        highlightQuest('A', 'B');
    }
    else if (season === "Spring (AB)") {
        season = "Summer (BC)";
        springpoints += checkPoints('A', 'B');
        highlightQuest('B', 'C');
        document.getElementById('spring-point').textContent = springpoints;
    }
    else if (season === "Summer (BC)") {
        season = "Autumn (CD)";
        summerpoints += checkPoints('B', 'C');
        highlightQuest('C', 'D')
        document.getElementById('summer-point').textContent = summerpoints;
    }
    else if (season === "Autumn (CD)") {
        season = "Winter (DA)";
        highlightQuest('D', 'A')
        autumnpoints += checkPoints('C', 'D');
        document.getElementById('autumn-point').textContent = autumnpoints;
    }
    else {
        winterpoints += checkPoints('D', 'A');
        document.getElementById('winter-point').textContent = winterpoints;
    }
    document.getElementById('currentSeason').textContent = season;
}
function highlightQuest(a, b) {
    storedindexone = 0;
    storedindextwo = 0;
    let el = document.querySelectorAll('.quest-cell');
    el.forEach(e => {
        e.style.border = '4px solid white';
    });
    missions.basic.forEach(mission => {
        if (mission.data === a || mission.data === b) {
            document.getElementById(mission.id).style.border = "4px solid #75a2eb";
        }
    });

}
function checkPoints(firstquest, secondquest) {
    point = 0;
    if (firstquest === 'A' || secondquest === 'A') {
        missions.basic.forEach(mission => {
            if (mission.data === 'A') {
                point += checkQuest(mission.title, mission);
            }
        });
    }
    if (firstquest === 'B' || secondquest === 'B') {
        missions.basic.forEach(mission => {
            if (mission.data === 'B') {
                point += checkQuest(mission.title, mission);
            }
        });
    }
    if (firstquest === 'C' || secondquest === 'C') {
        missions.basic.forEach(mission => {
            if (mission.data === 'C') {
                point += checkQuest(mission.title, mission);
            }
        });
    }
    if (firstquest === 'D' || secondquest === 'D') {
        missions.basic.forEach(mission => {
            if (mission.data === 'D') {
                point += checkQuest(mission.title, mission);
            }
        });
    }
    return point;



}
function checkIfMountainCornered() {
    let p = 0;
    for (let i = 1; i < matrix.length - 1; i++) {
        for (let j = 1; j < matrix[i].length - 1; j++) {
            if (matrix[i][j] === "mountain" && (matrix[i - 1][j] !== "none" && matrix[i + 1][j] !== "none"
                && matrix[i][j - 1] !== "none" && matrix[i][j + 1] !== "none")) {
                p++;
            }
        }
    }
    return p;
}
function checkQuest(questname, mis) {
    let p = 0;
    if (questname === "Határvidék") {
        for (let i = 0; i < matrix.length; i++) {
            let numoffull = 0;

            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] !== "none") {
                    numoffull++;
                }
            }

            if (numoffull === matrix[i].length) {
                p += 6;
            }
        }
        for (let j = 0; j < matrix[0].length; j++) {
            let numoffull = 0;

            for (let i = 0; i < matrix.length; i++) {
                if (matrix[i][j] !== "none") {
                    numoffull++;
                }
            }

            if (numoffull === matrix.length) {
                p += 6;
            }
        }
    }
    else if (questname === "Az erdő széle") {

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === "forest") {
                    if (i === 0 || i === matrix.length - 1 || j === 0 || j === matrix[i].length - 1) {
                        p += 1;
                    }
                }
            }
        }
    }
    else if (questname === "Álmos-völgy") {
        for (let i = 0; i < matrix.length; i++) {

            let numforest = 0;
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === "forest") {
                    numforest++;
                }
            }

            if (numforest === 3) {
                p += 4;
            }
        }
    }
    else if (questname === "Krumpliöntözés") {
        const numRows = matrix.length;
        const numCols = matrix[0].length;
        let uniqueIndices = [];

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (matrix[i][j] === "farm") {
                    if (i + 1 < numRows && matrix[i + 1][j] === "water" && !containsIndex(uniqueIndices, i + 1, j)) {
                        console.log(i + 2, j + 1);
                        uniqueIndices.push([i + 1, j]);
                    }
                    if (j + 1 < numCols && matrix[i][j + 1] === "water" && !containsIndex(uniqueIndices, i, j + 1)) {
                        console.log(i + 1, j + 2);
                        uniqueIndices.push([i, j + 1]);
                    }
                    if (j - 1 >= 0 && matrix[i][j - 1] === "water" && !containsIndex(uniqueIndices, i, j - 1)) {
                        console.log(i + 1, j);
                        uniqueIndices.push([i, j - 1]);
                    }
                    if (i - 1 >= 0 && matrix[i - 1][j] === "water" && !containsIndex(uniqueIndices, i - 1, j)) {
                        console.log(i, j + 1);
                        uniqueIndices.push([i - 1, j]);
                    }


                    if (i === 0 && matrix[i + 1][j] === "water" && !containsIndex(uniqueIndices, i + 1, j)) {
                        console.log(i + 2, j + 1);
                        uniqueIndices.push([i + 1, j]);
                    }
                    if (i === numRows - 1 && matrix[i - 1][j] === "water" && !containsIndex(uniqueIndices, i - 1, j)) {
                        console.log(i, j + 1);
                        uniqueIndices.push([i - 1, j]);
                    }
                    if (j === 0 && matrix[i][j + 1] === "water" && !containsIndex(uniqueIndices, i, j + 1)) {
                        console.log(i + 1, j + 2);
                        uniqueIndices.push([i, j + 1]);
                    }
                    if (j === numCols - 1 && matrix[i][j - 1] === "water" && !containsIndex(uniqueIndices, i, j - 1)) {
                        console.log(i + 1, j);
                        uniqueIndices.push([i, j - 1]);
                    }
                }
            }
        }
        p += uniqueIndices.length * 2;
    }

    if (questname === "Öntözőcsatorna") {
        for (let j = 0; j < matrix[0].length; j++) {
            waterc = 0;
            farmc = 0;
            for (let i = 0; i < matrix.length; i++) {
                if (matrix[i][j] === "water") {
                    waterc++;
                }
                else if (matrix[i][j] === "farm") {
                    farmc++;
                }
            }
            if (waterc !== 0 && waterc === farmc) {
                p += 4;
            }
        }
    }
    else if (questname === "Fasor") {
        let num = 0;
        let max = 0;
        for (let j = 0; j < matrix[0].length; j++) {


            for (let i = 0; i < matrix.length; i++) {
                if (matrix[i][j] === "forest") {
                    num++;
                }
                else {
                    if (num > max) {
                        max = num;
                    }
                    num = 0;
                }
            }
        }
        if (max > 1) {
            p += (2 * max);
            max = 0;
        }
    }
    else if (questname === "Sorház") {
        for (let i = 0; i < matrix.length; i++) {
            let num = 0;
            let max = 0;
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === "town") {
                    num++;
                }
                else {
                    if (num > max) {
                        max = num;
                    }
                    num = 0;
                }
            }
            if (max > 1) {
                p += 2 * max;
            }
        }
    }
    else if (questname === "Mágusok völgye") {
        for (let i = 1; i < matrix.length - 1; i++) {
            for (let j = 1; j < matrix[i].length - 1; j++) {
                if (matrix[i][j] === "mountain") {
                    if ((matrix[i + 1][j] === "water")) {
                        p += 3;
                    }
                    if ((matrix[i][j + 1] === "water")) {
                        p += 3;
                    }
                    if ((matrix[i][j - 1] === "water")) {
                        p += 3;
                    }
                    if ((matrix[i - 1][j] === "water")) {
                        p += 3;
                    }
                }
            }
        }
    }

    else if (questname === "Üres telek") {
        const numRows = matrix.length;
        const numCols = matrix[0].length;
        let uniqueIndices = [];

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (matrix[i][j] === "town") {
                    if (i + 1 < numRows && matrix[i + 1][j] === "none" && !containsIndex(uniqueIndices, i + 1, j)) {
                        console.log(i + 2, j + 1);
                        uniqueIndices.push([i + 1, j]);
                    }
                    if (j + 1 < numCols && matrix[i][j + 1] === "none" && !containsIndex(uniqueIndices, i, j + 1)) {
                        console.log(i + 1, j + 2);
                        uniqueIndices.push([i, j + 1]);
                    }
                    if (j - 1 >= 0 && matrix[i][j - 1] === "none" && !containsIndex(uniqueIndices, i, j - 1)) {
                        console.log(i + 1, j);
                        uniqueIndices.push([i, j - 1]);
                    }
                    if (i - 1 >= 0 && matrix[i - 1][j] === "none" && !containsIndex(uniqueIndices, i - 1, j)) {
                        console.log(i, j + 1);
                        uniqueIndices.push([i - 1, j]);
                    }


                    if (i === 0 && matrix[i + 1][j] === "none" && !containsIndex(uniqueIndices, i + 1, j)) {
                        console.log(i + 2, j + 1);
                        uniqueIndices.push([i + 1, j]);
                    }
                    if (i === numRows - 1 && matrix[i - 1][j] === "none" && !containsIndex(uniqueIndices, i - 1, j)) {
                        console.log(i, j + 1);
                        uniqueIndices.push([i - 1, j]);
                    }
                    if (j === 0 && matrix[i][j + 1] === "none" && !containsIndex(uniqueIndices, i, j + 1)) {
                        console.log(i + 1, j + 2);
                        uniqueIndices.push([i, j + 1]);
                    }
                    if (j === numCols - 1 && matrix[i][j - 1] === "none" && !containsIndex(uniqueIndices, i, j - 1)) {
                        console.log(i + 1, j);
                        uniqueIndices.push([i, j - 1]);
                    }
                }
            }
        }
        p += uniqueIndices.length * 2;
    }


    else if (questname === "Páratlan sílók") {
        for (let j = 0; j < matrix[0].length; j++) {
            let num = 0;
            for (let i = 0; i < matrix.length; i++) {
                if ((j + 1) % 2 === 1 && matrix[i][j] !== "none") {
                    num++;
                }
            }

            if (num === matrix.length) {
                p += 10;
            }
        }
    }
    else if (questname === "Gazdag vidék") {
        for (let i = 0; i < matrix.length; i++) {
            let uniqueValues = [];
            for (let j = 0; j < matrix[i].length; j++) {
                if (!uniqueValues.includes(matrix[i][j] && matrix[i][j] !== "none")) {
                    uniqueValues.push(matrix[i][j]);
                }

            }
            if (uniqueValues.length <= 5) {
                p += 4;
                break;
            }
        }
    }
    else if (questname === "Gazdag város") {
        const numRows = matrix.length;
        const numCols = matrix[0].length;

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                let uniqueValues = [];
                if (matrix[i][j] === "town") {
                    if (i + 1 < numRows && matrix[i + 1][j] !== "none" && !uniqueValues.includes(matrix[i + 1][j])) {
                        uniqueValues.push(matrix[i + 1][j]);
                    }
                    if (j + 1 < numCols && matrix[i][j + 1] !== "none" && !uniqueValues.includes(matrix[i][j + 1])) {
                        uniqueValues.push(matrix[i][j + 1]);
                    }
                    if (j - 1 >= 0 && matrix[i][j - 1] !== "none" && !uniqueValues.includes(matrix[i][j - 1])) {
                        uniqueValues.push(matrix[i][j - 1]);
                    }
                    if (i - 1 >= 0 && matrix[i - 1][j] !== "none" && !uniqueValues.includes(matrix[i - 1][j])) {
                        uniqueValues.push(matrix[i - 1][j]);
                    }

                    // külső cellák
                    if (i === 0 && i + 1 < numRows && matrix[i + 1][j] !== "none" && !uniqueValues.includes(matrix[i + 1][j])) {
                        uniqueValues.push(matrix[i + 1][j]);
                    }
                    if (i === numRows - 1 && i - 1 >= 0 && matrix[i - 1][j] !== "none" && !uniqueValues.includes(matrix[i - 1][j])) {
                        uniqueValues.push(matrix[i - 1][j]);
                    }
                    if (j === 0 && j + 1 < numCols && matrix[i][j + 1] !== "none" && !uniqueValues.includes(matrix[i][j + 1])) {
                        uniqueValues.push(matrix[i][j + 1]);
                    }
                    if (j === numCols - 1 && j - 1 >= 0 && matrix[i][j - 1] !== "none" && !uniqueValues.includes(matrix[i][j - 1])) {
                        uniqueValues.push(matrix[i][j - 1]);
                    }
                    if (uniqueValues.length >= 3) {
                        p += 3;
                    }
                }
            }
        }
    }
    mis.point += p;
    let temp = mis.id + "time";
    document.getElementById(temp).textContent = p;

    return p;
}

function containsIndex(array, row, col) {
    for (let i = 0; i < array.length; i++) {
        const [r, c] = array[i];
        if (r === row && c === col) {
            return true;
        }
    }
    return false;
}

function init() {
    let mirrorbuttonelement = document.getElementById("mirrorbutton");
    let rotatebuttonelement = document.getElementById("rotatebutton");
    let resetbuttonelement = document.getElementById("resetbutton");
    mirrorbuttonelement.addEventListener("click", initMirror);
    rotatebuttonelement.addEventListener("click", initRotate);
    resetbuttonelement.addEventListener("click", initReset);
}

function checkCollision(i, j, x, y) {
    if (i === x && j === y) { return true; }
    else if (i < 0 || j < 0 || i > 11 || j > 11) { return true; }
    return false;
}

let overlayMatrix = [];

function applyOverlay(row, col, numOfOnes) { //overlay, collission and placement init
    let collides = false;
    let count = numOfOnes;
    let canplace = true;
    tohover = [];
    tohoverindex = 0;
    counttwo = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (overlayMatrix[i + 1][j + 1] === 1) {
                for (let k = 0; k < occupiedtiles.length; k++) {
                    collides = checkCollision(row + i, col + j, occupiedtiles[k][0], occupiedtiles[k][1]);

                    if (collides) {
                        break;
                    }
                }

                let targetRow = row + i;
                let targetCol = col + j;
                let cell = document.getElementById(`cell-${targetRow}-${targetCol}`);
                if (cell) {
                    if (collides || (count <= numOfOnes - 1 && count > 0)) {
                        cell.style.border = "2px solid red";
                        count--;
                        canplace = false;
                    }
                    else {
                        cell.style.border = "2px solid green";
                        count = numOfOnes;
                        canplace = true;
                    }
                }
            }
        }
    }
}
function removeOverlay(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let targetRow = row + i;
            let targetCol = col + j;
            let cell = document.getElementById(`cell-${targetRow}-${targetCol}`);
            if (cell) {
                if (cell) {
                    cell.style.border = "2px solid #fff";
                }
            }
        }
    }
}
function insertTile(row, col, numOfOnes) {
    if (!endgame && elements[index] !== null) {

        let collides = false;
        let count = numOfOnes;
        let canplace = true;
        let counttwo = 0;
        toplace = [];
        toplaceindex = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (overlayMatrix[i + 1][j + 1] === 1) {
                    for (let k = 0; k < occupiedtiles.length; k++) {
                        collides = checkCollision(row + i, col + j, occupiedtiles[k][0], occupiedtiles[k][1]);
                        if (collides) {
                            break;
                        }
                    }
                    let targetRow = row + i;
                    let targetCol = col + j;
                    let cell = document.getElementById(`cell-${targetRow}-${targetCol}`);
                    if (cell) {
                        if (collides || (count <= numOfOnes - 1 && count > 0)) {
                            count--;
                            canplace = false;
                        }
                        else {
                            count = numOfOnes;
                            canplace = true;
                        }
                        if (canplace && counttwo < numOfOnes && !collides) {

                            toplace.push({ x: row + i, y: col + j, type: elements[index].type });

                            toplaceindex++;
                            counttwo++;
                        }
                        if (counttwo == numOfOnes) {
                            counttwo = 0;
                            toplace.forEach(element => {
                                occupiedtiles.push([element.x, element.y, element.type]);
                                updateCell(element.x, element.y, element.type);
                            });
                            toplace = [];
                            toplaceindex = 0;
                            gameLoop();

                        }
                    }
                }
            }
        }
    }
}
function countOverlayOnes(shape) {
    let overlayOnes = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (shape[i][j] === 1) {
                overlayOnes++;
            }
        }
    }
    return overlayOnes;
}

let cellContainers = document.querySelectorAll('.cell-container');

cellContainers.forEach(function (cellContainer) {
    let [row, col] = cellContainer.id.split('-').slice(1).map(Number);
    checkIfGameEnded();
    cellContainer.addEventListener('mouseover', function () {
        if (!(endgame)) {
            overlayMatrix = elements[index].shape;
            let overlayOnes = countOverlayOnes(elements[index].shape);
            applyOverlay(row, col, overlayOnes);
        }
    });

    cellContainer.addEventListener('mouseout', function () { removeOverlay(row, col); });
    cellContainer.addEventListener('click', function () {
        if (!endgame) {
            overlayMatrix = elements[index].shape;
            let overlayOnes = countOverlayOnes(elements[index].shape);
            insertTile(row, col, overlayOnes);
        }
    });

});

function initRotate() {
    rotateMatrix(elements[index]);
}
function initMirror() {
    mirrorMatrix(elements[index]);
}
function initReset(){
    localStorage.clear();
    location.reload();
}
start();
init();