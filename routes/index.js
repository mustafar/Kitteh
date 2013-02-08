
/*
 * GET KITTEH!!
 */

exports.index = function (req, res) {
  var $ = require('jquery'),
    Mongojs = require('mongojs');
  var clientId = '2e0077af5c2b4aef81c5f4349ac1558d',
    dbName = 'apps',
    collectionName = 'kitteh',
    apiUrl = 'https://api.instagram.com/v1/tags/kitty/media/recent?client_id=' + clientId;

  // set up database
  var db = Mongojs(dbName, [collectionName]);

  // fetch kitteh
  console.log(apiUrl);
  $.getJSON(apiUrl, function(response){
    console.log(response);
    var random = Math.floor(Math.random() * (response.data.length + 1)),
        item = response.data[random];
    kitteh = {
          'id': item['id'],
          'timeCreated': Number(item['created_time']),
          'timeAdded': Math.round((new Date()).getTime() / 1000),
          'link': item['link'],
          'url': item['images']['standard_resolution']['url'],
          'isConfirmed': false
        };
    
    db[collectionName].find({id: kitteh.id}, function (err, docs) {
      if (err) throw err;

      // kitteh not found. add it?
      if (docs.length === 0) {
        db[collectionName].save(kitteh);

      // seen this kitteh
      } else {
      }
    });

    // send to view
    db[collectionName].find({}, function (err, docs) {
      res.render ('index', {
        title: 'Kitteh',
        kitteh: docs
      })
    });

  });

};
