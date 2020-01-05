// MAIN MODULE
const game = (() => {

    const Player = (name, marker, id) => {
        let score = 0;
        return {
            name,
            marker,
            score,
            id
        }
    }
    let boardArr = ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'];
    const winArrays = [
        [0, 1, 2],
        [0, 4, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [3, 4, 5],
        [6, 7, 8],
        [6, 4, 2]
    ]
    let player1;
    let player2;

    //INITIALIZES PLAYER OBJECTS FROM FORM INPUT
    const init = () => {
        document.getElementById("cta-player-info").addEventListener("click", () => {
            const name = document.getElementById("name").value;
            let marker = document.getElementById("marker").value;

            if (name.length > 0 && marker !== "marker") {
                player1 = Player(name, marker, 1);

                let aiMarker = "";
                player1.marker === "x" ? aiMarker = "o" : aiMarker = "x"

                player2 = Player("Ai", aiMarker, 2);
                displayController.init();
            }
        })
    }

    const _sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // POPULATES TIC TAC TOE GRID, ADDS AND REMOVES PLAY AGAIN? BUTTON, REMOVES FORM, 
    const displayController = (() => {

        const init = () => {
            _removeForm();
            _updatePlayerInfo();
            _buildTicBoxes();
            if (player1.name !== "Ai" && player1.marker === "x") {
                _addTicListeners(player1);
            } else {
                player1.marker === "x" ? mainController.hardAiTurn(player1) : mainController.hardAiTurn(player2);
            }
        }

        const _removeTicBoxes = () => {
            const container = document.getElementById("tic-box-container");
            container.remove();
        }

        const declareWinner = (winner) => {
            const span1 = document.getElementById("player1-span");
            const seperator = document.getElementById("score-seperator");
            const span2 = document.getElementById("player2-span");

            span1.innerHTML = `${winner.name} is the winner!`;
            seperator.innerHTML = "";
            span2.innerHTML = "";
            _playAgainButton();
            _removeTicBoxes();
            _buildTicBoxes();
            _render();
        }

        const declareTie = () => {
            const span1 = document.getElementById("player1-span");
            const seperator = document.getElementById("score-seperator");
            const span2 = document.getElementById("player2-span");

            span1.innerHTML = `Game is a tie!`;
            seperator.innerHTML = "";
            span2.innerHTML = "";
            _playAgainButton();
            _removeTicBoxes();
            _buildTicBoxes();
            _render();
        }
        // CREATES PLAY AGAIN? BUTTON, ADDS A CLICK LISTENER, REMOVES ITSELF ON EVENT, THEN STARTS NEW GAME.
        const _playAgainButton = () => {
            const btnContainer = document.getElementById("cta-new-game");
            const button = document.createElement("button");
            button.classList.add("btn", "btn-primary");
            button.innerHTML = "Play Again?";
            btnContainer.appendChild(button);
           
            button.addEventListener("click", () => {
                button.remove();
                _updatePlayerInfo();
                player1.marker === "x" ? update(player1) : update(player2);
            })
        }

        // AFTER TURN mainController.turnPlayed() WILL CALL AND FUNCTION RENDERS PAGE
        const update = (player) => {
            _removeTicBoxes();
            _buildTicBoxes();
            _render();
            player.name !== "Ai" ? _addTicListeners(player) : mainController.hardAiTurn(player);
        }

        // UPDATE SCORE
        const _updatePlayerInfo = () => {
            const span1 = document.getElementById("player1-span");
            const seperator = document.getElementById("score-seperator");
            const span2 = document.getElementById("player2-span");

            span1.innerHTML = `${player1.name}: ${player1.score}`;
            seperator.innerHTML = "&nbsp - &nbsp";
            span2.innerHTML = `${player2.name}: ${player2.score}`;
        }

        // REMOVES FORM
        const _removeForm = () => {
            document.getElementById("player-form").remove();
        }

        // CREATES TIC BOXES
        const _buildTicBoxes = () => {
            const row = document.getElementById("game-container").querySelector(".row");
            const mainCol = document.createElement("div");
            const container = document.createElement("div");
            const innerRow = document.createElement("div");

            mainCol.classList.add("col-6", "content");
            mainCol.setAttribute("id", "tic-box-container")
            container.classList.add("container", "tic-container");
            innerRow.classList.add("row", "tic-row");

            for (i = 0; i < 9; i++) {
                const ticBox = document.createElement("div");
                ticBox.setAttribute("data-index", i)
                ticBox.classList.add("col-4", "tic-box");

                if (i >= 0 && i <= 2) {
                    ticBox.classList.add("tic-box-top")
                }
                if (i === 0 || i === 3 || i === 6) {
                    ticBox.classList.add("tic-box-left")
                }
                if (i === 2 || i === 5 || i === 8) {
                    ticBox.classList.add("tic-box-right")
                }
                if (i >= 6 && i <= 8) {
                    ticBox.classList.add("tic-box-bottom")
                }

                innerRow.appendChild(ticBox);

                if (i === 2 || i === 5 || i === 8) {
                    container.appendChild(innerRow)
                }
            }
            mainCol.appendChild(container);
            row.appendChild(mainCol);
        }

        //EVENT LISTENER FOR MARKS - TAKES PARAMETER FOR PLAYER INCASE GAME IS EVER MADE 2-PLAYER.  IN CURRENT STATE currentPlayer === player1 
        const _addTicListeners = (currentPlayer) => {
            document.querySelectorAll(".tic-box").forEach(box => {
                box.addEventListener("click", () => {
                    const index = box.getAttribute("data-index");
                    if (boardArr[index] === 'e') {
                        boardArr[index] = currentPlayer.marker;
                        _render();
                        mainController.turnPlayed(currentPlayer);
                    }
                })
            })
        }

        // RENDERS TILES WITH MARKS BASED OFF OF boardArr VALUES
        const _render = () => document.querySelectorAll(".tic-box").forEach(box => {
            const index = box.getAttribute("data-index");

            if (boardArr[index] !== 'e') {
                box.innerHTML = boardArr[index].toUpperCase();
            } else {
                box.innerHTML = "";
            }
        })
        return {
            init,
            update,
            declareWinner,
            declareTie
        };
    })();

    // CONTROLS TURNS, CHECKS IF WIN/TIE, AND CONTAINS AI CODE. PUBLIC FUNCTIONS: turnPlayed, hardAiTurn, easyAiTurn
    const mainController = (() => {
        const turnPlayed = (player) => {
            if (_isGameOver(player.marker, boardArr) === true) {
                displayController.declareWinner(player)
                boardArr = ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'];
                player.score++;
            }
            else if(_isGameTie() === true) {
                displayController.declareTie();
                boardArr = ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'];
            }
            else {
                player.id === 1 ? displayController.update(player2) : displayController.update(player1);
            }         
        }

        // CHECKS TIE
        const _isGameTie = () => {
           return boardArr.includes("e") ? false : true;
        }

        // AI ALGORITHM
        const hardAiTurn = (currentAi) => {
            _sleep(500).then(() => {
                let emptyPlaces = []
                let moveIndex;
                let moveScore = -1;
                const enemyPlayer = currentAi.id === 1 ? player2 : player1;
                for (i = 0; i <= 8; i++) {
                    if (boardArr[i] === 'e') {
                        emptyPlaces.push(i)
                    }
                }
                
                for(i = 0; i <= emptyPlaces.length -1; i++) {
                    let newArr = [...boardArr]; 
                    newArr[emptyPlaces[i]] = currentAi.marker;
                    // PLAYERS WINNING MOVE
                    if (_isGameOver(currentAi.marker, newArr) === true && moveScore < 10) {                       
                        moveIndex = emptyPlaces[i];
                        moveScore = 10;
                    }
                    // OPPONENTS WINNING MOVE
                    newArr[emptyPlaces[i]] = enemyPlayer.marker; 
                    if (_isGameOver(enemyPlayer.marker, newArr) === true && moveScore < 5) {
                        moveIndex = emptyPlaces[i];
                        moveScore = 5;
                    }
                    // CORNER MOVES
                    if(moveScore < 3) {
                        if(emptyPlaces.includes(0)) {
                            moveIndex = 0;
                            moveScore = 3;
                        }
                        else if (emptyPlaces.includes(2)) {
                            moveIndex = 2;
                            moveScore = 3;
                        }
                        else if (emptyPlaces.includes(6)) {
                            moveIndex = 6;
                            moveScore = 3;
                        }
                        else if (emptyPlaces.includes(8)) {
                            moveIndex = 8;
                            moveScore = 3;
                        }                   
                    }
                    // CENTER MOVE
                    if(moveScore < 4 && emptyPlaces.includes(4)) {
                        moveIndex = 4;
                        moveScore = 4;
                    }
                    // RANDOM MOVE
                    if(moveScore === -1) {
                        let randIndex = Math.floor(Math.random() * emptyPlaces.length)
                        moveIndex = emptyPlaces[randIndex];
                        moveScore = 0;
                    }
                }
                boardArr[moveIndex] = currentAi.marker;
                turnPlayed(currentAi);
            })
        }
        // JUST RANDOM MOVES - UNUSED FUNCTION
        const easyAiTurn = (currentAi) => {
            _sleep(500).then(() => {
                let emptyPlaces = []
                for (i = 0; i <= 8; i++) {
                    if (boardArr[i] === 'e') {
                        emptyPlaces.push(i)
                    }
                }
                let randIndex = Math.floor(Math.random() * emptyPlaces.length)
                let markIndex = emptyPlaces[randIndex];
                boardArr[markIndex] = currentAi.marker;
                turnPlayed(currentAi);
            })
        }
        // RETURNS BOOLEAN VALUE IF MOVE WINS GAME - newBoard IS PARAMETER SENT BY 2 FUNCTIONS: hardAiTurn, turnPlayed 
        // hardAiTurn - newBoard is a cloned array of actual board with an altered hypothetical value sent as a parameter
        // turnPlayed - newBoard is actual array for board. 
        const _isGameOver = (marker, newBoard) => {
            let gameOver = false;
            const isTrue = (currentIndex) => currentIndex === true;

            winArrays.forEach(arr => {
                let boolArr = [false, false, false]
                let counter = 0;

                arr.forEach(index => {
                    if (marker === newBoard[index]) {
                        boolArr[counter] = true;
                    }
                    counter++;
                })

                if (boolArr.every(isTrue)) {
                    gameOver = true;
                }
            })
            return gameOver === true ? true : false;
        }
        return {
            turnPlayed,
            hardAiTurn,
            easyAiTurn
        }
    })();
    return {
        init
    };
})();

game.init()