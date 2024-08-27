
const statusTypeModel = require('../../models/statusTypeModel');


const addStatusType = async (StatusType) => {
  return statusTypeModel.createStatusType(StatusType);
};

const getStatusType = async () => {
  return statusTypeModel.getStatusType();
}

const getStatusTypeAll = async () => {
  return statusTypeModel.getStatusTypeAll();
}

const removeStatusType = async (StatusTypeId) => {
  return statusTypeModel.deleteStatusType(StatusTypeId);
};

const modifyStatusType = async (StatusType) => {
  return statusTypeModel.updateStatusType(StatusType);
};


// Master Status
const addMasterStatus = async(masterStatus) => {
  return statusTypeModel.createMasterStatus(masterStatus);
}

const getMasterStatus = async(masterStatus) => {
  return statusTypeModel.getMasterStatus(masterStatus);
}

const removeMasterStatus = async(masterStatus) => {
  return statusTypeModel.deleteMasterStatus(masterStatus);
}

const modifyMasterStatus = async(masterStatus)=>{
  return statusTypeModel.updateMasterStatus(masterStatus);
}


module.exports = {
  addStatusType,
  getStatusType,
  removeStatusType,
  modifyStatusType,
  getStatusTypeAll,
  addMasterStatus,
  getMasterStatus,
  removeMasterStatus,
  modifyMasterStatus
};