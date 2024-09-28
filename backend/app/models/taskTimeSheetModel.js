const pool = require('../config/database');
const deleteUploadFile = require('../../app/middlewares/deleteUploadFile');
const { SatffLogUpdateOperation, generateNextUniqueCodeJobLogTitle } = require('../../app/utils/helper');

const getTaskTimeSheet = async (timeSheet) => {
  const { job_id } = timeSheet;
  
  try {
    const query = `
     SELECT 
     client_job_task.id AS id,
     jobs.id AS job_id,
     task.id AS task_id,
     task.name AS task_name,
     services.id AS service_id,
     services.name AS service_name,
     job_types.id AS job_type_id,
     job_types.type AS job_type_type,
     client_job_task.task_status AS task_status,
     master_status.name AS task_status_name,
     client_job_task.time AS time
     FROM 
     jobs
     JOIN
     client_job_task ON client_job_task.job_id = jobs.id
     JOIN
     clients ON clients.id = jobs.client_id
     JOIN
     task ON task.id = client_job_task.task_id
     JOIN
     services ON services.id = task.service_id
     JOIN
     job_types ON job_types.id = task.job_type_id
     LEFT JOIN
     master_status ON master_status.id = client_job_task.task_status
     WHERE 
     jobs.id = client_job_task.job_id AND
     client_job_task.job_id = ?
     ORDER BY
     client_job_task.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
  
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }




}
const getjobTimeSheet = async (timeSheet) => {
  const { job_id } = timeSheet;
  
  try {
    const query = `
     SELECT 
     jobs.id AS job_id,
     jobs.budgeted_hours AS budgeted_hours,
     jobs.job_id AS job_code_id,
     jobs.total_hours AS total_hours,
     jobs.total_hours_status AS total_hours_status
     FROM 
     jobs
     WHERE 
     jobs.id = ?
  
     `;
    const [rows] = await pool.execute(query, [job_id]);

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
   
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }
}
const updateTaskTimeSheetStatus = async (timeSheet) => {

  const { id, task_status, time } = timeSheet;
  try {
    const query = `
     UPDATE 
     client_job_task
     SET
     task_status = ? , time = ?
     WHERE 
     id = ?
     `;
    const [rows] = await pool.execute(query, [task_status, time, id]);

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {

    return { status: false, message: 'Error getTaskTimeSheet .' };
  }
}

const updateJobTimeTotalHours = async (timeSheet) => {
  const { job_id, total_hours, total_hours_status } = timeSheet;
  try {
    const query = `
     UPDATE 
     jobs
     SET
     total_hours = ? , total_hours_status = ?
     WHERE 
     id = ?
     `;
    const [rows] = await pool.execute(query, [total_hours, total_hours_status, job_id]);
   
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }
}

const addMissingLog = async (missingLog) => {


  const { job_id, missing_log, missing_log_sent_on, missing_log_reviewed_by, status } = missingLog.body;

  let data = {
    table: 'missing_logs',
    field: 'missing_log_title',
    filter_id: `job_id = ${job_id}`,
    prefix: 'M'
  }
  const UniqueNoTitle = await generateNextUniqueCodeJobLogTitle(data)

  let missing_log_prepared_date = missingLog.body.missing_log_prepared_date == 'null' ? null : missingLog.body.missing_log_prepared_date

  let missing_log_reviewed_date = missingLog.body.missing_log_reviewed_date == 'null' ? null : missingLog.body.missing_log_reviewed_date

  const missing_log_document = missingLog.files;

  try {
    const query = `
     INSERT INTO 
     missing_logs
      (job_id, missing_log, missing_log_sent_on,missing_log_prepared_date,missing_log_title,missing_log_reviewed_by,missing_log_reviewed_date,status)
      VALUES
      (?,?,?,?,?,?,?,?)
      `;
    const [rows] = await pool.execute(query, [
      job_id,
      missing_log,
      missing_log_sent_on,
      missing_log_prepared_date,
      UniqueNoTitle,
      missing_log_reviewed_by,
      missing_log_reviewed_date,
      status
    ]);
 
    if(rows.insertId > 0){
         const currentDate = new Date();
          await SatffLogUpdateOperation(
            {
              staff_id: missingLog.body.StaffUserId,
              ip: missingLog.body.ip,
              date: currentDate.toISOString().split('T')[0],
              module_name: 'job',
              log_message: `sent the missing logs for job code:`,
              permission_type: 'created',
              module_id: job_id,
            }
          );

      let update_status = 2;
      const [result] = await pool.execute(`UPDATE jobs SET status_type = ?  WHERE id = ?`, [update_status,job_id]);
    } 



    if (missing_log_document.length > 0) {
      for (let file of missing_log_document) {
        const file_name = file.filename;
        const original_name = file.originalname;
        const file_type = file.mimetype;
        const file_size = file.size;


        const insertQuery = `
            INSERT INTO missing_logs_documents (
                missing_log_id, file_name, original_name, file_type, file_size
            ) VALUES (?, ?, ?, ?, ?)
        `;

        try {
          const [result] = await pool.execute(insertQuery, [
            rows.insertId,
            file_name,
            original_name,
            file_type,
            file_size
          ]);

        } catch (error) {
        
        }
      }
    }

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {

    return { status: false, message: 'Error addMissingLog .' };
  }
}

const getMissingLog = async (missingLog) => {
  const { job_id } = missingLog
  try {
    const query = `
    SELECT 
    missing_logs.id AS id,
    missing_logs.job_id AS job_id,
    missing_logs.missing_log AS missing_log,
    missing_logs.missing_paperwork AS missing_paperwork,
    DATE_FORMAT(missing_logs.missing_log_sent_on, '%Y-%m-%d') AS missing_log_sent_on,
    DATE_FORMAT(missing_logs.missing_log_prepared_date, '%Y-%m-%d') AS missing_log_prepared_date,
    missing_logs.missing_log_title AS missing_log_title,
    missing_logs.missing_log_reviewed_by AS missing_log_reviewed_by,
    DATE_FORMAT(missing_logs.missing_log_reviewed_date, '%Y-%m-%d') AS missing_log_reviewed_date,
    DATE_FORMAT(missing_logs.missing_paperwork_received_on, '%Y-%m-%d') AS missing_paperwork_received_on,
    missing_logs.status AS status,
    CONCAT(
      SUBSTRING(customers.trading_name, 1, 3), '_', 
      SUBSTRING(clients.trading_name, 1, 3), '_',
      SUBSTRING(missing_logs.missing_log_title, 1, 15)
    ) AS title
    FROM 
    missing_logs
    JOIN jobs ON jobs.id = missing_logs.job_id
    JOIN customers ON customers.id = jobs.customer_id
    JOIN clients ON clients.id = jobs.client_id
    WHERE 
    missing_logs.job_id = ?
    ORDER BY
    missing_logs.id DESC;
`;
    const [rows] = await pool.execute(query, [job_id]);
  
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
   
    return { status: false, message: 'Error getMissingLog .' };
  }
}

const editMissingLog = async (missingLog) => {
  const { id, missing_log, missing_log_sent_on, missing_log_reviewed_by, status } = missingLog.body;
 
  let missing_log_prepared_date = missingLog.body.missing_log_prepared_date == 'null' ? null : missingLog.body.missing_log_prepared_date

  let missing_log_reviewed_date = missingLog.body.missing_log_reviewed_date == 'null' ? null : missingLog.body.missing_log_reviewed_date

  const missing_log_document = missingLog.files;

  const [[existMissingLog]] = await pool.execute(
    "SELECT id ,job_id, missing_log, DATE_FORMAT(missing_log_sent_on, '%Y-%m-%d') AS missing_log_sent_on,DATE_FORMAT(missing_log_prepared_date, '%Y-%m-%d') AS missing_log_prepared_date ,missing_log_reviewed_by,DATE_FORMAT(missing_log_reviewed_date, '%Y-%m-%d') AS missing_log_reviewed_date,status FROM missing_logs WHERE id = ? "
    , [id]);


  try {
    const query = `
     UPDATE 
     missing_logs
     SET
     missing_log = ?,
     missing_log_sent_on = ?,
     missing_log_prepared_date = ?,
     missing_log_reviewed_by = ?,
     missing_log_reviewed_date = ?,
     status = ?
     WHERE 
     id = ?
     `;
    const [rows] = await pool.execute(query, [missing_log, missing_log_sent_on, missing_log_prepared_date, missing_log_reviewed_by, missing_log_reviewed_date, status, id]);

    if(rows.changedRows > 0){

    let missing_log_msg = []
    if(parseInt(status) == 1){
      missing_log_msg.push('completed the missing logs')

    }else if(existMissingLog.missing_log != missing_log || existMissingLog.missing_log_sent_on != missing_log_sent_on || existMissingLog.missing_log_prepared_date != missing_log_prepared_date || existMissingLog.missing_log_reviewed_by != missing_log_reviewed_by || existMissingLog.missing_log_reviewed_date != missing_log_reviewed_date){
      missing_log_msg.push('edited the missing logs')
    }
    
    if(missing_log_msg.length > 0){
      const msgLog = missing_log_msg.length > 1
            ? missing_log_msg.slice(0, -1).join(', ') + ' and ' + missing_log_msg.slice(-1)
            : missing_log_msg[0];
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: missingLog.body.StaffUserId,
          ip: missingLog.body.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: 'job',
          log_message: `${msgLog} job code:`,
          permission_type: 'updated',
          module_id: existMissingLog.job_id,
        }
      );
     }
  

      const [job_id] = await pool.execute('SELECT job_id FROM  `missing_logs` WHERE id = ?', [id]);
      let update_status = 2;
      const [result] = await pool.execute(`UPDATE jobs SET status_type = ?  WHERE id = ?`, [update_status,job_id[0].job_id]);
    }

    if (missing_log_document.length > 0) {
      for (let file of missing_log_document) {
        const file_name = file.filename;
        const original_name = file.originalname;
        const file_type = file.mimetype;
        const file_size = file.size;


        const insertQuery = `
            INSERT INTO missing_logs_documents (
                missing_log_id, file_name, original_name, file_type, file_size
            ) VALUES (?, ?, ?, ?, ?)
        `;

        try {
          const [result] = await pool.execute(insertQuery, [
            id,
            file_name,
            original_name,
            file_type,
            file_size
          ]);

        } catch (error) {
          console.log('Error inserting file:', error);
        }
      }
    }

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
   
    return { status: false, message: 'Error editMissingLog .' };
  }
}

const getMissingLogSingleView = async (missingLog) => {
  const { id } = missingLog;
  try {
    const query = `
     SELECT 
     missing_logs.id AS id,
     DATE_FORMAT(missing_logs.missing_log_sent_on, '%Y-%m-%d') AS missing_log_sent_on,
     DATE_FORMAT(missing_logs.missing_paperwork_received_on, '%Y-%m-%d') AS missing_paperwork_received_on
     FROM 
     missing_logs
     WHERE 
     missing_logs.id = ?
     ORDER BY
     missing_logs.id DESC;
     `;
    const [rows] = await pool.execute(query, [id]);

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {

    return { status: false, message: 'Error getMissingLog .' };
  }

}

//Queries
const addQuerie = async (querie) => {
  const { job_id, queries_remaining, reviewed_by, query_sent_date, response_received, status } = querie.body;
  const query_document = querie.files;

  let data = {
    table: 'queries',
    field: 'query_title',
    filter_id: `job_id = ${job_id}`,
    prefix : 'Q'
  }

  const UniqueNoTitle = await generateNextUniqueCodeJobLogTitle(data)

  let missing_queries_prepared_date = querie.body.missing_queries_prepared_date == 'null' ? null : querie.body.missing_queries_prepared_date

  let final_query_response_received_date = querie.body.final_query_response_received_date == 'null' ? null : querie.body.final_query_response_received_date

  try {
    const query = `
     INSERT INTO 
     queries
      (job_id, queries_remaining, status ,query_title, reviewed_by, missing_queries_prepared_date, query_sent_date, response_received,final_query_response_received_date)
      VALUES
      (?,?,?,?,?,?,?,?,?)
      `;
    const [rows] = await pool.execute(query, [job_id, queries_remaining, status, UniqueNoTitle, reviewed_by, missing_queries_prepared_date, query_sent_date, response_received, final_query_response_received_date]);

    if(rows.insertId > 0){
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: querie.body.StaffUserId,
          ip: querie.body.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: 'job',
          log_message: `sent the queries for job code:`,
          permission_type: 'created',
          module_id: job_id,
        }
      );
      let update_status = 4;
      const [result] = await pool.execute(`UPDATE jobs SET status_type = ?  WHERE id = ?`, [update_status,job_id]);
    } 


    if (query_document.length > 0) {
      for (let file of query_document) {
        const file_name = file.filename;
        const original_name = file.originalname;
        const file_type = file.mimetype;
        const file_size = file.size;


        const insertQuery = `
            INSERT INTO queries_documents (
                query_id, file_name, original_name, file_type, file_size
            ) VALUES (?, ?, ?, ?, ?)
        `;

        try {
          const [result] = await pool.execute(insertQuery, [
            rows.insertId,
            file_name,
            original_name,
            file_type,
            file_size
          ]);

        } catch (error) {
          console.log('Error inserting file:', error);
        }
      }
    }

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error querie .' };
  }
}
const getQuerie = async (querie) => {
  const { job_id } = querie;
  try {
    const query = `
     SELECT 
      queries.id AS id,
      queries.queries_remaining AS queries_remaining,
      queries.query_title AS query_title,
      queries.reviewed_by AS reviewed_by,
      DATE_FORMAT(queries.missing_queries_prepared_date, '%Y-%m-%d') AS missing_queries_prepared_date,
      DATE_FORMAT(queries.query_sent_date, '%Y-%m-%d') AS query_sent_date,
      queries.response_received AS response_received,
      queries.response AS response,
      DATE_FORMAT(queries.final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date,
      queries.status AS status,
      CONCAT(
      SUBSTRING(customers.trading_name, 1, 3), '_', 
      SUBSTRING(clients.trading_name, 1, 3), '_',
      SUBSTRING(queries.query_title, 1, 15)
    ) AS title

     FROM 
      queries
    JOIN jobs ON jobs.id = queries.job_id
    JOIN customers ON customers.id = jobs.customer_id
    JOIN clients ON clients.id = jobs.client_id 
     WHERE 
      queries.job_id = ?
     ORDER BY
      queries.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);
 
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error querie .' };
  }

}

const getQuerieSingleView = async (querie) => {
  const { id } = querie;
  try {
    const query = `
     SELECT 
      queries.id AS id,
      DATE_FORMAT(queries.query_sent_date, '%Y-%m-%d') AS query_sent_date,
      queries.response_received AS response_received,
      queries.response AS response
     FROM 
      queries
     WHERE 
      queries.id = ?
     ORDER BY
      queries.id DESC;
     `;
    const [rows] = await pool.execute(query, [id]);
 
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error querie .' };
  }
}

const editQuerie = async (query) => {
  const { id, queries_remaining, reviewed_by, query_sent_date, response_received, status } = query.body;
  const query_document = query.files;

  let missing_queries_prepared_date = query.body.missing_queries_prepared_date == 'null' ? null : query.body.missing_queries_prepared_date

  let final_query_response_received_date = query.body.final_query_response_received_date == 'null' ? null : query.body.final_query_response_received_date


  const [[existQuerie]] = await pool.execute(
    "SELECT id ,job_id, queries_remaining, reviewed_by, DATE_FORMAT(missing_queries_prepared_date, '%Y-%m-%d') AS missing_queries_prepared_date, DATE_FORMAT(query_sent_date, '%Y-%m-%d') AS query_sent_date, response_received, response, DATE_FORMAT(final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date, status FROM queries WHERE id = ? "
    , [id]);


  try {
    const query_table = `
     UPDATE 
     queries
     SET
     queries_remaining = ?,
     status = ?,
     reviewed_by = ?,
     missing_queries_prepared_date = ?,
     query_sent_date = ?,
     response_received = ?,
     final_query_response_received_date = ?
     WHERE 
     id = ?
     `;
    const [rows] = await pool.execute(query_table, [queries_remaining, status, reviewed_by, missing_queries_prepared_date, query_sent_date, response_received, final_query_response_received_date, id]);

    if(rows.changedRows > 0){
      let querie_log_msg = []
      if(parseInt(status) == 3){
        querie_log_msg.push('completed the queries')
        }
      else if(existQuerie.queries_remaining != queries_remaining || existQuerie.reviewed_by != reviewed_by || existQuerie.missing_queries_prepared_date != missing_queries_prepared_date || existQuerie.query_sent_date != query_sent_date || existQuerie.response_received != response_received || existQuerie.final_query_response_received_date != final_query_response_received_date){
        querie_log_msg.push('edited the queries')
      }

     if(querie_log_msg.length > 0){
      const msgLog = querie_log_msg.length > 1
            ? querie_log_msg.slice(0, -1).join(', ') + ' and ' + querie_log_msg.slice(-1)
            : querie_log_msg[0];
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: query.body.StaffUserId,
          ip: query.body.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: 'job',
          log_message: `${msgLog} job code:`,
          permission_type: 'updated',
          module_id: existQuerie.job_id,
        }
       );
      
     }

      const [job_id] = await pool.execute('SELECT job_id FROM  `queries` WHERE id = ?', [id]);
      let update_status = 4;
      const [result] = await pool.execute(`UPDATE jobs SET status_type = ?  WHERE id = ?`, [update_status,job_id[0].job_id]);
    }


    if (query_document.length > 0) {
      for (let file of query_document) {
        const file_name = file.filename;
        const original_name = file.originalname;
        const file_type = file.mimetype;
        const file_size = file.size;


        const insertQuery = `
            INSERT INTO queries_documents (
                query_id, file_name , original_name, file_type, file_size 
            ) VALUES (?, ?, ?, ?, ?)
        `;
        const [rows] = await pool.execute(insertQuery, [id, file_name, original_name
          , file_type, file_size]);
      }
    }
    return { status: true, message: 'Success.', data: rows };
  }
  catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error editQuerie .' };
  }
}

// Draft
const getDraft = async (draft) => {
  const { job_id } = draft;
  try {
    const query = `
     SELECT 
      drafts.id AS id,
      drafts.job_id AS job_id,
      drafts.feedback_received AS feedback_received,
      drafts.updated_amendment AS updated_amendment,
      drafts.feedback AS feedback,
      drafts.was_it_complete AS was_it_complete,
      DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
      DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on,
      CONCAT(
      SUBSTRING(customers.trading_name, 1, 3), '_', 
      SUBSTRING(clients.trading_name, 1, 3), '_',
      SUBSTRING(drafts.draft_title, 1, 15)
    ) AS title
     FROM 
      drafts
    JOIN jobs ON jobs.id = drafts.job_id
    JOIN customers ON customers.id = jobs.customer_id
    JOIN clients ON clients.id = jobs.client_id  
     WHERE 
      drafts.job_id = ?
     ORDER BY
      drafts.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);
   
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {

    return { status: false, message: 'Error getDraft .' };
  }
}

const getDraftSingleView = async (req, res) => {
  const { id } = req;
  try {
    const query = `
     SELECT 
      drafts.id AS id,
      DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
      DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on,
      drafts.feedback_received AS feedback_received,
      drafts.feedback AS feedback
     FROM 
      drafts
     WHERE 
      drafts.id = ?
     ORDER BY
      drafts.id DESC;
     `;
    const [rows] = await pool.execute(query, [id]);
 
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {

    return { status: false, message: 'Error getDraft .' };
  }
}

const addDraft = async (draft) => {
  const { job_id, draft_sent_on, feedback_received, updated_amendment, feedback, was_it_complete ,final_draft_sent_on } = draft;


  if(parseInt(was_it_complete)===1){
    const [[rowsCheckMissingLog]] = await pool.execute(`SELECT 
    CASE
        WHEN NOT EXISTS (
            SELECT 1 
            FROM missing_logs 
            WHERE job_id = ? 
              AND status <> '1'
        )
        THEN 1
        ELSE 0
    END AS status_check;`, [job_id]);
    // console.log("rowsCheckMissingLog",rowsCheckMissingLog)

    const [[rowsCheckQuery]] = await pool.execute(`SELECT 
      CASE
          WHEN NOT EXISTS (
              SELECT 1 
              FROM queries 
              WHERE job_id = ? 
                AND status <> '1'
          )
          THEN 1
          ELSE 0
      END AS status_check;`, [job_id]);
      // console.log("rowsCheckQuery",rowsCheckQuery)

    if(rowsCheckMissingLog.status_check === 0 && rowsCheckQuery.status_check === 0){
      return { status: false, message: 'Please complete the missing logs and queries first.' , data : "W" };
    }
    else if(rowsCheckMissingLog.status_check === 0){
      return { status: false, message: 'Please complete the missing logs first.',data : "W" };
    }
    else if(rowsCheckQuery.status_check === 0){
      return { status: false, message: 'Please complete the queries first.', data : "W" };
    }
  }
 
  let data = {
    table: 'drafts',
    field: 'draft_title',
    filter_id: `job_id = ${job_id}`,
    prefix : 'D'
  }
  const UniqueNoTitle = await generateNextUniqueCodeJobLogTitle(data)

  try {
    const query = `
     INSERT INTO 
     drafts
      (job_id,draft_sent_on,draft_title,feedback_received,updated_amendment,feedback,was_it_complete,final_draft_sent_on)
      VALUES
      (?,?,?,?,?,?,?,?)
      `;
    const [rows] = await pool.execute(query, [job_id, draft_sent_on, UniqueNoTitle, feedback_received, updated_amendment, feedback, was_it_complete,final_draft_sent_on]);
    if(rows.insertId > 0){
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: draft.body.StaffUserId,
          ip: draft.body.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: 'job',
          log_message: `sent the draft for job code:`,
          permission_type: 'created',
          module_id: job_id,
        }
      );
      if(parseInt(was_it_complete)===1){
      let update_status = 6;
      const [result] = await pool.execute(`UPDATE jobs SET status_type = ?  WHERE id = ?`, [update_status, job_id]);
      }
    }

    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getDraft .' };
  }
}

const editDraft = async (draft) => {
  
  const {draft_sent_on, feedback_received, updated_amendment, feedback, was_it_complete, final_draft_sent_on, id } = draft.body;

  try {

    const [[rowJob]] = await pool.execute("SELECT job_id,DATE_FORMAT(draft_sent_on, '%Y-%m-%d') AS draft_sent_on,feedback_received,updated_amendment,feedback,was_it_complete,DATE_FORMAT(final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on FROM `drafts` WHERE id = ?", [id]);
    
    if(parseInt(was_it_complete)===1){
      const [[rowsCheckMissingLog]] = await pool.execute(`SELECT 
      CASE
          WHEN NOT EXISTS (
              SELECT 1 
              FROM missing_logs 
              WHERE job_id = ? 
                AND status <> '1'
          )
          THEN 1
          ELSE 0
      END AS status_check;`, [rowJob.job_id]);
      // console.log("rowsCheckMissingLog",rowsCheckMissingLog)
  
      const [[rowsCheckQuery]] = await pool.execute(`SELECT 
        CASE
            WHEN NOT EXISTS (
                SELECT 1 
                FROM queries 
                WHERE job_id = ? 
                  AND status <> '1'
            )
            THEN 1
            ELSE 0
        END AS status_check;`, [rowJob.job_id]);
        // console.log("rowsCheckQuery",rowsCheckQuery)
  
      if(rowsCheckMissingLog.status_check === 0 && rowsCheckQuery.status_check === 0){
        return { status: false, message: 'Please complete the missing logs and queries first.' ,data : "W" };
      }
      else if(rowsCheckMissingLog.status_check === 0){
        return { status: false, message: 'Please complete the missing logs first.',data : "W" };
      }
      else if(rowsCheckQuery.status_check === 0){
        return { status: false, message: 'Please complete the queries first.',data : "W" };
      }
    }
   

    const query_table = `
     UPDATE 
     drafts
     SET
      draft_sent_on = ?,
      feedback_received = ?,
      updated_amendment = ?,
      feedback = ?,
      was_it_complete = ?,
      final_draft_sent_on = ?
      WHERE
      id = ?
      `;
    const [rows] = await pool.execute(query_table, [draft_sent_on, feedback_received, updated_amendment, feedback, was_it_complete, final_draft_sent_on, id]);

    if(rows.changedRows > 0){

      let draft_log_msg = []
     
      if(parseInt(was_it_complete)===1){
       draft_log_msg.push('completed the draft')
      let update_status = 6;
      const [result] = await pool.execute(`UPDATE jobs SET status_type = ?  WHERE id = ?`, [update_status,rowJob.job_id]);
      }
      else if(rowJob.draft_sent_on != draft_sent_on || rowJob.feedback_received != feedback_received || rowJob.updated_amendment != updated_amendment || rowJob.feedback != feedback || rowJob.was_it_complete != was_it_complete || rowJob.final_draft_sent_on != final_draft_sent_on){
        draft_log_msg.push('edited the draft')
      }

      if(draft_log_msg.length > 0){
        const msgLog = draft_log_msg.length > 1
              ? draft_log_msg.slice(0, -1).join(', ') + ' and ' + draft_log_msg.slice(-1)
              : draft_log_msg[0];
        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: draft.body.StaffUserId,
            ip: draft.body.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'job',
            log_message: `${msgLog} job code:`,
            permission_type: 'updated',
            module_id: rowJob.job_id,
          }
        );
      }
    }
    
    return { status: true, message: 'Success.', data: rows };

  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getDraft .' };
  }
}

// JobDocument
const addJobDocument = async (jobDocument) => {
  const { job_id } = jobDocument.body
  const job_document = jobDocument.files;

  if (job_document.length > 0) {
    for (let file of job_document) {
      const file_name = file.filename;
      const original_name = file.originalname;
      const file_type = file.mimetype;
      const file_size = file.size;
      const insertQuery = `
          INSERT INTO job_documents (
              job_id, file_name, original_name, file_type, file_size
          ) VALUES (?, ?, ?, ?, ?)
      `;
      try {
        const [result] = await pool.execute(insertQuery, [
          job_id,
          file_name,
          original_name,
          file_type,
          file_size
        ]);

      } catch (error) {
        console.log('Error inserting file:', error);

      }
    }
    return { status: true, message: 'success .', data: [] };
  } else {
    return { status: true, message: 'no data .', data: [] };
  }
}

const getJobDocument = async (jobDocument) => {
  const { job_id } = jobDocument;
  try {
    const query = `
     SELECT 
      job_documents.id AS id,
      job_documents.job_id AS job_id,
      job_documents.file_name AS file_name,
      job_documents.original_name AS original_name,
      job_documents.file_type AS file_type,
      job_documents.file_size AS file_size
     FROM 
      job_documents
     WHERE 
      job_documents.job_id = ?
     ORDER BY
      job_documents.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getJobDocument .' };
  }
}

const deleteJobDocument = async (jobDocument) => {
  const { id, file_name } = jobDocument;
  try {
    const query = `
     DELETE FROM 
      job_documents
     WHERE 
      job_documents.id = ?
     `;
    const [rows] = await pool.execute(query, [id]);
    deleteUploadFile(file_name)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getJobDocument .' };
  }
}



module.exports = {
  getTaskTimeSheet,
  getjobTimeSheet,
  updateTaskTimeSheetStatus,
  addMissingLog,
  getMissingLog,
  editMissingLog,
  getMissingLogSingleView,
  updateJobTimeTotalHours,
  getQuerie,
  getQuerieSingleView,
  addQuerie,
  editQuerie,
  getDraft,
  addDraft,
  getDraftSingleView,
  addJobDocument,
  getJobDocument,
  deleteJobDocument,
  editDraft

};