
const IncorporationModel = require('../../models/incorporationModel');


const addIncorporation = async (Incorporation) => {
  return IncorporationModel.createIncorporation(Incorporation);
};

const getIncorporation = async () => {
  return IncorporationModel.getIncorporation();
}

const getIncorporationAll = async () => {
  return IncorporationModel.getIncorporationAll();
}

const removeIncorporation = async (IncorporationId) => {
  return IncorporationModel.deleteIncorporation(IncorporationId);
};

const modifyIncorporation = async (Incorporation) => {
  return IncorporationModel.updateIncorporation(Incorporation);
};


module.exports = {
  addIncorporation,
  getIncorporation,
  removeIncorporation,
  modifyIncorporation,
  getIncorporationAll
};