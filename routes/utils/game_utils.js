const axios = require("axios");
require("dotenv").config();
const DButils = require("../utils/DButils");

async function getPastGames() {
  const past_games = await DButils.execQuery(`SELECT game_date_time,
  home_team_id,
  guest_team_id,
  field,
  dbo.games.game_id,
  home_team_score,
  guest_team_score,
  referee_id,
  event_type,
  minute_game,
  event_description
  FROM dbo.games JOIN dbo.diary_events ON dbo.games.game_id = dbo.diary_events.game_id WHERE is_past = 1`);
  return past_games;
}

async function getFutureGames() {
    const future_games = await DButils.execQuery(`SELECT game_date_time,
    home_team_id,
    guest_team_id,
    field,
    game_id,
    referee_id FROM dbo.games WHERE is_past = 0`);
    return future_games;
  }
  exports.getPastGames = getPastGames;
  exports.getFutureGames = getFutureGames;