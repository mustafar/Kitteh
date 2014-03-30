/*
 * GET KITTEH!!
 */

exports.index = function (req, res) {
  var $ = require ('jquery'),
      NConf = require ('nconf'),
      Mongojs = require ('mongojs');

  // nconf setup
  NConf.use ('file', {file: 'config.json' });
  NConf.load ();

  // set up instagram api
  var clientId = process.env.INSTAGRAM_CLIENT_ID || NConf.get('instagram_client_id'),
      apiUrl = 'https://api.instagram.com/v1/tags/catsofinstagram/media/recent?client_id=' + clientId;

  // set up database
  var dbName = 'apps',
      collectionName = 'kitteh',
      db = Mongojs (process.env.MONGOHQ_URL || dbName, [collectionName]);

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
        'randomNumber': Math.random(),
        'isDeleted': false
      };

      db[collectionName].find ({id: kitteh.id}, function (err, docs) {
        if (err) {
          console.log (err);
          // render json response
          res.json({message: 'Server Error. Sorry :(', status: 'FAIL'});
          return;
        }

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
  db[collectionName].find ({isDeleted: false})
    .limit (100)
    .sort ({timeAdded: -1}, function (err, docs) {
    res.render ('index', {
      'title': 'Kitteh!!',
      'kittehs': docs
    });
  });

};

/*
 * GET RANDOM KITTEH!!
 */

exports.random = function (req, res) {
  var $ = require ('jquery'),
      NConf = require ('nconf'),
      Mongojs = require ('mongojs');
  var dbName = 'apps',
      collectionName = 'kitteh';

  // set up database
  var db = Mongojs (process.env.MONGOHQ_URL || dbName, [collectionName]);

  // nconf setup
  NConf.use ('file', {file: 'config.json' });
  NConf.load ();

  // set up instagram api
  var clientId = process.env.INSTAGRAM_CLIENT_ID || NConf.get('instagram_client_id'),
      apiUrl = 'https://api.instagram.com/v1/tags/catsofinstagram/media/recent?client_id=' + clientId;

  db[collectionName].find ({isDeleted: false})
    .limit (100, function (err, docs) {
    if (err || docs.length == 0) {
      console.log (err);
      // render json response
      res.json({message: 'Server Error. Sorry :(', status: 'FAIL'});
      return;
    }
    var random = Math.floor (Math.random() * docs.length);
    res.render ('random', {
      'title': 'Kitteh!!',
      'kitteh': docs[random]
    });
  });

  // send to view
  /*var rand = Math.random();
  db[collectionName].findOne ({randomNumber: {$gte : rand}}, function (err, doc) {
    if (!doc) {
      db[collectionName].findOne ({randomNumber: {$lte : rand}}, function (err, doc) {
        if (!doc) {
          doc = {};
        }
        res.render ('random', {
          'title': 'Kitteh!!',
          'kitteh': doc
        });
      });

    } else {
      res.render ('random', {
        'title': 'Kitteh!!',
        'kitteh': doc
      });
    }
  });*/

};

/*
 * DELETE KITTEH!!
 */

exports.del = function (req, res) {
  var $ = require ('jquery'),
      Mongojs = require ('mongojs');
  var dbName = 'apps',
      collectionName = 'kitteh';

  // set up database
  var db = Mongojs (process.env.MONGOHQ_URL || dbName, [collectionName]);

  db[collectionName].update({id: req.params.id},
      {$set: {isDeleted: true}});

  // render json
  res.json({
    kittehId: req.params.id,
    message: 'Deleted',
    status: 'OK'
  });
  
};
