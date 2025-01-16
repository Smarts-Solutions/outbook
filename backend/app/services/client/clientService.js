
const clientModel = require('../../models/clientModel');

const addClient = async (client) => {
  return clientModel.createClient(client);
};

const clientAction = async (client) => {
  const {action} = client
  if(action === "get"){
    return clientModel.getClient(client);
  }
  else if(action === "getByid"){
    return clientModel.getByidClient(client);
  }
  else if(action === "getCustomerId"){
    return clientModel.getCustomerId(client);
  }
  else if(action === "delete"){
    return clientModel.deleteClient(client);
  }
  else{
   return
  }
};
const clientUpdate = async (client) => {
  return clientModel.clientUpdate(client);
}; 

const addClientDocument = async (client) => {
  return clientModel.addClientDocument(client);
};

const deleteClientFile = async (client) => {
  return clientModel.deleteClientFile(client);
};

module.exports = {
  addClient,
  clientAction,
  clientUpdate,
  addClientDocument,
  deleteClientFile
};