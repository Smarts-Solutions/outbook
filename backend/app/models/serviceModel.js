const pool = require('../config/database');
const { SatffLogUpdateOperation } = require('../utils/helper');

const createServices = async (Services) => {
    const { name } = Services;
    const checkQuery = `SELECT 1 FROM services WHERE name = ? AND deleted = '0'`;
    const query = `
    INSERT INTO services (name)
    VALUES (?)
    `;

    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return { status: false, message: 'Service already exists.' };
        }
        const [result] = await pool.execute(query, [name]);
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: Services.StaffUserId,
                ip: Services.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "services",
                log_message: `created services ${name}`,
                permission_type: "created",
                module_id: result.insertId
            }
        );

        if (result.insertId > 0) {
            const service_id = result.insertId
            const type = name
            const queryJobType = `
            INSERT INTO job_types (service_id,type)
            VALUES (?,?)
            `;
            const [resultJobType] = await pool.execute(queryJobType, [service_id, type]);
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: Services.StaffUserId,
                    ip: Services.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: "job_types",
                    log_message: `created job type ${type}`,
                    permission_type: "created",
                    module_id: resultJobType.insertId
                }
            );
        }

        return { status: true, message: 'Service created successfully.', data: result.insertId };
    } catch (err) {
        console.log('Error inserting data:', err);
        throw err;
    }
};

const getServices = async () => {
    const query = `
    SELECT * FROM services WHERE status = '1' AND deleted = '0'
    ORDER BY id DESC 
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.log('Error selecting data:', err);
        throw err;
    }
}

const getServicesAll = async () => {
    // const query = `
    // SELECT * FROM services
    // WHERE deleted = '0'
    // ORDER BY id DESC 
    // `;
    const query = `SELECT 
    services.*,
    CASE 
        WHEN jobs.service_id IS NOT NULL THEN TRUE
        ELSE NULL
    END AS job_service_exists

    FROM services
    LEFT JOIN jobs ON jobs.service_id = services.id
    WHERE services.deleted = '0'
    GROUP BY services.id
    ORDER BY services.id DESC
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.log('Error selecting data:', err);
        throw err;
    }
}

const deleteServices = async (ServicesId) => {
    const [[existName]] = await pool.execute(`SELECT name FROM services WHERE id = ?`, [ServicesId.id]);

    if (parseInt(ServicesId.id) > 0) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: ServicesId.StaffUserId,
                ip: ServicesId.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "services",
                log_message: `deleted services ${existName.name}`,
                permission_type: "deleted",
                module_id: ServicesId.id
            }
        );
    }
    
    // delete customer services
    const queryCustomerServices = `DELETE FROM customer_services WHERE service_id = ? `;
    try {
        await pool.execute(queryCustomerServices, [ServicesId.id]);
    } catch (err) {
        console.log('Error deleting data:', err);
        throw err;
    }

    const query = `DELETE FROM services WHERE id = ? `;
    try {
        await pool.execute(query, [ServicesId.id]);

    } catch (err) {
        console.log('Error deleting data:', err);
        throw err;
    }
};

// const deletExistingJob = async (Services) => {
//     let { data, ip, StaffUserId } = Services
//     let { delete_service_id , jobs_data  } = data

//     // console.log("Services --->>>", Services)
//     // console.log("jobs_data --->>>", jobs_data)
//     // return;
   

//     // let [get_job_id] = await pool.execute(`SELECT id , client_id FROM jobs WHERE service_id = ?`, [deleted_service_info.id]);

    
//     for (let index = 0; index < jobs_data?.length; index++) {
//         const element = jobs_data[index];
//         const job_id = element?.job_id;
//         const client_id = element?.client_id;
//         const service_id = element?.service_id;
//         const job_type_id = element?.job_type_id;
//         const tasks_budget_hours = element?.tasks_budget_hours;


        

//         //// find job 
//         let query = `
//             UPDATE jobs SET
//             service_id = ${service_id},job_type_id = ${job_type_id}
//             WHERE id=${job_id}
//         `;

//         await pool.query(query);

 
//         // Task Insert
//         // Delete job tasks
//         await pool.execute(`DELETE FROM client_job_task WHERE job_id = ?`, [job_id]);

//         for (let index = 0; index < tasks_budget_hours?.length; index++) {
//             // insert client_job_task this tasks
//             const task = tasks_budget_hours[index];
//              const task_id = task?.task_id;
//              const budgeted_hour = task?.budgeted_hour;
//             console.log("task --->>>", task)
//             const insertQuery = `
//             INSERT INTO 
//             client_job_task 
//             (
//                 job_id,
//                 client_id,
//                 task_id,
//                 time
//             ) VALUES 
//              (?,?,?,?)`;

//             const insertValues = [
//                 job_id,
//                 client_id,
//                 task_id,
//                 budgeted_hour 
//             ];

//             await pool.query(insertQuery, insertValues);
//         }


//     }
   
//      const query = `UPDATE services SET name = CONCAT(name,'_'${delete_service_id}), deleted = '1' WHERE id = ? `;
//      await pool.execute(query, [delete_service_id]);
//      return { status: true, message: 'Service deleted successfully.', data: [] };





// }

const deletExistingJob = async (Services) => {
  const { data } = Services;
  const { delete_service_id, jobs_data } = data;

  if (!jobs_data?.length) {
    return { status: true, message: "No jobs to update.", data: [] };
  }

  try {
    // STEP 1: Process all jobs in parallel (controlled)
    await Promise.all(
      jobs_data.map(async (job) => {
        const {
          job_id,
          client_id,
          service_id,
          job_type_id,
          tasks_budget_hours = [],
        } = job;

        // 1. Update job
        await pool.execute(
          `UPDATE jobs SET service_id = ?, job_type_id = ? WHERE id = ?`,
          [service_id, job_type_id, job_id]
        );

        // 2. Delete old tasks
        await pool.execute(
          `DELETE FROM client_job_task WHERE job_id = ?`,
          [job_id]
        );

        // 3. Insert new tasks (parallel inside job)
        if (tasks_budget_hours.length > 0) {
          const taskQueries = tasks_budget_hours.map((task) => {
            return pool.execute(
              `INSERT INTO client_job_task 
               (job_id, client_id, task_id, time) 
               VALUES (?, ?, ?, ?)`,
              [
                job_id,
                client_id,
                task.task_id,
                task.budgeted_hour,
              ]
            );
          });

          await Promise.all(taskQueries);
        }
      })
    );

    // STEP 2: Update service (SAFE query fix)
    await pool.execute(
      `UPDATE services 
       SET name = CONCAT(name, '_', ?), deleted = '1' 
       WHERE id = ?`,
      [delete_service_id, delete_service_id]
    );

    return {
      status: true,
      message: "Service deleted successfully.",
      data: [],
    };
  } catch (error) {
    console.error("Error in deletExistingJob:", error);
    throw error;
  }
};

const updateServices = async (Services) => {
    const { id, ...fields } = Services;
    const name = Services.name
    // Create an array to hold the set clauses
    const setClauses = [];
    const values = [];
    // Iterate over the fields and construct the set clauses dynamically
    for (const [key, value] of Object.entries(fields)) {
        if (key != "ip" && key != "StaffUserId") {
            setClauses.push(`${key} = ?`);
            values.push(value);
        }
    }
    // Add the id to the values array for the WHERE clause
    values.push(id);
    // Construct the final SQL query
    const query = `
    UPDATE services
    SET ${setClauses.join(', ')}
    WHERE id = ?
    `;

    // Check if the record exists
    const checkQuery = `SELECT 1 FROM services WHERE name = ? AND id != ?`;
    try {
        const [check] = await pool.execute(checkQuery, [name, id]);
        if (check.length > 0) {
            return { status: false, message: 'Service already exists.' };
        }
        const [[existStatus]] = await pool.execute(`SELECT status FROM services WHERE id = ?`, [id]);
        let status_change = "Deactivate"
        if (Services.status == "1") {
            status_change = "Activate"
        }
        let log_message = existStatus.status === Services.status ?
            // `edited services ${type}`:
            `edited services ` :

            `changes the services status ${status_change} ${name}`

        const [result] = await pool.execute(query, values);
        if (result.changedRows) {
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: Services.StaffUserId,
                    ip: Services.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: "services",
                    log_message: log_message,
                    permission_type: "updated",
                    module_id: Services.id
                }
            );
        }
        return { status: true, message: 'Service updated successfully.', data: result.affectedRows };
    } catch (err) {
        console.log('Error updating data:', err);
        throw err;
    }
};




module.exports = {
    createServices,
    deleteServices,
    updateServices,
    getServices,
    getServicesAll,
    deletExistingJob

};