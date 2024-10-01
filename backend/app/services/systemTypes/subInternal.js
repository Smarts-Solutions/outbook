
const subInternalModel = require('../../models/subInternalModal');


const AddSubInternal = async (subInternal) => {
    return subInternalModel.AddSubInternal(subInternal);
};

const getSubInternal = async (subInternal) => {
    return subInternalModel.getSubInternal(subInternal);
}

const getSubInternalAll = async () => {
    return subInternalModel.getSubInternalAll();
}

const removeSubInternal = async (subInternal) => {
    return subInternalModel.removeSubInternal(subInternal);
};

const modifySubInternal = async (subInternal) => {
    return subInternalModel.modifySubInternal(subInternal);
};


module.exports = {
    AddSubInternal,
    getSubInternal,
    getSubInternalAll,
    removeSubInternal,
    modifySubInternal
};