
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Sfarrington:Br00kl1n@cluster0.hfopzip.mongodb.net/?appName=Cluster0";


MongoClient.connect(url, async function(err, db) {
if(err){
    return console.log(err);
}else{
    var dbo = db.db("cs120");
    var collection = dbo.collection('places');

    // deletes all entries from the database
    await collection.deleteMany({}, function(err, res){
        if(err){
            console.log(err)
        }else{
            console.log("The database has been cleared");
        }

        db.close();
    });
}
}); 

