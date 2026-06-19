ssues to fix first

group_value is selected twice in the outer SELECT — this will throw a duplicate column error. Remove one.
You shouldn't build that giant UNION ALL block twice (once for count, once for data). Use a CTE so it's defined once.


const page  = Math.max(Number(data.page)  || 1, 1);
const limit = Math.max(Number(data.limit) || 50, 1);
const offset = (page - 1) * limit;

// Build the heavy unpivot ONCE as a CTE
const unpivotCTE = `
WITH raw AS (
    SELECT timesheet.id AS timesheet_id, timesheet.staff_id, timesheet.customer_id,
           timesheet.client_id, timesheet.job_id, timesheet.task_id,
           ${groupValueSQL}, timesheet.monday_date AS work_date,
           timesheet.monday_hours AS work_hours, timesheet.task_type
    FROM timesheet
    LEFT JOIN staffs s ON timesheet.staff_id = s.id
    WHERE timesheet.monday_date IS NOT NULL
    UNION ALL
    SELECT timesheet.id, timesheet.staff_id, timesheet.customer_id,
           timesheet.client_id, timesheet.job_id, timesheet.task_id,
           ${groupValueSQL}, timesheet.tuesday_date, timesheet.tuesday_hours, timesheet.task_type
    FROM timesheet LEFT JOIN staffs s ON timesheet.staff_id = s.id
    WHERE timesheet.tuesday_date IS NOT NULL
    UNION ALL
    SELECT timesheet.id, timesheet.staff_id, timesheet.customer_id,
           timesheet.client_id, timesheet.job_id, timesheet.task_id,
           ${groupValueSQL}, timesheet.wednesday_date, timesheet.wednesday_hours, timesheet.task_type
    FROM timesheet LEFT JOIN staffs s ON timesheet.staff_id = s.id
    WHERE timesheet.wednesday_date IS NOT NULL
    UNION ALL
    SELECT timesheet.id, timesheet.staff_id, timesheet.customer_id,
           timesheet.client_id, timesheet.job_id, timesheet.task_id,
           ${groupValueSQL}, timesheet.thursday_date, timesheet.thursday_hours, timesheet.task_type
    FROM timesheet LEFT JOIN staffs s ON timesheet.staff_id = s.id
    WHERE timesheet.thursday_date IS NOT NULL
    UNION ALL
    SELECT timesheet.id, timesheet.staff_id, timesheet.customer_id,
           timesheet.client_id, timesheet.job_id, timesheet.task_id,
           ${groupValueSQL}, timesheet.friday_date, timesheet.friday_hours, timesheet.task_type
    FROM timesheet LEFT JOIN staffs s ON timesheet.staff_id = s.id
    WHERE timesheet.friday_date IS NOT NULL
    UNION ALL
    SELECT timesheet.id, timesheet.staff_id, timesheet.customer_id,
           timesheet.client_id, timesheet.job_id, timesheet.task_id,
           ${groupValueSQL}, timesheet.saturday_date, timesheet.saturday_hours, timesheet.task_type
    FROM timesheet LEFT JOIN staffs s ON timesheet.staff_id = s.id
    WHERE timesheet.saturday_date IS NOT NULL
    UNION ALL
    SELECT timesheet.id, timesheet.staff_id, timesheet.customer_id,
           timesheet.client_id, timesheet.job_id, timesheet.task_id,
           ${groupValueSQL}, timesheet.sunday_date, timesheet.sunday_hours, timesheet.task_type
    FROM timesheet LEFT JOIN staffs s ON timesheet.staff_id = s.id
    WHERE timesheet.sunday_date IS NOT NULL
),
joined AS (
    SELECT
        raw.timesheet_id,
        raw.group_value,
        raw.work_date,
        raw.work_hours,
        raw.task_type,
        ${groupLabelFinal},
        ${staffName},
        ${customerName},
        ${clientName},
        ${jobName},
        ${taskName},
        ${taskType},
        ${employeeNumber}
    FROM raw
    LEFT JOIN staffs s        ON raw.staff_id    = s.id
    LEFT JOIN customers c     ON raw.customer_id = c.id
    LEFT JOIN clients cl      ON raw.client_id   = cl.id
    LEFT JOIN internal        ON (raw.task_type = '1' AND raw.job_id  = internal.id)
    LEFT JOIN jobs j          ON (raw.task_type = '2' AND raw.job_id  = j.id)
    LEFT JOIN job_types       ON j.job_type_id = job_types.id
    LEFT JOIN sub_internal    ON (raw.task_type = '1' AND raw.task_id = sub_internal.id)
    LEFT JOIN task t          ON (raw.task_type = '2' AND raw.task_id = t.id)
    ${where}
)
`;

// 1) Count query
const countSQL = `${unpivotCTE} SELECT COUNT(*) AS total FROM joined`;

// 2) Paginated data query
const dataSQL = `
${unpivotCTE}
SELECT * FROM joined
ORDER BY group_value, work_date
LIMIT ${limit} OFFSET ${offset}
`;


///////////////////////////////////////-------------------//////////

//Running it (run both in parallel)

const [countRows, rows] = await Promise.all([
    db.query(countSQL),   // adapt to your driver
    db.query(dataSQL),
]);

const total = Number(countRows[0]?.total ?? 0);

return {
    data: rows,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
    },
};




Key points

CTE defined once → the heavy UNION ALL is written/maintained only once.
COUNT(*) on the CTE → accurate total reflecting your ${where} filter.
Promise.all → count and data run concurrently.
Removed the duplicate group_value and prefixed columns with raw. to avoid ambiguity (several joined tables may share column names).
Use parameterized values inside ${where} / ${groupValueSQL} etc. — don't interpolate raw user input. limit/offset here are Number-cast so they're safe.

If you're on MySQL < 8.0 (no CTE support), tell me and I'll swap the CTE for a derived-table version.
