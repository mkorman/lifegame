var Persistence = [];
Persistence.Constants = [];

Persistence.Constants.TABLE_NAME = 'lifegame_saves';

var tableService = azure.createTableService();




function intialize() {
    tableService.createTableIfNotExists(Persistence.Constants.TABLE_NAME, function (error) {

        if (!error) {
            // Table exists or created
        }
    });
};

function insertSavegame(save) {

    tableService.insertEntity(Persistence.Constants.TABLE_NAME, save, function (error) {
        if (!error) {
            // Insert OK
        }
    });
};

