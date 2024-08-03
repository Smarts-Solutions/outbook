const pool = require('../config/database');
const deleteUploadFile = require('../middlewares/deleteUploadFile');
//   deleteUploadFile('1722257591646-SSSSSSSS.jpg')

async function generateNextUniqueCode() {
    const [rows] = await pool.execute('SELECT client_code FROM clients ORDER BY id DESC LIMIT 1');
    let newCode = '00001'; // Default code if table is empty
    if (rows.length > 0) {
        const inputString = rows[0].client_code;
        const parts = inputString.split('_');
        const lastPart = parts[parts.length - 1];
        const lastCode = lastPart;
        const nextCode = parseInt(lastCode, 10) + 1;
        // console.log("nextCode", nextCode);
        newCode = "0000" + nextCode
    }

    return newCode;
}

const createClient = async (client) => {
    // Customer Code(cust+CustName+UniqueNo)
    let UniqueNo = await generateNextUniqueCode()
    let client_id; 
    const { client_type,customer_id,client_industry_id,trading_name,trading_address,vat_registered,vat_number,website } = client;
     
    const [ExistCustomer] = await pool.execute('SELECT trading_name FROM customers WHERE id ='+customer_id);
    // console.log("ExistCustomer",ExistCustomer[0].trading_name)
    const existCustomerName =  ExistCustomer[0].trading_name
    const firstThreeLettersexistCustomerName = existCustomerName.substring(0, 3)
    const firstThreeLettersClientName = trading_name.substring(0, 3)
    const client_code = "cli_"+firstThreeLettersexistCustomerName+"_"+ firstThreeLettersClientName + "_" + UniqueNo;
    const query = `
INSERT INTO clients (client_type,customer_id,client_industry_id,trading_name,client_code,trading_address,vat_registered,vat_number,website)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    try {
        const [result] = await pool.execute(query, [client_type,customer_id,client_industry_id,trading_name,client_code,trading_address,vat_registered,vat_number,website]);
        client_id = result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }


    if(client_type == "1"){
        const {first_name, last_name, phone, email, residential_address } = client;
        try {
        const query2 = `
        INSERT INTO client_contact_details (client_id, first_name, last_name, phone, email, residential_address)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
            const [result2] = await pool.execute(query2, [client_id, first_name, last_name, phone, email, residential_address]);
           
        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

    else if(client_type == "2"){
        const {company_name,entity_type,company_status,company_number,registered_office_address,incorporation_date,incorporation_in,contactDetails } = client;


       try {
        const query1 = `
        INSERT INTO client_company_information (client_id,company_name,entity_type,company_status,company_number,registered_office_address,incorporation_date,incorporation_in)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
            const [result1] = await pool.execute(query1, [client_id, company_name,entity_type,company_status,company_number,registered_office_address,incorporation_date,incorporation_in]);
       } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
       }

     
        try {
        const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,phone,email)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
           
        for (const detail of contactDetails) {
            // console.log("detail",detail)
            let role = detail.role;
            let first_name = detail.first_name;
            let last_name = detail.last_name;
            let phone = detail.phone;
            let email = detail.email;
            const [result2] = await pool.execute(query2, [client_id ,role, first_name, last_name, phone, email]);

        }  
           
        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

    else if(client_type == "3"){
        const {contactDetails } = client;
        try {
        const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
           
        for (const detail of contactDetails) {
            // console.log("detail",detail)
            let role = detail.role;
            let first_name = detail.first_name;
            let last_name = detail.last_name;
            let email = detail.email;
            let alternate_email = detail.alternate_email;
            let phone = detail.phone;
            let alternate_phone = detail.alternate_phone;
            let authorised_signatory_status = detail.authorised_signatory_status;
            const [result2] = await pool.execute(query2, [client_id ,role,first_name,last_name,email,alternate_email,phone,alternate_phone,authorised_signatory_status]);

        }  
           
        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }


    return client_id

};

const getClient = async (client) => {
const {cutomer_id} = client;
console.log("cutomer_id",cutomer_id)
const query = `
    SELECT  
        clients.id AS id,
        clients.trading_name AS client_name,
        clients.client_code AS client_code,
        clients.status AS status,
        client_types.type AS client_type_name,
        client_contact_details.email AS email,
        client_contact_details.phone AS phone
    FROM 
        clients
    JOIN 
        client_types ON client_types.id = clients.client_type
    LEFT JOIN 
        client_contact_details ON client_contact_details.id = (
            SELECT MIN(cd.id)
            FROM client_contact_details cd
            WHERE cd.client_id = clients.id
        )
    WHERE clients.customer_id = ?
`;

try {
    const [result] = await pool.execute(query, [cutomer_id]);
    return result;
} catch (err) {
    console.error('Error selecting data:', err);
    return [];
}


}

const getByidClient = async (client) => {
    const { client_id } = client;
    const [ExistClient] = await pool.execute('SELECT client_type FROM `clients` WHERE id =' + client_id);
    
    const client_type = ExistClient[0].client_type;

    //Solo Traders Details
    if (client_type == "1") {
        const query = `
SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id, 
    clients.client_industry_id AS client_industry_id, 
    clients.trading_name AS trading_name, 
    clients.client_code AS client_code, 
    clients.trading_address AS trading_address, 
    clients.vat_registered AS vat_registered, 
    clients.vat_number AS vat_number, 
    clients.website AS website, 
    clients.status AS status, 
    client_contact_details.*,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id
FROM 
    clients
JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role 
WHERE 
    clients.id = ?
`;

        const [rows] = await pool.execute(query, [client_id]);
        if (rows.length > 0) {

            const clientData = {
                id: rows[0].client_id,
                client_type: rows[0].client_type,
                customer_id: rows[0].customer_id,
                client_industry_id: rows[0].client_industry_id,
                trading_name: rows[0].trading_name,
                client_code: rows[0].client_code,
                trading_address: rows[0].trading_address,
                vat_registered: rows[0].vat_registered,
                vat_number: rows[0].vat_number,
                website: rows[0].website,
                status: rows[0].status,


            };

            const contactDetails = rows.map(row => ({
                customer_contact_person_role_id: row.customer_role_contact_id,
                customer_contact_person_role_name: row.customer_role_contact_name,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                phone: row.phone,
                residential_address: row.residential_address,
                // Add other contact detail fields as needed
            }));

            const result = {
                client: clientData,
                contact_details: contactDetails
            };

            return result
            // Return or further process `result` as needed
        } else {
            // console.log("No customer found with the given ID.");
            return []
        }
        ;
    }else{
        return []
    }
   
   
}

const deleteClient = async (client) => {
    const { client_id } = client;
    console.log("client_id", client_id);
    const query = `
    DELETE FROM clients WHERE id = ?`;

    try {
        await pool.execute(query, [client_id]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }

}





module.exports = {
    createClient,
    getClient,
    getByidClient,
    deleteClient

};