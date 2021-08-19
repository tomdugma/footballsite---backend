const axios = require('axios');


  async function getCountryList() {
    axios.get('https://restcountries.eu/rest/v2/all')
    .then(response => {
    console.log(response.body.data);
    return response.body.data
  })
  .catch(error => {
    console.log(error);
  });
};

exports.getCountryList = getCountryList;

