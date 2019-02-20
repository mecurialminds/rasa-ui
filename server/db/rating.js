const db = require('./db')

function getBotRating(req, res, next) {
 console.log("rating.getBotRating");
  var botID = parseInt(req.params.bot_id);
  
  db.any("select  (select count(*) from rating) as totalUsers, \n"+
		"(select count(*) from rating where rating::INTEGER>8) as promoters, \n"+
		"(select count(*) from rating where rating::INTEGER between 7 and 8) as passives, \n"+
		"(select count(*) from rating where rating::INTEGER between 0 and 6) as detractors, \n"+
		"(select count(*) from rating where gender='male') as maleUsers, \n"+
		"(select count(*) from rating where gender='female') as femaleUsers \n"+		
	   "from rating where bot_id::INTEGER= "+botID+" LIMIT 1")
    .then(function (data) {
      console.log(botID);
      res.status(200)
        .json({
          rating: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function insertBotRating(req, res, next) {
  console.log("rating.insertBotRating");
  console.log(req.body)
  db.any('insert into rating(bot_id, rating, gender) values(${bot_id}, ${rating}, ${gender}) RETURNING bot_id',
    req.body)
    .then(function (resp) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted',
          bot_id: req.body.bot_id
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  getBotRating: getBotRating,
  insertBotRating: insertBotRating
};
