var Life = {};

// Constants
Life.Constants = {};
Life.Constants.BOARD_X_SIZE = 80;
Life.Constants.BOARD_Y_SIZE = 80;

// Variables
Life.Variables = {};
Life.Variables.Board = [Life.Constants.BOARD_Y_SIZE];
Life.Variables.IntervalId = -1;

// Board setup. Initializes an empty board
Life.Reset = function () {
    var i, j;
    for (i = 0; i < Life.Constants.BOARD_Y_SIZE; i++) {
        Life.Variables.Board[i] = [Life.Constants.BOARD_X_SIZE];
        for (j = 0; j < Life.Constants.BOARD_X_SIZE; j++) {
            Life.Variables.Board[i][j] = 0;
        }
    }

    // Remove visual rendering
    $("#gameBoard .liveCell").removeClass("live");
};

// Grows a cell, making it live
Life.GrowCell = function (x, y)
{
    // If we only get an x coord, assume y
    if (y === undefined) {
        y = Math.floor(x / Life.Constants.BOARD_X_SIZE);
    }
    x = x % Life.Constants.BOARD_X_SIZE;
    y = y % Life.Constants.BOARD_Y_SIZE;

    // Wrap around negative numbers
    if (x < 0) x += Life.Constants.BOARD_X_SIZE;
    if (y < 0) y += Life.Constants.BOARD_Y_SIZE;
    
    Life.Variables.Board[y][x] = 1;
    Life.GrowCellInDom(x, y);
};

// Kills a cell, making it dead
Life.KillCell = function (x, y) {

    // If we only get an x coord, assume y
    if (y === undefined) {
        y = Math.floor (x / Life.Constants.BOARD_X_SIZE);
    }
    x = x % Life.Constants.BOARD_X_SIZE;
    y = y % Life.Constants.BOARD_Y_SIZE;

    // Wrap around negative numbers
    if (x < 0) x += Life.Constants.BOARD_X_SIZE;
    if (y < 0) y += Life.Constants.BOARD_Y_SIZE;

    Life.Variables.Board[y][x] = 0;
    Life.KillCellInDom(x, y);
};

// Verifies whether a cell is live
Life.IsCellLive = function (x, y) {

    // If we only get an x coord, assume y
    if (y === undefined) {
        y = Math.floor(x / Life.Constants.BOARD_X_SIZE);
    }
    x = x % Life.Constants.BOARD_X_SIZE;
    y = y % Life.Constants.BOARD_Y_SIZE;

    // Wrap around negative numbers
    if (x < 0) x += Life.Constants.BOARD_X_SIZE;
    if (y < 0) y += Life.Constants.BOARD_Y_SIZE;

    return Life.Variables.Board[y][x];
};

Life.ToggleCell = function (x, y) {

    var isLiveCell = Life.IsCellLive(x, y);

    if (isLiveCell) {
        Life.KillCell(x, y);
    }
    else {
        Life.GrowCell(x, y);
    }
};


Life.CountNeighbours = function (x, y) {
    // If we only get an x coord, assume y
    if (y === undefined) {
        y = Math.floor(x / Life.Constants.BOARD_X_SIZE);
    }
    x = x % Life.Constants.BOARD_X_SIZE;
    y = y % Life.Constants.BOARD_Y_SIZE;

    var i, j, numNeighbours = 0;

    for (i = -1; i < 2 ; i++) {
        for (j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;
            numNeighbours += Life.IsCellLive(x + i, y + j);
        }
    }

    return numNeighbours;
};

Life.KillCellInDom = function (x, y) {

    // array coords are 0-based, while jquery is 1-based
    x++;
    y++;

    $("#gameBoard tr:nth-child(" + y + ") td:nth-child(" + x + ")").removeClass("live");
};

Life.GrowCellInDom = function (x, y) {

    // array coords are 0-based, while jquery is 1-based
    x++;
    y++;

    $("#gameBoard tr:nth-child(" + y + ") td:nth-child(" + x + ")").addClass("live");
};

// Initial board rendering. Re-creates the table DOM
Life.Render = function (tableId) {

    var i, j, innerText = '';

    // Iterate over rows
    for (i = 0; i < Life.Constants.BOARD_Y_SIZE; i++)
    {
        innerText += "<tr>";
        // Iterate over columns
        for (j = 0; j < Life.Constants.BOARD_X_SIZE; j++)
        {
            // 
            if (Life.IsCellLive(j, i)) {
                innerText += '<td class="live"></td>';
            }
            else {
                innerText += "<td></td>";
            }
        }
        innerText += "</tr>";
    }

    $("#" + tableId).html(innerText);

    // Toggle the cell on user click
    $("td").click(function () {
        var column = this.cellIndex;
        var row = this.parentNode.rowIndex;
        Life.ToggleCell(column, row);
    });
};

// Calculates the next generation. Kills and grows cells as needed
Life.Step = function () {
    var i, j, cellsToGrow = [], cellsToDie = [], numNeighbours, isLiveCell;

    // Traverse the board and calculate who lives and who dies
    for (i = 0; i < Life.Constants.BOARD_X_SIZE; i++) {
        for (j = 0; j < Life.Constants.BOARD_Y_SIZE; j++) {
            isLiveCell = Life.IsCellLive(i, j);
            numNeighbours = Life.CountNeighbours(i, j);

            // Loneliness
            if (isLiveCell && numNeighbours < 2) {
                cellsToDie.push([i, j]);
            }
            // Overpopulation
            else if (isLiveCell && numNeighbours > 3) {
                cellsToDie.push([i, j]);
            }
            // New life!
            else if (!isLiveCell && numNeighbours === 3) {
                cellsToGrow.push([i, j]);
            }
        }
    }

    console.log("Growing " + cellsToGrow.length + " cells");
    console.log("Killing " + cellsToDie.length + " cells");

    for (i = 0; i < cellsToGrow.length; i++) {
        Life.GrowCell(cellsToGrow[i][0], cellsToGrow[i][1]);
    }

    for (i = 0; i < cellsToDie.length; i++) {
        Life.KillCell(cellsToDie[i][0], cellsToDie[i][1]);
    }
};

// Clears the board
Life.Clear = function () {
    Life.Reset();
    Life.Render("board");
};

// Sets an interval to execute step periodically
Life.AutoStep = function (period) {

    if (Life.Variables.IntervalId < 0) {
        Life.Variables.IntervalId = setInterval(Life.Step, period);
    }
};


// Reschedules the AutoStep
Life.RescheduleAutoStep = function (period) {

    // Do nothing if there's no interval
    if (Life.Variables.IntervalId < 0) {
        return;
    }

    Life.Pause();
    Life.AutoStep(period);
};

// Removes the interval to execute step periodically
Life.Pause = function () {

    if (Life.Variables.IntervalId >= 0) {
        clearInterval(Life.Variables.IntervalId);
        Life.Variables.IntervalId = -1;
    }
};

// Seed a figure specificied by a 2-dimensional array, at x, y coords
Life.SeedFigure = function (figure, x, y) {
    var i, j;

    // i iterates over rows, j over columns
    for (i = 0; i < figure.length; i++)
    {
        for (j = 0; j < figure[i].length; j++)
        {
            if (figure[i][j])
            {
                Life.GrowCell(x + j, y + i);
            }
            else
            {
                Life.KillCell(x + j, y + i);
            }
        }
    }
};

// Rotates a figure counter-clockwise
Life.RotateFigure = function (figure) {

    return Object.keys(figure[0]).map(function (c) {
        return figure.map(function (r) {
            return r[r.length - 1 - c];
        });
    });
};

// Seeds a blinker, an roating figure
Life.SeedOscillator = function (x, y) {
    var figure = [[1, 1, 1]];

    Life.SeedFigure(figure, x, y);
};

// Seeds a block, a static figure
Life.SeedBlock = function (x, y) {

    var figure =   [[1, 1],
                    [1, 1]];

    Life.SeedFigure(figure, x, y);
};

// Seeds a toad, an oscillating figure
Life.SeedToad = function (x, y) {
    var figure = [[1, 1, 1, 0],
                  [0, 1, 1, 1]];

    Life.SeedFigure(figure, x, y);
};

// Seeds a boat, a static figure
Life.SeedBoat = function (x, y) {
    var figure = [[0, 1, 1],
                  [1, 0, 1],
                  [0, 1, 0]];

    Life.SeedFigure(figure, x, y);
};

// Seeds a glider, a figure that moves diagonally
Life.SeedGlider = function (x, y) {
    var figure = [[0, 1, 0],
                  [0, 0, 1],
                  [1, 1, 1]];

    Life.SeedFigure(figure, x, y);
};

// Seeds a LWSS, a figure that moves horizontally or vertically
Life.SeedLWSS = function (x, y) {
    var figure = [[0, 1, 0, 0, 1],
                  [1, 0, 0, 0, 0],
                  [1, 0, 0, 0, 1],
                  [1, 1, 1, 1, 0]];

    Life.SeedFigure(figure, x, y);
};

// Seeds a pulsar, a 3 step oscillating, symmetrical pattern
Life.SeedPulsar = function (x, y) {
    var figure = [[0, 0, 1, 1, 0, 0],
                  [0, 0, 0, 1, 1, 0],
                  [1, 0, 0, 1, 0, 1],
                  [1, 1, 1, 0, 1, 1],
                  [0, 1, 0, 1, 0, 1],
                  [0, 0, 1, 1, 1, 0]];

    Life.SeedFigure(figure, x, y);

    // Rotate for next quadrant
    figure = Life.RotateFigure(figure);
    Life.SeedFigure(figure, x, y + 7);

    // Rotate for next quadrant
    figure = Life.RotateFigure(figure);
    Life.SeedFigure(figure, x + 7, y + 7);

    // Rotate for next quadrant
    figure = Life.RotateFigure(figure);
    Life.SeedFigure(figure, x + 7, y);
};

// Returns the current state of the board as a base-64 encoded string
Life.Serialize = function () {
    var i, j, state = [];

    for (i = 0; i < Life.Constants.BOARD_X_SIZE; i++) {
        for (j = 0; j < Life.Constants.BOARD_Y_SIZE; j++) {
            if (Life.IsCellLive(i, j)) {
                state.push(i);
                state.push(j);
            }
        }
    }
    return btoa(state.join(","));
};

// Resets the board and seeds the board from an encoded seed
// The seed is a base-64 encoded string representing an int []
// The array contains x and y coords of different points in the sequence
Life.Load = function (seed) {

    var x, y, seedArray = atob(seed).split(",");

    Life.Reset();

    while (seedArray.length > 0) {
        x = seedArray.shift();
        if (seedArray.length <= 0) {
            break;
        }
        y = seedArray.shift();
        Life.GrowCell(x, y);
    }
};

// Initializes the board with some live cells
Life.SeedSample = function()
{
    /*
    // Blocks
    Life.SeedBlock(70, 11);
    Life.SeedBlock(10, 41);

    // Boats
    Life.SeedBoat(29, 20);
    Life.SeedBoat(19, 40);
    Life.SeedBoat(49, 60);

    // Oscillators
    Life.SeedOscillator(3, 7);
    Life.SeedOscillator(12, 21);
    Life.SeedOscillator(24, 55);
    Life.SeedOscillator(33, 71);

    // Toads
    Life.SeedToad(22, 67);
    Life.SeedToad(70, 70);

    // Gliders
    Life.SeedGlider(40, 60);
    Life.SeedGlider(70, 70);
    Life.SeedGlider(60, 3);

    // LWSSs
    Life.SeedLWSS(40, 75);
    Life.SeedLWSS(40, 5);

    // Pulsars
    Life.SeedPulsar(60, 20);
    Life.SeedPulsar(5, 55);

    // Seed by figure
    Life.SeedBlock(77, 77);
    Life.SeedToad(0, 78);

    alert(Life.Serialize());
    
    
    // Random cells
    Life.GrowCell(9, 11);
    Life.GrowCell(4, 27);
    Life.GrowCell(17, 7);
    Life.GrowCell(22, 1);
    Life.GrowCell(1);
    Life.GrowCell(1001);
    Life.GrowCell(64003);
    Life.GrowCell(64085);
    Life.GrowCell(-1);
    Life.GrowCell(0, 0);
    Life.GrowCell(50, 50);
    Life.GrowCell(30, 30);
    Life.GrowCell(79, 79);

    var seedString = Life.Serialize();

    Life.Load(seedString);
    */

    Life.Load("MCw3OCwxLDc4LDEsNzksMiw3OCwyLDc5LDMsNywzLDc5LDQsNyw1LDcsNSw1Nyw1LDU4LDUsNjQsNSw2NSw2LDU4LDYsNTksNiw2Myw2LDY0LDcsNTUsNyw1OCw3LDYwLDcsNjIsNyw2NCw3LDY3LDgsNTUsOCw1Niw4LDU3LDgsNTksOCw2MCw4LDYyLDgsNjMsOCw2NSw4LDY2LDgsNjcsOSw1Niw5LDU4LDksNjAsOSw2Miw5LDY0LDksNjYsMTAsNDEsMTAsNDIsMTAsNTcsMTAsNTgsMTAsNTksMTAsNjMsMTAsNjQsMTAsNjUsMTEsNDEsMTEsNDIsMTIsMjEsMTIsNTcsMTIsNTgsMTIsNTksMTIsNjMsMTIsNjQsMTIsNjUsMTMsMjEsMTMsNTYsMTMsNTgsMTMsNjAsMTMsNjIsMTMsNjQsMTMsNjYsMTQsMjEsMTQsNTUsMTQsNTYsMTQsNTcsMTQsNTksMTQsNjAsMTQsNjIsMTQsNjMsMTQsNjUsMTQsNjYsMTQsNjcsMTUsNTUsMTUsNTgsMTUsNjAsMTUsNjIsMTUsNjQsMTUsNjcsMTYsNTgsMTYsNTksMTYsNjMsMTYsNjQsMTcsNTcsMTcsNTgsMTcsNjQsMTcsNjUsMTksNDEsMjAsNDAsMjAsNDIsMjEsNDAsMjEsNDEsMjIsNjcsMjMsNjcsMjMsNjgsMjQsNTUsMjQsNjcsMjQsNjgsMjUsNTUsMjUsNjgsMjYsNTUsMjksMjEsMzAsMjAsMzAsMjIsMzEsMjAsMzEsMjEsMzMsNzEsMzQsNzEsMzUsNzEsNDAsNiw0MCw3LDQwLDgsNDAsNjIsNDAsNzYsNDAsNzcsNDAsNzgsNDEsNSw0MSw4LDQxLDYwLDQxLDYyLDQxLDc1LDQxLDc4LDQyLDgsNDIsNjEsNDIsNjIsNDIsNzgsNDMsOCw0Myw3OCw0NCw1LDQ0LDcsNDQsNzUsNDQsNzcsNDksNjEsNTAsNjAsNTAsNjIsNTEsNjAsNTEsNjEsNjAsNSw2MCwyMiw2MCwyMyw2MCwyOSw2MCwzMCw2MSwzLDYxLDUsNjEsMjMsNjEsMjQsNjEsMjgsNjEsMjksNjIsNCw2Miw1LDYyLDIwLDYyLDIzLDYyLDI1LDYyLDI3LDYyLDI5LDYyLDMyLDYzLDIwLDYzLDIxLDYzLDIyLDYzLDI0LDYzLDI1LDYzLDI3LDYzLDI4LDYzLDMwLDYzLDMxLDYzLDMyLDY0LDIxLDY0LDIzLDY0LDI1LDY0LDI3LDY0LDI5LDY0LDMxLDY1LDIyLDY1LDIzLDY1LDI0LDY1LDI4LDY1LDI5LDY1LDMwLDY3LDIyLDY3LDIzLDY3LDI0LDY3LDI4LDY3LDI5LDY3LDMwLDY4LDIxLDY4LDIzLDY4LDI1LDY4LDI3LDY4LDI5LDY4LDMxLDY5LDIwLDY5LDIxLDY5LDIyLDY5LDI0LDY5LDI1LDY5LDI3LDY5LDI4LDY5LDMwLDY5LDMxLDY5LDMyLDcwLDExLDcwLDEyLDcwLDIwLDcwLDIzLDcwLDI1LDcwLDI3LDcwLDI5LDcwLDMyLDcwLDcyLDcxLDExLDcxLDEyLDcxLDIzLDcxLDI0LDcxLDI4LDcxLDI5LDcxLDcwLDcxLDcyLDcyLDIyLDcyLDIzLDcyLDI5LDcyLDMwLDcyLDcxLDcyLDcyLDczLDcxLDc3LDc3LDc3LDc4LDc4LDc3LDc4LDc4");
    
};

// Bootstrapping code
Life.Reset();
Life.SeedSample();
Life.Render("board");
