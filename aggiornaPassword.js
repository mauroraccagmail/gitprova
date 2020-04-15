const HEADERS = require('headers');
const ERRORS = require('errors');

const MONGO_CLIENT = require("mongodb").MongoClient;
const STRING_CONNECT = 'mongodb://127.0.0.1:27017';
const PARAMETERS = {
    useNewUrlParser: true,
    /* useUnifiedTopology: true */
};
const async = require("async");
const bcrypt = require("bcrypt");

MONGO_CLIENT.connect(STRING_CONNECT, PARAMETERS, function(err, client) {
    if (err)
        error(req, res, err, ERRORS.DB_CONNECTION);
    else {
        const DB = client.db('DBmail');
        const COLLECTION = DB.collection('mail');

        // updateMany dovrebbe usare la seguente action: NON è fattibile ! 
        // let action={"$set":{"password":bcrypt.hashSync("password", 10) }};

        COLLECTION.find({}).toArray((err, data) => {
            async.forEach(data,
                function(item, callback) {
                    // controllo che il campo password esista e NON contenga già una stringa bcrypt.
                    // le stringhe bcrypt sono lunghe 60 e inizano con $2[ayb]$
                    let regex = new RegExp("^\\$2[ayb]\\$.{56}$");
                    if ("password" in item && !regex.test(item["password"])) {
                        console.log(item["_id"]);
                        item["password"] = bcrypt.hashSync(item["password"], 10)
                        let filter = { "_id": item["_id"] };
                        let action = { "$set": { "password": item["password"] } };
                        COLLECTION.updateOne(filter, action, function(err, data) {
                            callback(err);
                        });
                    } else
                        callback(false);
                },
                function(err) {
                    if (err)
                        error(req, res, err, ERRORS.QUERY_EXECUTE);
                    else
                        console.log("operazione eseguita correttamente");
                    client.close();
                });
        });
    }
});


function error(req, res, err, httpError) {
    console.log(err.code + ' - ' + err.message);
    // res.status(httpError.CODE);
    // res.send(httpError.MESSAGE);
}