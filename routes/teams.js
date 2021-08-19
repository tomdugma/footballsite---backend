var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
//8DQtNPfI95iKoxfoGCtfVvJmfZBcBATGDL3wpmMALYCDgtbLEBWVNG7siVx8

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const team_squad_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    const team_past_games = await teams_utils.getPastGames(
      req.params.teamId
    );
    const team_future_games = await teams_utils.getFutureGames(
      req.params.teamId
    );

    const team_name_logo = await teams_utils.getTeamNameLogoById(
      req.params.teamId
    );
    
    res.status(200).send({team_name: team_name_logo.team_name , team_logo: team_name_logo.logo, players: team_squad_details,past_games: team_past_games, future_games: team_future_games});
    }catch (error) {
    next(error);
  }
});

router.get('/SearchTeamByName/:teamName', async (req, res, next) => {
  try {
    const team_id = await teams_utils.getTeamIdByName(
      req.params.teamName
    );

    const team_squad_details = await players_utils.getPlayersByTeam(
      team_id.id
    );
    const team_past_games = await teams_utils.getPastGames(
      team_id.id
    );
    const team_future_games = await teams_utils.getFutureGames(
      team_id.id
    );
    const team_name_logo = await teams_utils.getTeamNameLogoById(
      team_id.id
    );
    
    res.status(200).send({team_name: team_name_logo.team_name , team_logo: team_name_logo.logo, players: team_squad_details,past_games: team_past_games, future_games: team_future_games});
    } catch (error) {
    next(error);
  }
});
module.exports = router;
