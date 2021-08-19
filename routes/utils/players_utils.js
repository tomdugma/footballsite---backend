const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";


async function getPlayerInfoByID(player_id) {
  const player = await axios.get(`${api_domain}/players/${player_id}`, {
    params: {
      include: "team",
      api_token: process.env.api_token,
    },
  });
  let full_name = player.data.data.fullname;
  let picture = player.data.data.image_path;
  let position = player.data.data.position_id;
  let common_name = player.data.data.common_name;
  let nationality = player.data.data.nationality;
  let birthcountry = player.data.data.birthcountry;
  let birthdate =  player.data.data.birthdate;
  let height = player.data.data.height;
  let weight = player.data.data.weight;
  let team_name = player.data.data.team.data.name;
  return {
    fullname:full_name,
    commonName:common_name,
    nationality:nationality,
    birthdate:birthdate,
    birthCountry:birthcountry,
    height:height,
    weight:weight,
    image:picture,
    position:position,
    team_name:team_name
  };
}

// async function getPlayerInfoByName(player_name) {
//   const players_lst = await axios.get(`${api_domain}/players/search/${player_name}`, {
//     params: {
//       include: "team.league",
//       api_token: process.env.api_token,
//     },
//   });
//   res.data.data.map((player) => playerList.push(player));
//   let players_info = await Promise.all(playerList);

//   let full_name = player.data.data.fullname;
//   let picture = player.data.data.image_path;
//   let position = player.data.data.position_id;
//   let team_name = player.data.data.team.data.name;
//   return {
//     fullname:full_name,
//     image:picture,
//     position:position,
//     team_name:team_name
//   };
// }


async function getPlayerInfoByName(playerName){
  let playerList=[];
  const res = await axios.get(`${api_domain}/players/search/${playerName}`, {
    params: {
      include:"team.league",
      api_token: process.env.api_token,
    },
  });

  res.data.data.forEach(player => {
    let team_name;
    let position_id;
    let position_name;
    // console.log(player.team.data.league.data.id )
    try
      {
      if (!(player.team.data.league.data.id == undefined) && !(player.team.data.league.data.id == 271)
      && !(player.team.data.name == undefined) )
      {
        
          if(player.team == undefined){
            team_name = null;
          }
          else{
            team_name = player.team.data.name;
          }
          if(player.position == undefined){
            position_id = null;
            position_name = null;
          }
          else{
            position_id = player.position.data.id;
            position_name = player.position.data.name;
          }
          
          playerList.push({"firstname": player.firstname, "lastname": player.lastname,"image_path": player.image_path ,
          "team_name": team_name, "position_num": position_id,"position_name": position_name})  
          
        }
      }
    catch (error) {
      next(error);        
    }
  
})
  return playerList;
}
    




function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name:name
    };
  });
}

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

  
function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name:name
    };
  });
}


async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerInfoByID = getPlayerInfoByID;
exports.getPlayerInfoByName = getPlayerInfoByName;
