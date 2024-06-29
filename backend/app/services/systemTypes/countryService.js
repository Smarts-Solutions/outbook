
const countryModel = require('../../models/countryModel');


const addCountry = async (Country) => {
  return countryModel.createCountry(Country);
};

const getCountry = async () => {
  return countryModel.getCountry();
}

const removeCountry = async (CountryId) => {
  return countryModel.deleteCountry(CountryId);
};

const modifyCountry = async (Country) => {
  return countryModel.updateCountry(Country);
};


module.exports = {
  addCountry,
  getCountry,
  removeCountry,
  modifyCountry
};