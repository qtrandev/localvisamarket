var request = require('request');
var fs = require('fs');

var data = JSON.stringify({
    "systemsTraceAuditNumber" : "451001",
    "retrievalReferenceNumber" : "330000550000",
    "localTransactionDateTime" : "2016-05-25T14:33:00",
    "acquiringBin" : "408999",
    "acquirerCountryCode" : "840",
    "senderPrimaryAccountNumber" : "4005520000011126",
    "senderCardExpiryDate" : "2020-03",
    "senderCurrencyCode" : "USD",
    "amount" : "100",
    "businessApplicationId" : "AA",
    "surcharge" : "0",
    "foreignExchangeFeeTransaction" : "11.99",
    "cavv" : "0700100038238906000013405823891061668252",
    "cardAcceptor" : {
        "name" : "Acceptor 1",
        "terminalId" : "ABCD1234",
        "idCode" : "ABCD1234ABCD123",
        "address" : {
            "state" : "CA",
            "county" : "San Mateo",
            "country" : "USA",
            "zipCode" : "94404"
        }
    }
});

var req = request.defaults();

var userId = 'GWV71HN5A707XNFENGVR21anrqsLFSBJ4-zRJo8INGfQY2wbo' ;
var password = '5Spw6VC6r5iU0zSDMRv794Ch9MScIjTmmFW4I4L';
var keyFile = 'key.pem';
var certificateFile ='cert.pem';

var appRouter = function(app) {
  app.get("/", function(req, res) {
    res.send(
      "Local Visa Market<br><br>" +
      "Usage:<br><br>"+
      "<a href='/'>/</a> : <br>"+
      "Home<br><br>"+
      "<a href='/account?username=qtrandev'>/account?username=qtrandev</a> : <br>"+
      "Sample account information<br><br>"+
      "<a href='/visa'>/visa</a> : <br>"+
      "Send sample request to visa. Not working since .pem files not present.<br><br>"+
      "<a href='/products'>/products</a> : <br>"+
      "Sample list of products<br>"
    );
  });

  app.get("/visa", function(requ, res) {

    req.post({
        uri : "https://sandbox.api.visa.com/visadirect/fundstransfer/v1/pullfundstransactions",
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certificateFile),
        headers: {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
          'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64')
        },
        body: data
      }, function(error, response, body) {
        if (!error) {
          console.log("Response Code: " + response.statusCode);
          console.log("Headers:");
          for(var item in response.headers) {
            console.log(item + ": " + response.headers[item]);
          }
          console.log("Body: "+ body);
          res.send(body);
        } else {
          console.log("Got error: " + error.message);
        }
      }
    );
  });

  app.get("/account", function(req, res) {
    var accountMock = {
        "username": "qtrandev",
        "password": "1234",
        "twitter": "@qtrandev"
    }
    if(!req.query.username) {
        return res.send({"status": "error", "message": "missing username"});
    } else if(req.query.username != accountMock.username) {
        return res.send({"status": "error", "message": "wrong username"});
    } else {
        return res.send(accountMock);
    }
  });

  app.post("/account", function(req, res) {
    if(!req.body.username || !req.body.password || !req.body.twitter) {
        return res.send({"status": "error", "message": "missing a parameter"});
    } else {
        return res.send(req.body);
    }
  });
  
  app.get("/products", function(req, res) {
    res.send(
      [
        {
          id: '1',
          productName: 'iPhone 6s Plus 64GB',
          productDescription: 'The iPhone is an engineering marvel.',
          productPrice: '$699',
          productImage: 'http://www.qtrandev.com/thriftee/iphone.png',
          sellerName: 'Zac Thomas'
        },
        {
          id: '2',
          productName: 'Nike Jordan',
          productDescription: 'The best shoes money can buy.',
          productPrice: '$149',
          productImage: 'http://www.qtrandev.com/thriftee/nike.png',
          sellerName: 'Michael Jardyn'
        },
        {
          id: '3',
          productName: 'Fixed Bike',
          productDescription: 'Fixed-speed bikes are the best bikes for casual riding.',
          productPrice: '$130',
          productImage: 'http://www.qtrandev.com/thriftee/bike.png',
          sellerName: 'Lance Sharapova'
        }
      ]
    );
  });
}

module.exports = appRouter;
