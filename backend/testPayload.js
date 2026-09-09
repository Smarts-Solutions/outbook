const staff = [
  411, 225, 279, 408, 340, 437, 390, 459, 528, 256,
  309, 470, 207, 150, 486, 302, 446, 22, 181, 559
];

// Sirf 10 staff
for (const currentStaffId of staff.slice(0, 10)) {

  console.log(`Processing staff_id: ${currentStaffId}`);

  await Promise.all(
    data?.map(async (row) => {

      let task_type_name = getTaskTypeName(row.task_type);

      const customer_id = row.customer_id ?? 0;
      const client_id = row.client_id ?? 0;

      const remark = getNoteValue(row.remark);
      const final_remark = getNoteValue(row.final_remark);

      const monday_note = getNoteValue(row.monday_note);
      const tuesday_note = getNoteValue(row.tuesday_note);
      const wednesday_note = getNoteValue(row.wednesday_note);
      const thursday_note = getNoteValue(row.thursday_note);
      const friday_note = getNoteValue(row.friday_note);
      const saturday_note = getNoteValue(row.saturday_note);
      const sunday_note = getNoteValue(row.sunday_note);

      const monday_hours = formatTime(row.monday_hours);
      const tuesday_hours = formatTime(row.tuesday_hours);
      const wednesday_hours = formatTime(row.wednesday_hours);
      const thursday_hours = formatTime(row.thursday_hours);
      const friday_hours = formatTime(row.friday_hours);
      const saturday_hours = formatTime(row.saturday_hours);
      const sunday_hours = formatTime(row.sunday_hours);

      let duplicate_entry = null;

      let save_date = row?.save_date
        ? new Date(row.save_date)
        : null;

      let submit_date = row?.submit_date
        ? new Date(row.submit_date)
        : null;

      if (Number(row?.submit_status) === 1) {
        submit_date = new Date();
      } else {
        save_date = new Date();
      }

      const days = [
        {
          day: "monday",
          date: row.monday_date,
          hours: monday_hours
        },
        {
          day: "tuesday",
          date: row.tuesday_date,
          hours: tuesday_hours
        },
        {
          day: "wednesday",
          date: row.wednesday_date,
          hours: wednesday_hours
        },
        {
          day: "thursday",
          date: row.thursday_date,
          hours: thursday_hours
        },
        {
          day: "friday",
          date: row.friday_date,
          hours: friday_hours
        },
        {
          day: "saturday",
          date: row.saturday_date,
          hours: saturday_hours
        },
        {
          day: "sunday",
          date: row.sunday_date,
          hours: sunday_hours
        }
      ];

      let DateTimeString = "";

      days.forEach((d) => {
        if (d.date !== null) {
          DateTimeString += ` Date: ${d.date}, Hours : ${d.hours}`;
        }
      });

      const JobTaskName = await JobTaskNameWithId({
        job_id: row.job_id,
        task_id: row.task_id,
        TaskType: parseInt(row.task_type)
      });

      // =====================================================
      // INSERT
      // =====================================================

      if (row.id === null) {

        const insertQuery = `
          INSERT INTO timesheet (
            staff_id,
            task_type,
            customer_id,
            client_id,
            job_id,
            task_id,

            monday_date,
            monday_hours,

            tuesday_date,
            tuesday_hours,

            wednesday_date,
            wednesday_hours,

            thursday_date,
            thursday_hours,

            friday_date,
            friday_hours,

            saturday_date,
            saturday_hours,

            sunday_date,
            sunday_hours,

            remark,
            final_remark,
            submit_status,

            monday_note,
            tuesday_note,
            wednesday_note,
            thursday_note,
            friday_note,
            saturday_note,
            sunday_note,

            save_date,
            submit_date,
            duplicate_entry,

            monday_filled_at,
            tuesday_filled_at,
            wednesday_filled_at,
            thursday_filled_at,
            friday_filled_at,
            saturday_filled_at,
            sunday_filled_at
          )
          VALUES (
            ?,?,?,?,?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?,
            ?,?
          )
        `;

        const insertValues = [

          // IMPORTANT
          // Outer loop ka current staff ID
          currentStaffId,

          row.task_type,
          customer_id,
          client_id,
          row.job_id,
          row.task_id,

          row.monday_date,
          monday_hours,

          row.tuesday_date,
          tuesday_hours,

          row.wednesday_date,
          wednesday_hours,

          row.thursday_date,
          thursday_hours,

          row.friday_date,
          friday_hours,

          row.saturday_date,
          saturday_hours,

          row.sunday_date,
          sunday_hours,

          remark,
          final_remark,
          row.submit_status,

          monday_note,
          tuesday_note,
          wednesday_note,
          thursday_note,
          friday_note,
          saturday_note,
          sunday_note,

          save_date,
          submit_date,
          duplicate_entry,

          monday_hours ? new Date() : null,
          tuesday_hours ? new Date() : null,
          wednesday_hours ? new Date() : null,
          thursday_hours ? new Date() : null,
          friday_hours ? new Date() : null,
          saturday_hours ? new Date() : null,
          sunday_hours ? new Date() : null
        ];

        const [insertResult] = await pool.query(
          insertQuery,
          insertValues
        );

        const newRowId = insertResult.insertId;

        // =================================================
        // TIMESHEET LOGS
        // =================================================

        const action_type =
          Number(row.submit_status) === 1
            ? "SUBMIT"
            : "SAVE";

        const internal_external =
          parseInt(row.task_type) === 2
            ? 2
            : 1;

        for (const d of days) {

          if (d.date !== null && d.hours !== null) {

            const logDesc =
              `${action_type} entry for ${d.day} with ${d.hours} hours.`;

            const logQuery = `
              INSERT INTO timesheet_logs (
                timesheet_row_id,
                staff_id,
                action_type,
                internal_external,
                customer_id,
                client_id,
                job_id,
                task_id,
                entry_day,
                hours_entered,
                created_at,
                description
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
            `;

            const logValues = [
              newRowId,

              // IMPORTANT
              currentStaffId,

              action_type,
              internal_external,
              customer_id,
              client_id,
              row.job_id,
              row.task_id,
              d.day,
              d.hours,
              logDesc
            ];

            await pool.query(
              logQuery,
              logValues
            );
          }
        }

        // =================================================
        // ACTIVITY LOG
        // =================================================

        if (DateTimeString !== "") {

          const eventType =
            parseInt(row.submit_status) === 1
              ? "submit"
              : "save";

          if (!checkStringEvent.includes(eventType)) {

            checkStringEvent.push(eventType);

            timesheet_log_msg.push(
              `${
                eventType === "submit"
                  ? "submitted"
                  : "save"
              } a timesheet entry. Task type:${task_type_name},
              ${DateTimeString},
              Job code:${JobTaskName.job_name},
              Task name:${JobTaskName.task_name}`
            );

          } else {

            timesheet_log_msg.push(
              `Task type:${task_type_name},
              ${DateTimeString},
              Job code:${JobTaskName.job_name},
              Task name:${JobTaskName.task_name}`
            );
          }
        }

      }

      // =====================================================
      // UPDATE
      // =====================================================

      else {

        // Aapka existing UPDATE code yahan same rahega.
        // Lekin jahan bhi staff_id use ho raha hai,
        // wahan currentStaffId use karna hai.

      }

    })
  );

  console.log(`Completed staff_id: ${currentStaffId}`);
}