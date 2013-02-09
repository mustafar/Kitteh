/*
 * GET KITTEH!!
 */

exports.index = function (req, res) {
  var $ = require ('jquery'),
      Mongojs = require ('mongojs');
  var clientId = '2e0077af5c2b4aef81c5f4349ac1558d',
      dbName = 'apps',
      collectionName = 'kitteh',
      apiUrl = 'https://api.instagram.com/v1/tags/kitty/media/recent?client_id=' + clientId;

  // set up database
  var db = Mongojs (process.env.MONGOHQ_URL || dbName, [collectionName]);

  // fetch kitteh
  var doFetchKitteh = true;
  if (doFetchKitteh) {

    $.getJSON (apiUrl, function (response){
      var random = Math.floor (Math.random () * (response.data.length + 1)),
          item = response.data[random];

      if (!item) {
        return;
      }

      kitteh = {
        'id': item['id'],
        'timeCreated': Number (item['created_time']),
        'timeAdded': Math.round ((new Date ()).getTime () / 1000),
        'link': item['link'],
        'url': item['images']['standard_resolution']['url'],
        'isDeleted': false
      };

      db[collectionName].find ({id: kitteh.id}, function (err, docs) {
        if (err) throw err;

       // kitteh not found. add it
        if (docs.length === 0) {
          var doAdd = false;

          // lowercase all tags
          for (var i=0; i<item.tags.length; i++) {
            item.tags[i] = item.tags[i].toLowerCase ();
          }

          // Rule - if less than 5 tags, add it
          if (item.tags.length < 5) {
            doAdd = true;

          // Rule - if less than 10 tags, add
          // only if other catlike tags present
          } else if (item.tags.length < 10) {
            var catTags = ['kitteh', 'meow', 'cat'],
              numFound = 0;
            for (var i=0; i<catTags.length; i++) {
              if (item.tags.indexOf (catTags[i]) >= 0) {
                numFound += 1;
              }
            }
            var confidence = Math.floor ((numFound/item.tags.length) * 100);
            if (confidence > 20) {
              doAdd = true;
            }
          }

          // overrides
          var negativeCats = [
            'hello',
            'hellokitty'],
            numFound = 0;
          for (var i=0; i<negativeCats.length; i++) {
            if (item.tags.indexOf (negativeCats[i]) >= 0) {
              numFound += 1;
            }
          }
          if (numFound > 0) {
            doAdd = false;
          }

          // add to kitty-db
          if (doAdd) {
            db[collectionName].save (kitteh);
          }

        // seen this kitteh
        } else {
        }
      });

    });
  }

  // send to view
  db[collectionName].find ({})
    .limit (100)
    .sort ({timeAdded: -1}, function (err, docs) {
    res.render ('index.jade', {
      'title': 'Kitteh',
      'kittehs': docs
    });
  });

};
