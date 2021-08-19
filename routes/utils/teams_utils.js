const axios = require("axios");
const { response } = require("express");
const DButils = require("../utils/DButils");
require("dotenv").config();
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";


async function getPastGames(team_id) {
  let team_past_games = [];
    
  const past_home_team_games = await DButils.execQuery(`SELECT game_date_time,
  home_team_id,
  guest_team_id,
  field,
  game_id,
  home_team_score,
  guest_team_score,
  referee_id FROM dbo.games WHERE home_team_id = ${team_id} AND is_past = 1`);
  const past_guest_team_games = await DButils.execQuery(`SELECT game_date_time,
  home_team_id,
  guest_team_id,
  field,
  game_id,
  home_team_score,
  guest_team_score,
  referee_id FROM dbo.games WHERE guest_team_id = ${team_id} AND is_past = 1`);
  team_past_games.push(past_home_team_games);
  team_past_games.push(past_guest_team_games);

  return team_past_games;
}
async function getFutureGames(team_id) {
  let team_future_games = [];
    
  const future_home_team_games = await DButils.execQuery(`SELECT game_date_time,
  home_team_id,
  guest_team_id,
  field,
  game_id,
  referee_id FROM dbo.games WHERE home_team_id = ${team_id} AND is_past = 0`);
  const future_guest_team_games = await DButils.execQuery(`SELECT game_date_time,
  home_team_id,
  guest_team_id,
  field,
  game_id,
  referee_id FROM dbo.games WHERE guest_team_id = ${team_id} AND is_past = 0`);
  team_future_games.push(future_home_team_games);
  team_future_games.push(future_guest_team_games);

  return team_future_games;
}

async function getTeamIdByName(team_name) {
  const team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/search/${team_name}`,
    {
      params: {
        include: "league",
        api_token: process.env.api_token,
      },
    }
  );

  if(!(team.data.data[0].league.data.id == undefined) &&  team.data.data[0].league.data.id == 271)
    return team.data.data[0];
  else
    res.status(404).send('team name was not found');
}

async function getTeamNameLogoById(team_id) {
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  team_name = team.data.name;
  logo = team.data.logo_path;
  return {
    team_name: team_name,
    logo: logo,
  };
}

exports.getTeamNameLogoById = getTeamNameLogoById;
exports.getFutureGames = getFutureGames;
exports.getPastGames = getPastGames;
exports.getTeamIdByName = getTeamIdByName;
