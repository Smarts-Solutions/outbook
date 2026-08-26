import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileAxis3d,
  Eye,
  Pencil,
  Check,
  Save,
  CalendarClock,
  Briefcase,
  User,
  SquareCheck,
  Info,
  File,
  ArrowLeft,
  Plus,
  Minus

} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  getTimesheetData,
  getTimesheetTaskTypedData,
  saveTimesheetData,
  getStaffHourMinute,
} from "../../../ReduxStore/Slice/Timesheet/TimesheetSlice";

import { SAVE_TIMESHEET } from "../../../Services/Timesheet/TimesheetService";
import sweatalert from "sweetalert2";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import TimesheetDatatable from "../../../Components/ExtraComponents/TimesheetDatatable";
import ResourceDatatable from "../../../Components/ExtraComponents/ResourceDatatable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const TimesheetNewDesign = () => {
  const [activeIndex, setActiveIndex] = useState(null); // row
  const [activeField, setActiveField] = useState(null); // field name

  // add node state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // copy timesheet modal state
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyTimeSheetRows, setCopyTimeSheetRows] = useState([]);

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

  //console.log("weekOffset==>", weekOffset);

  const [hasValidWeekOffsetZero, setHasValidWeekOffsetZero] = useState(false);

  const validateRowDatesMatchWeek = (data) => {
    const dayMap = {
      monday_date: weekDays.monday,
      tuesday_date: weekDays.tuesday,
      wednesday_date: weekDays.wednesday,
      thursday_date: weekDays.thursday,
      friday_date: weekDays.friday,
      saturday_date: weekDays.saturday,
      sunday_date: weekDays.sunday,
    };
    for (const row of data) {
      for (const [dateKey, expectedDisplayDate] of Object.entries(dayMap)) {
        if (row[dateKey] && expectedDisplayDate) {
          const expectedISO = convertDateFormatForCopy(expectedDisplayDate);
          if (row[dateKey] !== expectedISO) {
            return {
              valid: false,
              field: dateKey,
              expected: expectedISO,
              got: row[dateKey],
            };
          }
        }
      }
    }
    return {
      valid: true
    };
  };

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
    // console.log("weekOffset==>", weekOffset);
    let dayOfWeek = today.getDay();

    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1) + weekOffset * 7);

    //console.log("startOfWeek==>", startOfWeek);

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
      // sunday: formatDate(startOfWeek),
      sunday: formatDate(
        new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))
      ),
    });
  }, [weekOffset]);

  console.log("weekDays==>", weekDays);
  //   useEffect(() => {
  //   // const today = new Date("2026-06-21"); // test sunday
  //   const today = new Date();

  //   let dayOfWeek = today.getDay();
  //   dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  //   const monday = new Date(today);
  //   monday.setDate(
  //     today.getDate() - (dayOfWeek - 1) + weekOffset * 7
  //   );

  //   setWeekDays({
  //     monday: formatDate(new Date(monday)),
  //     tuesday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 1)),
  //     wednesday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 2)),
  //     thursday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3)),
  //     friday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4)),
  //     saturday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 5)),
  //     sunday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)),
  //   });
  // }, [weekOffset]);






  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [selectedStaff, setSelectedStaff] = useState(staffDetails.id);

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

  const [isExistStaffDataWeekDataAll, setIsExistStaffDataWeekDataAll] =
    useState({
      loading: true,
      data: [],
    });

  const [
    staffDataWeekDataAllSubmitTImeSheet,
    setStaffDataWeekDataAllSubmitTImeSheet,
  ] = useState({
    loading: true,
    data: [],
  });

  const [lineMangerData, setLineMangerData] = useState([]);
  const [selectedLineManager, setSelectedLineManager] = useState("");

  const GetLineManagerData = async () => {
    await dispatch(
      Staff({ req: { action: "get_line_manager" }, authToken: token })
    )
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          console.log(`response`, response);
          // Extract data array whether it's nested (like getStaffNew) or direct
          setLineMangerData(response.data?.data || response.data);
        } else {
          setLineMangerData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetTimeSheet = async (weekOffset) => {
    setIsWeekSwitching(true);
    setLoading(true);
    const req = { staff_id: multipleFilter.staff_id, weekOffset: weekOffset };
    const res = await dispatch(
      getTimesheetData({ req, authToken: token })
    ).unwrap();
    setSubmitStatusAllKey(0);
    setDeleteRows([]);
    if (res.status) {
      if (isExistStaffDataWeekDataAll?.data?.length === 0) {
        setIsExistStaffDataWeekDataAll({
          loading: false,
          data: res.filterDataWeek,
        });
      }

      if (
        selectedLineManager != "" &&
        res.filterDataWeekSubmitTimeSheet.length === 0
      ) {
        sweatalert.fire({
          icon: "warning",
          title: "No timesheets have been submitted yet.",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 2000,
        });
      }

      setStaffDataWeekDataAll({ loading: false, data: res.filterDataWeek });
      setStaffDataWeekDataAllSubmitTImeSheet({
        loading: false,
        data: res.filterDataWeekSubmitTimeSheet,
      });

      const hasValidWeekOffsetZeroValue =
        res.filterDataWeek?.length > 0 &&
        res.filterDataWeek?.some(
          (item) => parseInt(item.valid_weekOffsets) === 0
        );
      if (hasValidWeekOffsetZeroValue) {
        setHasValidWeekOffsetZero(true);
      } else {
        setHasValidWeekOffsetZero(false);
      }

      if (res?.data?.length > 0 && res?.data[0]?.submit_status === "1") {
        setSubmitStatusAllKey(1);
      }
      setTimeSheetRows(res.data);
      setTimeSheetRows((prevRows) =>
        prevRows?.map((row) => {
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
    setLoading(false);
    setIsWeekSwitching(false);
  };



  const selectFilterStaffANdWeek = async (e) => {
    let { name, value } = e.target;

    if (name === "staff_id") {
      setMultipleFilter((prev) => ({ ...prev, [name]: value }));
      weekOffSetValue.current = 0;
      setWeekOffset(0);
      setSelectedStaff(value);
      // await GetTimeSheet(0)
    } else if (name === "week") {
      if ([null, undefined, ""].includes(value)) {
        value = 0;
      } else {
        value = parseInt(value);
      }
      weekOffSetValue.current = parseInt(value);
      setWeekOffset(value);
      await GetTimeSheet(value);
    } else if (name === "copy_week") {
      await getTimeSheetCopyRecord(value);
    }
  };

  const getTimeSheetCopyRecord = async (weekOffset) => {
    const req = { staff_id: multipleFilter.staff_id, weekOffset: weekOffset };
    const res = await dispatch(
      getTimesheetData({ req, authToken: token })
    ).unwrap();

    if (res.status) {
      setCopyTimeSheetRows(res.data);
      setCopyTimeSheetRows((prevRows) =>
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
    }
  };

  const staffData = async () => {
    await dispatch(
      Staff({
        req: { action: "get", page: 1, limit: 10000, search: "" },
        authToken: token,
      })
    )
      .unwrap()
      .then(async (response) => {
        if (response?.data?.status) {
          // const filteredData = response.data.filter((item) => {
          //   return item.status === "1";
          // });
          const filteredData = response?.data?.data;
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
    GetLineManagerData();
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
  // const changeWeek = (offset) => {
  //   // alert(offset);
  //   setWeekOffset(parseInt(weekOffset) + offset);
  //   weekOffSetValue.current = parseInt(weekOffset) + offset;
  //   GetTimeSheet(parseInt(weekOffset) + offset);
  // };

  const changeWeek = (offset) => {
    if (isWeekSwitching) return;   //  ADD: 

    setWeekOffset(parseInt(weekOffset) + offset);
    weekOffSetValue.current = parseInt(weekOffset) + offset;
    GetTimeSheet(parseInt(weekOffset) + offset);
  };

  const [submitStatus, setSubmitStatus] = useState(0);
  const [remarkText, setRemarkText] = useState(null);
  const [remarkModel, setRemarkModel] = useState(false);
  const [remarkSingleModel, setRemarkSingleModel] = useState(false);
  const [remarkSingleIndex, setRemarkSingleIndex] = useState(null);

  const [timeSheetRows, setTimeSheetRows] = useState([]);
  const [updateTimeSheetRows, setUpdateTimeSheetRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState("this-week");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [isWeekSwitching, setIsWeekSwitching] = useState(false);
  const [isAddingRow, setIsAddingRow] = useState(false);

  // console.log(`timeSheetRows`, timeSheetRows);

  // Function to handle dropdown change
  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };

  const handleAddNewSheet = async () => {
    if (isAddingRow) return;
    setIsAddingRow(true);
    try {
      if (timeSheetRows.length > 0) {
        const lastObject = timeSheetRows[timeSheetRows.length - 1];
        let missingFields = [];

        if (lastObject.task_type === "2") {
          if (!lastObject.customer_id) missingFields.push("Customer");
          if (!lastObject.client_id) missingFields.push("Client");
        }

        if (!lastObject.job_id) missingFields.push("Job");
        if (!lastObject.task_id) missingFields.push("Task");

        if (missingFields.length > 0) {
          let textMsg = "";
          if (missingFields.includes("Client")) {
            textMsg = `This row cannot be added because ${missingFields.join(", ")} are missing. Please complete the current row first.`;
          } else {
            textMsg = `This row cannot be added because no Job or Task is available for the selected client. Please choose a different client or create a Job first.`;
          }

          sweatalert.fire({
            icon: "warning",
            title: "Missing Fields",
            text: textMsg,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 3000,
          });
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
        monday_note: null,
        tuesday_date: null,
        tuesday_hours: null,
        tuesday_note: null,
        wednesday_date: null,
        wednesday_hours: null,
        wednesday_note: null,
        thursday_date: null,
        thursday_hours: null,
        thursday_note: null,
        friday_date: null,
        friday_hours: null,
        friday_note: null,
        saturday_date: null,
        saturday_hours: null,
        saturday_note: null,
        sunday_date: null,
        sunday_hours: null,
        sunday_note: null,
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
    } catch (error) {
      console.log("Error in handleAddNewSheet:", error);
    } finally {
      setIsAddingRow(false);
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

    updatedRows[index].customer_id = null;
    updatedRows[index].client_id = null;
    updatedRows[index].job_id = null;
    updatedRows[index].task_id = null;


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
        updatedRows[index].customer_id = e.target.value;
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

    updatedRows[index].client_id = null;
    updatedRows[index].job_id = null;
    updatedRows[index].task_id = null;


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
        updatedRows[index].client_id = e.target.value;
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

    updatedRows[index].job_id = null;
    updatedRows[index].task_id = null;

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
    updatedRows[index].job_id = e.target.value;
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


    let final_value = value;

    let [intPart, decimalPart] = value.toString().split(".");

    if (decimalPart) {
      let multiplied = Math.floor(parseInt(decimalPart) * 0.6);

      const multipliedStr = multiplied.toString().padStart(2, "0");
      final_value = `${intPart}.${multipliedStr}`;
      // final_value = `${intPart}.${multiplied}`;
    }

    // console.log(`final_value`, final_value);

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

    if (parseFloat(final_value) > 23.59) {
      sweatalert.fire({
        icon: "warning",
        title: "Total hours in a day cannot exceed 24",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    // const [integerPart, fractionalPart] = value.split(".");
    // if (fractionalPart && parseInt(fractionalPart) > 59) {
    //   sweatalert.fire({
    //     icon: "warning",
    //     title: "Minutes cannot exceed 59 ",
    //     timerProgressBar: true,
    //     showConfirmButton: true,
    //     timer: 1500,
    //   });
    //   return;
    // }

    const [integerPart, fractionalPartRaw] = final_value.split(".");
    let fractionalPart = fractionalPartRaw || "0";
    if (fractionalPart.length === 1) {
      fractionalPart = fractionalPart + "0";
    }
    if (parseInt(fractionalPart) > 59) {
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
    // const total = timeSheetRows && timeSheetRows.reduce((acc, item) => {
    //   const val = parseFloat(item[key] || 0);
    //   const hrs = Math.floor(val);
    //   const mins = Math.round((val - hrs) * 100);
    //   acc.totalMinutes += hrs * 60 + mins;
    //   return acc;
    // }, { totalMinutes: 0 });

    // const totalHours = Math.floor(total.totalMinutes / 60);
    // const totalMins = total.totalMinutes % 60;
    // const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;
    // return finalTotalHours;

    const total =
      timeSheetRows &&
      timeSheetRows?.reduce((acc, item) => {
        const val = parseFloat(item[key] || 0);
        return acc + val;
      }, 0);

    return total.toFixed(2); // returns something like 8.75
  };

  function totalWeeklyHoursMinutes(timeData) {
    const dayFields = [
      "monday_hours",
      "tuesday_hours",
      "wednesday_hours",
      "thursday_hours",
      "friday_hours",
      "saturday_hours",
      "sunday_hours",
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
    const formattedMinutes = finalMinutes.toString().padStart(2, "0");

    const totalFormattedTime = `${finalHours}.${formattedMinutes}`;
    return totalFormattedTime;
  }

  const totalHoursMinute = () => {
    // const converted = timeSheetRows && timeSheetRows?.map(item => {
    //   return {
    //     original: item.total_hours,
    //     totalweeklyHours: totalWeeklyHoursMinutes(item)
    //   };
    // });
    // const total = converted.reduce((acc, item) => {
    //   const val = parseFloat(item.totalweeklyHours || 0);
    //   const hrs = Math.floor(val);
    //   const mins = Math.round((val - hrs) * 100);

    //   acc.totalMinutes += hrs * 60 + mins;
    //   return acc;
    // }, { totalMinutes: 0 });

    // const totalHours = Math.floor(total.totalMinutes / 60);
    // const totalMins = total.totalMinutes % 60;
    // const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;
    // return finalTotalHours;

    const total =
      timeSheetRows &&
      timeSheetRows?.reduce((acc, item) => {
        const val = parseFloat(item.total_hours || 0);
        return acc + val;
      }, 0);

    return total.toFixed(2);
  };

  const saveData = async (e) => {

    if (timeSheetRows.length === 0) {
      sweatalert.fire({
        icon: "warning",
        title: "Please add at least one row to the timesheet.",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }

    if (timeSheetRows.length > 0) {
      const lastObject = timeSheetRows[timeSheetRows.length - 1];
      let missingFields = [];

      if (lastObject.task_type === "2") {
        if (!lastObject.customer_id) missingFields.push("Customer");
        if (!lastObject.client_id) missingFields.push("Client");
      }

      if (!lastObject.job_id) missingFields.push("Job");
      if (!lastObject.task_id) missingFields.push("Task");

      if (missingFields.length > 0) {
        let textMsg = "";
        if (missingFields.includes("Client")) {
          textMsg = `This row cannot be saved because ${missingFields.join(", ")} are missing. Please complete the current row first.`;
        } else {
          textMsg = `This row cannot be saved because no Job or Task is available for the selected client. Please choose a different client or create a Job first.`;
        }

        sweatalert.fire({
          icon: "warning",
          title: "Missing Fields",
          text: textMsg,
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 3000,
        });
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

      let staff_hourminute =
        parseFloat(updatedTimeSheetRows?.[0]?.staffs_hourminute) / 5 || null;
      //console.log(`updatedTimeSheetRows?.[0]`, updatedTimeSheetRows?.[0]);
      //console.log(`staff_hourminute`, staff_hourminute);
      if (staff_hourminute != null) {
        const converted =
          updatedTimeSheetRows &&
          updatedTimeSheetRows?.map((item) => {
            return {
              original: item.total_hours,
              totalweeklyHours: totalWeeklyHoursMinutes(item),
            };
          });

        const total = converted.reduce(
          (acc, item) => {
            const val = parseFloat(item.totalweeklyHours || 0);
            const hrs = Math.floor(val);
            const mins = Math.round((val - hrs) * 100);

            acc.totalMinutes += hrs * 60 + mins;
            return acc;
          },
          { totalMinutes: 0 }
        );

        const totalHours = Math.floor(total.totalMinutes / 60);
        const totalMins = total.totalMinutes % 60;
        const finalTotalHours = `${totalHours}.${totalMins
          .toString()
          .padStart(2, "0")}`;
        // console.log(`finalTotalHours`, finalTotalHours);

        // if (staff_hourminute > parseFloat(finalTotalHours)) {
        //   sweatalert.fire({
        //     icon: "warning",
        //     title: "Please enter the minimum required hourly time in the timesheet before submitting.",
        //     timerProgressBar: true,
        //     showConfirmButton: true,
        //     timer: 3000,
        //   });
        //   return;
        // }
      }

      let isvalid = await validateDateFields(req.data);
      if (!isvalid) {
        sweatalert.fire({
          icon: "warning",
          title: "Please fill at least one date field for each row.",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 3000,
        });
        return;
      }

      const dateCheck = validateRowDatesMatchWeek(req.data);
      if (!dateCheck.valid) {
        sweatalert.fire({
          icon: "error",
          title: `Date mismatch detected in ${dateCheck.field}. Expected ${dateCheck.expected}, but found ${dateCheck.got}. Please refresh and re-enter.`,
          showConfirmButton: true,
        });
        return;
      }

      // const res = await dispatch(
      //   saveTimesheetData({ req, authToken: token })
      // ).unwrap();

      setLoading(true);
      setIsDisabled(true);


      const res = await SAVE_TIMESHEET({ req, authToken: token });
      if (res.status) {

        setLoading(false);
        setIsDisabled(false);


        setActiveIndex(null);
        setActiveField(null);
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

        // note States reset
        setIsModalOpen(false);
        setModalText("");
        return;
      } else {
        sweatalert.fire({
          icon: "error",
          title: res.message,
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 1500,
        });
        setLoading(false);
        setIsDisabled(false);
        return;
      }
    }
  };

  const validateDateFields = (data) => {
    const isInvalid = data.some((row) => {
      const allDatesEmpty =
        !row.monday_date &&
        !row.tuesday_date &&
        !row.wednesday_date &&
        !row.thursday_date &&
        !row.friday_date &&
        !row.saturday_date &&
        !row.sunday_date;

      return row.id === null && allDatesEmpty;
    });

    if (isInvalid) {
      return false;
    }
    return true;
  };

  const submitData = async (e) => {
    if (timeSheetRows.length === 0) {
      sweatalert.fire({
        icon: "warning",
        title: "Please add at least one row to the timesheet.",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }

    if (timeSheetRows.length > 0) {
      const lastObject = timeSheetRows[timeSheetRows.length - 1];
      let missingFields = [];

      if (lastObject.task_type === "2") {
        if (!lastObject.customer_id) missingFields.push("Customer");
        if (!lastObject.client_id) missingFields.push("Client");
      }

      if (!lastObject.job_id) missingFields.push("Job");
      if (!lastObject.task_id) missingFields.push("Task");

      if (missingFields.length > 0) {
        let textMsg = "";
        if (missingFields.includes("Client")) {
          textMsg = `This row cannot be submitted because ${missingFields.join(", ")} are missing. Please complete the current row first.`;
        } else {
          textMsg = `This row cannot be submitted because no Job or Task is available for the selected client. Please choose a different client or create a Job first.`;
        }

        sweatalert.fire({
          icon: "warning",
          title: "Missing Fields",
          text: textMsg,
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 3000,
        });
        return;
      }
    }

    setSubmitStatus(1);
    setRemarkModel(true);
  };

  async function convertHoursMinutes(totalHours) {
    if (totalHours == null || totalHours === "") {
      return "0.00"; // Return a default value if totalHours is null or empty
    }
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}.${formattedMinutes}`;
  }

  const saveTimeSheetRemark = async (e) => {

    if (submitStatus == 1) {
      const updatedTimeSheetRows = timeSheetRows.map((item) => {
        return {
          ...item,
          submit_status: "1",
          final_remark: remarkText,
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

      //let staff_hourminute = (parseFloat(updatedTimeSheetRows1?.[0]?.staffs_hourminute) / 5) || null;
      let staff_hourminute =
        updatedTimeSheetRows1?.[0]?.staffs_hourminute || null;

      //  console.log(`staff_hourminute 111 `, staff_hourminute);

      if (staff_hourminute != null && staff_hourminute?.includes(":")) {
        const [hours, minutes] = staff_hourminute.split(":").map(Number);
        const decimal = hours + "." + minutes;
        staff_hourminute = parseFloat(decimal);
      } else if (staff_hourminute != null) {
        staff_hourminute = parseFloat(staff_hourminute);
      }

      if (staff_hourminute != null) {
        // const converted = updatedTimeSheetRows1 && updatedTimeSheetRows1?.map(item => {
        //   return {
        //     original: item.total_hours,
        //     totalweeklyHours: totalWeeklyHoursMinutes(item)
        //   };
        // });

        //  const total = converted.reduce((acc, item) => {
        //   const val = parseFloat(item.totalweeklyHours || 0);
        //   const hrs = Math.floor(val);
        //   const mins = Math.round((val - hrs) * 100);

        //   acc.totalMinutes += hrs * 60 + mins;
        //   return acc;
        // }, { totalMinutes: 0 });

        // const totalHours = Math.floor(total.totalMinutes / 60);
        // const totalMins = total.totalMinutes % 60;
        // const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;
        // console.log(`finalTotalHours`, finalTotalHours);

        const totalHours =
          timeSheetRows &&
          timeSheetRows?.reduce((acc, item) => {
            const val = parseFloat(item.total_hours || 0);
            return acc + val;
          }, 0);

        let finalTotalHours = await convertHoursMinutes(totalHours);

        // console.log(`finalTotalHours`, finalTotalHours);
        // console.log(`staff_hourminute`, staff_hourminute);

        if (staff_hourminute > parseFloat(finalTotalHours)) {
          sweatalert.fire({
            icon: "warning",
            title:
              "Please enter the minimum required hourly time in the timesheet before submitting.",
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 3000,
          });

          return;
        }
      }

      setLoading(true);
      setIsDisabled(true);

      // const res = await dispatch(
      //   saveTimesheetData({ req, authToken: token })
      // ).unwrap();

      const res = await SAVE_TIMESHEET({ req, authToken: token });
      if (res.status) {

        setLoading(false);
        setIsDisabled(false);

        setActiveIndex(null);
        setActiveField(null);

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


        return;
      } else {
        setLoading(false);
        setIsDisabled(false);

        sweatalert.fire({
          icon: "error",
          title: "Timesheet data submit failed.",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 1500,
        });
        return;
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

    let staff_hourminute =
      updatedTimeSheetRows1?.[0]?.staffs_hourminute || null;

    if (staff_hourminute != null && staff_hourminute?.includes(":")) {
      const [hours, minutes] = staff_hourminute.split(":").map(Number);
      const decimal = hours + "." + minutes;
      staff_hourminute = parseFloat(decimal);
    } else if (staff_hourminute != null) {
      staff_hourminute = parseFloat(staff_hourminute);
    }

    if (staff_hourminute != null) {
      // const converted = updatedTimeSheetRows1 && updatedTimeSheetRows1?.map(item => {
      //   return {
      //     original: item.total_hours,
      //     totalweeklyHours: totalWeeklyHoursMinutes(item)
      //   };
      // });

      //  const total = converted.reduce((acc, item) => {
      //   const val = parseFloat(item.totalweeklyHours || 0);
      //   const hrs = Math.floor(val);
      //   const mins = Math.round((val - hrs) * 100);

      //   acc.totalMinutes += hrs * 60 + mins;
      //   return acc;
      // }, { totalMinutes: 0 });

      // const totalHours = Math.floor(total.totalMinutes / 60);
      // const totalMins = total.totalMinutes % 60;
      // const finalTotalHours = `${totalHours}.${totalMins.toString().padStart(2, '0')}`;
      // console.log(`finalTotalHours`, finalTotalHours);

      const totalHours =
        timeSheetRows &&
        timeSheetRows?.reduce((acc, item) => {
          const val = parseFloat(item.total_hours || 0);
          return acc + val;
        }, 0);

      let finalTotalHours = await convertHoursMinutes(totalHours);

      // console.log(`finalTotalHours 1 `, finalTotalHours);
      // console.log(`staff_hourminute 1 `, staff_hourminute);

      if (staff_hourminute > parseFloat(finalTotalHours)) {
        sweatalert.fire({
          icon: "warning",
          title:
            "Please enter the minimum required hourly time in the timesheet before submitting.",
          timerProgressBar: true,
          showConfirmButton: true,
          timer: 3000,
        });

        return;
      }
    }

    // const res = await dispatch(
    //   saveTimesheetData({ req, authToken: token })
    // ).unwrap();

    setLoading(true);
    setIsDisabled(true);



    const res = await SAVE_TIMESHEET({ req, authToken: token });

    if (res.status) {

      setLoading(false);
      setIsDisabled(false);

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

      // note States reset
      setIsModalOpen(false);
      setModalText("");
      setActiveIndex(null);
      setActiveField(null);
      return;

    } else {
      sweatalert.fire({
        icon: "error",
        title: res.message,
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      setLoading(false);
      setIsDisabled(false);

      return;

    }

  };

  // const dayMonthFormatDate = (dateString) => {

  //   const parts = dateString.split(", ");
  //   const dayOfWeek = parts[0];
  //   const dateParts = parts[1].split("/");
  //   const day = dateParts[0];
  //   const monthIndex = dateParts[1] - 1;
  //   const year = dateParts[2];
  //   const date = new Date(year, monthIndex, day);
  //   const options = { month: "short" };
  //   const month = date.toLocaleDateString("en-US", options).toLowerCase();
  //   // Return formatted string
  //   return `${dayOfWeek} ${day} ${month}`;
  // };

  const dayMonthFormatDate = (dateString) => {

    const parts = dateString.split(", ");
    const dateParts = parts[1].split("/");

    const day = String(dateParts[0]).padStart(2, "0");
    const month = String(dateParts[1]).padStart(2, "0");
    const year = String(dateParts[2]).slice(-2); // last 2 digit

    return `${day}/${month}/${year}`;
  };


  const exportToCSV = (timeSheetRows) => {
    if (!timeSheetRows || timeSheetRows.length === 0) {
      alert("No data to export!");
      return;
    }

    setExporting(true);
    setTimeout(() => {
      // const headers = [
      //   "Index",
      //   "Task Type",
      //   "Customer Name",
      //   "Client Name",
      //   "Job Name",
      //   "Job Type",
      //   "Task Name",
      //   weekDays.monday ? dayMonthFormatDate(weekDays.monday) : "",
      //   //"Monday Hours",
      //   "Monday Note",
      //   "Tuesday Hours",
      //   "Wednesday Hours",
      //   "Thursday Hours",
      //   "Friday Hours",
      //   "Saturday Hours",
      //   "Remark"
      // ];

      const headers = [
        "Index",
        "Task Type",
        "Customer Name",
        "Client Name",
        "Job Name",
        "Job Type",
        "Task Name",
        weekDays.monday ? dayMonthFormatDate(weekDays.monday) : "",
        "Monday Note",
        weekDays.tuesday ? dayMonthFormatDate(weekDays.tuesday) : "",
        "Tuesday Note",
        weekDays.wednesday ? dayMonthFormatDate(weekDays.wednesday) : "",
        "Wednesday Note",
        weekDays.thursday ? dayMonthFormatDate(weekDays.thursday) : "",
        "Thursday Note",
        weekDays.friday ? dayMonthFormatDate(weekDays.friday) : "",
        "Friday Note",
        weekDays.saturday ? dayMonthFormatDate(weekDays.saturday) : "",
        "Saturday Note",
        "Remark",
      ];

      let total_hours = 0;
      const rows = timeSheetRows
        .filter((item) => item.id !== null && item.id !== undefined)
        .map((item, index) => {
          total_hours += parseFloat(item.total_hours) || 0;
          return [
            index + 1,
            item.task_type === "1" ? "Internal" : "External",
            item.customer_name || "No Customer",
            item.client_name || "No Client",
            item.task_type === "1"
              ? item.internal_name || "No Job"
              : item.job_name || "No Job",
            item.task_type === "1" ? " - " : item.job_type_name || " - ",
            item.task_type === "1"
              ? item.sub_internal_name || "No Task"
              : item.task_name || "No Task",
            item.monday_hours || 0,
            item.monday_note || "",
            item.tuesday_hours || 0,
            item.tuesday_note || "",
            item.wednesday_hours || 0,
            item.wednesday_note || "",
            item.thursday_hours || 0,
            item.thursday_note || "",
            item.friday_hours || 0,
            item.friday_note || "",
            item.saturday_hours || 0,
            item.saturday_note || "",
            item.remark || "",
          ];
        });

      const finalRemarkRow = [
        `Total Weekly Hours : ${total_hours.toFixed(2) || ""}`,
        `Final Remark: ${timeSheetRows[0].final_remark || ""}`,
        ...new Array(headers.length - 1).fill(""),
      ];

      const csvContent = [headers, ...rows, finalRemarkRow]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TimeSheetData.csv";
      link.click();
      setExporting(false);
    }, 100);
  };

  const handleSingleRemark = (e, item, index) => {
    setRemarkSingleModel(true);
    setRemarkSingleIndex(index);
  };

  const handleRemarkSingleText = (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].remark = e.target.value;
    setTimeSheetRows(updatedRows);
    const rowId = updatedRows[index].id;
    updateRecordSheet(rowId, "remark", e.target.value);
  };

  const singleRemarkModalDone = async () => {
    setRemarkSingleModel(false);
  };

  // SELECT OPTIONS FOR STAFF START //
  const staffOptions =
    staffDataAll.data?.map((val) => ({
      value: val.id,
      label: `${val.first_name} ${val.last_name}`,
    })) || [];
  // SELECT OPTIONS FOR STAFF END //

  // SELECT OPTIONS FOR WEEK START //
  const weekOptions = [];
  if (!hasValidWeekOffsetZero) {
    weekOptions.push({
      value: "0",
      label: getFormattedDate("current", ""),
    });
  }

  if (staffDataWeekDataAll.data) {
    staffDataWeekDataAll.data.forEach((val) => {
      weekOptions.push({
        value: val.valid_weekOffsets,
        label: getFormattedDate("convert", val.month_date),
      });
    });
  }

  const weekOptionsSubmitTimeSheet = [];

  if (staffDataWeekDataAllSubmitTImeSheet.data) {
    staffDataWeekDataAllSubmitTImeSheet.data.forEach((val) => {
      weekOptionsSubmitTimeSheet.push({
        value: val.valid_weekOffsets,
        label: getFormattedDate("convert", val.month_date),
      });
    });
  }

  let currentValue = weekOptions.find(
    (opt) => opt.value == weekOffSetValue.current
  );

  // SELECT OPTIONS FOR WEEK END //

  const handleSaveNote = (e) => {
    // console.log("modalText ",modalText);
    // console.log("activeField ",activeField);
    const updatedRows = [...timeSheetRows];
    let key = activeField + "_note";
    updatedRows[selectedRowIndex][key] = modalText;
    setTimeSheetRows(updatedRows);
    setUpdateTimeSheetRows((prev) => {
      const existingIndex = prev.findIndex(
        (row) => row.id === updatedRows[selectedRowIndex].id
      );
      if (existingIndex !== -1) {
        const updatedPrev = [...prev];
        updatedPrev[existingIndex][key] = modalText;
        return updatedPrev;
      } else {
        return [
          ...prev,
          { id: updatedRows[selectedRowIndex].id, [key]: modalText },
        ];
      }
    });
    setIsModalOpen(false);
    setModalText("");
    setActiveIndex(null);
    setActiveField(null);
  };

  //  timeSheet functionality
  const weekOptionsWithPlaceholder = [
    { label: "-- select --", value: "" },
    ...weekOptions,
  ];

  // COPY TIMESHEET FUNCTIONALITY START //
  const weekOptionsWithPlaceholderSubmitTimeSheet = [
    { label: "-- select --", value: "" },
    ...weekOptionsSubmitTimeSheet,
  ];

  //lineMangerDataWithPlaceholder
  const lineMangerDataOptions =
    lineMangerData?.map((val) => ({
      value: val.staff_id,
      label: `${val.staff_name}`,
    })) || [];
  const lineMangerDataWithPlaceholder = [
    { label: "-- select --", value: "" },
    ...lineMangerDataOptions,
  ];

  const selectLineManager = async (e) => {
    // console.log("e ", e);
    let name = e.target.name;
    let value = e.target.value;

    if (!["", "0", undefined, null].includes(value)) {
      setSelectedLineManager(value);
      const e = { target: { name: "staff_id", value: value } };
      selectFilterStaffANdWeek(e);
    } else {
      setSelectedLineManager("");
      const e = { target: { name: "staff_id", value: staffDetails?.id } };
      selectFilterStaffANdWeek(e);
    }
  };

  // console.log("weekOptionsWithPlaceholder ", weekOptionsWithPlaceholder);
  // console.log("weekOptions ", weekOptions);

  const convertDateFormatForCopy = (dateString) => {
    const datePart = dateString.split(",")[1].trim(); // "07/10/2024"
    const [day, month, year] = datePart.split("/");
    const formattedDate = new Date(`${year}-${month}-${day}`);
    const date_final_value = formattedDate.toISOString().split("T")[0];
    return date_final_value;
  };

  const handleCopyTimeSheetAutoFill = async () => {
    if (copyTimeSheetRows && copyTimeSheetRows.length > 0) {
      setTimeSheetRows((prev) => [
        ...prev, // previous state retained
        ...copyTimeSheetRows.map((row) => {
          const sum =
            (parseFloat(row.monday_hours) || 0) +
            (parseFloat(row.tuesday_hours) || 0) +
            (parseFloat(row.wednesday_hours) || 0) +
            (parseFloat(row.thursday_hours) || 0) +
            (parseFloat(row.friday_hours) || 0) +
            (parseFloat(row.saturday_hours) || 0) +
            (parseFloat(row.sunday_hours) || 0);

          return {
            ...row,
            id: null,
            submit_status: "0",
            monday_date: convertDateFormatForCopy(weekDays.monday),
            tuesday_date: convertDateFormatForCopy(weekDays.tuesday),
            wednesday_date: convertDateFormatForCopy(weekDays.wednesday),
            thursday_date: convertDateFormatForCopy(weekDays.thursday),
            friday_date: convertDateFormatForCopy(weekDays.friday),
            saturday_date: convertDateFormatForCopy(weekDays.saturday),
            sunday_date: convertDateFormatForCopy(weekDays.sunday),
            total_hours: parseFloat(sum).toFixed(2),
          };
        }),
      ]);

      setUpdateTimeSheetRows((prev) => [
        ...prev,
        ...copyTimeSheetRows.map((row) => {
          const sum =
            (parseFloat(row.monday_hours) || 0) +
            (parseFloat(row.tuesday_hours) || 0) +
            (parseFloat(row.wednesday_hours) || 0) +
            (parseFloat(row.thursday_hours) || 0) +
            (parseFloat(row.friday_hours) || 0) +
            (parseFloat(row.saturday_hours) || 0) +
            (parseFloat(row.sunday_hours) || 0);

          return {
            ...row,
            id: null,
            submit_status: "0",
            monday_date: convertDateFormatForCopy(weekDays.monday),
            tuesday_date: convertDateFormatForCopy(weekDays.tuesday),
            wednesday_date: convertDateFormatForCopy(weekDays.wednesday),
            thursday_date: convertDateFormatForCopy(weekDays.thursday),
            friday_date: convertDateFormatForCopy(weekDays.friday),
            saturday_date: convertDateFormatForCopy(weekDays.saturday),
            sunday_date: convertDateFormatForCopy(weekDays.sunday),

            total_hours: parseFloat(sum).toFixed(2),
          };
        }),
      ]);
    }
    setCopyTimeSheetRows([]);
    setIsCopyModalOpen(false);
  };

  //  console.log("timeSheetRows -- > ", timeSheetRows);

  // External Customer DropDown

  const getCustomerOptions = (item) =>
    item.customerData?.map((customer) => ({
      value: customer.id,
      label: customer.trading_name,
    })) || [];

  const getClientOptions = (item) =>
    item.clientData?.map((client) => ({
      value: client.id,
      label: client.trading_name,
    })) || [];

  const getJobOptions = (item) =>
    item.jobData?.map((job) => ({
      value: job.id,
      label: job.name,
    })) || [];

  const getTaskOptions = (item) =>
    item.taskData?.map((task) => ({
      value: task.id,
      label: task.name,
    })) || [];

  const taskTypeOptions = [
    { value: "1", label: "Internal" },
    { value: "2", label: "External" },
  ];

  console.log("timeSheetRows", timeSheetRows);


  const graphData = [
    { month: "Jan 26", total: 65, billable: 45, leave: 10 },
    { month: "Feb 26", total: 72, billable: 52, leave: 8 },
    { month: "Mar 26", total: 80, billable: 60, leave: 12 },
    { month: "Apr 26", total: 68, billable: 48, leave: 15 },
    { month: "May 26", total: 85, billable: 65, leave: 7 },
    { month: "Jun 26", total: 78, billable: 58, leave: 10 },
  ];

  const renderPercentLabel = ({ x, y, width, value }) => {
    if (!value) return null;

    return (
      <text
        x={x + width / 2}
        y={y - 8}
        textAnchor="middle"
        fontSize={12}
        fill="#5b6b7a"
      >
        {value}%
      </text>
    );
  };

  function LegendDot({ color, label }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
          }}
        />

        <span
          style={{
            fontSize: 13,
            color: "#5b6b7a",
          }}
        >
          {label}
        </span>
      </div>
    );
  }


  return (
    <>
      {/* <div className="container-fluid" style={{ position: "relative" }}>
        {(loading || exporting || staffDataAll.loading || staffDataWeekDataAll.loading || isExistStaffDataWeekDataAll.loading || staffDataWeekDataAllSubmitTImeSheet.loading || isAddingRow) && (
          <div className="overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
            <div className="loader"></div>
          </div>
        )}
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

            <div className="col-md-4">

              {timeSheetRows.length > 0 ? (
                <div className="form-group float-md-end">
                  <button
                    className="btn btn-info "
                    onClick={() => exportToCSV(timeSheetRows)}
                  >
                    <Download size={16} />
                    <span> Export Timesheet Data</span>
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="report-data mt-4">
          <div className="col-md-12">
            <div className="row ">
              {["SUPERADMIN", "ADMIN", "MANAGEMENT"].includes(role) ? (
                <div className="form-group col-md-4">
                  <label className="form-label mb-2">Select Staff</label>

                  <Select
                    id="tabSelect"
                    name="staff_id"
                    className="basic-multi-select"
                    options={staffOptions}
                    value={staffOptions.find(
                      (opt) => Number(opt.value) === Number(selectedStaff)
                    )}
                    onChange={(selectedOption) => {

                      const e = {
                        target: { name: "staff_id", value: selectedOption.value },
                      };
                      selectFilterStaffANdWeek(e);
                    }}
                    classNamePrefix="react-select"
                    isSearchable
                  />
                </div>
              ) : (
                ""
              )}

              {staffDataWeekDataAll.data &&
                staffDataWeekDataAll.data.length > 0 ? (
                <div className="form-group col-md-4   pe-0">
                  <label className="form-label mb-2">Select Date</label>
                  <Select
                    id="tabSelect"
                    name="week"
                    className="basic-multi-select"

                    options={weekOptionsWithPlaceholder}
                    value={currentValue || null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {

                      const e = {
                        target: { name: "week", value: selectedOption.value },
                      };
                      selectFilterStaffANdWeek(e);
                    }}
                    classNamePrefix="react-select"
                    isSearchable
                    isDisabled={selectedLineManager != "" ? true : false}
                  />
                </div>
              ) : (
                ""
              )}

              {isExistStaffDataWeekDataAll?.data &&
                isExistStaffDataWeekDataAll?.data.length > 0 &&
                staffDataWeekDataAll?.data.length === 0 ? (
                <div className="form-group col-md-4 pe-0">
                  <label className="form-label mb-2">Select Date</label>
                  <Select
                    id="tabSelect"
                    name="week"
                    className="basic-multi-select"
                    options={weekOptionsWithPlaceholder}
                    value={currentValue || null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {

                      const e = {
                        target: { name: "week", value: selectedOption.value },
                      };
                      selectFilterStaffANdWeek(e);
                    }}
                    classNamePrefix="react-select"
                    isSearchable
                    isDisabled={selectedLineManager != "" ? true : false}
                  />
                </div>
              ) : (
                ""
              )}

              {role !== "SUPERADMIN" && lineMangerData && lineMangerData.length > 0 ? (
                <div className="form-group  col-md-4  pe-0">
                  <label className="form-label mb-2">Team Timesheet Status</label>
                  <Select
                    id="tabSelect"
                    name="week"
                    className="basic-multi-select"

                    options={lineMangerDataWithPlaceholder}
                    defaultValue={null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {

                      const e = {
                        target: {
                          name: "lineManger",
                          value: selectedOption.value,
                        },
                      };
                      selectLineManager(e);
                    }}
                    classNamePrefix="react-select"
                    isSearchable
                  />
                </div>
              ) : (
                ""
              )}

              {selectedLineManager != "" &&
                staffDataWeekDataAll.data &&
                staffDataWeekDataAll.data.length > 0 ? (
                <div className="form-group col-md-4  pe-0">
                  <label className="form-label mb-2">
                    Line Manager Select Week
                  </label>
                  <Select
                    id="tabSelect"
                    name="week"
                    className="basic-multi-select"
                    options={weekOptionsWithPlaceholderSubmitTimeSheet}
                    defaultValue={null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {

                      const e = {
                        target: { name: "week", value: selectedOption.value },
                      };
                      selectFilterStaffANdWeek(e);
                    }}
                    classNamePrefix="react-select"
                    isSearchable
                  />
                </div>
              ) : (
                ""
              )}
            </div>


            <div className="tab-content mt-1">

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
                              <th className="dropdwnCol2 pe-0" data-field="phone">
                                No
                              </th>
                              <th className="" data-field="phone">
                                Task Type
                              </th>
                              <th className="dropdwnCol7" data-field="phone">
                                Customer
                              </th>
                              <th className="dropdwnCol6" data-field="phone">
                                Client
                              </th>
                              <th className="dropdwnCol5" data-field="phone">
                                Job
                              </th>
                              <th className="dropdwnCol5" data-field="phone">
                                Job Type
                              </th>
                              <th className="dropdwnCol5" data-field="phone">
                                Task
                              </th>

                              <th
                                className={`pe-0 week-data ${isExpanded ? "expanded" : ""
                                  }`}

                              >
                                <div className="d-flex align-items-center">

                                  < ChevronLeft style={{ cursor: isWeekSwitching ? "not-allowed" : "pointer", opacity: isWeekSwitching ? 0.5 : 1 }} onClick={(e) => { e.preventDefault(); if (!isWeekSwitching) changeWeek(-1); }}
                                  />
                                  <span className="me-0">
                                    {weekDays.monday
                                      ? dayMonthFormatDate(weekDays.monday)
                                      : ""}
                                  </span>


                                  {isExpanded && (
                                    <div
                                      className="d-flex"
                                      style={{ width: "70%" }}
                                    >
                                      {[
                                        "tuesday",
                                        "wednesday",
                                        "thursday",
                                        "friday",
                                        "saturday",
                                      ].map((day) => (
                                        <span key={day}>
                                          {weekDays[day]
                                            ? dayMonthFormatDate(weekDays[day])
                                            : ""}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <button
                                    onClick={toggleAllRowsView}
                                    className="px-0 btn btn-sm btn-link text-decoration-none"
                                  >

                                    {isExpanded ? (
                                      <Minus size={16} />
                                    ) : (
                                      <Plus size={16} />
                                    )}
                                  </button>


                                  <ChevronRight style={{ cursor: isWeekSwitching ? "not-allowed" : "pointer", opacity: isWeekSwitching ? 0.5 : 1 }} onClick={(e) => { e.preventDefault(); if (!isWeekSwitching) changeWeek(1); }} />
                                </div>
                              </th>



                              {submitStatusAllKey === 0 ? (
                                <>
                                  <th className="dropdwnCol5" data-field="phone">
                                    Action
                                  </th>
                                </>
                              ) : (
                                <th className="dropdwnCol5" data-field="phone">
                                  Remark
                                </th>
                              )}
                            </tr>
                          </thead>

                          <tbody className="list form-check-all">
                            {timeSheetRows?.length > 0 ? (
                              timeSheetRows?.map((item, index) => (
                                <tr className="tabel_new">
                                  <td className="pe-0">{index + 1}</td>

                                  <td className="ps-0">
                                    {item.newRow === 1 ? (

                                      <Select
                                        className="basic-multi-select"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        classNamePrefix="react-select"
                                        styles={{
                                          container: (base) => ({
                                            ...base,
                                            width: 140,
                                          }),
                                        }}
                                        options={taskTypeOptions}
                                        value={taskTypeOptions.find(
                                          (opt) =>
                                            String(opt.value) ===
                                            String(item.task_type)
                                        )}
                                        isSearchable={false}
                                        placeholder="Task Type"
                                        onChange={(selectedOption) => {
                                          const e = {
                                            target: {
                                              name: "task_type",
                                              value: selectedOption.value,
                                            },
                                          };

                                          handleChangeTaskType(e, item, index);
                                        }}
                                      />
                                    ) : (
                                      <select
                                        className="form-select form-control"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        style={{ width: "100px" }}
                                        value={item.task_type}
                                        disabled
                                      >
                                        <option value="1">Internal</option>
                                        <option value="2">External</option>
                                      </select>
                                    )}
                                  </td>


                                  <td>
                                    {item.newRow === 1 &&
                                      item.task_type === "2" ? (


                                      <Select
                                        className="basic-multi-select"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        classNamePrefix="react-select"
                                        styles={{
                                          container: (base) => ({
                                            ...base,
                                            width: 150,
                                          }),
                                        }}
                                        options={getCustomerOptions(item)}
                                        value={getCustomerOptions(item).find(
                                          (opt) =>
                                            Number(opt.value) ===
                                            Number(item.customer_id)
                                        )}
                                        isSearchable
                                        onChange={(selectedOption) => {

                                          const e = {
                                            target: {
                                              name: "customer_id",
                                              value: selectedOption?.value || "",
                                            },
                                          };

                                          selectCustomerData(e, index);
                                        }}
                                      />
                                    ) : (
                                      <input
                                        className="form-control cursor-pointer"
                                        style={{ width: "100px" }}
                                        value={
                                          item.task_type === "1"
                                            ? "No Customer"
                                            : item.customer_name
                                        }
                                        disabled
                                      />
                                    )}
                                  </td>


                                  <td>
                                    {item.newRow === 1 &&
                                      item.task_type === "2" ? (

                                      <Select
                                        className="basic-multi-select"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        classNamePrefix="react-select"
                                        styles={{
                                          container: (base) => ({
                                            ...base,
                                            width: 150,
                                          }),
                                        }}
                                        options={getClientOptions(item)}
                                        value={getClientOptions(item).find(
                                          (opt) =>
                                            Number(opt.value) ===
                                            Number(item.client_id)
                                        )}
                                        isSearchable
                                        isDisabled={
                                          !item.clientData ||
                                          item.clientData.length === 0
                                        }
                                        placeholder={
                                          !item.clientData ||
                                            item.clientData.length === 0
                                            ? "No Client"
                                            : "Client"
                                        }
                                        onChange={(selectedOption) => {

                                          const e = {
                                            target: {
                                              name: "client_id",
                                              value: selectedOption?.value || "",
                                            },
                                          };

                                          selectClientData(e, index);
                                        }}
                                      />
                                    ) : (
                                      <input
                                        className="form-control cursor-pointer"
                                        style={{ width: "90px" }}
                                        value={
                                          item.task_type === "1"
                                            ? "No Client"
                                            : item.client_name
                                        }
                                        disabled
                                      />
                                    )}
                                  </td>


                                  <td>
                                    {item.newRow === 1 ? (

                                      <Select
                                        className="basic-multi-select"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        classNamePrefix="react-select"
                                        styles={{
                                          container: (base) => ({
                                            ...base,
                                            width: 140,
                                          }),
                                        }}
                                        options={getJobOptions(item)}
                                        value={getJobOptions(item).find(
                                          (opt) =>
                                            Number(opt.value) ===
                                            Number(item.job_id)
                                        )}
                                        isSearchable
                                        isDisabled={
                                          !item.jobData ||
                                          item.jobData.length === 0
                                        }
                                        placeholder={
                                          !item.jobData ||
                                            item.jobData.length === 0
                                            ? "No Job"
                                            : "Job"
                                        }
                                        onChange={(selectedOption) => {

                                          const e = {
                                            target: {
                                              name: "job_id",
                                              value: selectedOption?.value || "",
                                            },
                                          };

                                          selectJobData(e, item.task_type, index);
                                        }}
                                      />
                                    ) : (
                                      <input
                                        style={{ width: "100px" }}
                                        className="form-control cursor-pointer"
                                        value={
                                          item.task_type === "1"
                                            ? item.internal_name
                                            : item.job_name
                                        }
                                        disabled
                                      />
                                    )}
                                  </td>

                                  <td>
                                    {item.newRow === 1 ? (
                                      (() => {
                                        const matchedJob = item.jobData?.find(
                                          (job) =>
                                            Number(job.id) === Number(item.job_id)
                                        );
                                        return matchedJob &&
                                          matchedJob.job_type_name !==
                                          undefined ? (
                                          <div style={{ width: "100px" }}>
                                            {matchedJob.job_type_name}
                                          </div>
                                        ) : (
                                          <div style={{ width: "80px" }}>-</div>
                                        );
                                      })()
                                    ) : item.task_type === "1" ? (
                                      <div style={{ width: "80px" }}>-</div>
                                    ) : (
                                      <div style={{ width: "100px" }}>
                                        {item.job_type_name}
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    {item.newRow === 1 ? (

                                      <Select
                                        className="basic-multi-select"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        classNamePrefix="react-select"
                                        styles={{
                                          container: (base) => ({
                                            ...base,
                                            width: 140,
                                          }),
                                        }}
                                        options={getTaskOptions(item)}
                                        value={getTaskOptions(item).find(
                                          (opt) =>
                                            Number(opt.value) ===
                                            Number(item.task_id)
                                        )}
                                        isSearchable
                                        isDisabled={
                                          !item.taskData ||
                                          item.taskData.length === 0
                                        }
                                        placeholder={
                                          !item.taskData ||
                                            item.taskData.length === 0
                                            ? "No Task"
                                            : "Task"
                                        }
                                        onChange={(selectedOption) => {

                                          const e = {
                                            target: {
                                              name: "task_id",
                                              value: selectedOption?.value || "",
                                            },
                                          };

                                          selectTaskData(e, index);
                                        }}
                                      />
                                    ) : (
                                      <input
                                        className="form-control cursor-pointer"
                                        style={{ width: "100px" }}
                                        value={
                                          item.task_type === "1"
                                            ? item.sub_internal_name
                                            : item.task_name
                                        }
                                        disabled
                                      />
                                    )}
                                  </td>

                                  <td>
                                    <div className="ms-2">
                                      {isExpanded ? (
                                        <div className="d-flex  ms-3">
                                          <div className="position-relative">
                  <div className="position-relative">
                                            
<div className="d-flex align-items-start">
<input className="form-control cursor-pointer border-radius-end"
                                              type="text"
                                              style={{ width: "80px", paddingRight: "20px" }}
                                              name="monday_hours"
                                              onChange={(e) => handleHoursInput(e, index, "monday_date", weekDays.monday, item)}
                                              value={
                                                item.monday_hours == null
                                                  ? "0"
                                                  : item.monday_hours
                                              }

                                              disabled={
                                                !item.task_id ? true : staffDetails.id != multipleFilter.staff_id
                                                  ? true
                                                  : item.submit_status === "1"
                                                    ? true
                                                    : isWeekSwitching
                                                      ? true
                                                      : false
                                              }
                                              onFocus={() => { setActiveIndex(index); setActiveField("monday"); }} />

                                            {activeIndex === index && activeField === "monday" && (
                                              <Pencil
                                                className="ms-1 mt-2 cursor-pointer"
                                                
                                                size={14}
                                                onClick={() => {
                                                  setSelectedRowIndex(index);
                                                  setModalText(item.monday_note || "");
                                                  setIsModalOpen(true);
                                                }}
                                              />
                                            )}
</div>

                                          </div>
                </div>


                                          <div className="position-relative ms-2">
                  <div className="position-relative ms-2">
                                            
<div className="d-flex align-items-start ms-2">
<input style={{ width: "80px", paddingRight: "20px" }}
                                            className="form-control cursor-pointer "
                                            type="text"
                                            name="tuesday_hours"
                                            onChange={(e) => handleHoursInput(e, index, "tuesday_date", weekDays.tuesday, item)}
                                            value={
                                              item.tuesday_hours == null
                                                ? "0"
                                                : item.tuesday_hours
                                            }

                                            disabled={
                                              !item.task_id ? true : staffDetails.id != multipleFilter.staff_id
                                                ? true
                                                : item.submit_status === "1"
                                                  ? true
                                                  : isWeekSwitching
                                                    ? true
                                                    : false
                                            }
                                            onFocus={() => { setActiveIndex(index); setActiveField("tuesday"); }} />

                                            {activeIndex === index && activeField === "tuesday" && (
                                              <Pencil
                                                className="ms-1 mt-2 cursor-pointer"
                                                
                                                size={14}
                                                onClick={() => {
                                                  setSelectedRowIndex(index);
                                                  setModalText(item.tuesday_note || "");
                                                  setIsModalOpen(true);
                                                }}
                                              />
                                            )}
</div>

                                          </div>
                </div>

                                          <div className="position-relative ms-2">
                  <div className="position-relative ms-2">
                                            
<div className="d-flex align-items-start ms-2">
<input style={{ width: "80px", paddingRight: "20px" }}
                                            className="form-control cursor-pointer "
                                            type="text"
                                            name="wednesday_hours"
                                            onChange={(e) => handleHoursInput(e, index, "wednesday_date", weekDays.wednesday, item)}
                                            value={
                                              item.wednesday_hours == null
                                                ? "0"
                                                : item.wednesday_hours
                                            }


                                            disabled={
                                              !item.task_id ? true : staffDetails.id != multipleFilter.staff_id
                                                ? true
                                                : item.submit_status === "1"
                                                  ? true
                                                  : isWeekSwitching
                                                    ? true
                                                    : false
                                            }
                                            onFocus={() => { setActiveIndex(index); setActiveField("wednesday"); }} />

                                            {activeIndex === index && activeField === "wednesday" && (
                                              <Pencil
                                                className="ms-1 mt-2 cursor-pointer"
                                                
                                                size={14}
                                                onClick={() => {
                                                  setSelectedRowIndex(index);
                                                  setModalText(item.wednesday_note || "");
                                                  setIsModalOpen(true);
                                                }}
                                              />
                                            )}
</div>

                                          </div>
                </div>

                                          <div className="position-relative ms-2">
                  <div className="position-relative ms-2">
                                            
<div className="d-flex align-items-start ms-2">
<input style={{ width: "80px", paddingRight: "20px" }}
                                            className="form-control cursor-pointer "
                                            type="text"
                                            name="thursday_hours"
                                            onChange={(e) => handleHoursInput(e, index, "thursday_date", weekDays.thursday, item)}
                                            value={
                                              item.thursday_hours == null
                                                ? "0"
                                                : item.thursday_hours
                                            }

                                            disabled={
                                              !item.task_id ? true : staffDetails.id != multipleFilter.staff_id
                                                ? true
                                                : item.submit_status === "1"
                                                  ? true
                                                  : isWeekSwitching
                                                    ? true
                                                    : false
                                            }

                                            onFocus={() => { setActiveIndex(index); setActiveField("thursday"); }} />

                                            {activeIndex === index && activeField === "thursday" && (
                                              <Pencil
                                                className="ms-1 mt-2 cursor-pointer"
                                                
                                                size={14}
                                                onClick={() => {
                                                  setSelectedRowIndex(index);
                                                  setModalText(item.thursday_note || "");
                                                  setIsModalOpen(true);
                                                }}
                                              />
                                            )}
</div>

                                          </div>
                </div>

                                          <div className="position-relative ms-2">
                  <div className="position-relative ms-2">
                                            
<div className="d-flex align-items-start ms-2">
<input style={{ width: "80px", paddingRight: "20px" }}
                                            className="form-control cursor-pointer "
                                            type="text"
                                            name="friday_hours"
                                            onChange={(e) => handleHoursInput(e, index, "friday_date", weekDays.friday, item)}
                                            value={
                                              item.friday_hours == null
                                                ? "0"
                                                : item.friday_hours
                                            }


                                            disabled={
                                              !item.task_id ? true : staffDetails.id != multipleFilter.staff_id
                                                ? true
                                                : item.submit_status === "1"
                                                  ? true
                                                  : isWeekSwitching
                                                    ? true
                                                    : false
                                            }
                                            onFocus={() => { setActiveIndex(index); setActiveField("friday"); }} />

                                            {activeIndex === index && activeField === "friday" && (
                                              <Pencil
                                                className="ms-1 mt-2 cursor-pointer"
                                                
                                                size={14}
                                                onClick={() => {
                                                  setSelectedRowIndex(index);
                                                  setModalText(item.friday_note || "");
                                                  setIsModalOpen(true);
                                                }}
                                              />
                                            )}
</div>

                                          </div>
                </div>

                                          <div className="position-relative ms-2">
                  <div className="position-relative ms-2">
                                            
<div className="d-flex align-items-start ms-2">
<input style={{ width: "80px", paddingRight: "20px" }}
                                            className="form-control cursor-pointer "
                                            type="text"
                                            name="saturday_hours"
                                            onChange={(e) => handleHoursInput(e, index, "saturday_date", weekDays.saturday, item)}
                                            value={
                                              item.saturday_hours == null
                                                ? "0"
                                                : item.saturday_hours
                                            }


                                            disabled={
                                              !item.task_id ? true : staffDetails.id != multipleFilter.staff_id
                                                ? true
                                                : item.submit_status === "1"
                                                  ? true
                                                  : isWeekSwitching
                                                    ? true
                                                    : false
                                            }
                                            onFocus={() => { setActiveIndex(index); setActiveField("saturday"); }} />

                                            {activeIndex === index && activeField === "saturday" && (
                                              <Pencil
                                                className="ms-1 mt-2 cursor-pointer"
                                                
                                                size={14}
                                                onClick={() => {
                                                  setSelectedRowIndex(index);
                                                  setModalText(item.saturday_note || "");
                                                  setIsModalOpen(true);
                                                }}
                                              />
                                            )}
</div>

                                          </div>
                </div>
                                        </div>
                                      ) : (
                                        <div className="ms-3">
                                          {" "}
                                          <div className="position-relative">
                  <div className="position-relative">
                                            
<div className="d-flex align-items-start">
<input className="form-control cursor-pointer border-radius-end"
                                            type="text"
                                            style={{ width: "80px", paddingRight: "20px" }}
                                            name="monday_hours"
                                            onChange={(e) => handleHoursInput(e, index, "monday_date", weekDays.monday, item)}
                                            value={
                                              item.monday_hours == null
                                                ? "0"
                                                : item.monday_hours
                                            }


                                            disabled={
                                              !item.task_id ? true : staffDetails.id != multipleFilter.staff_id
                                                ? true
                                                : item.submit_status === "1"
                                                  ? true
                                                  : isWeekSwitching
                                                    ? true
                                                    : false
                                            }
                                            onFocus={() => { setActiveIndex(index); setActiveField("monday"); }} />

                                            {activeIndex === index && activeField === "monday" && (
                                              <Pencil
                                                className="ms-1 mt-2 cursor-pointer"
                                                
                                                size={14}
                                                onClick={() => {
                                                  setSelectedRowIndex(index);
                                                  setModalText(item.monday_note || "");
                                                  setIsModalOpen(true);
                                                }}
                                              />
                                            )}
</div>

                                          </div>
                </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>


                                  <td className="d-flex ps-0">
                                    {submitStatusAllKey === 0 ? (
                                      <div className="d-flex align-items-center">
                                        <button
                                          className="view-icon"
                                          onClick={(e) => {
                                            handleSingleRemark(e, item, index);
                                          }}
                                        >
                                          <i className="ti-comment text-warning"></i>
                                        </button>

                                        <button
                                          className="delete-icon"
                                          onClick={() => handleDeleteRow(index)}
                                        >
                                          <i className="ti-trash text-danger"></i>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="d-flex align-items-center">
                                        <button
                                          className="edit-icon"
                                          onClick={(e) => {
                                            handleSingleRemark(e, item, index);
                                          }}
                                        >
                                          <Eye size={16} />
                                        </button>
                                      </div>
                                    )}

                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={12} className="text-center">
                                  No data found
                                </td>
                              </tr>
                            )}
                          </tbody>
                          {timeSheetRows.length > 0 ? (
                            <tfoot className="table-light table-head-blue">
                              <tr>
                                <th
                                  className="dropdwnCol2 pe-0"
                                  data-field="phone"
                                ></th>
                                <th className="" data-field="phone">
                                  {" "}
                                </th>
                                <th
                                  className="dropdwnCol7"
                                  data-field="phone"
                                ></th>
                                <th
                                  className="dropdwnCol6"
                                  data-field="phone"
                                ></th>
                                <th
                                  className="dropdwnCol5"
                                  data-field="phone"
                                ></th>
                                <th
                                  className="dropdwnCol5"
                                  data-field="phone"
                                ></th>
                                <th
                                  className="dropdwnCol5"
                                  data-field="phone"
                                ></th>
                                <th className="pe-0 week-data">
                                  <div className="d-flex  ms-3">
                                    <input
                                      className="form-control cursor-pointer border-radius-end"
                                      type="text"
                                      readOnly
                                      disabled
                                      name="monday_hours"
                                      value={getTotalHoursFromKey("monday_hours")}
                                      style={{
                                        width: 80,
                                        border: "1px solid #00afef",
                                      }}
                                    />
                                    {isExpanded && (
                                      <div className="d-flex  ms-3">
                                        <input
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          disabled
                                          readOnly
                                          name="tuesday_hours"
                                          value={getTotalHoursFromKey(
                                            "tuesday_hours"
                                          )}
                                          style={{
                                            width: 80,
                                            border: "1px solid #00afef",
                                          }}
                                        />
                                        <input
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          disabled
                                          readOnly
                                          name="wednesday_hours"
                                          value={getTotalHoursFromKey(
                                            "wednesday_hours"
                                          )}
                                          style={{
                                            width: 80,
                                            border: "1px solid #00afef",
                                          }}
                                        />
                                        <input
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          disabled
                                          readOnly
                                          name="thursday_hours"
                                          value={getTotalHoursFromKey(
                                            "thursday_hours"
                                          )}
                                          style={{
                                            width: 80,
                                            border: "1px solid #00afef",
                                          }}
                                        />
                                        <input
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          disabled
                                          readOnly
                                          name="friday_hours"
                                          value={getTotalHoursFromKey(
                                            "friday_hours"
                                          )}
                                          style={{
                                            width: 80,
                                            border: "1px solid #00afef",
                                          }}
                                        />
                                        <input
                                          className="form-control cursor-pointer ms-2"
                                          type="text"
                                          disabled
                                          readOnly
                                          name="saturday_hours"
                                          value={getTotalHoursFromKey(
                                            "saturday_hours"
                                          )}
                                          style={{
                                            width: 80,
                                            border: "1px solid #00afef",
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  className="dropdwnCol5"
                                  data-field="phone"
                                  style={{ width: "5%" }}
                                ></th>
                              </tr>
                            </tfoot>
                          ) : null}

                          <tfoot>
                            <tr className="tabel_new border-none">
                              <td
                                className="border-none"
                                style={{ border: "none" }}
                              >
                                {staffDetails.id == multipleFilter.staff_id ? (
                                  submitStatusAllKey === 0 ? (
                                    <>

                                      <button
                                        style={{ zIndex: "unset" }}
                                        className="d-flex btn btn-info fw-normal px-2"
                                        onClick={handleAddNewSheet}
                                        disabled={isAddingRow}
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


                                      <span
                                        style={{ marginTop: "2rem" }}
                                        className="ms-3"
                                      >
                                        <button
                                          style={{ zIndex: "unset" }}
                                          className="d-flex btn btn-info fw-normal px-2"
                                          onClick={() => setIsCopyModalOpen(true)}
                                        >
                                          <span className="ms-2">
                                            Copy Timesheet
                                          </span>
                                        </button>
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                        {timeSheetRows.length > 0 ? (
                          <>
                            <div className=""></div>

                            <div className="mt-2 mb-2">
                              <span className="fs-6 text-dark">
                                {" "}
                                <b>Total Weekly Hours : {totalHoursMinute()}</b>
                              </span>
                            </div>

                            {submitStatusAllKey === 1 ? (
                              <div className="mt-2 mb-2">

                                <span className="fs-6 text-dark">
                                  {" "}
                                  <b>Final Remark :</b>
                                  <button
                                    className="edit-icon"
                                    onClick={() => setRemarkModel(true)}
                                  >
                                    <Eye size={16} />
                                  </button>
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}
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
                      <Check size={16} /> Save
                    </button>

                    <button
                      className="btn btn-outline-success ms-3"
                      onClick={(e) => {
                        submitData(e);
                      }}
                    >
                      <Save size={16} /> Submit
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
              disabled_submit={isDisabled}
              btn_name={loading ? "Submitting..." : (submitStatus === 1 ? "Submit" : "Save11")}
              title="Final Remark"
              hideBtn={submitStatusAllKey === 1 ? true : false}
              handleClose={() => {
                setRemarkModel(false);
                setSubmitStatus(0);
                setRemarkText("");
              }}
              Submit_Function={(e) => saveTimeSheetRemark(e)}
            >
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    {submitStatusAllKey === 1 ? (
                      <div>
                        <p>
                          {timeSheetRows && timeSheetRows.length > 0
                            ? timeSheetRows[0].final_remark
                              ? timeSheetRows[0].final_remark
                              : "No Final Remark Found"
                            : "No Final Remark Found"}
                        </p>
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor="customername-field"
                          className="form-label"
                        >
                          Final Remark
                        </label>
                        <textarea
                          type="text"
                          className="form-control cursor-pointer"
                          placeholder="Enter Remark"
                          defaultValue=""
                          onChange={(e) => setRemarkText(e.target.value)}
                          value={remarkText}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CommonModal>

            <CommonModal
              isOpen={remarkSingleModel}
              backdrop="static"
              size="lg"
              cancel_btn={false}
              btn_2="true"
              btn_name={submitStatusAllKey === 1 ? "Close" : "Done"}
              title="Remark"
              hideBtn={false}
              handleClose={() => {
                setRemarkSingleModel(false);
              }}
              Submit_Function={(e) => singleRemarkModalDone(e)}
            >
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    {submitStatusAllKey === 1 ? (
                      <p>
                        {remarkSingleIndex != null && timeSheetRows.length > 0
                          ? ["", null, undefined].includes(
                            timeSheetRows[remarkSingleIndex]
                          )
                            ? "No Remark Found"
                            : !["", null, undefined].includes(
                              timeSheetRows[remarkSingleIndex].remark
                            )
                              ? timeSheetRows[remarkSingleIndex].remark
                              : "No Remark Found"
                          : "No Remark Found"}
                      </p>
                    ) : (
                      <>
                        <label
                          htmlFor="customername-field"
                          className="form-label"
                        >
                          Remark
                        </label>
                        <textarea
                          type="text"
                          className="form-control cursor-pointer"
                          placeholder="Enter Remark"
                          defaultValue=""
                          onChange={(e) =>
                            handleRemarkSingleText(e, remarkSingleIndex)
                          }
                          value={
                            remarkSingleIndex != null && timeSheetRows.length > 0
                              ? ["", null, undefined].includes(
                                timeSheetRows[remarkSingleIndex]
                              )
                                ? ""
                                : timeSheetRows[remarkSingleIndex].remark
                              : ""
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CommonModal>

            <CommonModal
              isOpen={isModalOpen}
              backdrop="static"
              size="lg"
              cancel_btn={false}
              btn_2="true"
              btn_name={"Save"}
              title={
                activeField === "monday"
                  ? "Monday Note"
                  : activeField === "tuesday"
                  ? "Tuesday Note"
                  : activeField === "wednesday"
                  ? "Wednesday Note"
                  : activeField === "thursday"
                  ? "Thursday Note"
                  : activeField === "friday"
                  ? "Friday Note"
                  : activeField === "saturday"
                  ? "Saturday Note"
                  : activeField === "sunday"
                  ? "Sunday Note"
                  : "Add Note"
              }
              hideBtn={false}
              handleClose={() => {
                setIsModalOpen(false);
                setModalText("");
                setActiveIndex(null);
                setActiveField(null);
              }}
              Submit_Function={(e) => handleSaveNote(e)}
            >
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h5>Add Note</h5>

                    <textarea
                      className="form-control"
                      rows={4}
                      value={modalText}
                      onChange={(e) => setModalText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CommonModal>

            <CommonModal
              isOpen={isCopyModalOpen}
              backdrop="static"
              size="lg"
              cancel_btn={false}
              btn_2="true"
              btn_name={"Save"}
              title={"Timesheet"}
              hideBtn={false}
              handleClose={() => {
                setIsCopyModalOpen(false);
              }}
              Submit_Function={(e) => handleCopyTimeSheetAutoFill(e)}
            >
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h5>Select Week to Copy Timesheet From</h5>
                    <Select
                      id="tabSelect"
                      name="week"
                      className="basic-multi-select"
                      options={weekOptionsWithPlaceholderSubmitTimeSheet}
                      defaultValue={null}

                      placeholder="-- Select --"
                      onChange={(selectedOption) => {

                        const e = {
                          target: {
                            name: "copy_week",
                            value: selectedOption.value,
                          },
                        };
                        selectFilterStaffANdWeek(e);
                      }}
                      classNamePrefix="react-select"
                      isSearchable
                    />
                  </div>
                </div>
              </div>
            </CommonModal>
          </div>
        </div>
      </div> */}

      <div className="container-fluid mt-4">
        <div className="timesheet-header">
          <div className="timesheet-header-title-div">
            <span className="timesheet-header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6h4"></path></svg>
            </span>
            <div className="tab-title"><h3 className="mt-0">Timesheet</h3></div>
          </div>
          <ul className="nav timesheet-tabs" id="myTab" role="tablist">
            <li role="presentation">
              <button className="active" id="timesheet-tab" data-bs-toggle="tab" data-bs-target="#timesheet-tab-pane" type="button" role="tab" aria-controls="timesheet-tab-pane" aria-selected="true">My Timesheet</button>
            </li>
            <li role="presentation">
              <button id="manager-review-tab" data-bs-toggle="tab" data-bs-target="#manager-review-tab-pane" type="button" role="tab" aria-controls="manager-review-tab-pane" aria-selected="false">Manager Review</button>
            </li>
            <li role="presentation">
              <button id="mis-dashboard-tab" data-bs-toggle="tab" data-bs-target="#mis-dashboard-tab-pane" type="button" role="tab" aria-controls="mis-dashboard-tab-pane" aria-selected="false">MIS Dashboard</button>
            </li>
          </ul>
        </div>

        <div className="tab-content timesheet-tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="timesheet-tab-pane" role="tabpanel" aria-labelledby="timesheet-tab" tabindex="0">
            <div className="timesheet-tab-content-header">
              <div className="timesheet-tab-content-header-left d-flex align-items-center gap-2">
                <h3 className="timesheet-tab-content-heading">Weekly Timesheet</h3>

                <div className="text-center ">
                  <p className="text-info bg-soft-primary px-3 py-2 mb-0 font-11 rounded">
                    <i className="fa fa-calendar-clock me-1" />
                    <span> Week 4, Month 8, Year 2026 </span>
                  </p>
                </div>

                {/* <p className="timesheet-tab-content-para">Vikas Patel · One row per task, fill Mon–Sun hours in one go.</p> */}
              </div>
              <div className="timesheet-tab-content-header-right">
                <div className="timesheet-week-div">
                  <button className="timesheet-week-button" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-4" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
                  </button>
                  <div className="timesheet-week-content-div">
                    <p className="timesheet-week-date">24 Aug 2026 – 30 Aug 2026</p>
                    <p className="timesheet-week-text">Current week</p>
                  </div>
                  <button className="timesheet-week-button" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right size-4" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
                  </button>
                </div>
                <button type="button" className="btn btn-outline-info fw-bold">Today</button>
              </div>
            </div>
            <div className="timesheet-white-card mt-4">
              <div className="timesheet-whitediv-flex">
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Employee</p>
                  <p className="timesheet-white-card-value">Vikas Patel</p>
                </div>
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Weekly required hours</p>
                  <p className="timesheet-white-card-value">40h <span className="timesheet-white-card-value-small">(min 35 / max 45)</span></p>
                </div>
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Entered / Remaining</p>
                  <p className="timesheet-white-card-value">5h / 40h</p>
                </div>
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Status</p>
                  <p className="timesheet-white-card-value"><span className="timesheet-white-card-status">Draft</span><span className="timesheet-white-card-unsaved">unsaved changes</span></p>
                </div>
              </div>
              <div className="timesheet-progress">
                <div className="timesheet-progress-bar" style={{ width: "25%" }}></div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Task Rows</p>
                  <p className="timesheet-white-card-value-big">1</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Total Hours</p>
                  <p className="timesheet-white-card-value-big">0h</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Submitted Hours</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-blue">0h</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Draft Hours</p>
                  <p className="timesheet-white-card-value-big">0h</p>
                </div>
              </div>
            </div>
            <form>
              <div className="timesheet-white-card mt-3">
                <div className="timesheet-table-header-div">
                  <div className="timesheet-table-header-div-left">
                    <div className="tab-title"><h3 className="mt-0">Weekly Grid</h3></div>
                  </div>
                  <div className="timesheet-table-header-div-right">
                    <button className="timesheet-table-header-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg> Copy previous week
                    </button>
                    {/* <button className="timesheet-table-header-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg> Spread 40h Mon–Fri
                    </button>
                    <button className="timesheet-table-header-btn">
                      Clear hours
                    </button> */}
                    <button className="timesheet-table-header-add-task-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> Add task row</button>
                    <button className="timesheet-table-header-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> Export</button>
                  </div>
                </div>
                <div className="mt-3">
                  <TimesheetDatatable />
                </div>
                <div className="mt-3">
                  <label className="form-label">Final remark (weekly)</label>
                  <div>
                    <textarea className="form-control" placeholder="e.g. Completed all assigned development tasks for this week." style={{ minHeight: "60px" }}></textarea>
                  </div>
                  <div className="timesheet-submit-div">
                    <div className="timesheet-submit-div-left">
                      <p>Draft saves keep the timesheet editable. Submitting locks it for manager review.</p>
                    </div>
                    <div className="timesheet-submit-div-right">
                      <button className="btn btn-info"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"></path></svg> Save</button>
                      <button className="btn btn-outline-success"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg> Submit</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="tab-pane fade" id="manager-review-tab-pane" role="tabpanel" aria-labelledby="manager-review-tab" tabindex="0">
            <div className="timesheet-tab-content-header">
              <div className="timesheet-tab-content-header-left">
                <h3 className="timesheet-tab-content-heading">Manager Review</h3>
                <p className="timesheet-tab-content-para">Track, filter and approve team timesheets.</p>
              </div>
              <div className="timesheet-tab-content-header-right">
                <button type="button" className="btn btn-outline-info fw-bold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> Export filtered</button>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Timesheets</p>
                  <p className="timesheet-white-card-value-big">3</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Entries</p>
                  <p className="timesheet-white-card-value-big">14</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Total Hours</p>
                  <p className="timesheet-white-card-value-big">95h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Submitted</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-blue">36h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Approved</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-green">39h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Rejected</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-red">20h</p>
                </div>
              </div>
            </div>
            <div className="timesheet-white-card mt-3">
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">Employee</label>
                  <select className="form-select" >
                    <option>All</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select className="form-select" >
                    <option>All</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Task Type</label>
                  <select className="form-select" >
                    <option>All</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="col-md-4 mt-3">
                  <label className="form-label">Customer</label>
                  <select className="form-select" >
                    <option>All</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="col-md-4 mt-3">
                  <label className="form-label">Client</label>
                  <select className="form-select" >
                    <option>All</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="col-md-4 mt-3">
                  <label className="form-label">Job</label>
                  <select className="form-select" >
                    <option>All</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="col-md-4 mt-3">
                  <label className="form-label">Date from</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-4 mt-3">
                  <label className="form-label">Date to</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="mt-3 text-end">
                  <button type="button" className="btn btn-outline-info fw-bold">Reset filters</button>
                </div>
              </div>
            </div>
            <div className="timesheet-white-card mt-3">
              <div className="timesheet-table-header-div">
                <div className="timesheet-table-header-div-left">
                  <div className="tab-title"><h3 className="mt-0">Ayesha Khan</h3></div>
                  <p className="page-subtitle mb-0 mt-2">17 Aug 2026 – 23 Aug 2026 · 5 entries · 36h</p>
                </div>
                {/* <div className="timesheet-table-header-div-right">
                  <span className="timesheet-table-header-status-approved">Approved</span>
                  <span className="timesheet-table-header-status-rejected">Rejected</span>
                  <button className="timesheet-table-header-btn-approve">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>
                    Approve
                  </button>
                  <button className="timesheet-table-header-btn-reject">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    Reject
                  </button>
                </div> */}
              </div>
              <div className="mt-3">
                <TimesheetDatatable />
              </div>
              <div className="mt-3">
                <div className="timesheet-submit-div-left">
                  <p><b>Final remark:</b> Website revamp frontend in progress.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-pane fade" id="mis-dashboard-tab-pane" role="tabpanel" aria-labelledby="mis-dashboard-tab" tabindex="0">

            <div className="timesheet-tab-content-header">
              <div className="timesheet-tab-content-header-left">
                <h3 className="timesheet-tab-content-heading">MIS Dashboard</h3>
                <p className="timesheet-tab-content-para">Submission compliance, billable vs leave hours and resource utilisation.</p>
              </div>
              <div className="timesheet-week-div">
                <button className="timesheet-week-button" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-4" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
                </button>
                <div className="timesheet-week-content-div-mis">
                  <p className="timesheet-week-date">August 2026</p>
                </div>
                <button className="timesheet-week-button" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right size-4" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
                </button>
              </div>
            </div>


            <div className="row mt-4">
              <div className="col-md-4">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Total Employees</p>
                  <p className="timesheet-white-card-value-big">3</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Timesheets Submitted</p>
                  <p className="timesheet-white-card-value-big timesheet-submitted-mis">14</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Missing Timesheets</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-red">95h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Pending Approval</p>
                  <p className="timesheet-white-card-value-big timesheet-pending-mis">36h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Total Hours</p>
                  <p className="timesheet-white-card-value-big">39h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Billable Hours</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-green">20h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Leave Hours</p>
                  <p className="timesheet-white-card-value-big timesheet-pending-mis">3</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Available Hours</p>
                  <p className="timesheet-white-card-value-big">14</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Utilisation</p>
                  <p className="timesheet-white-card-value-big timesheet-pending-mis">95h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Productive Share</p>
                  <p className="timesheet-white-card-value-big timesheet-submitted-mis">36h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Approved</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-green">39h</p>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Rejected</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-red">20h</p>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg-7">
                <div className="timesheet-white-card">
                  <div className="timesheet-table-header-div">
                    <div className="timesheet-table-header-div-left">
                      <div className="tab-title"><h3 className="mt-0">Monthly trend</h3></div>
                      <p className="page-subtitle mb-0 mt-2">Total, billable and leave hours with utilisation over the last 6 months.</p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 720,
                      fontFamily: "sans-serif",
                    }}
                  >
                    <ResponsiveContainer width="100%" height={239}>
                      <BarChart
                        data={graphData}
                        margin={{
                          top: 30,
                          right: 20,
                          left: 20,
                          bottom: 5,
                        }}
                        barGap={4}
                      >
                        <XAxis
                          dataKey="month"
                          axisLine={{ stroke: "#e2e8ee" }}
                          tickLine={false}
                          tick={{
                            fill: "#5b6b7a",
                            fontSize: 13,
                          }}
                        />

                        <YAxis hide domain={[0, 100]} />

                        <Tooltip
                          formatter={(value, name) => [`${value}%`, name]}
                          cursor={{
                            fill: "rgba(0,0,0,0.03)",
                          }}
                        />

                        <Bar
                          dataKey="total"
                          fill="#b7d9d4"
                          barSize={16}
                          radius={[6, 6, 0, 0]}
                        >
                          <LabelList
                            dataKey="total"
                            content={renderPercentLabel}
                          />
                        </Bar>

                        <Bar
                          dataKey="billable"
                          fill="#2e6f5e"
                          barSize={16}
                          radius={[6, 6, 0, 0]}
                        >
                          <LabelList
                            dataKey="billable"
                            content={renderPercentLabel}
                          />
                        </Bar>

                        <Bar
                          dataKey="leave"
                          fill="#9c6b1a"
                          barSize={16}
                          radius={[6, 6, 0, 0]}
                        >
                          <LabelList
                            dataKey="leave"
                            content={renderPercentLabel}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        paddingLeft: 20,
                      }}
                    >
                      <LegendDot color="#b7d9d4" label="Total" />
                      <LegendDot color="#2e6f5e" label="Billable" />
                      <LegendDot color="#9c6b1a" label="Leave" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="timesheet-white-card">
                  <div className="timesheet-table-header-div">
                    <div className="timesheet-table-header-div-left dis">

                      <div className="tab-title d-flex align-items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert size-4 text-warning" aria-hidden="true" data-tsd-source="/src/routes/dashboard.tsx:315:13"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg><h3 className="mt-0">Follow-up list</h3></div>
                      <p className="page-subtitle mb-0 mt-2">Employees with missing or unsubmitted weeks this month.</p>
                    </div>
                  </div>
                  <div className="staff-report-list">
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                    <div className="staff-report-card">
                      <div>
                        <div className="staff-name">
                          Vikas Patel
                        </div>
                        <div className="staff-date">
                          27 Jul 2026 – 02 Aug 2026
                        </div>
                      </div>
                      <span className="staff-status">
                        Not started
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="timesheet-white-card mt-3">
              <div className="timesheet-table-header-div">
                <div className="timesheet-table-header-div-left">
                  <div className="tab-title"><h3 className="mt-0">Resource utilisation</h3></div>
                  <p className="page-subtitle mb-0 mt-2">Billable hours ÷ available hours (net of leave) for August 2026.</p>
                </div>
              </div>
              <ul className="nav resource-tabs" id="resourceTab" role="tablist">
                <li role="presentation">
                  <button className="active" id="employee-tab" data-bs-toggle="tab" data-bs-target="#employee-tab-pane" type="button" role="tab" aria-controls="employee-tab-pane" aria-selected="true">Employee</button>
                </li>
                <li role="presentation">
                  <button id="team-tab" data-bs-toggle="tab" data-bs-target="#team-tab-pane" type="button" role="tab" aria-controls="team-tab-pane" aria-selected="false">Team</button>
                </li>
                <li role="presentation">
                  <button id="department-tab" data-bs-toggle="tab" data-bs-target="#department-tab-pane" type="button" role="tab" aria-controls="department-tab-pane" aria-selected="false">Department</button>
                </li>
                <li role="presentation">
                  <button id="client-tab" data-bs-toggle="tab" data-bs-target="#client-tab-pane" type="button" role="tab" aria-controls="client-tab-pane" aria-selected="false">Client</button>
                </li>
              </ul>
              <div className="tab-content" id="resourceTabContent">
                <div className="tab-pane fade show active" id="employee-tab-pane" role="tabpanel" aria-labelledby="employee-tab" tabindex="0">
                  <div className="mt-1">
                    <ResourceDatatable />
                  </div>
                </div>
                <div className="tab-pane fade" id="team-tab-pane" role="tabpanel" aria-labelledby="team-tab" tabindex="0">
                  <div className="mt-1">
                    <ResourceDatatable />
                  </div>
                </div>
                <div className="tab-pane fade" id="department-tab-pane" role="tabpanel" aria-labelledby="department-tab" tabindex="0">
                  <div className="mt-1">
                    <ResourceDatatable />
                  </div>
                </div>
                <div className="tab-pane fade" id="client-tab-pane" role="tabpanel" aria-labelledby="client-tab" tabindex="0">
                  <div className="mt-1">
                    <ResourceDatatable />
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div >
    </>
  );
};

export default TimesheetNewDesign;