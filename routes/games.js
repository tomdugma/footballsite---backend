var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const league_details = require("./utils/league_utils");
const game_utils = require("./utils/game_utils");


router.post("/addGame", async (req, res, next) => {
  try {
      let game_date_time = req.body.game_date_time;
      if (game_date_time === undefined)
      {
          console.log("please check your input");
          throw { status: 409, message: "one or more values missing" };
      }
      let home_team_id = req.body.home_team_id;
      let guest_team_id = req.body.guest_team_id;
      let field = req.body.field;
      let referee_id = req.body.referee_id;
    await DButils.execQuery(`INSERT INTO dbo.games (game_date_time,home_team_id,\
        guest_team_id,field,is_past,referee_id) VALUES \
      (DATEADD(year, 0, '${game_date_time}')
     , ${home_team_id}, ${guest_team_id}, '${field}',${0},${referee_id})`
    );
    res.status(201).send('game was created');
  } catch (error) {
    next(error);
  }
});


router.put("/updateGame", async (req, res, next) => {
  try{
    if(!req.session || !req.session.user_id)
    {
      throw { status: 401, message: "please login before trying the following request" };
    }
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.session.user_id}'`
      )
    )[0];
    if(user.is_admin === 0)
    {
      throw { status: 403, message: "no premission to do the following" };
    }
    let home_score = req.body.home_team_score;
    let guest_score = req.body.guest_team_score;
    let game_id = req.body.game_id;
    await DButils.execQuery(`UPDATE dbo.games SET home_team_score = ${home_score}, guest_team_score=${guest_score},is_past=1
    WHERE game_id = ${game_id}`);
    res.status(201).send("update result was successfully created.");
  } catch (error) {
    next(error);
  }

});

router.post("/addEvent/:game_id", async (req, res, next) => {
  try{
      let game_id = parseInt( req.params.game_id);
      console.log(game_id)
      
      if(!req.session || !req.session.user_id)
      {
        throw { status: 401, message: "please login before trying the following request" };
      }
      const user = (
          await DButils.execQuery(
            `SELECT * FROM dbo.users WHERE username = '${req.session.user_id}'`
          )
        )[0];
      if(user.is_admin === 0)
      {
      throw { status: 403, message: "no premission to do the following" };
      }
      const game_is_past = (
        await DButils.execQuery(
          `SELECT is_past FROM dbo.games WHERE game_id = ${game_id}`
        )
      );
      if (game_is_past === 0)
      {
        throw { status: 403, message: "you are trying to add an event to a future game ! it must be past game" };
      }
      // let event_id = req.body.event_id;
      // let game_id = req.body.game_id;
      let event_type = req.body.event_type;
      let event_data_time = req.body.event_data_time;
      let minute_game = req.body.minute_game;
      let event_description = req.body.event_description;
      
      await DButils.execQuery(`INSERT INTO dbo.diary_events (game_id,event_type,\
          event_data_time,minute_game,event_description) VALUES \
        (${game_id},'${event_type}',DATEADD(year, 0, '${event_data_time}'), ${minute_game},'${event_description}')`);
      res.status(201).send("insert event to diary was successfully created.");
    } catch (error) {
      next(error);
    }
  });

  router.get("/currentCycleGames", async (req, res, next) => {
    try {
      const past_games = await game_utils.getPastGames();
      const future_games = await game_utils.getFutureGames();
      res.status(201).send({past_games: past_games, future_games: future_games});
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
