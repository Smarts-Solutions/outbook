const pool = require("../config/database");
const { SatffLogUpdateOperation } = require("../utils/helper");

const createJobType = async (JobType) => {
  const { service_id, type } = JobType;
  const checkQuery = `SELECT 1 FROM job_types WHERE type = ? AND service_id = ?`;
  const query = `
    INSERT INTO job_types (service_id,type)
    VALUES (?,?)
    `;

  try {

    const [check] = await pool.query(checkQuery, [type, service_id]);
    if (check.length > 0) {
      return { status: false, message: "Job Type already exists." };
    }
    const [result] = await pool.execute(query, [service_id, type]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: JobType.StaffUserId,
        ip: JobType.ip,
        date: currentDate.toISOString().split('T')[0],
        module_name: "job types",
        log_message: `created job types ${type}`,
        permission_type: "created",
        module_id: result.insertId
      }
    );
    return { status: true, message: 'Job Type created successfully.', data: result.insertId };
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};

const getJobType = async (JobType) => {
  const { service_id } = JobType;
  if (service_id == undefined) {
    return []
  }
  const query = `
    SELECT job_types.id, job_types.type , job_types.status ,services.name as service_name FROM job_types JOIN services ON job_types.service_id = services.id 
    WHERE job_types.service_id = ?
    ORDER BY job_types.id DESC 
    `;

  try {
    const [result] = await pool.execute(query, [service_id]);
    return result;
  } catch (err) {
    console.log("Error selecting data:", err);
    throw err;
  }
};

const deleteJobType = async (JobTypeId) => {

  const [[existType]] = await pool.execute(`SELECT type FROM job_types WHERE id = ?`, [JobTypeId.id]);


  if (parseInt(JobTypeId.id) > 0) {

    const [assignedChecklist] = await pool.execute(
      `SELECT COUNT(*) AS count FROM checklists WHERE job_type_id = ?`,
      [JobTypeId.id]
    );
    if (assignedChecklist[0].count > 0) {
      return { status: false, message: `Job Type ${existType.type} is assigned to existing checklists.`, key: "warning" };
    }


    const [assignedJobs] = await pool.execute(
      `SELECT COUNT(*) AS count FROM jobs WHERE job_type_id = ?`,
      [JobTypeId.id]
    );
    if (assignedJobs[0].count > 0) {
      return { status: false, message: `Job Type ${existType.type} is assigned to existing jobs.`, key: "warning" };
    }
  }


  if (parseInt(JobTypeId.id) > 0) {
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: JobTypeId.StaffUserId,
        ip: JobTypeId.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "job types",
        log_message: `deleted job types ${existType.type}`,
        permission_type: "deleted",
        module_id: JobTypeId.id,
      }
    );
  }
  const query = `
    DELETE FROM job_types WHERE id = ?
    `;
  try {
    await pool.execute(query, [JobTypeId.id]);
    return { status: true, message: "Job type deleted successfully" };
  } catch (err) {
    console.log("Error deleting data:", err);
    return { status: false, message: "failed", key: "" };
  }
};

const updateJobType = async (JobType) => {
  const { id, ...fields } = JobType;
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
    UPDATE job_types
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;
  try {
    const [[existStatus]] = await pool.execute(`SELECT status FROM job_types WHERE id = ?`, [id]);
    let status_change = "Deactivate"
    if (JobType.status == "1") {
      status_change = "Activate"
    }
    let log_message = existStatus.status === JobType.status ?
      `edited job types ${JobType.type}` :
      `changes the job types status ${status_change} ${JobType.type}`
    const [result] = await pool.execute(query, values);
    if (result.changedRows) {
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: JobType.StaffUserId,
          ip: JobType.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "job types",
          log_message: log_message,
          permission_type: "updated",
          module_id: id,
        }
      );
    }
    return { status: true, message: 'Job Type updated successfully.', data: result.affectedRows };
  } catch (err) {
    console.log("Error updating data:", err);
    throw err;
  }
};

// Task Module
const addTask = async (task) => {
  const { name, service_id, job_type_id } = task;
  try {
    const query = `
     INSERT INTO task (name,service_id,job_type_id,budgeted_hour)
     VALUES (?, ?, ? ,?)
     `;
    let taskadd = ""
    for (const val of name) {
      const checkQuery = `
                SELECT id FROM task WHERE name = ? AND service_id = ? AND job_type_id = ?
            `;
      const [existing] = await pool.execute(checkQuery, [
        val.name,
        service_id,
        job_type_id,
      ]);
      if (existing.length === 0) {
        taskadd += val.name + ","
        const [result] = await pool.execute(query, [
          val.name,
          service_id,
          job_type_id,
          val.budgeted_hour
        ]);
      }
    }
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: task.StaffUserId,
        ip: task.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "task",
        log_message: `created task ${taskadd}`,
        permission_type: "created",
        module_id: 0,
      }
    );

    return { status: true, message: "Task Add Successfully.", data: [] };
  } catch (err) {
    return { status: false, message: "Error adding task." };
  }
};

const updateTask = async (task) => {
  const { id, name,budgeted_hour, service_id, job_type_id } = task;
   // check task name already exist
  const checkQuery = `
    SELECT id , name FROM task WHERE name = ? AND service_id = ? AND job_type_id = ? AND id != ?
  `;
  const [existing] = await pool.execute(checkQuery, [
    name,
    service_id,
    job_type_id,
    id
  ]);
  if (existing.length > 0) {
    return { status: false, message: "Task name already exists." };
  }
  const query = `
    UPDATE task
    SET name = ?,
    budgeted_hour = ?
    WHERE id = ? 
    `;
  try {
    
    const [result] = await pool.execute(query, [name,budgeted_hour,id]);
    if (result.changedRows) {
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: task.StaffUserId,
          ip: task.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "task",
          log_message: `edited task ${existing.name} to ${name}`,
          permission_type: "updated",
          module_id: id,
        }
      );
    }
    return { status: true, message: "Task updated successfully.", data: result.affectedRows };
  } catch (err) {
    return { status: false, message: "Error updating task." };
  }
 
}

const deleteTask = async (task) => {
  const { id } = task;
  try {
    const [[existName]] = await pool.execute(`SELECT name FROM task WHERE id = ?`, [id]);
    await pool.execute("DELETE FROM task WHERE id = ?", [id]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: task.StaffUserId,
        ip: task.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "task",
        log_message: `deleted task ${existName.name}`,
        permission_type: "deleted",
        module_id: id,
      }
    );
    return { status: true, message: "Task deleted successfully." };
  } catch (err) {
    return { status: false, message: "Error deleting task." };
  }
};

const getTask = async (task) => {
  const { service_id, job_type_id } = task;

  const query = `
    SELECT 
    task.id,
    task.name,
    task.service_id,
    task.job_type_id,
    task.status,
    services.name AS service_name,
    job_types.type AS job_type_type,
    task.budgeted_hour,
    CASE WHEN client_job_task.task_id IS NOT NULL THEN 1 ELSE 0 END AS is_assigned
    FROM 
    task
    JOIN services ON services.id = task.service_id
    JOIN job_types ON job_types.id = task.job_type_id
    LEFT JOIN client_job_task ON client_job_task.task_id = task.id
    WHERE task.service_id = ? AND task.job_type_id = ?
    GROUP BY task.id
    ORDER BY id DESC
    `;
  try {
    const [result] = await pool.execute(query, [service_id, job_type_id]);
    return { status: true, message: "task get successfully.", data: result };
  } catch (err) {
    console.log("Error getting task:", err);
    return { status: false, message: "Error get task." };
  }
};

const addChecklist = async (checklist) => {

  const {
    service_id,
    job_type_id,
    client_type_id,
    check_list_name,
    status,
    task,
  } = checklist;


  let customer_id = checklist.customer_id
  if (customer_id == null || customer_id == '' || customer_id == undefined) {
    customer_id = 0
  }



  try {
    const query = `
    INSERT INTO checklists (customer_id,service_id,job_type_id,client_type_id,check_list_name,status)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      customer_id,
      service_id,
      job_type_id,
      client_type_id,
      check_list_name,
      status,
    ]);
    const checklist_id = result.insertId;
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: checklist.StaffUserId,
        ip: checklist.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "checklist",
        log_message: `created checklist ${check_list_name}`,
        permission_type: "created",
        module_id: checklist_id,
      }
    );


    const checklistTasksQuery = `
    INSERT INTO checklist_tasks (checklist_id,task_id,task_name,budgeted_hour)
    VALUES (?, ?, ?, ?)
    `;
    for (const valTask of task) {
      const { task_id, task_name, budgeted_hour } = valTask;
      if (task_id == "" || task_id == null || task_id == undefined) {


        const InsertTaskquery = `
            INSERT INTO task (name,service_id,job_type_id)
            VALUES (?, ?, ?)
            `;

        const checkQuery = `
                SELECT id FROM task WHERE name = ? AND service_id = ? AND job_type_id = ?
            `;
        const [existing] = await pool.execute(checkQuery, [
          task_name,
          service_id,
          job_type_id,
        ]);
        if (existing.length === 0) {
          const [result] = await pool.execute(InsertTaskquery, [
            task_name,
            service_id,
            job_type_id,
          ]);
          const task_id = result.insertId;
          const [result1] = await pool.execute(checklistTasksQuery, [
            checklist_id,
            task_id,
            task_name,
            budgeted_hour,
          ]);
        }
      } else {
        const [result] = await pool.execute(checklistTasksQuery, [
          checklist_id,
          task_id,
          task_name,
          budgeted_hour,
        ]);
      }
    }

    return { status: true, message: "checklist add successfully.", data: [] };
  } catch (err) {
    return { status: false, message: "Error added checklist." };
  }
};

const getChecklist = async (checklist) => {
  const { customer_id } = checklist;

  console.log("customer_id", customer_id)
  let query = `
    SELECT
    checklists.id AS checklists_id,
    checklists.check_list_name AS check_list_name,
    checklists.status AS status,
    customers.id AS customer_id,
    services.id AS service_id,
    services.name AS service_name,
    job_types.id AS job_type_id,
    job_types.type AS job_type_type,
    client_types.id AS client_type_id,
    client_types.type AS client_type_type,
    checklists.client_type_id  AS checklists_client_type_id
    FROM checklists 
    JOIN 
         customers ON customers.id = checklists.customer_id
    JOIN 
         services ON services.id = checklists.service_id
    JOIN
         job_types ON job_types.id = checklists.job_type_id
    JOIN
         client_types ON client_types.id = checklists.client_type_id          
    WHERE checklists.customer_id = ?
    ORDER BY checklists.id DESC
    `;


  if (parseInt(customer_id) === 0) {
    query = `
    SELECT
    checklists.id AS checklists_id,
    checklists.check_list_name AS check_list_name,
    checklists.status AS status,
    services.id AS service_id,
    services.name AS service_name,
    job_types.id AS job_type_id,
    job_types.type AS job_type_type,
    client_types.id AS client_type_id,
    client_types.type AS client_type_type,
    checklists.client_type_id  AS checklists_client_type_id
    FROM checklists 
    JOIN 
         services ON services.id = checklists.service_id
    JOIN
         job_types ON job_types.id = checklists.job_type_id
    JOIN
         client_types ON client_types.id = checklists.client_type_id          
    WHERE checklists.customer_id = ?
    ORDER BY checklists.id DESC
    `;
  }

  try {
    const [result] = await pool.execute(query, [customer_id]);
    return {
      status: true,
      message: "checklist get successfully.",
      data: result,
    };
  } catch (err) {
    return { status: false, message: "Error get checklist." };
  }
};

const getByIdChecklist = async (checklist) => {
  const { checklist_id } = checklist;
  const query = `
    SELECT
    checklists.id AS checklists_id,
    checklists.check_list_name AS check_list_name,
    checklists.status AS status,
    checklists.client_type_id AS client_type_id,
    customers.id AS customer_id,
    services.id AS service_id,
    services.name AS service_name,
    job_types.id AS job_type_id,
    job_types.type AS job_type_type,
 
    checklist_tasks.id AS checklist_tasks_id,
    checklist_tasks.task_id AS task_id,
    checklist_tasks.task_name AS task_name,
    checklist_tasks.budgeted_hour AS budgeted_hour
    FROM checklists 
    LEFT JOIN 
         customers ON customers.id = checklists.customer_id
    JOIN 
         services ON services.id = checklists.service_id
    JOIN
         job_types ON job_types.id = checklists.job_type_id

    JOIN
         checklist_tasks ON checklist_tasks.checklist_id = checklists.id
    WHERE checklists.id = ?
    ORDER BY checklist_tasks.id DESC
    `;
  try {
    const [rows] = await pool.execute(query, [checklist_id]);
    let result = {};

    if (rows.length > 0) {
      result = {
        checklists_id: rows[0].checklists_id,
        check_list_name: rows[0].check_list_name,
        status: rows[0].status,
        customer_id: rows[0].customer_id,
        service_id: rows[0].service_id,
        service_name: rows[0].service_name,
        job_type_id: rows[0].job_type_id,
        job_type_type: rows[0].job_type_type,
        client_type_id:
          rows[0].client_type_id.length > 0
            ? rows[0].client_type_id.split(",")
            : [],
        // client_type_type: rows[0].client_type_type,
        task: rows.map((row) => ({
          checklist_tasks_id: row.checklist_tasks_id,
          task_id: row.task_id,
          task_name: row.task_name,
          budgeted_hour: row.budgeted_hour,
        })),
      };
    }
    return {
      status: true,
      message: "checklist get successfully.",
      data: result,
    };
  } catch (err) {
    return { status: false, message: "Error get checklist." };
  }
};

const deleteChecklist = async (checklist) => {
  const { checklist_id } = checklist;
  try {
    const [[existName]] = await pool.execute(`SELECT check_list_name FROM checklists WHERE id = ?`, [checklist_id]);

    await pool.execute("DELETE FROM checklists WHERE id = ?", [checklist_id]);
    await pool.execute("DELETE FROM checklist_tasks WHERE checklist_id = ?", [
      checklist_id,
    ]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: checklist.StaffUserId,
        ip: checklist.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "checklist",
        log_message: `deleted checklist ${existName.check_list_name}`,
        permission_type: "deleted",
        module_id: checklist_id,
      }
    );

    return { status: true, message: "checklist deleted successfully." };
  } catch (err) {
    return { status: false, message: "Error deleting checklist." };
  }
};

const updateChecklist = async (checklist) => {
  const {
    checklists_id,
    service_id,
    job_type_id,
    client_type_id,
    check_list_name,
    status,
    task,
  } = checklist;

  let customer_id = checklist.customer_id;
  if (customer_id == null || customer_id == '' || customer_id == undefined) {
    customer_id = 0
  }

  // EXIST checklist tasks id
  const [ExistChecklistsids] = await pool.execute(
    "SELECT id  FROM `checklist_tasks` WHERE checklist_id =" + checklists_id
  );
  const idArray = await ExistChecklistsids.map((item) => item.id);
  let arrayInterId = [];



  try {
    // Update query for checklists table
    const updateChecklistQuery = `
    UPDATE checklists 
    SET customer_id = ?, 
        service_id = ?, 
        job_type_id = ?, 
        client_type_id = ?, 
        check_list_name = ?, 
        status = ?
    WHERE id = ?
    `;
    const [checklistResult] = await pool.execute(updateChecklistQuery, [
      customer_id,
      service_id,
      job_type_id,
      client_type_id,
      check_list_name,
      status,
      checklists_id,
    ]);

    if (checklistResult.changedRows > 0) {
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: checklist.StaffUserId,
          ip: checklist.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "checklist",
          log_message: `edited checklist ${check_list_name}`,
          permission_type: "updated",
          module_id: checklists_id,
        }
      );
    }

    // Update query for checklist_tasks table
    const updateChecklistTasksQuery = `
    UPDATE checklist_tasks 
    SET task_name = ?, 
        budgeted_hour = ?
    WHERE checklist_id = ? AND task_id = ?
    `;
    for (const valTask of task) {
      const { checklist_tasks_id, task_id, task_name, budgeted_hour } = valTask;
      arrayInterId.push(checklist_tasks_id);
      if (['', null, undefined].includes(task_id)) {
        const InsertTaskquery = `
            INSERT INTO task (name,service_id,job_type_id)
            VALUES (?, ?, ?)
            `;

        const checkQuery = `
                SELECT id FROM task WHERE name = ? AND service_id = ? AND job_type_id = ?
            `;
        const [existing] = await pool.execute(checkQuery, [
          task_name,
          service_id,
          job_type_id,
        ]);
        if (existing.length === 0) {
          const [result] = await pool.execute(InsertTaskquery, [
            task_name,
            service_id,
            job_type_id,
          ]);
          const task_id = result.insertId;


          const checklistTasksQuery = `
          INSERT INTO checklist_tasks (checklist_id,task_id,task_name,budgeted_hour)
          VALUES (?, ?, ?, ?)
          `;
          const [result1] = await pool.execute(checklistTasksQuery, [
            checklists_id,
            task_id,
            task_name,
            budgeted_hour,
          ]);

        } else {

          const checklistTasksQuery = `
    INSERT INTO checklist_tasks (checklist_id,task_id,task_name,budgeted_hour)
    VALUES (?, ?, ?, ?)
    `;
          const [result1] = await pool.execute(checklistTasksQuery, [
            checklists_id,
            existing[0].id,
            task_name,
            budgeted_hour,
          ]);

        }

      } else {
        await pool.execute(updateChecklistTasksQuery, [
          task_name,
          budgeted_hour,
          checklists_id,
          task_id,
        ]);
      }
    }

    let deleteIdArray = idArray.filter((id) => !arrayInterId.includes(id));
    if (deleteIdArray.length > 0) {
      for (const id of deleteIdArray) {
        await pool.execute("DELETE FROM checklist_tasks WHERE id = ?", [id]);
      }
    }

    return {
      status: true,
      message: "Checklist updated successfully.",
      data: [],
    };
  } catch (err) {
    console.error("Error updating checklist:", err);
    return { status: false, message: "Error updating checklist." };
  }
};

const customerGetService = async (task) => {
  const { customer_id } = task;
  const query = `
    SELECT 
    services.id AS service_id,
    services.name AS service_name
    FROM customer_services
    JOIN
    services ON services.id = customer_services.service_id
    WHERE customer_services.customer_id = ?
    ORDER BY customer_services.id DESC
    `;
  try {
    const [result] = await pool.execute(query, [customer_id]);
    return { status: true, message: "service get successfully.", data: result };
  } catch (err) {
    return { status: false, message: "Error get service." };
  }
};

const getClientTypeChecklist = async (checklist) => {
  const query = `
    SELECT * FROM client_types
    ORDER BY id DESC
    `;
  try {
    const [result] = await pool.execute(query);
    return {
      status: true,
      message: "getClientTypeChecklist get successfully.",
      data: result,
    };
  } catch (err) {
    return { status: false, message: "Error get getClientTypeChecklist." };
  }
};

// const getByServiceWithJobType = async (checklist) => {
//   const { service_id, job_type_id, clientId } = checklist;
//   let customer_id = (checklist.customer_id).toString()
//   const query = `SELECT
//     checklists.id AS checklists_id,
//     checklists.check_list_name AS check_list_name,
//     checklists.status AS status,
//     checklists.client_type_id AS client_type_id,
//     clients.client_type AS client_type,
//     customers.id AS customer_id,
//     services.id AS service_id,
//     services.name AS service_name,
//     job_types.id AS job_type_id,
//     job_types.type AS job_type_type,
//     checklist_tasks.task_id AS task_id,
//     checklist_tasks.budgeted_hour AS budgeted_hour,
//     task.name AS task_name
//     FROM checklists
//     LEFT JOIN
//         customers ON customers.id = checklists.customer_id
//     JOIN
//         clients ON clients.customer_id = customers.id
//     JOIN
//         services ON services.id = checklists.service_id
//     JOIN
//         job_types ON job_types.id = checklists.job_type_id
//     JOIN
//         checklist_tasks ON checklist_tasks.checklist_id = checklists.id
//     JOIN
//         task ON task.id = checklist_tasks.task_id
//     WHERE checklists.service_id = ${Number(service_id)}
//     AND clients.id = ${Number(clientId)}
//     AND checklists.job_type_id = ${Number(job_type_id)}
//     OR FIND_IN_SET(checklists.client_type_id,clients.client_type) > 0
//     AND checklists.customer_id = ${Number(customer_id)} AND
//         checklists.is_all_customer LIKE '%${customer_id}]%' OR
//         checklists.is_all_customer LIKE '[${customer_id},%' OR
//         checklists.is_all_customer LIKE '%,${customer_id}]' OR
//         checklists.is_all_customer LIKE '${customer_id}]'
//     GROUP BY  checklist_tasks.task_id
//     ORDER BY checklists.id DESC;`
//     try {
//     const [result] = await pool.execute(query);
//     //console.log("result",result)
//     return {
//       status: true,
//       message: "checklist get successfully.",
//       data: result,
//     };
//     } catch (err) {

//     return { status: false, message: "Error get checklist." };
//   }
// };

const getByServiceWithJobType = async (checklist) => {
  const { service_id, job_type_id } = checklist;
  const query = `SELECT
    task.id AS task_id,
    task.budgeted_hour AS budgeted_hour,
    task.name AS task_name
    FROM task
    WHERE task.service_id = ${Number(service_id)} AND task.job_type_id = ${Number(job_type_id)}
    ORDER BY task.id DESC;`
    try {
    const [result] = await pool.execute(query);
   // console.log("result",result)
    return {
      status: true,
      message: "get Task in Job Create successfully.",
      data: result,
    };
    } catch (err) {
    return { status: false, message: "Error get task." };
  }
};

module.exports = {
  createJobType,
  deleteJobType,
  updateJobType,
  getJobType,
  addTask,
  updateTask,
  deleteTask,
  getTask,
  addChecklist,
  getChecklist,
  getByIdChecklist,
  deleteChecklist,
  updateChecklist,
  customerGetService,
  getClientTypeChecklist,
  getByServiceWithJobType,
};
