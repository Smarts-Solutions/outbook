
const internalModel = require('../../models/internalModel');


const AddInternal = async (Internal) => {
  return internalModel.AddInternal(Internal);
};

const getInternal = async (InternalId) => {
  return internalModel.getInternal(InternalId);
}

const getInternalAll = async () => {
  return internalModel.getInternalAll();
}

const removeInternal = async (InternalId) => {
  return internalModel.removeInternal(InternalId);
};

const modifyInternal = async (Internal) => {
  return internalModel.modifyInternal(Internal);
};


module.exports = {
  AddInternal,
  getInternal,
  getInternalAll,
  removeInternal,
  modifyInternal
};