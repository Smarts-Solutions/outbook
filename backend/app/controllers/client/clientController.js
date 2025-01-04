const clientService = require('../../services/client/clientService');


const addClient = async (req, res) => {
  try {
     const { ...client } = req.body;
    
       const result = await clientService.addClient(client);

       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const addClientDocument = async (req, res) => {
  try {
      const { ...client } = req.body;
      const result = await clientService.addClientDocument(client);
      if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });
      }else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
    }
    catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const deleteClientFile = async (req, res) => {
  try {
      const { ...client } = req.body;
      const result = await clientService.deleteClientFile(client);
      if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });
      }else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
    }
    catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}


const clientAction = async (req, res) => {
  try {
     const { ...client } = req.body;

      const result = await clientService.clientAction(client);
      if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}



const clientUpdate = async (req, res) => {
  try {
      const { ...client } = req.body;
      const result = await clientService.clientUpdate(client);
      if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });  
      }else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}



module.exports = {
  addClient,
  clientAction,
  clientUpdate,
  addClientDocument,
  deleteClientFile
};