var mysql = require('mysql');
var connection = mysql.createConnection({

    host: "localhost",
    database: "premierleague",
    user: "root",
    password: "Grap34@Dasz",


});

connection.connect(function(err){
    if (err) {
        console.log('Error Connecting: ' + err.stack)
        return;
    }

    console.log('Connect as id' + connection.threadId);

});


connection.query('SELECT * FROM players9', function(error, results, fields) {
    if (error) 
        throw error;
    results.forEach(result => {console.log(result);

    });
});