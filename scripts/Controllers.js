var conwayLifeGame = angular.module('conwayLifeGame', []);
// SavesController
// Manages game saving and loading
conwayLifeGame.controller('SavesController', function ($scope) {

    // Initial list population. Some savegames I created previously.
    $scope.saves = [
    {
        'name': 'Game 1',
        'seed': 'MCw3OCwxLDc4LDEsNzksMiw3OCwyLDc5LDMsNywzLDc5LDQsNyw1LDcsNSw1Nyw1LDU4LDUsNjQsNSw2NSw2LDU4LDYsNTksNiw2Myw2LDY0LDcsNTUsNyw1OCw3LDYwLDcsNjIsNyw2NCw3LDY3LDgsNTUsOCw1Niw4LDU3LDgsNTksOCw2MCw4LDYyLDgsNjMsOCw2NSw4LDY2LDgsNjcsOSw1Niw5LDU4LDksNjAsOSw2Miw5LDY0LDksNjYsMTAsNDEsMTAsNDIsMTAsNTcsMTAsNTgsMTAsNTksMTAsNjMsMTAsNjQsMTAsNjUsMTEsNDEsMTEsNDIsMTIsMjEsMTIsNTcsMTIsNTgsMTIsNTksMTIsNjMsMTIsNjQsMTIsNjUsMTMsMjEsMTMsNTYsMTMsNTgsMTMsNjAsMTMsNjIsMTMsNjQsMTMsNjYsMTQsMjEsMTQsNTUsMTQsNTYsMTQsNTcsMTQsNTksMTQsNjAsMTQsNjIsMTQsNjMsMTQsNjUsMTQsNjYsMTQsNjcsMTUsNTUsMTUsNTgsMTUsNjAsMTUsNjIsMTUsNjQsMTUsNjcsMTYsNTgsMTYsNTksMTYsNjMsMTYsNjQsMTcsNTcsMTcsNTgsMTcsNjQsMTcsNjUsMTksNDEsMjAsNDAsMjAsNDIsMjEsNDAsMjEsNDEsMjIsNjcsMjMsNjcsMjMsNjgsMjQsNTUsMjQsNjcsMjQsNjgsMjUsNTUsMjUsNjgsMjYsNTUsMjksMjEsMzAsMjAsMzAsMjIsMzEsMjAsMzEsMjEsMzMsNzEsMzQsNzEsMzUsNzEsNDAsNiw0MCw3LDQwLDgsNDAsNjIsNDAsNzYsNDAsNzcsNDAsNzgsNDEsNSw0MSw4LDQxLDYwLDQxLDYyLDQxLDc1LDQxLDc4LDQyLDgsNDIsNjEsNDIsNjIsNDIsNzgsNDMsOCw0Myw3OCw0NCw1LDQ0LDcsNDQsNzUsNDQsNzcsNDksNjEsNTAsNjAsNTAsNjIsNTEsNjAsNTEsNjEsNjAsNSw2MCwyMiw2MCwyMyw2MCwyOSw2MCwzMCw2MSwzLDYxLDUsNjEsMjMsNjEsMjQsNjEsMjgsNjEsMjksNjIsNCw2Miw1LDYyLDIwLDYyLDIzLDYyLDI1LDYyLDI3LDYyLDI5LDYyLDMyLDYzLDIwLDYzLDIxLDYzLDIyLDYzLDI0LDYzLDI1LDYzLDI3LDYzLDI4LDYzLDMwLDYzLDMxLDYzLDMyLDY0LDIxLDY0LDIzLDY0LDI1LDY0LDI3LDY0LDI5LDY0LDMxLDY1LDIyLDY1LDIzLDY1LDI0LDY1LDI4LDY1LDI5LDY1LDMwLDY3LDIyLDY3LDIzLDY3LDI0LDY3LDI4LDY3LDI5LDY3LDMwLDY4LDIxLDY4LDIzLDY4LDI1LDY4LDI3LDY4LDI5LDY4LDMxLDY5LDIwLDY5LDIxLDY5LDIyLDY5LDI0LDY5LDI1LDY5LDI3LDY5LDI4LDY5LDMwLDY5LDMxLDY5LDMyLDcwLDExLDcwLDEyLDcwLDIwLDcwLDIzLDcwLDI1LDcwLDI3LDcwLDI5LDcwLDMyLDcwLDcyLDcxLDExLDcxLDEyLDcxLDIzLDcxLDI0LDcxLDI4LDcxLDI5LDcxLDcwLDcxLDcyLDcyLDIyLDcyLDIzLDcyLDI5LDcyLDMwLDcyLDcxLDcyLDcyLDczLDcxLDc3LDc3LDc3LDc4LDc4LDc3LDc4LDc4'
    },
    {
        'name': 'Game 2',
        'seed': 'Myw3LDQsNyw0LDU4LDQsNjQsNSw3LDUsNTgsNSw2NCw2LDU4LDYsNTksNiw2Myw2LDY0LDgsNTQsOCw1NSw4LDU2LDgsNTksOCw2MCw4LDYyLDgsNjMsOCw2Niw4LDY3LDgsNjgsOSw1Niw5LDU4LDksNjAsOSw2Miw5LDY0LDksNjYsMTAsNDEsMTAsNDIsMTAsNTgsMTAsNTksMTAsNjMsMTAsNjQsMTEsNDEsMTEsNDIsMTIsMjEsMTIsNTgsMTIsNTksMTIsNjMsMTIsNjQsMTMsMjEsMTMsNTYsMTMsNTgsMTMsNjAsMTMsNjIsMTMsNjQsMTMsNjYsMTQsMjEsMTQsNTQsMTQsNTUsMTQsNTYsMTQsNTksMTQsNjAsMTQsNjIsMTQsNjMsMTQsNjYsMTQsNjcsMTQsNjgsMTYsNTgsMTYsNTksMTYsNjMsMTYsNjQsMTcsNTgsMTcsNjQsMTgsNTgsMTgsNjQsMTksNDEsMjAsNDAsMjAsNDIsMjEsNDAsMjEsNDEsMjQsNTUsMjUsNTUsMjYsNTUsMjcsNiwyNyw3LDI3LDgsMjcsNzYsMjcsNzcsMjcsNzgsMjgsNiwyOCw5LDI4LDc2LDI4LDc5LDI5LDYsMjksMjEsMjksNzYsMzAsNiwzMCwyMCwzMCwyMiwzMCw3NiwzMSw3LDMxLDksMzEsMjAsMzEsMjEsMzEsNzcsMzEsNzksMzMsNzEsMzQsNzEsMzUsNzEsNDYsNjgsNDcsNjksNDgsNjcsNDgsNjgsNDgsNjksNDksNjEsNTAsNjAsNTAsNjIsNTEsNjAsNTEsNjEsNTksMjMsNTksMjksNjAsMjMsNjAsMjksNjEsMjMsNjEsMjQsNjEsMjgsNjEsMjksNjMsMTksNjMsMjAsNjMsMjEsNjMsMjQsNjMsMjUsNjMsMjcsNjMsMjgsNjMsMzEsNjMsMzIsNjMsMzMsNjQsMjEsNjQsMjMsNjQsMjUsNjQsMjcsNjQsMjksNjQsMzEsNjUsMjMsNjUsMjQsNjUsMjgsNjUsMjksNjcsMjMsNjcsMjQsNjcsMjgsNjcsMjksNjgsMjEsNjgsMjMsNjgsMjUsNjgsMjcsNjgsMjksNjgsMzEsNjksMTksNjksMjAsNjksMjEsNjksMjQsNjksMjUsNjksMjcsNjksMjgsNjksMzEsNjksMzIsNjksMzMsNzEsMjMsNzEsMjQsNzEsMjgsNzEsMjksNzIsMjMsNzIsMjksNzMsMjMsNzMsMjksNzUsMiw3NSwzLDc2LDIsNzYsMw'
    },
    {
        'name': 'Game 3',
        'seed': 'MiwxLDIsMiwzLDEsMywyLDMsNyw0LDcsNCw1OCw0LDY0LDUsNyw1LDU4LDUsNjQsNiw1OCw2LDU5LDYsNjMsNiw2NCw4LDU0LDgsNTUsOCw1Niw4LDU5LDgsNjAsOCw2Miw4LDYzLDgsNjYsOCw2Nyw4LDY4LDksNTYsOSw1OCw5LDYwLDksNjIsOSw2NCw5LDY2LDEwLDQxLDEwLDQyLDEwLDU4LDEwLDU5LDEwLDYzLDEwLDY0LDExLDQxLDExLDQyLDEyLDIxLDEyLDU4LDEyLDU5LDEyLDYzLDEyLDY0LDEzLDIxLDEzLDU2LDEzLDU4LDEzLDYwLDEzLDYyLDEzLDY0LDEzLDY2LDE0LDIxLDE0LDU0LDE0LDU1LDE0LDU2LDE0LDU5LDE0LDYwLDE0LDYyLDE0LDYzLDE0LDY2LDE0LDY3LDE0LDY4LDE2LDU4LDE2LDU5LDE2LDYzLDE2LDY0LDE3LDU4LDE3LDY0LDE4LDU4LDE4LDY0LDE5LDQxLDIwLDQwLDIwLDQyLDIxLDQwLDIxLDQxLDI0LDU1LDI1LDU1LDI2LDU1LDI3LDYsMjcsNywyNyw4LDI3LDc2LDI3LDc3LDI3LDc4LDI4LDYsMjgsOSwyOCw3NiwyOCw3OSwyOSw2LDI5LDIxLDI5LDc2LDMwLDYsMzAsMjAsMzAsMjIsMzAsNzYsMzEsNywzMSw5LDMxLDIwLDMxLDIxLDMxLDc3LDMxLDc5LDMzLDcxLDM0LDcxLDM1LDcxLDQ2LDY4LDQ3LDY5LDQ4LDY3LDQ4LDY4LDQ4LDY5LDQ5LDYxLDUwLDYwLDUwLDYyLDUxLDYwLDUxLDYxLDYzLDE5LDYzLDIwLDYzLDIxLDYzLDI0LDYzLDI1LDYzLDI3LDYzLDI4LDYzLDMxLDYzLDMyLDYzLDMzLDY0LDIxLDY0LDIzLDY0LDI1LDY0LDI3LDY0LDI5LDY0LDMxLDY1LDIzLDY1LDI0LDY1LDI4LDY1LDI5LDY3LDIzLDY3LDI0LDY3LDI4LDY3LDI5LDY4LDIxLDY4LDIzLDY4LDI1LDY4LDI3LDY4LDI5LDY4LDMxLDY5LDE5LDY5LDIwLDY5LDIxLDY5LDI0LDY5LDI1LDY5LDI3LDY5LDI4LDY5LDMxLDY5LDMyLDY5LDMzLDc1LDIsNzUsMyw3NiwyLDc2LDM'
    }
    ];

    // API
    $scope.addSaveGame = function (save) {
        console.log("Adding a savegame");
        var i,existingSave, seed = Life.Serialize();

        // Reject existing save if one with the same name exists
        for (i = 0; i < $scope.saves.length; i++)
        {
            existingSave = $scope.saves[i];

            if (existingSave.name === save.name)
            {
                save.name = "";
                return false;
            }
        }

        $scope.saves.push({ name: $scope.save.name, seed: seed });
        save.name = "";
        return true;
    };

    $scope.deleteSaveGame = function (save) {
        console.log("Deleting a savegame");
        var i, existingSave;

        // Reject existing save if one with the same name exists
        for (i = 0; i < $scope.saves.length; i++) {
            existingSave = $scope.saves[i];

            if (existingSave.name === save.name) {
                $scope.saves.splice(i, 1);
                break;
            }
        }

        save.name = "";
    };

    $scope.loadSaveGame = function (save) {
        Life.Load(save.seed);
    };
});