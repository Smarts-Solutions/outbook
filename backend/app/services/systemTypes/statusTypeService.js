
const statusTypeModel = require('../../models/statusTypeModel');


const addStatusType = async (StatusType) => {
  return statusTypeModel.createStatusType(StatusType);
};

const getStatusType = async () => {
  return statusTypeModel.getStatusType();
}

const removeStatusType = async (StatusTypeId) => {
  return statusTypeModel.deleteStatusType(StatusTypeId);
};

const modifyStatusType = async (StatusType) => {
  return statusTypeModel.updateStatusType(StatusType);
};


module.exports = {
  addStatusType,
  getStatusType,
  removeStatusType,
  modifyStatusType
};