const DButils = require("./DButils");

async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${user_id}',${player_id})`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where user_id='${user_id}'`
  );
  return player_ids;
}
async function markGameAsFavorite(username, game_id) {
  await DButils.execQuery(
    `insert into dbo.FavoriteGames values ('${username}',${game_id})`
  );
}

async function getFavoriteGames(username) {
  const games = await DButils.execQuery(
    `select game_date_time,home_team_id,guest_team_id,field,is_past,referee_id from dbo.games join dbo.FavoriteGames on dbo.games.game_id = dbo.FavoriteGames.game_id where dbo.FavoriteGames.username='${username}' AND dbo.games.is_past=0 `
  );
  return games;
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.getFavoriteGames = getFavoriteGames;
exports.markGameAsFavorite = markGameAsFavorite;
