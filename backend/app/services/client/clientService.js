
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
  else if(action === "delete"){
    return clientModel.deleteClient(client);
  }
  else{
   return
  }
};

module.exports = {
  addClient,
  clientAction
};