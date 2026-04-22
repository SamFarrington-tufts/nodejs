
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb+srv://Sfarrington:Br00kl1n@cluster0.hfopzip.mongodb.net/?appName=Cluster0";
var http = require('http');
var url = require('url');
var port = process.env.PORT || 3000;


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  urlObj = url.parse(req.url,true)
  path = urlObj.pathname;

  // creates a form on the home page for the user to input a place name or zip
  if (path == "/"){
    s = "<h3>Enter a place or zip<h3/> <br />" +
        "<form action='/process' method='get'>"+
        "<input type='text' name='userInput'><br />" +
        "<input type='submit'>" +
        "</form>";
	  res.write(s);
  } else if (path == "/process"){
      let input = urlObj.query.userInput;

    MongoClient.connect(mongoUrl, async function(err, db) {
        if(err){
            console.log(err);
            res.write(err);
            res.end();
        }else{
            var dbo = db.db("cs120");
            var collection = dbo.collection('places');

            // creates a query variable and assigns the zip or place name to it
            let query;
            if(!isNaN(input.charAt(0))){
                query = {zips : input};
            } else{
                query = {place : input};
            }

            // searches the collection for the query and prints the place name along with its
            // associated zips, while also printing the info to the console
            await collection.find(query).toArray(function(err, items){
                if(err){
                    console.log(err);
                    res.write(err);
                    res.end();
                } else{
                    if(items.length > 0){
                        let result = items[0];
                        res.write(result.place + "<br />");
                        console.log(result.place);
                        
                        result.zips.forEach(function(zip){
                            res.write(zip + "<br />");
                            console.log(zip);
                        });
                    } else{
                        res.write("No results found for " + input);
                        console.log("No results found for " + input);
                    }
                }
                db.close();
                res.end();
            });
        }
    }); 
  }
  
}).listen(port);
