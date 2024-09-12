const pool = require('../config/database');
const deleteUploadFile = require('../../app/middlewares/deleteUploadFile');

const getTaskTimeSheet = async (timeSheet) => {
  const { job_id } = timeSheet;
  console.log("job_id ", job_id)
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
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }




}
const getjobTimeSheet = async (timeSheet) => {
  const { job_id } = timeSheet;
  console.log("job_id ", job_id)
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
    console.log("error ", error)
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
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }
}

// MissingLog
const addMissingLog = async (missingLog) => {
  const { job_id, missing_log, missing_paperwork, missing_log_sent_on, missing_log_prepared_date, missing_log_title, missing_log_reviewed_by, missing_log_reviewed_date, missing_paperwork_received_on, status } = missingLog.body;

  const missing_log_document = missingLog.files;

  try {
    const query = `
     INSERT INTO 
     missing_logs
      (job_id, missing_log, missing_paperwork, missing_log_sent_on,missing_log_prepared_date,missing_log_title,missing_log_reviewed_by,missing_log_reviewed_date,missing_paperwork_received_on,status)
      VALUES
      (?,?,?,?,?,?,?,?,?,?)
      `;
    const [rows] = await pool.execute(query, [job_id, missing_log, missing_paperwork, missing_log_sent_on, missing_log_prepared_date, missing_log_title, missing_log_reviewed_by, missing_log_reviewed_date, missing_paperwork_received_on, status]);
    console.log("rows ", rows)

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
            console.log('Error inserting file:', error);
        }
      }
    }
    
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
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
     missing_logs.status AS status
     FROM 
     missing_logs
     WHERE 
     missing_logs.job_id = ?
     ORDER BY
     missing_logs.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getMissingLog .' };
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
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getMissingLog .' };
  }

}

//Queries
const addQuerie = async(querie) => {
  const { job_id, queries_remaining, query_title, reviewed_by, missing_queries_prepared_date, query_sent_date, response_received, response, final_query_response_received_date } = querie.body;
  const query_document = querie.files;

  try {
    const query = `
     INSERT INTO 
     queries
      (job_id, queries_remaining, query_title, reviewed_by, missing_queries_prepared_date, query_sent_date, response_received,response,final_query_response_received_date)
      VALUES
      (?,?,?,?,?,?,?,?,?)
      `;
    const [rows] = await pool.execute(query, [job_id, queries_remaining, query_title, reviewed_by, missing_queries_prepared_date, query_sent_date, response_received, response, final_query_response_received_date]);


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
      DATE_FORMAT(queries.final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date
     FROM 
      queries
     WHERE 
      queries.job_id = ?
     ORDER BY
      queries.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error querie .' };
  }

}

const getQuerieSingleView = async(querie) => {
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
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error querie .' };
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
      DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
      DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on
     FROM 
      drafts
     WHERE 
      drafts.job_id = ?
     ORDER BY
      drafts.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getDraft .' };
  }
}

const getDraftSingleView = async(req,res) => {
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
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getDraft .' };
  }
}

const addDraft = async (draft) => {
  const { job_id,draft_sent_on,final_draft_sent_on,feedback_received,updated_amendment,feedback,was_it_complete } = draft;

  try {
    const query = `
     INSERT INTO 
     drafts
      (job_id,draft_sent_on,final_draft_sent_on,feedback_received,updated_amendment,feedback,was_it_complete)
      VALUES
      (?,?,?,?,?,?,?)
      `;
    const [rows] = await pool.execute(query, [job_id,draft_sent_on,final_draft_sent_on,feedback_received,updated_amendment,feedback,was_it_complete]);
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getDraft .' };
  }
}

// JobDocument
const addJobDocument = async (jobDocument) => {
  const {job_id} = jobDocument.body
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
  }else{
    return { status: true, message: 'no data .', data: [] };
  }
}

const getJobDocument = async(jobDocument) => {
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

const deleteJobDocument = async(jobDocument) => {
  const { id ,file_name} = jobDocument;
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
  getMissingLogSingleView,
  updateJobTimeTotalHours,
  getQuerie,
  getQuerieSingleView,
  addQuerie,
  getDraft,
  addDraft,
  getDraftSingleView,
  addJobDocument,
  getJobDocument,
  deleteJobDocument

};