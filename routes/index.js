
/*
 * GET home page.
 */

exports.index = function (req, res) {
  var $ = require('jquery')
    , mongojs = require('mongojs')
    , canvas = require('canvas')
    , kittydar = require('kittydar')
    , clientId = '2e0077af5c2b4aef81c5f4349ac1558d'
    , dbName = 'apps'
    , collectionName = 'kitteh'
    , apiUrl = 'https://api.instagram.com/v1/tags/kitty/media/recent?client_id=' + clientId;

  // set up database
  var db = mongojs(dbName),
      kittehCollection = db.collection(collectionName);

  // fetch kitteh
  $.getJSON(apiUrl, function(response){
    for (var i=0; i<response.data.length; i++) {
      var item = response.data[i];
      /*db.kittehCollection.find({id: item.id}, function (err, docs) {
        console.log(docs);
      });*/
      console.log(item.id);
    }
  });
  res.render ('index', {
    title: 'Kitteh'
  })
};
