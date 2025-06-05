import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimesheetData,
  getTimesheetTaskTypedData,
  saveTimesheetData,
  getStaffHourMinute,
} from "../../../ReduxStore/Slice/Timesheet/TimesheetSlice";
import sweatalert from "sweetalert2";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";

const Timesheet = () => {
  const getFormattedDate = (type, date) => {
    let now = new Date();
    if (type === "convert") {
      now = new Date(date);
    }

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are 0-indexed
    const week = Math.ceil(now.getDate() / 7); // Calculate week number of the month
    return `Week ${week}, Month ${month}, Year ${year}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short", // Mon, Tue, etc.
      day: "2-digit", // 01, 02, etc.
      month: "2-digit", // 01, 02, etc.
      year: "numeric", // 2024, etc.
    });
  };

  const [weekOffset, setWeekOffset] = useState(0); // 0 for current week
  const [hasValidWeekOffsetZero, setHasValidWeekOffsetZero] = useState(false);
  const [weekDays, setWeekDays] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1) + weekOffset * 7);
    setWeekDays({
      monday: formatDate(startOfWeek),
      tuesday: formatDate(
        new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))
      ),
      wednesday: formatDate(
        new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))
      ),
      thursday: formatDate(
        new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))
      ),
      friday: formatDate(
        new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))
      ),
      saturday: formatDate(
        new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))
      ),
      sunday: formatDate(
        new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))
      ),
    });
  }, [weekOffset]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

  const weekOffSetValue = useRef(0);
  const [submitStatusAllKey, setSubmitStatusAllKey] = useState(0);
  const [expandedRows, setExpandedRows] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [multipleFilter, setMultipleFilter] = useState({
    staff_id: parseInt(staffDetails.id),
    week: 0,
  });
  const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
  const [staffDataWeekDataAll, setStaffDataWeekDataAll] = useState({
    loading: true,
    data: [],
  });

  const GetTimeSheet = async (weekOffset) => {
    const req = { staff_id: multipleFilter.staff_id, weekOffset: weekOffset };
    const res = await dispatch(
      getTimesheetData({ req, authToken: token })
    ).unwrap();
    setSubmitStatusAllKey(0);
    setDeleteRows([]);
    if (res.status) {
      setStaffDataWeekDataAll({ loading: false, data: res.filterDataWeek });

      const hasValidWeekOffsetZeroValue =
        res.filterDataWeek.length > 0 &&
        res.filterDataWeek.some(
          (item) => parseInt(item.valid_weekOffsets) === 0
        );
      if (hasValidWeekOffsetZeroValue) {
        setHasValidWeekOffsetZero(true);
      } else {
        setHasValidWeekOffsetZero(false);
      }

      if (res.data.length > 0 && res.data[0].submit_status === "1") {
        setSubmitStatusAllKey(1);
      }
      setTimeSheetRows(res.data);
      setTimeSheetRows((prevRows) =>
        prevRows.map((row) => {
          const sum =
            (parseFloat(row.monday_hours) || 0) +
            (parseFloat(row.tuesday_hours) || 0) +
            (parseFloat(row.wednesday_hours) || 0) +
            (parseFloat(row.thursday_hours) || 0) +
            (parseFloat(row.friday_hours) || 0) +
            (parseFloat(row.saturday_hours) || 0) +
            (parseFloat(row.sunday_hours) || 0);
          return { ...row, total_hours: parseFloat(sum).toFixed(2) };
        })
      );
    } else {
      setStaffDataWeekDataAll({ loading: false, data: [] });
      setSubmitStatusAllKey(0);
      setTimeSheetRows([]);
    }
  };

  const selectFilterStaffANdWeek = async (e) => {
    const { name, value } = e.target;
    if (name === "staff_id") {
      setMultipleFilter((prev) => ({ ...prev, [name]: value }));
      weekOffSetValue.current = 0;
      setWeekOffset(0);
      // await GetTimeSheet(0)
    } else if (name === "week") {
      weekOffSetValue.current = parseInt(value);
      setWeekOffset(value);
      await GetTimeSheet(value);
    }
  };

  const staffData = async () => {
    await dispatch(Staff({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          // const filteredData = response.data.filter((item) => {
          //   return item.status === "1";
          // });
          const filteredData = response.data;
          setStaffDataAll({ loading: false, data: filteredData });
        } else {
          setStaffDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const toggleAllRowsView = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const toggleRowView = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    staffData();
  }, []);

  useEffect(() => {
    GetTimeSheet(0);
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todays = new Date().getDay();
    setCurrentDay(days[todays]);
  }, [multipleFilter.staff_id]);

  useEffect(() => {
    GetTimeSheet(weekOffSetValue.current);
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todays = new Date().getDay();
    setCurrentDay(days[todays]);
  }, []);

  // Function to handle week change
  const changeWeek = (offset) => {
    setWeekOffset(weekOffset + offset);
    GetTimeSheet(weekOffset + offset);
    weekOffSetValue.current = parseInt(weekOffset) + offset;
  };

  const [submitStatus, setSubmitStatus] = useState(0);
  const [remarkText, setRemarkText] = useState(null);
  const [remarkModel, setRemarkModel] = useState(false);
  const [timeSheetRows, setTimeSheetRows] = useState([]);
  const [updateTimeSheetRows, setUpdateTimeSheetRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState("this-week");


  // Function to handle dropdown change
  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };

  const handleAddNewSheet = async () => {
    if (timeSheetRows.length > 0) {
      const lastObject = timeSheetRows[timeSheetRows.length - 1];
      if (lastObject.task_id == null) {
        alert("Please select the Task");
        return;
      }
    }

    const newSheetRow = {
      id: null,
      task_type: null,
      customer_id: null,
      client_id: null,
      job_id: null,
      task_id: null,
      job_total_time: null,
      monday_date: null,
      monday_hours: null,
      tuesday_date: null,
      tuesday_hours: null,
      wednesday_date: null,
      wednesday_hours: null,
      thursday_date: null,
      thursday_hours: null,
      friday_date: null,
      friday_hours: null,
      saturday_date: null,
      saturday_hours: null,
      sunday_date: null,
      sunday_hours: null,
      remark: null,
      newRow: 1,
      editRow: 0,
      submit_status: "0",
      customerData: [], // Holds the data for customer dropdown
      clientData: [], // Holds the data for client dropdown
      jobData: [], // Holds the data for job dropdown
      taskData: [], // Holds the data for task dropdown
    };

    // setTimeSheetRows((prevRows) => [...prevRows, newSheetRow]);
    let req = { staff_id: multipleFilter.staff_id };
    const resStaffTime = await dispatch(
      getStaffHourMinute({ req, authToken: token })
    ).unwrap();
    let staffs_hourminute = resStaffTime?.data?.[0]?.hourminute || null;

    setTimeSheetRows((prevRows) => {
      const updatedRows = [...prevRows, newSheetRow];
      const newIndex = updatedRows.length - 1; // Index of the newly added row
      updatedRows[newIndex].task_type = "1";
      updatedRows[newIndex].staffs_hourminute = staffs_hourminute;
      setTimeSheetRows(updatedRows);
      return updatedRows;
    });

    req = { staff_id: multipleFilter.staff_id, task_type: "1" };
    const res = await dispatch(
      getTimesheetTaskTypedData({ req, authToken: token })
    ).unwrap();

    if (res.status) {
      let req = {
        staff_id: multipleFilter.staff_id,
        task_type: "5",
        internal_id: res.data[0].id,
      };
      const res1 = await dispatch(
        getTimesheetTaskTypedData({ req, authToken: token })
      ).unwrap();
      setTimeSheetRows((prevRows) => {
        const updatedRows = [...prevRows];
        const newIndex = updatedRows.length - 1;
        updatedRows[newIndex].task_type = "1";
        updatedRows[newIndex].jobData = res.data;
        updatedRows[newIndex].job_id = res.data[0].id;
        updatedRows[newIndex].taskData = res1.data;
        updatedRows[newIndex].task_id = res1.data[0].id;
        return updatedRows;
      });

      // update record only

      updateRecordSheet(null, "task_type", "1");
    } else {
      // Handle the error case as needed
      console.log("API call failed:", res);
    }
  };
  const [deleteRows, setDeleteRows] = useState([]);
  const handleDeleteRow = (index) => {
    const newSheetRows = [...timeSheetRows];
    const id = newSheetRows[index].id;
    if (id != null) {
      setDeleteRows((prevRows) => {
        const existingIds = new Set(prevRows);
        if (!existingIds.has(id)) {
          return [...prevRows, id];
        }
        return prevRows;
      });
    }

    newSheetRows.splice(index, 1);
    setTimeSheetRows(newSheetRows);
  };

  const [openRows, setOpenRows] = useState([]); // Track which rows are open

  // Function to toggle rows open/close
  const toggleRow = (index) => {
    if (openRows.includes(index)) {
      setOpenRows(openRows.filter((i) => i !== index)); // Close if open
    } else {
      setOpenRows([...openRows, index]); // Open if closed
    }
  };

  const handleChangeTaskType = async (e, item, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index] = {
      ...updatedRows[index],
      task_type: e.target.value,
      jobData: [],
      customerData: [],
      clientData: [],
      taskData: [],
    };

    setTimeSheetRows(updatedRows);

    if (e.target.value === "1") {
      const req = {
        staff_id: multipleFilter.staff_id,
        task_type: e.target.value,
      };
      const res = await dispatch(
        getTimesheetTaskTypedData({ req, authToken: token })
      ).unwrap();

      if (res.status) {
        let req = {
          staff_id: multipleFilter.staff_id,
          task_type: "5",
          internal_id: res.data[0].id,
        };
        const res1 = await dispatch(
          getTimesheetTaskTypedData({ req, authToken: token })
        ).unwrap();
        updatedRows[index].jobData = res.data;
        updatedRows[index].job_id = res.data[0].id;
        updatedRows[index].taskData = res1.data;
        updatedRows[index].task_id = res1.data[0].id;
      }
    } else if (e.target.value === "2") {
      updatedRows[index].jobData = [];
      updatedRows[index].job_id = null;
      updatedRows[index].taskData = [];
      updatedRows[index].task_id = null;
      const req = {
        staff_id: multipleFilter.staff_id,
        task_type: e.target.value,
      };
      const res = await dispatch(
        getTimesheetTaskTypedData({ req, authToken: token })
      ).unwrap();
      if (res.status) {
        if (res.data.length > 0) {
          updatedRows[index].customerData = res.data;
          updatedRows[index].customer_id = res.data[0].id;

          const req = {
            staff_id: multipleFilter.staff_id,
            task_type: "3",
            customer_id: res.data[0].id,
          };
          const res1 = await dispatch(
            getTimesheetTaskTypedData({ req, authToken: token })
          ).unwrap();
          if (res1.status) {
            if (res1.data.length > 0) {
              updatedRows[index].clientData = res1.data;
              updatedRows[index].client_id = res1.data[0].id;
              const req = {
                staff_id: multipleFilter.staff_id,
                task_type: "4",
                client_id: res1.data[0].id,
              };
              const res2 = await dispatch(
                getTimesheetTaskTypedData({ req, authToken: token })
              ).unwrap();
              if (res2.status) {
                if (res2.data.length > 0) {
                  updatedRows[index].jobData = res2.data;
                  updatedRows[index].job_id = res2.data[0].id;
                  const req = {
                    staff_id: multipleFilter.staff_id,
                    task_type: "6",
                    job_id: res2.data[0].id,
                  };
                  const res3 = await dispatch(
                    getTimesheetTaskTypedData({ req, authToken: token })
                  ).unwrap();
                  if (res3.status) {
                    if (res3.data.length > 0) {
                      updatedRows[index].taskData = res3.data;
                      updatedRows[index].task_id = res3.data[0].id;
                    }
                  }
                } else {
                  sweatalert.fire({
                    icon: "warning",
                    title: "There is no job available for this client.",
                    timerProgressBar: true,
                    showConfirmButton: true,
                    timer: 1500,
                  });
                }
              }
            } else {
              sweatalert.fire({
                icon: "warning",
                title: "This customer does not have an available client.",
                timerProgressBar: true,
                showConfirmButton: true,
                timer: 1500,
              });
            }
          }
        } else {
          sweatalert.fire({
            icon: "warning",
            title: "There is no customer available.",
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500,
          });
        }
      }
    }
    setTimeSheetRows([...updatedRows]); // Save changes

    // update record only
    const rowId = updatedRows[index].id;
    updateRecordSheet(rowId, "task_type", e.target.value);
  };

  const selectCustomerData = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].jobData = [];
    updatedRows[index].clientData = [];
    updatedRows[index].taskData = [];

    const req = {
      staff_id: multipleFilter.staff_id,
      task_type: "3",
      customer_id: e.target.value,
    };
    const res = await dispatch(
      getTimesheetTaskTypedData({ req, authToken: token })
    ).unwrap();

    if (res.status) {
      if (res.data.length > 0) {
        updatedRows[index].customer_id = e.target.value;
        updatedRows[index].clientData = res.data;
        updatedRows[index].client_id = res.data[0].id;

        const req = {
          staff_id: multipleFilter.staff_id,
          task_type: "4",
          client_id: res.data[0].id,
        };
        const res2 = await dispatch(
          getTimesheetTaskTypedData({ req, authToken: token })
        ).unwrap();
        if (res2.status) {
          if (res2.data.length > 0) {
            updatedRows[index].jobData = res2.data;
            updatedRows[index].job_id = res2.data[0].id;
            const req = {
              staff_id: multipleFilter.staff_id,
              task_type: "6",
              job_id: res2.data[0].id,
            };
            const res3 = await dispatch(
              getTimesheetTaskTypedData({ req, authToken: token })
            ).unwrap();
            if (res3.status) {
              if (res3.data.length > 0) {
                updatedRows[index].taskData = res3.data;
                updatedRows[index].task_id = res3.data[0].id;
              }
            }
          } else {
            sweatalert.fire({
              icon: "warning",
              title: "There is no job available for this client.",
              timerProgressBar: true,
              showConfirmButton: true,
              timer: 1500,
            });
          }
        }
      } else {
        sweatalert.fire({
          icon: "warning",
          title: "There is no client available for this customer.",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 1500,
        });
      }
    }
    setTimeSheetRows(updatedRows);

    // update record only
    const rowId = updatedRows[index].id;
    updateRecordSheet(rowId, "customer_id", e.target.value);
  };

  function convertTimeFormat(timeString) {
    if (timeString == null) {
      return null;
    }
    const [hours, minutes] = timeString.split(":");
    const formattedTime = `${hours}.${minutes}`;
    return formattedTime;
  }

  const selectClientData = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].jobData = [];
    updatedRows[index].taskData = [];

    const req = {
      staff_id: multipleFilter.staff_id,
      task_type: "4",
      client_id: e.target.value,
    };
    const res = await dispatch(
      getTimesheetTaskTypedData({ req, authToken: token })
    ).unwrap();
    if (res.status) {
      if (res.data.length > 0) {
        updatedRows[index].client_id = e.target.value;
        updatedRows[index].jobData = res.data;
        updatedRows[index].job_id = res.data[0].id;
        updatedRows[index].job_total_time = convertTimeFormat(
          res.data[0].job_total_time
        );
        let req;
        if (updatedRows[index].task_type === "1") {
          req = {
            staff_id: multipleFilter.staff_id,
            task_type: "5",
            internal_id: res.data[0].id,
          };
        } else if (updatedRows[index].task_type === "2") {
          req = {
            staff_id: multipleFilter.staff_id,
            task_type: "6",
            job_id: res.data[0].id,
          };
        }
        if (req.staff_id != undefined) {
          const res = await dispatch(
            getTimesheetTaskTypedData({ req, authToken: token })
          ).unwrap();
          if (res.status) {
            if (res.data.length > 0) {
              updatedRows[index].taskData = res.data;
              updatedRows[index].task_id = res.data[0].id;
            }
          }
        }
      } else {
        sweatalert.fire({
          icon: "warning",
          title: "There is no job available for this client.",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 1500,
        });
      }
    }
    setTimeSheetRows(updatedRows);

    // update record only
    const rowId = updatedRows[index].id;
    updateRecordSheet(rowId, "client_id", e.target.value);
  };

  const selectJobData = async (e, task_type, index) => {
    const updatedRows = [...timeSheetRows];

    updatedRows[index].taskData = [];
    let req;
    if (task_type === "1") {
      req = {
        staff_id: multipleFilter.staff_id,
        task_type: "5",
        internal_id: e.target.value,
      };
    } else if (task_type === "2") {
      req = {
        staff_id: multipleFilter.staff_id,
        task_type: "6",
        job_id: e.target.value,
      };
    }
    if (req.staff_id != undefined) {
      const res = await dispatch(
        getTimesheetTaskTypedData({ req, authToken: token })
      ).unwrap();
      if (res.status) {
        if (res.data.length > 0) {
          let job_total_time = updatedRows[index].jobData.find(
            (item) => item.id === parseInt(e.target.value)
          );
          updatedRows[index].job_id = e.target.value;
          updatedRows[index].job_total_time =
            job_total_time.job_total_time == undefined
              ? null
              : convertTimeFormat(job_total_time.job_total_time);

          updatedRows[index].taskData = res.data;
          updatedRows[index].task_id = res.data[0].id;
        }
      }
    }
    setTimeSheetRows(updatedRows);

    // update record only
    const rowId = updatedRows[index].id;
    updateRecordSheet(rowId, "job_id", e.target.value);
  };

  const selectTaskData = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].task_id = e.target.value;
    setTimeSheetRows(updatedRows);

    // update record only
    const rowId = updatedRows[index].id;
    updateRecordSheet(rowId, "task_id", e.target.value);
  };

  const handleHoursInput = async (e, index, day_name, date_value, item) => {
    let value = e.target.value;
    let name = e.target.name;
    const updatedRows = [...timeSheetRows];
    if (updatedRows[index][name] == null) {
      updatedRows[index][name] = "";
      setTimeSheetRows(updatedRows);
    }
    // if (!/^[0-9.]*$/.test(value)) {
    //   return;
    // }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    if (parseFloat(value) > 23.59) {
      sweatalert.fire({
        icon: "warning",
        title: "Total hours in a day cannot exceed 24",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    const [integerPart, fractionalPart] = value.split(".");
    if (fractionalPart && parseInt(fractionalPart) > 59) {
      sweatalert.fire({
        icon: "warning",
        title: "Minutes cannot exceed 59 ",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    const datePart = date_value.split(",")[1].trim(); // "07/10/2024"
    const [day, month, year] = datePart.split("/");
    const formattedDate = new Date(`${year}-${month}-${day}`);
    const date_final_value = formattedDate.toISOString().split("T")[0];

    updatedRows[index][day_name] = date_final_value;
    updatedRows[index][name] = value;

    const sum =
      (parseFloat(updatedRows[index].monday_hours) || 0) +
      (parseFloat(updatedRows[index].tuesday_hours) || 0) +
      (parseFloat(updatedRows[index].wednesday_hours) || 0) +
      (parseFloat(updatedRows[index].thursday_hours) || 0) +
      (parseFloat(updatedRows[index].friday_hours) || 0) +
      (parseFloat(updatedRows[index].saturday_hours) || 0) +
      (parseFloat(updatedRows[index].sunday_hours) || 0);
    updatedRows[index].total_hours = sum;


    // warning total hours
    if (
      updatedRows[index].staffs_hourminute != null &&
      updatedRows[index].staffs_hourminute != undefined &&
      e.target.value != ""
    ) {
      if (
        updatedRows[index].total_hours >
        parseFloat(convertTimeFormat(updatedRows[index].staffs_hourminute))
      ) {
        sweatalert.fire({
          icon: "warning",
          title: "Your total allocated time has been exceeded",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 3000,
        });
      }
    }

    setTimeSheetRows(updatedRows);
    // update record only
    const rowId = updatedRows[index].id;
    updateRecordSheet(rowId, name, value);
  };

  // update record only Function
  function updateRecordSheet(rowId, name, value) {
    // update record only
    const updatedRows_update = [...updateTimeSheetRows];
    const existingUpdateIndex = updatedRows_update.findIndex(
      (row) => row.id === rowId
    );
    if (existingUpdateIndex !== -1) {
      updatedRows_update[existingUpdateIndex][name] = value;
    } else {
      updatedRows_update.push({
        id: rowId,
        [name]: value,
      });
    }
    setUpdateTimeSheetRows(updatedRows_update);
  }
  // update record Function

  const editRow = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].editRow = 1;
    setTimeSheetRows(updatedRows);
  };

  const undoEditRow = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].editRow = 0;
    setTimeSheetRows(updatedRows);
  };

  const getTotalHoursFromKey = (key) => {
          const total =timeSheetRows&& timeSheetRows.reduce((acc, item) => {
          const val = parseFloat(item[key] || 0);
          const hrs = Math.floor(val);
          const mins = Math.round((val - hrs) * 100);
          acc.totalMinutes += hrs * 60 + mins;
          return acc;
        }, { totalMinutes: 0 });

        const totalHours = Math.floor(total.totalMinutes / 60);
        const totalMins = total.totalMinutes % 60;
        const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;
       return finalTotalHours;
};

  function totalWeeklyHoursMinutes(timeData) {
    const dayFields = [
      'monday_hours',
      'tuesday_hours',
      'wednesday_hours',
      'thursday_hours',
      'friday_hours',
      'saturday_hours',
      'sunday_hours'
    ];

    const totalMinutes = dayFields.reduce((sum, key) => {
      const val = parseFloat(timeData[key]);
      if (!isNaN(val)) {
        const hours = Math.floor(val);
        const minutes = Math.round((val - hours) * 100); 
        return sum + (hours * 60 + minutes);
      }
      return sum;
    }, 0);

    // 3. Convert total minutes to HH:MM
    const finalHours = Math.floor(totalMinutes / 60);
    const finalMinutes = totalMinutes % 60;
    const formattedMinutes = finalMinutes.toString().padStart(2, '0');

    const totalFormattedTime = `${finalHours}.${formattedMinutes}`;
    return totalFormattedTime;
  }

  const totalHoursMinute = () =>{
     const converted = timeSheetRows && timeSheetRows?.map(item => {
          return {
            original: item.total_hours,
            totalweeklyHours: totalWeeklyHoursMinutes(item)
          };
        });

        const total = converted.reduce((acc, item) => {
          const val = parseFloat(item.totalweeklyHours || 0);
          const hrs = Math.floor(val);
          const mins = Math.round((val - hrs) * 100);

          acc.totalMinutes += hrs * 60 + mins;
          return acc;
        }, { totalMinutes: 0 });

        const totalHours = Math.floor(total.totalMinutes / 60);
        const totalMins = total.totalMinutes % 60;
        const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;
       return finalTotalHours;
  }

  const saveData = async (e) => {
    if (timeSheetRows.length > 0) {
      const lastObject = timeSheetRows[timeSheetRows.length - 1];
      if (lastObject.task_id == null) {
        alert("Please select the Task");
        return;
      }
    }


    if (updateTimeSheetRows.length > 0 || deleteRows.length > 0) {
      const hasEditRow = timeSheetRows.some((item) => item.editRow === 1);
      if (hasEditRow == true) {
        setRemarkModel(true);
        return;
      }
      const updatedTimeSheetRows = timeSheetRows.map((row) => {
        const { customerData, clientData, jobData, taskData, ...rest } = row;
        return rest;
      });

      const req = {
        staff_id: multipleFilter.staff_id,
        data: updatedTimeSheetRows,
        deleteRows: deleteRows,
      };




      let staff_hourminute = (parseFloat(updatedTimeSheetRows?.[0]?.staffs_hourminute) / 5) || null;
      //console.log(`staff_hourminute`, staff_hourminute);
      if (staff_hourminute != null) {

        const converted = updatedTimeSheetRows && updatedTimeSheetRows?.map(item => {
          return {
            original: item.total_hours,
            totalweeklyHours: totalWeeklyHoursMinutes(item)
          };
        });

        const total = converted.reduce((acc, item) => {
          const val = parseFloat(item.totalweeklyHours || 0);
          const hrs = Math.floor(val);
          const mins = Math.round((val - hrs) * 100);

          acc.totalMinutes += hrs * 60 + mins;
          return acc;
        }, { totalMinutes: 0 });

        const totalHours = Math.floor(total.totalMinutes / 60);
        const totalMins = total.totalMinutes % 60;
        const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;
        //console.log(`finalTotalHours`, finalTotalHours);
        if (staff_hourminute > parseFloat(finalTotalHours)) {
          sweatalert.fire({
            icon: "warning",
            title: "You have not completed your timesheet for this week.",
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 3000,
          });
          return;
        }

      }



      const res = await dispatch(
        saveTimesheetData({ req, authToken: token })
      ).unwrap();
      if (res.status) {
        sweatalert.fire({
          icon: "success",
          title: res.message,
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 1500,
        });
        setSubmitStatus(0);
        setSubmitStatusAllKey(0);
        GetTimeSheet(weekOffSetValue.current);
        setUpdateTimeSheetRows([]);
      }
    }
  };

  const submitData = async (e) => {
    if (timeSheetRows.length > 0) {
      const lastObject = timeSheetRows[timeSheetRows.length - 1];
      if (lastObject.task_id == null) {
        alert("Please select the Task");
        return;
      }
    }

    setSubmitStatus(1);
    setRemarkModel(true);
  };

  const saveTimeSheetRemark = async (e) => {
    if (submitStatus == 1) {
      const updatedTimeSheetRows = timeSheetRows.map((item) => {
        return {
          ...item,
          submit_status: "1",
          remark: item.editRow === 1 ? remarkText : null,
        };
      });

      const updatedTimeSheetRows1 = updatedTimeSheetRows.map((row) => {
        const { customerData, clientData, jobData, taskData, ...rest } = row;
        return rest;
      });

      const req = {
        staff_id: multipleFilter.staff_id,
        data: updatedTimeSheetRows1,
        deleteRows: deleteRows,
      };




      let staff_hourminute = (parseFloat(updatedTimeSheetRows1?.[0]?.staffs_hourminute) / 5) || null;
      // console.log(`staff_hourminute`, staff_hourminute);
      if (staff_hourminute != null) {
        const converted = updatedTimeSheetRows1 && updatedTimeSheetRows1?.map(item => {
          return {
            original: item.total_hours,
            totalweeklyHours: totalWeeklyHoursMinutes(item)
          };
        });

        const total = converted.reduce((acc, item) => {
          const val = parseFloat(item.totalweeklyHours || 0);
          const hrs = Math.floor(val);
          const mins = Math.round((val - hrs) * 100);

          acc.totalMinutes += hrs * 60 + mins;
          return acc;
        }, { totalMinutes: 0 });

        const totalHours = Math.floor(total.totalMinutes / 60);
        const totalMins = total.totalMinutes % 60;
        const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;


        if (staff_hourminute > parseFloat(finalTotalHours)) {
          sweatalert.fire({
            icon: "warning",
            title: "You have not completed your timesheet for this week.",
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 3000,
          });
          return;
        }

      }

      const res = await dispatch(
        saveTimesheetData({ req, authToken: token })
      ).unwrap();
      if (res.status) {
        setRemarkText(null);
        setUpdateTimeSheetRows([]);
        setRemarkModel(false);
        sweatalert.fire({
          icon: "success",
          title: "Timesheet data submit successfully.",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 1500,
        });
        setSubmitStatus(0);
        setSubmitStatusAllKey(0);
        GetTimeSheet(weekOffSetValue.current);
      }
      return;
    }

    const updatedTimeSheetRows = timeSheetRows.map((item) => {
      if (item.editRow === 1) {
        return {
          ...item,
          remark: remarkText,
        };
      }
      return item;
    });

    const updatedTimeSheetRows1 = updatedTimeSheetRows.map((row) => {
      const { customerData, clientData, jobData, taskData, ...rest } = row;
      return rest;
    });

    const req = {
      staff_id: multipleFilter.staff_id,
      data: updatedTimeSheetRows1,
      deleteRows: deleteRows,
    };
    const res = await dispatch(
      saveTimesheetData({ req, authToken: token })
    ).unwrap();
    if (res.status) {
      setRemarkText(null);
      setUpdateTimeSheetRows([]);
      setRemarkModel(false);
      sweatalert.fire({
        icon: "success",
        title: res.message,
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      setSubmitStatus(0);
      setSubmitStatusAllKey(0);
      GetTimeSheet(weekOffSetValue.current);
    }
  };

  const dayMonthFormatDate = (dateString) => {
    const parts = dateString.split(", ");
    const dayOfWeek = parts[0];
    const dateParts = parts[1].split("/");
    const day = dateParts[0];
    const monthIndex = dateParts[1] - 1;
    const year = dateParts[2];
    const date = new Date(year, monthIndex, day);
    const options = { month: "short" };
    const month = date.toLocaleDateString("en-US", options).toLowerCase();
    // Return formatted string
    return `${dayOfWeek} ${day} ${month}`;
  };

  const exportToCSV = (timeSheetRows) => {
    if (!timeSheetRows || timeSheetRows.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = [
      "Index",
      "Task Type",
      "Customer Name",
      "Client Name",
      "Job Name",
      "Task Name",
      "Monday Hours",
      "Tuesday Hours",
      "Wednesday Hours",
      "Thursday Hours",
      "Friday Hours",
      "Saturday Hours",
    ];
    const rows = timeSheetRows.map((item, index) => [
      index + 1,
      item.task_type === "1" ? "Internal" : "External",
      item.customer_name || "No Customer",
      item.client_name || "No Client",
      item.task_type === "1"
        ? item.internal_name || "No Job"
        : item.job_name || "No Job",
      item.task_type === "1"
        ? item.sub_internal_name || "No Task"
        : item.task_name || "No Task",
      item.monday_hours || 0,
      item.tuesday_hours || 0,
      item.wednesday_hours || 0,
      item.thursday_hours || 0,
      item.friday_hours || 0,
      item.saturday_hours || 0,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TimeSheetData.csv";
    link.click();
  };




  // Example usage
  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="row">
          <div className="col-md-8">
            <div
              className="tab-title d-flex align-items-center"
              style={{ gap: "15px" }}
            >
              <h3 className="mt-0">Timesheet</h3>

              <div className="text-center ">
                <p className="text-info bg-soft-primary px-3 py-2 mb-0 font-11 rounded">
                  <i className="fa fa-calendar-clock me-1" />
                  <span> {getFormattedDate("current", "")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="report-data mt-4">
        <div className="col-md-12">
          <div className="row ">
            {["SUPERADMIN", "ADMIN"].includes(role) ? (
              <div className="form-group col-md-4">
                <label className="form-label mb-2">Select Staff</label>
                <select
                  name="staff_id"
                  className="form-select"
                  id="tabSelect"
                  defaultValue={staffDetails.id}
                  onChange={(e) => selectFilterStaffANdWeek(e)}
                >
                  {staffDataAll.data &&
                    staffDataAll.data.map((val, index) => (
                      <option
                        key={index}
                        value={val.id}
                        selected={staffDetails.id === val.id}
                      >
                        {val.first_name + " " + val.last_name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              ""
            )}
            <div className="form-group col-md-8 row align-items-center">
              {staffDataWeekDataAll.data &&
                staffDataWeekDataAll.data.length > 0 ? (
                <div className="form-group col-md-6 pe-0">
                  <label className="form-label mb-2">Select Date</label>

                  <select
                    name="week"
                    className="form-select"
                    id="tabSelect"
                    // defaultValue={staffDataWeekDataAll.data && staffDataWeekDataAll.data[0].valid_weekOffsets}
                    onChange={(e) => selectFilterStaffANdWeek(e)}
                  >
                    {!hasValidWeekOffsetZero && (
                      <option value="0">
                        {getFormattedDate("current", "")}
                      </option>
                    )}

                    {staffDataWeekDataAll.data &&
                      staffDataWeekDataAll.data.map((val, index) => (
                        <option
                          key={index}
                          value={val.valid_weekOffsets}
                          selected={
                            weekOffSetValue.current == val.valid_weekOffsets
                          }
                        >
                          {getFormattedDate("convert", val.month_date)}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                ""
              )}

              {["SUPERADMIN", "ADMIN"].includes(role) &&
                timeSheetRows.length > 0 ? (
                <div className="form-group col-md-6">
                  <button
                    className=" btn btn-info float-md-end mt-lg-2"
                    onClick={() => exportToCSV(timeSheetRows)}
                  >
                    Export Timesheet Data
                    <i className="fa fa-download ms-2" />
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Tabs Content */}
          <div className="tab-content mt-1">
            {/* Render content based on selected tab */}
            {selectedTab === "this-week" && (
              <div className="tab-pane show active">
                <div id="customerList">
                  <div className="row">
                    <div className="table-responsive table-card  mb-1">
                      <table
                        className="timesheetTable table align-middle table-nowrap mb-0"
                        id="customerTable"
                      >
                        <thead className="table-light table-head-blue">
                          <tr>
                            <th
                              className="dropdwnCol2 pe-0"
                              data-field="phone"
                              style={{ width: "10px" }}
                            >
                              No
                            </th>
                            <th
                              className=""
                              data-field="phone"
                              style={{ width: "10%" }}
                            >
                              Task Type
                            </th>
                            <th
                              className="dropdwnCol7"
                              data-field="phone"
                              style={{ width: "10%" }}
                            >
                              Customer
                            </th>
                            <th
                              className="dropdwnCol6"
                              data-field="phone"
                              style={{ width: "10%" }}
                            >
                              Client
                            </th>
                            <th
                              className="dropdwnCol5"
                              data-field="phone"
                              style={{ width: "10%" }}
                            >
                              Job
                            </th>
                            <th
                              className="dropdwnCol5"
                              data-field="phone"
                              style={{ width: "8%" }}
                            >
                              Task
                            </th>

                            <th
                              colSpan="8"
                              className="pe-0 week-data"
                              style={{ width: "50%" }}
                            >
                              <div className="d-flex align-items-center">
                                <ChevronLeft
                                  onClick={(e) => {
                                    e.preventDefault();
                                    changeWeek(-1);
                                  }}
                                />
                                <span className=" me-0">
                                  {weekDays.monday
                                    ? dayMonthFormatDate(weekDays.monday)
                                    : ""}
                                </span>
                                {/* Conditionally render weekdays when expanded */}
                                {isExpanded && (
                                  <div
                                    className="d-flex"
                                    style={{ width: "70%" }}
                                  >
                                    <span>
                                      {weekDays.tuesday
                                        ? dayMonthFormatDate(weekDays.tuesday)
                                        : ""}
                                    </span>
                                    <span>
                                      {weekDays.wednesday
                                        ? dayMonthFormatDate(weekDays.wednesday)
                                        : ""}
                                    </span>
                                    <span>
                                      {weekDays.thursday
                                        ? dayMonthFormatDate(weekDays.thursday)
                                        : ""}
                                    </span>
                                    <span>
                                      {weekDays.friday
                                        ? dayMonthFormatDate(weekDays.friday)
                                        : ""}
                                    </span>
                                    <span>
                                      {weekDays.saturday
                                        ? dayMonthFormatDate(weekDays.saturday)
                                        : ""}
                                    </span>
                                  </div>
                                )}
                                <button
                                  onClick={toggleAllRowsView}
                                  className="px-0 btn btn-sm btn-link text-decoration-none"
                                >
                                  {/* Font Awesome plus icon */}
                                  <i
                                    className={`fa ${isExpanded ? "fa-minus" : "fa-plus"
                                      }`}
                                    aria-hidden="true"
                                  ></i>
                                </button>
                                <ChevronRight
                                  onClick={(e) => {
                                    e.preventDefault();
                                    changeWeek(1);
                                  }}
                                />
                              </div>
                            </th>
                            {/* <th className="dropdwnCol5" data-field="phone">
                              {weekDays.sunday!=""?dayMonthFormatDate(weekDays.sunday): ""}
                            </th> */}

                            {/* <th
                              className="dropdwnCol5"
                              data-field="phone"
                              style={{ width: "8%" }}
                            >
                              Weekly Hours
                            </th> */}

                            {submitStatusAllKey === 0 ? (
                              <th
                                className="dropdwnCol5"
                                data-field="phone"
                                style={{ width: "5%" }}
                              >
                                Action
                              </th>
                            ) : (
                              ""
                            )}
                          </tr>
                        </thead>

                        <tbody className="list form-check-all">
                          {timeSheetRows.length > 0 ? (
                            timeSheetRows?.map((item, index) => (
                              <tr className="tabel_new">
                                <td className="pe-0">{index + 1}</td>

                                <td className="ps-0">
                                  {item.newRow === 1 ? (
                                    <select
                                      className="form-select form-control"
                                      style={{ width: "100px" }}
                                      value={item.task_type}
                                      onChange={(e) =>
                                        handleChangeTaskType(e, item, index)
                                      }
                                    >
                                      <option value="1">Internal</option>
                                      <option value="2">External</option>
                                    </select>
                                  ) : (
                                    <select
                                      className="form-select form-control"
                                      value={item.task_type}
                                      disabled
                                    >
                                      <option value="1">Internal</option>
                                      <option value="2">External</option>
                                    </select>
                                  )}
                                </td>

                                {/* Customer Selection */}
                                <td>
                                  {item.newRow === 1 &&
                                    item.task_type === "2" ? (
                                    <select
                                      className="form-select"
                                      style={{ width: "100px" }}
                                      defaultValue={item.customer_id || ""}
                                      onChange={(e) =>
                                        selectCustomerData(e, index)
                                      }
                                    >
                                      {item.customerData?.map((customer) => (
                                        <option
                                          key={customer.id}
                                          value={customer.id}
                                        >
                                          {customer.trading_name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      className="form-control cursor-pointer"
                                      defaultValue={
                                        item.task_type === "1"
                                          ? "No Customer"
                                          : item.customer_name
                                      }
                                      disabled
                                    />
                                  )}
                                </td>

                                {/* Client Selection */}
                                <td>
                                  {item.newRow === 1 &&
                                    item.task_type === "2" ? (
                                    <select
                                      className="form-select"
                                      style={{ width: "100px" }}
                                      defaultValue={item.client_id || ""}
                                      onChange={(e) =>
                                        selectClientData(e, index)
                                      }
                                    >
                                      {item.clientData?.map((client) => (
                                        <option
                                          key={client.id}
                                          value={client.id}
                                        >
                                          {client.trading_name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      className="form-control cursor-pointer"
                                      defaultValue={
                                        item.task_type === "1"
                                          ? "No Client"
                                          : item.client_name
                                      }
                                      disabled
                                    />
                                  )}
                                </td>

                                {/* Job Selection */}
                                <td>
                                  {item.newRow === 1 ? (
                                    <select
                                      className="form-select"
                                      style={{ width: "100px" }}
                                      defaultValue={item.job_id || ""}
                                      onChange={(e) =>
                                        selectJobData(e, item.task_type, index)
                                      }
                                    >
                                      {item.jobData?.map((job) => (
                                        <option key={job.id} value={job.id}>
                                          {job.name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      style={{ width: "100px" }}
                                      className="form-control cursor-pointer"
                                      defaultValue={
                                        item.task_type === "1"
                                          ? item.internal_name
                                          : item.job_name
                                      }
                                      disabled
                                    />
                                  )}
                                </td>

                                {/* Task Selection */}
                                <td>
                                  {item.newRow === 1 ? (
                                    <select
                                      className="form-select"
                                      style={{ width: "100px" }}
                                      defaultValue={item.task_id || ""}
                                      onChange={(e) => selectTaskData(e, index)}
                                    >
                                      {item.taskData?.map((task) => (
                                        <option key={task.id} value={task.id}>
                                          {task.name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      className="form-control cursor-pointer"
                                      style={{ width: "100px" }}
                                      defaultValue={
                                        item.task_type === "1"
                                          ? item.sub_internal_name
                                          : item.task_name
                                      }
                                      disabled
                                    />
                                  )}
                                </td>

                                {/*Monday Input*/}
                                <td colspan="8">
                                  <table>
                                    <tr>
                                      <td></td>

                                    </tr>
                                  </table>
                                  <div className="ms-2">
                                    {isExpanded ? (
                                      <div
                                        className="d-flex  ms-3"
                                        style={{ width: "88%" }}
                                      >
                                        <input
                                          className="form-control cursor-pointer border-radius-end"
                                          type="text"
                                          style={{ width: "80px" }}
                                          name="monday_hours"
                                          onChange={(e) =>
                                            handleHoursInput(
                                              e,
                                              index,
                                              "monday_date",
                                              weekDays.monday,
                                              item
                                            )
                                          }
                                          value={
                                            item.monday_hours == null
                                              ? "0"
                                              : item.monday_hours
                                          }
                                          // disabled={item.submit_status === "1" ? true : item.editRow == 1 ? new Date(weekDays.monday) > new Date() ? currentDay === 'monday' ? false : true : false :false}
                                          disabled={
                                            staffDetails.id !=
                                              multipleFilter.staff_id
                                              ? true
                                              : item.submit_status === "1"
                                                ? true
                                                : false
                                          }
                                        />
                                        <input
                                          style={{ width: "80px" }}
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          name="tuesday_hours"
                                          onChange={(e) =>
                                            handleHoursInput(
                                              e,
                                              index,
                                              "tuesday_date",
                                              weekDays.tuesday,
                                              item
                                            )
                                          }
                                          value={
                                            item.tuesday_hours == null
                                              ? "0"
                                              : item.tuesday_hours
                                          }
                                          // disabled={item.submit_status === "1" ? true : item.editRow == 1 ? new Date(weekDays.tuesday) > new Date() ? currentDay === 'tuesday' ? false : true : false : currentDay !== 'tuesday'}
                                          disabled={
                                            staffDetails.id !=
                                              multipleFilter.staff_id
                                              ? true
                                              : item.submit_status === "1"
                                                ? true
                                                : false
                                          }
                                        />
                                        <input
                                          style={{ width: "80px" }}
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          name="wednesday_hours"
                                          onChange={(e) =>
                                            handleHoursInput(
                                              e,
                                              index,
                                              "wednesday_date",
                                              weekDays.wednesday,
                                              item
                                            )
                                          }
                                          value={
                                            item.wednesday_hours == null
                                              ? "0"
                                              : item.wednesday_hours
                                          }
                                          // disabled={item.submit_status === "1" ? true : item.editRow == 1 ? new Date(weekDays.wednesday) > new Date() ? currentDay === 'wednesday' ? false : true : false : currentDay !== 'wednesday'}
                                          disabled={
                                            staffDetails.id !=
                                              multipleFilter.staff_id
                                              ? true
                                              : item.submit_status === "1"
                                                ? true
                                                : false
                                          }
                                        />
                                        <input
                                          style={{ width: "80px" }}
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          name="thursday_hours"
                                          onChange={(e) =>
                                            handleHoursInput(
                                              e,
                                              index,
                                              "thursday_date",
                                              weekDays.thursday,
                                              item
                                            )
                                          }
                                          value={
                                            item.thursday_hours == null
                                              ? "0"
                                              : item.thursday_hours
                                          }
                                          // disabled={item.submit_status === "1" ? true : item.editRow == 1 ? new Date(weekDays.thursday) > new Date() ? currentDay === 'thursday' ? false : true : false : currentDay !== 'thursday'}
                                          disabled={
                                            staffDetails.id !=
                                              multipleFilter.staff_id
                                              ? true
                                              : item.submit_status === "1"
                                                ? true
                                                : false
                                          }
                                        />
                                        <input
                                          style={{ width: "80px" }}
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          name="friday_hours"
                                          onChange={(e) =>
                                            handleHoursInput(
                                              e,
                                              index,
                                              "friday_date",
                                              weekDays.friday,
                                              item
                                            )
                                          }
                                          value={
                                            item.friday_hours == null
                                              ? "0"
                                              : item.friday_hours
                                          }
                                          // disabled={item.submit_status === "1" ? true : item.editRow == 1 ? new Date(weekDays.friday) > new Date() ? currentDay === 'friday' ? false : true : false : currentDay !== 'friday'}
                                          disabled={
                                            staffDetails.id !=
                                              multipleFilter.staff_id
                                              ? true
                                              : item.submit_status === "1"
                                                ? true
                                                : false
                                          }
                                        />
                                        <input
                                          style={{ width: "80px" }}
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          name="saturday_hours"
                                          onChange={(e) =>
                                            handleHoursInput(
                                              e,
                                              index,
                                              "saturday_date",
                                              weekDays.saturday,
                                              item
                                            )
                                          }
                                          value={
                                            item.saturday_hours == null
                                              ? "0"
                                              : item.saturday_hours
                                          }
                                          // disabled={item.submit_status === "1" ? true : item.editRow == 1 ? new Date(weekDays.saturday) > new Date() ? currentDay === 'saturday' ? false : true : false : currentDay !== 'saturday'}
                                          disabled={
                                            staffDetails.id !=
                                              multipleFilter.staff_id
                                              ? true
                                              : item.submit_status === "1"
                                                ? true
                                                : false
                                          }
                                        />
                                      </div>
                                    ) : (
                                      <div className="ms-3">
                                        {" "}
                                        <input
                                          className="form-control cursor-pointer border-radius-end"
                                          type="text"
                                          style={{ width: "80px" }}
                                          name="monday_hours"
                                          onChange={(e) =>
                                            handleHoursInput(
                                              e,
                                              index,
                                              "monday_date",
                                              weekDays.monday,
                                              item
                                            )
                                          }
                                          value={
                                            item.monday_hours == null
                                              ? "0"
                                              : item.monday_hours
                                          }
                                          // disabled={item.submit_status === "1" ? true : item.editRow == 1 ? new Date(weekDays.monday) > new Date() ? currentDay === 'monday' ? false : true : false : currentDay !== 'monday'}
                                          disabled={
                                            staffDetails.id !=
                                              multipleFilter.staff_id
                                              ? true
                                              : item.submit_status === "1"
                                                ? true
                                                : false
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>

                                </td>

                                {/*Sunday Input*/}
                                {/* 
                               <td>
                                <input
                                  className="form-control cursor-pointer"
                                  type="text"
                                  name="sunday_hours"
                                  onChange={(e) => handleHoursInput(e, index, 'sunday_date', weekDays.sunday ,item )}
                                  value={item.sunday_hours == null ? "0" : item.sunday_hours}
                                  disabled={item.submit_status === "1"?true: item.editRow == 1 ? new Date(weekDays.sunday) > new Date() ? currentDay === 'sunday' ? false: true : false : currentDay !== 'sunday'}
                                />

                              </td>
                              
                              */}
                                {/* <td>
                                  {console.log("item.weekly_hours", item)}
                                  <span className="fs-6 text-dark"> {totalWeeklyHoursMinutes(item)}</span>

                                </td> */}

                                {submitStatusAllKey === 0 ? (
                                  <td className="d-flex ps-0">
                                    {/* {
                                  item.submit_status === "0" ?

                                    item.editRow == 0 || item.editRow == undefined ?
                                      <button
                                        className="edit-icon"
                                        onClick={(e) => {
                                          editRow(e, index);
                                        }}
                                      >
                                        <i className="fa fa-pencil text-primary  "></i>
                                      </button>
                                      :
                                      <button
                                        className="edit-icon"
                                        onClick={(e) => {
                                          undoEditRow(e, index);
                                        }}
                                      >
                                        <i class="fa-solid fa-arrow-rotate-left"></i>
                                      </button>
                                    : ""
                                } */}
                                    {submitStatusAllKey === 0 ? (
                                      <button
                                        className="delete-icon"
                                        onClick={() => handleDeleteRow(index)}
                                      >
                                        <i className="ti-trash text-danger  "></i>
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                    {/* <Trash2 className="delete-icon" /> */}
                                  </td>
                                ) : (
                                  ""
                                )}
                              </tr>


                            ))

                          ) : (
                            <tr>
                              <td colSpan={12} className="text-center">
                                No data found
                              </td>
                            </tr>
                          )}



                          <tr className="tabel_new">
                            <td>
                              {staffDetails.id == multipleFilter.staff_id ? (
                                submitStatusAllKey === 0 ? (
                                  <button
                                    className="d-flex btn btn-info fw-normal px-2"
                                    onClick={handleAddNewSheet}
                                  >
                                    <i
                                      style={{
                                        display: "block",
                                        fontSize: 18,
                                        cursor: "pointer",
                                      }}
                                      className="ri-add-circle-fill"
                                    />
                                  </button>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )}
                            </td>
                            <td colSpan={12}></td>
                          </tr>
                        </tbody>
                      </table>
                        {
                          timeSheetRows.length > 0 ?
                          <>
                         <div className="ms-5">
                        <table
                          className="timesheetTable table align-middle table-nowrap"
                          id="customerTable"
                          // style={{ marginTop: '-40px' }}
                        >
                          <thead className="table-light table-head-blue">
                            <tr>
                             
                              <th className="border-0" data-field="phone" style={{ width: isExpanded ? "45%" : "48%" }} />

                              <th colSpan={8} className="pe-0 total-weekly border-0" style={{position:'relative', width:'100%', left: isExpanded ? "6%" : "7%" }} >

                                <div className="d-flex  " style={{ width: "88%" }}>
                                  <div className="d-flex align-items-center">

                                    <span className="ms-3  fs-6">
                                      {getTotalHoursFromKey("monday_hours")}
                                    </span>
                                    
                                    {isExpanded && (
                                      <div
                                        className="d-flex"
                                        style={{ width: "77%" }}
                                      >
                                        <span className="fs-6">
                                          {getTotalHoursFromKey("tuesday_hours")}
                                        </span>
                                        <span className="fs-6">
                                          {getTotalHoursFromKey("wednesday_hours")}
                                        </span>
                                        <span className="fs-6">
                                          {getTotalHoursFromKey("thursday_hours")}
                                        </span>
                                        <span className="fs-6">
                                          {getTotalHoursFromKey("friday_hours")}
                                        </span>
                                        <span className="fs-6">
                                          {getTotalHoursFromKey("saturday_hours")}
                                        </span>
                                      </div>
                                    )}


                                  </div>
                                </div>
                              </th>
                             
                            </tr>
                          </thead>
                        </table>
                        </div>

                        <div>
                         <span className="fs-6 text-dark"> <b>Total Weekly Hours : {totalHoursMinute()}</b></span>
                        </div>
                        </>
                          
                          :""
                        }
                        
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "last-week" && (
              <div>This Last week content...</div>
            )}

            {selectedTab === "this-month" && <div>This month's content...</div>}
            {selectedTab === "last-month" && <div>Last month's content...</div>}
            {selectedTab === "last-quarter" && (
              <div>Last quarter's content...</div>
            )}
            {selectedTab === "this-6-months" && (
              <div>This 6 months' content...</div>
            )}
            {selectedTab === "last-6-months" && (
              <div>Last 6 months' content...</div>
            )}
            {selectedTab === "this-year" && <div>This year's content...</div>}
            {selectedTab === "last-year" && <div>Last year's content...</div>}
            {selectedTab === "custom" && <div>Custom content...</div>}
          </div>

          <div className="d-flex justify-content-end mt-3">
            {staffDetails.id == multipleFilter.staff_id ? (
              submitStatusAllKey === 0 ? (
                <>
                  <button
                    className="btn btn-info"
                    onClick={(e) => {
                      saveData(e);
                    }}
                  >
                    <i className="fa fa-check"></i> Save
                  </button>

                  <button
                    className="btn btn-outline-success ms-3"
                    onClick={(e) => {
                      submitData(e);
                    }}
                  >
                    <i className="far fa-save"></i> Submit
                  </button>
                </>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>

          <CommonModal
            isOpen={remarkModel}
            backdrop="static"
            size="lg"
            cancel_btn={false}
            btn_2="true"
            btn_name={submitStatus === 1 ? "Submit" : "Save"}
            title="Remark"
            hideBtn={false}
            handleClose={() => {
              setRemarkModel(false);
              setSubmitStatus(0);
            }}
            Submit_Function={(e) => saveTimeSheetRemark(e)}
          >
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-12">
                  <label htmlFor="customername-field" className="form-label">
                    Remark
                  </label>
                  <textarea
                    type="text"
                    className="form-control cursor-pointer"
                    placeholder="Enter Remark"
                    defaultValue=""
                    onChange={(e) => setRemarkText(e.target.value)}
                    value={remarkText}
                  />
                </div>
              </div>
            </div>
          </CommonModal>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
