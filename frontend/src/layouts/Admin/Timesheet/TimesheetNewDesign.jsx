import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { Eye, History, Download, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  getTimesheetData,
  getTimesheetTaskTypedData,
  saveTimesheetData,
  getStaffHourMinute,
  getTimesheetLogsData,
  deleteTimesheetRowData,
  getManagerReviewCount,
  getManagerReviewData,
} from "../../../ReduxStore/Slice/Timesheet/TimesheetSlice";

import { SAVE_TIMESHEET } from "../../../Services/Timesheet/TimesheetService";
import sweatalert from "sweetalert2";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import ReactPaginate from "react-paginate";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import ManagerReviewDatatable from "../../../Components/ExtraComponents/ManagerReviewDatatable";
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

  // history modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [rowHistoryLogs, setRowHistoryLogs] = useState([]);
  // manager review count state
  const [managerReviewCount, setManagerReviewCount] = useState(0);
  const [submittedThisWeek, setSubmittedThisWeek] = useState(0);
  const [savedThisWeek, setSavedThisWeek] = useState(0);
  const [missingLastWeek, setMissingLastWeek] = useState(0);
  const [activeReviewTab, setActiveReviewTab] = useState("all"); // all | submitted | saved | missing
  const [hasFetchedManagerReview, setHasFetchedManagerReview] = useState(false);

  const [managerReviewData, setManagerReviewData] = useState({
    loading: true,
    rows: [],
    pagination: {},
  });
  const [managerReviewPage, setManagerReviewPage] = useState(1);
  // managerReviewPage already hai, bas ye naye add karo:
  const [managerReviewSearchTerm, setManagerReviewSearchTerm] = useState("");
  const [managerReviewPageSize, setManagerReviewPageSize] = useState(10);
  const managerReviewDebounceRef = useRef(null);




  const openHistoryModal = async () => {
    try {
      setLoading(true);
      const req = { staff_id: multipleFilter.staff_id, weekOffset: weekOffset };
      const res = await dispatch(getTimesheetLogsData({ req, authToken: token })).unwrap();
      if (res.status) {
        setRowHistoryLogs(res.data);
        setIsHistoryModalOpen(true);
      } else {
        sweatalert.fire({ icon: "error", title: "Error fetching logs" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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

  // Get Manager Review Count — defined here so dispatch and token are in scope
  const fetchManagerReviewCount = async () => {
    try {
      const res = await dispatch(getManagerReviewCount({ req: {}, authToken: token })).unwrap();
      if (res.status) {
        setManagerReviewCount(res?.data?.total_staff || 0);
        setSubmittedThisWeek(res?.data?.submitted_this_week || 0);
        setSavedThisWeek(res?.data?.saved_this_week || 0);
        setMissingLastWeek(res?.data?.missing_last_week || 0);
      }
    } catch (err) {
      console.log("Manager review count fetch error:", err);
    }
  };

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
      if (res?.data?.length > 0) {
        setRemarkText(res.data[0].final_remark || "");
      } else {
        setRemarkText("");
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
      await getTimeSheetCopyRecord(value, e.target.label);
    }
  };

  const getTimeSheetCopyRecord = async (weekOffset, weekLabel) => {
    try {
      setLoading(true);
      const req = { staff_id: multipleFilter.staff_id, weekOffset: weekOffset };
      const res = await dispatch(
        getTimesheetData({ req, authToken: token })
      ).unwrap();

      if (res.status) {
        const rowsWithCopiedMeta = res.data.map(row => ({
          ...row,
          copied_from_week: weekLabel,
          is_modified: false
        }));
        setCopyTimeSheetRows(rowsWithCopiedMeta);
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

    } finally {
      setLoading(false);
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
    if (hasFetchedManagerReview) {
      fetchManagerReviewCount();
    }
  }, [hasFetchedManagerReview]);

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

  const [isManagerRemarkModalOpen, setIsManagerRemarkModalOpen] = useState(false);
  const [managerRemarkText, setManagerRemarkText] = useState("");

  const [timeSheetRows, setTimeSheetRows] = useState([]);
  const [updateTimeSheetRows, setUpdateTimeSheetRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState("this-week");
  const [loading, setLoading] = useState(false);
  const [saveAction, setSaveAction] = useState(null);
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
    if (submitStatusAllKey === 1) {
      sweatalert.fire({ icon: "error", title: "Cannot add a new row to a submitted timesheet." });
      return;
    }
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
  const handleDeleteRow = async (index) => {
    if (submitStatusAllKey === 1 || timeSheetRows[index]?.submit_status === "1") {
      sweatalert.fire({ icon: "error", title: "Cannot delete a submitted timesheet." });
      return;
    }
    const confirmDelete = await sweatalert.fire({
      title: "Are you sure?",
      text: "You want to delete this row?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      setLoading(true);

      const newSheetRows = [...timeSheetRows];
      const id = newSheetRows[index].id;
      if (id != null) {
        // Call API to soft delete
        const req = {
          row_id: id,
          staff_id: multipleFilter.staff_id
        };
        const res = await dispatch(deleteTimesheetRowData({ req, authToken: token })).unwrap();
        if (!res.status) {
          sweatalert.fire({ icon: "error", title: res.message || "Error deleting row" });
          return; // don't remove from UI if API fails
        }
      }

      newSheetRows.splice(index, 1);
      setTimeSheetRows(newSheetRows);

      sweatalert.fire({ icon: "success", title: "Row deleted successfully", timer: 1500, showConfirmButton: false });

    } catch (err) {
      console.log(err);
      sweatalert.fire({ icon: "error", title: "Error deleting row" });
    } finally {
      setLoading(false);
    }
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
    if (
      submitStatusAllKey === 1 ||
      timeSheetRows[index]?.submit_status === "1" ||
      isRowSaved(index)
    ) {
      return;
    }
    try {
      setLoading(true);
      const updatedRows = [...timeSheetRows];
      updatedRows[index].is_modified = true;
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
      resetRowHours(updatedRows, index, rowId);

    } finally {
      setLoading(false);
    }
  };

  const selectCustomerData = async (e, index) => {
    if (
      submitStatusAllKey === 1 ||
      timeSheetRows[index]?.submit_status === "1" ||
      isRowSaved(index)
    ) {
      return;
    }
    try {
      setLoading(true);
      const updatedRows = [...timeSheetRows];
      updatedRows[index].is_modified = true;
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
      resetRowHours(updatedRows, index, rowId);

    } finally {
      setLoading(false);
    }
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
    if (
      submitStatusAllKey === 1 ||
      timeSheetRows[index]?.submit_status === "1" ||
      isRowSaved(index)
    ) {
      return;
    }
    try {
      setLoading(true);

      const updatedRows = [...timeSheetRows];
      updatedRows[index].is_modified = true;
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
      resetRowHours(updatedRows, index, rowId);

    } finally {
      setLoading(false);
    }
  };

  const selectJobData = async (e, task_type, index) => {
    if (
      submitStatusAllKey === 1 ||
      timeSheetRows[index]?.submit_status === "1" ||
      isRowSaved(index)
    ) {
      return;
    }
    try {
      setLoading(true);
      const updatedRows = [...timeSheetRows];
      updatedRows[index].is_modified = true;

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
      resetRowHours(updatedRows, index, rowId);

    } finally {
      setLoading(false);
    }
  };

  const selectTaskData = async (e, index) => {
    if (
      submitStatusAllKey === 1 ||
      timeSheetRows[index]?.submit_status === "1" ||
      isRowSaved(index)
    ) {
      return;
    }
    try {
      setLoading(true);
      const updatedRows = [...timeSheetRows];
      updatedRows[index].is_modified = true;
      updatedRows[index].task_id = e.target.value;
      setTimeSheetRows(updatedRows);

      // update record only
      const rowId = updatedRows[index].id;
      updateRecordSheet(rowId, "task_id", e.target.value);
      resetRowHours(updatedRows, index, rowId);

    } finally {
      setLoading(false);
    }
  };

  const handleHoursInput = async (e, index, day_name, date_value, item) => {
    if (submitStatusAllKey === 1 || timeSheetRows[index]?.submit_status === "1") return;
    try {
      setLoading(true);
      let value = e.target.value;
      let name = e.target.name;

      let final_value = value;

      let [intPart, decimalPart] = value.toString().split(".");

      if (decimalPart) {
        let multiplied = Math.floor(parseInt(decimalPart) * 0.6);

        const multipliedStr = multiplied.toString().padStart(2, "0");
        final_value = `${intPart}.${multipliedStr}`;
      }

      const updatedRows = [...timeSheetRows];
      updatedRows[index].is_modified = true;
      if (updatedRows[index][name] == null) {
        updatedRows[index][name] = "";
        setTimeSheetRows(updatedRows);
      }

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

      const [integerPart, fractionalPartRaw] = final_value.split(".");
      let fractionalPart = fractionalPartRaw || "0";
      if (fractionalPart.length === 1) {
        fractionalPart = fractionalPart + "0";
      }

      if (parseInt(fractionalPart) > 59) {
        sweatalert.fire({
          icon: "warning",
          title: "Minutes cannot exceed 59",
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

    } finally {
      setLoading(false);
    }
  };

  function updateRecordSheetMultiple(rowId, updates) {
    setUpdateTimeSheetRows(prev => {
      const updatedRows_update = [...prev];
      const existingUpdateIndex = updatedRows_update.findIndex(row => row.id === rowId);
      if (existingUpdateIndex !== -1) {
        updatedRows_update[existingUpdateIndex] = { ...updatedRows_update[existingUpdateIndex], ...updates };
      } else {
        updatedRows_update.push({ id: rowId, ...updates });
      }
      return updatedRows_update;
    });
  }

  const resetRowHours = (updatedRows, index, rowId) => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const updates = {};
    days.forEach(day => {
      updatedRows[index][`${day}_hours`] = null;
      updatedRows[index][`${day}_note`] = "";
      updates[`${day}_hours`] = null;
      updates[`${day}_note`] = "";
    });
    updatedRows[index].total_hours = 0;
    if (rowId) {
      updateRecordSheetMultiple(rowId, updates);
    }
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
    if (submitStatusAllKey === 1 || timeSheetRows[index]?.submit_status === "1") return;
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

  const saveData = async (e, status = 0) => {
    setSaveAction(status);
    e.preventDefault();
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

    if (updateTimeSheetRows.length > 0 || deleteRows.length > 0 || status === 1) {
      const hasEditRow = timeSheetRows.some((item) => item.editRow === 1);

      const updatedTimeSheetRows = timeSheetRows.map((row) => {
        const { customerData, clientData, jobData, taskData, ...rest } = row;
        if (status === 1) {
          return { ...rest, submit_status: "1", final_remark: remarkText };
        }
        return rest;
      });

      const req = {
        staff_id: multipleFilter.staff_id,
        data: updatedTimeSheetRows,
        deleteRows: deleteRows,
        weekOffset: weekOffset,
      };

      let staff_hourminute = updatedTimeSheetRows?.[0]?.staffs_hourminute || null;
      if (staff_hourminute != null && staff_hourminute?.includes(":")) {
        const [hours, minutes] = staff_hourminute.split(":").map(Number);
        const decimal = hours + "." + minutes;
        staff_hourminute = parseFloat(decimal);
      } else if (staff_hourminute != null) {
        staff_hourminute = parseFloat(staff_hourminute);
      }
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
        const finalTotalHoursStr = `${totalHours}.${totalMins
          .toString()
          .padStart(2, "0")}`;

        if (status === 1) {
          const totalHoursVal = timeSheetRows && timeSheetRows?.reduce((acc, item) => {
            const val = parseFloat(item.total_hours || 0);
            return acc + val;
          }, 0);

          let finalTotalHours = await convertHoursMinutes(totalHoursVal);

          if (staff_hourminute > parseFloat(finalTotalHours)) {
            sweatalert.fire({
              icon: "warning",
              title: "Please enter the minimum required hourly time in the timesheet before submitting.",
              timerProgressBar: true,
              showConfirmButton: true,
              timer: 3000,
            });
            return;
          }
        }
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
          title: status === 1 ? "Timesheet data submit successfully." : res.message,
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
    saveTimeSheetRemark(e, true);
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

  const saveTimeSheetRemark = async (e, isSubmit = false) => {

    if (submitStatus == 1 || isSubmit) {
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
        weekOffset: weekOffset,
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
          setSubmitStatus(0);
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
      weekOffset: weekOffset,
    };

    let staff_hourminute =
      updatedTimeSheetRows1?.[0]?.staffs_hourminute || null;

    if (staff_hourminute != null && staff_hourminute?.includes(":")) {
      const [hours, minutes] = staff_hourminute.split(":");
      const decimal = Number(hours) + "." + minutes.padStart(2, "0");
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
        weekDays.sunday ? dayMonthFormatDate(weekDays.sunday) : "",
        "Sunday Note",
        // "Remark",
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
            item.sunday_hours || 0,
            item.sunday_note || "",
            // item.remark || "",
          ];
        });

      const finalRemarkRow = [
        `Total Weekly Hours : ${total_hours.toFixed(2) || ""}`,
        `Final Remark: ${timeSheetRows[0].final_remark || ""}`,
        ...new Array(headers.length - 1).fill(""),
      ];

      const csvContent = [headers, ...rows, finalRemarkRow]
        .map((row) => row.map(cell => {
          if (cell === null || cell === undefined) return "";
          const str = String(cell);
          if (str.search(/["\r\n,]/) >= 0) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TimeSheetData.csv";
      link.click();
      setExporting(false);
    }, 100);
  };

  const exportManagerReviewCSV = (rows) => {
  if (!rows || rows.length === 0) {
    sweatalert.fire({ icon: "info", title: "No data to export." });
    return;
  }

  setExporting(true);
  setTimeout(() => {
    const headers = [
      "S.No",
      "Staff",
      "Email",
      "Employee ID",
      "Role",
      "Line Manager",
      "Entries",
      "Entered Hours",
      "Remaining Hours",
      "Status",
    ];

    const getRemainingHours = (row) => {
      const staffId = row.user_id || row.staff_id || row.StaffUserId || row.id;
      const staffInfo = staffDataAll?.data?.find((s) => Number(s.id) === Number(staffId));

      let allocatedStr = row.staffs_hourminute || staffInfo?.hourminute || "0";
      let allocated = 0;
      if (typeof allocatedStr === "string" && allocatedStr.includes(":")) {
        const [h, m] = allocatedStr.split(":");
        allocated = parseFloat(h) + parseFloat(m) / 60;
      } else {
        allocated = parseFloat(allocatedStr) || 0;
      }

      const total = parseFloat(row.total_hours) || 0;
      let remaining = allocated - total;
      if (remaining < 0) remaining = 0;
      return remaining.toFixed(2);
    };

    const getLineManagerName = (row) => {
      const staffId = row.user_id || row.staff_id || row.StaffUserId || row.id;
      const staffInfo = staffDataAll?.data?.find((s) => Number(s.id) === Number(staffId));
      return (
        row.line_manager_name ||
        row.line_manager ||
        row.manager_name ||
        row.manager ||
        staffInfo?.line_manager_name ||
        staffInfo?.manager_name ||
        "-"
      );
    };

    const csvRows = rows.map((row, index) => [
      (managerReviewPage - 1) * managerReviewPageSize + (index + 1),
      row.staff_name || "",
      row.email || "",
      row.employee_number || "-",
      row.role_name || "",
      getLineManagerName(row),
      row.timesheet_count || 0,
      row.total_hours || 0,
      getRemainingHours(row),
      row.timesheet_status || "",
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) =>
        row
          .map((cell) => {
            if (cell === null || cell === undefined) return "";
            const str = String(cell);
            if (str.search(/["\r\n,]/) >= 0) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const tabLabel = activeReviewTab.charAt(0).toUpperCase() + activeReviewTab.slice(1);
    link.download = `ManagerReview_${tabLabel}.csv`;
    link.click();
    setExporting(false);
  }, 100);
};

  const handleSingleRemark = (e, item, index) => {
    setRemarkSingleModel(true);
    setRemarkSingleIndex(index);
  };

  const handleRemarkSingleText = (e, index) => {
    if (submitStatusAllKey === 1 || timeSheetRows[index]?.submit_status === "1") return;
    const updatedRows = [...timeSheetRows];
    updatedRows[index].is_modified = true;
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
    let sortedData = [...staffDataWeekDataAll.data].sort((a, b) => new Date(b.month_date) - new Date(a.month_date));
    sortedData.forEach((val) => {
      weekOptions.push({
        value: val.valid_weekOffsets,
        label: getFormattedDate("convert", val.month_date),
      });
    });
  }

  const weekOptionsSubmitTimeSheet = [];

  if (staffDataWeekDataAllSubmitTImeSheet.data) {
    let sortedSubmitData = [...staffDataWeekDataAllSubmitTImeSheet.data].sort((a, b) => new Date(b.month_date) - new Date(a.month_date));
    sortedSubmitData.forEach((val) => {
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
    if (submitStatusAllKey === 1 || timeSheetRows[selectedRowIndex]?.submit_status === "1") {
      sweatalert.fire({
        icon: "error",
        title: "Cannot update a note on a submitted timesheet.",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }
    // console.log("modalText ",modalText);
    // console.log("activeField ",activeField);
    const updatedRows = [...timeSheetRows];
    updatedRows[selectedRowIndex].is_modified = true;
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
            isCopiedFromPreviousWeek: true,
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

  const totalEnteredHoursNum = timeSheetRows.reduce((sum, row) => sum + (parseFloat(row.total_hours) || 0), 0);
  const totalSubmittedHoursNum = submitStatusAllKey === 1 ? totalEnteredHoursNum : 0;
  const totalDraftHoursNum = submitStatusAllKey === 0 ? totalEnteredHoursNum : 0;
  const selectedStaffData = staffDataAll?.data?.find(s => Number(s.id) === Number(multipleFilter.staff_id));
  const weeklyRequiredHours = (timeSheetRows.length > 0 && timeSheetRows[0].staffs_hourminute) ? timeSheetRows[0].staffs_hourminute : (selectedStaffData?.hourminute || "40:00");
  const getGrandTotalStr = () => timeSheetRows.reduce((sum, row) => sum + (parseFloat(row.total_hours) || 0), 0).toFixed(2);

  const weeklyReqStr = String(weeklyRequiredHours || "0:0");
  const [reqH, reqM] = weeklyReqStr.split(":");
  const reqTotalNum = parseInt(reqH || 0) + parseInt(reqM || 0) / 60;
  const progressPercent = reqTotalNum > 0 ? Math.min((totalEnteredHoursNum / reqTotalNum) * 100, 100) : 0;

  const isManagerReviewVisible = ["SUPERADMIN", "ADMIN"].includes(role) || (lineMangerData && lineMangerData.length > 0);

  const isRowSaved = (index) => {
    return Boolean(timeSheetRows[index]?.id);
  };

  const isRowLocked = (index) => {
    return (
      isRowSaved(index) ||
      timeSheetRows[index]?.isCopiedFromPreviousWeek === true
    );
  };

  useEffect(() => {
    if (hasFetchedManagerReview) {
      setManagerReviewPage(1);
      fetchManagerReviewData(activeReviewTab, 1, managerReviewPageSize, managerReviewSearchTerm);
    }
  }, [activeReviewTab, weekOffset, hasFetchedManagerReview]);

  const fetchManagerReviewData = async (
    statusTab = activeReviewTab,
    page = 1,
    limit = managerReviewPageSize,
    search = managerReviewSearchTerm
  ) => {
    try {
      setManagerReviewData((prev) => ({ ...prev, loading: true }));
      const req = {
        StaffUserId: parseInt(staffDetails.id),
        weekOffset: weekOffset,
        status: statusTab,
        page,
        limit,
        search,
      };
      const res = await dispatch(getManagerReviewData({ req, authToken: token })).unwrap();
      if (res.status) {
        setManagerReviewData({ loading: false, rows: res.data, pagination: res.pagination });
        if (res.summary) {
          setManagerReviewCount(res.summary.totalStaff || 0);
          setSubmittedThisWeek(res.summary.submitted || 0);
          setSavedThisWeek(res.summary.saved || 0);
          setMissingLastWeek(res.summary.missing || 0);
        }
      } else {
        setManagerReviewData({ loading: false, rows: [], pagination: {} });
      }
    } catch (err) {
      console.log(err);
      setManagerReviewData({ loading: false, rows: [], pagination: {} });
    }
  };


  const handleManagerReviewPageChange = (selected) => {
    const newPage = selected.selected + 1;
    setManagerReviewPage(newPage);
    fetchManagerReviewData(activeReviewTab, newPage, managerReviewPageSize, managerReviewSearchTerm);
  };

  const handleManagerReviewPageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setManagerReviewPageSize(newSize);
    setManagerReviewPage(1);
    fetchManagerReviewData(activeReviewTab, 1, newSize, managerReviewSearchTerm);
  };

  const handleManagerReviewSearchChange = (term) => {
    setManagerReviewSearchTerm(term);
    setManagerReviewPage(1);
    if (managerReviewDebounceRef.current) clearTimeout(managerReviewDebounceRef.current);
    managerReviewDebounceRef.current = setTimeout(() => {
      fetchManagerReviewData(activeReviewTab, 1, managerReviewPageSize, term);
    }, 500);
  };

  const handleViewStaffTimesheet = (staffId) => {
    const e = { target: { name: "staff_id", value: staffId } };
    selectFilterStaffANdWeek(e);
    document.getElementById("timesheet-tab")?.click();
  };

  const renderStatusBadge = (status) => {
    const map = {
      Submitted: { color: "#0cb2ef", bg: "#e6f7fd" },
      Saved: { color: "#e8930a", bg: "#fdf3e3" },
      Missing: { color: "#dc3545", bg: "#fbe9eb" },
    };
    const s = map[status] || { color: "#5b6b7a", bg: "#eef2f5" };
    return (
      <span
        className="table-status"
        style={{ color: s.color, background: s.bg, padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}
      >
        {status}
      </span>
    );
  };

  const handleManagerViewLog = async (row) => {
    try {
      setLoading(true);
      const staffId = row.user_id || row.staff_id || row.StaffUserId || row.id;
      const req = { staff_id: staffId, weekOffset: weekOffset };
      const res = await dispatch(getTimesheetLogsData({ req, authToken: token })).unwrap();
      if (res.status) {
        setRowHistoryLogs(res.data);
        setIsHistoryModalOpen(true);
      } else {
        sweatalert.fire({ icon: "error", title: "Error fetching logs" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManagerDownloadTimesheet = async (row) => {
    try {
      const staffId = row.user_id || row.staff_id || row.StaffUserId || row.id;
      const req = { staff_id: staffId, weekOffset: weekOffset };
      const res = await dispatch(getTimesheetData({ req, authToken: token })).unwrap();
      if (res.status && res.data && res.data.length > 0) {
        const rowsWithTotals = res.data.map(r => {
          const sum =
            (parseFloat(r.monday_hours) || 0) +
            (parseFloat(r.tuesday_hours) || 0) +
            (parseFloat(r.wednesday_hours) || 0) +
            (parseFloat(r.thursday_hours) || 0) +
            (parseFloat(r.friday_hours) || 0) +
            (parseFloat(r.saturday_hours) || 0) +
            (parseFloat(r.sunday_hours) || 0);
          return { ...r, total_hours: parseFloat(sum).toFixed(2) };
        });
        exportToCSV(rowsWithTotals);
      } else {
        sweatalert.fire({ icon: "info", title: "No timesheet data available to download." });
        setExporting(false);
      }
    } catch (err) {
      console.error(err);
      setExporting(false);
    }
  };

  const handleViewManagerRemark = async (row) => {
    try {
      setLoading(true);
      const staffId = row.user_id || row.staff_id || row.StaffUserId || row.id;
      const req = { staff_id: staffId, weekOffset: weekOffset };
      const res = await dispatch(getTimesheetData({ req, authToken: token })).unwrap();
      if (res.status && res.data && res.data.length > 0) {
        setManagerRemarkText(res.data[0].final_remark || "No Final Remark Found");
        setIsManagerRemarkModalOpen(true);
      } else {
        setManagerRemarkText("No Final Remark Found");
        setIsManagerRemarkModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const managerReviewColumns = [
    {
      name: "S.No",
      selector: (row, index) => (managerReviewPage - 1) * managerReviewPageSize + (index + 1),
      width: "80px",
      reorder: false,
    },
    {
      name: "Staff",
      cell: (row) => <div title={row.staff_name}>{row.staff_name}</div>,
      selector: (row) => row.staff_name,
      sortable: true,
      width: "230px",
      reorder: false,
    },
    {
      name: "Email",
      cell: (row) => <div title={row.email}>{row.email}</div>,
      selector: (row) => row.email,
      sortable: true,
      width: "290px",
      reorder: false,
    },
    {
      name: "Employee ID",
      selector: (row) => row.employee_number || "-",
      sortable: true,
      width: "160px",
      reorder: false,
    },
    {
      name: "Role",
      selector: (row) => row.role_name,
      sortable: true,
      width: "160px",
      reorder: false,
    },
    {
      name: "Line Manager",
      selector: (row) => {
        const staffId = row.user_id || row.staff_id || row.StaffUserId || row.id;
        const staffInfo = staffDataAll?.data?.find(s => Number(s.id) === Number(staffId));
        return row.line_manager_name || row.line_manager || row.manager_name || row.manager || staffInfo?.line_manager_name || staffInfo?.manager_name || "-";
      },
      sortable: true,
      width: "160px",
      reorder: false,
    },
    {
      name: "Entries",
      cell: (row) => <div className="w-100 text-center">{row.timesheet_count}</div>,
      selector: (row) => row.timesheet_count,
      sortable: true,
      width: "105px",
      reorder: false,
    },
    {
      name: "Entered Hours",
      cell: (row) => <div className="w-100 text-center">{row.total_hours}</div>,
      selector: (row) => row.total_hours,
      sortable: true,
      width: "170px",
      reorder: false,
    },
    {
      name: "Remaining Hours",
      cell: (row) => {
        const staffId = row.user_id || row.staff_id || row.StaffUserId || row.id;
        const staffInfo = staffDataAll?.data?.find(s => Number(s.id) === Number(staffId));
        
        let allocatedStr = row.staffs_hourminute || staffInfo?.hourminute || "0";
        let allocated = 0;
        if (typeof allocatedStr === "string" && allocatedStr.includes(":")) {
          const [h, m] = allocatedStr.split(":");
          allocated = parseFloat(h) + (parseFloat(m) / 60);
        } else {
          allocated = parseFloat(allocatedStr) || 0;
        }

        const total = parseFloat(row.total_hours) || 0;
        let remaining = allocated - total;

        if (remaining < 0) {
          remaining = 0;
        }
        
        return <div className="w-100 text-center">{remaining.toFixed(2)}</div>;
      },
      sortable: true,
      width: "190px",
      reorder: false,
    },
    {
      name: "Status",
      cell: (row) => renderStatusBadge(row.timesheet_status),
      width: "130px",
      reorder: false,
    },
    {
      name: "Action",
      cell: (row) => {
        if (row.timesheet_status === "Missing") return null;

        return (
          <div className="d-flex justify-content-center align-items-center gap-3">
            <span title="View Logs" onClick={(e) => { e.stopPropagation(); handleManagerViewLog(row); }}>
              <Eye 
                size={18} 
                className="cursor-pointer text-primary" 
              />
            </span>

            <span title="Download Timesheet" onClick={(e) => { e.stopPropagation(); handleManagerDownloadTimesheet(row); }}>
              <Download 
                size={18} 
                className="cursor-pointer text-success" 
              />
            </span>

            {row.timesheet_status === "Submitted" && (
              <span title="View Final Remark" onClick={(e) => { e.stopPropagation(); handleViewManagerRemark(row); }}>
                <MessageSquare 
                  size={18} 
                  className="cursor-pointer text-info" 
                />
              </span>
            )}
          </div>
        );
      },
      width: "140px",
      reorder: false,
    },
  ];

  // Accordion component to display timesheet when row is expanded
  const ExpandedComponent = ({ data }) => {
    const [timesheetData, setTimesheetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [remark, setRemark] = useState("");
    const [staffHourMinute, setStaffHourMinute] = useState(null);

    useEffect(() => {
      const fetchStaffTimesheet = async () => {
        try {
          setLoading(true);
          // Try multiple properties since the exact ID key in Manager Review data might vary
          const staffId = data.user_id || data.staff_id || data.StaffUserId || data.id;
          const req = { staff_id: staffId, weekOffset: weekOffset };
          const res = await dispatch(getTimesheetData({ req, authToken: token })).unwrap();

          if (res.status && res.data) {
            const rowsWithTotals = res.data.map(row => {
              const sum =
                (parseFloat(row.monday_hours) || 0) +
                (parseFloat(row.tuesday_hours) || 0) +
                (parseFloat(row.wednesday_hours) || 0) +
                (parseFloat(row.thursday_hours) || 0) +
                (parseFloat(row.friday_hours) || 0) +
                (parseFloat(row.saturday_hours) || 0) +
                (parseFloat(row.sunday_hours) || 0);
              return { ...row, total_hours: parseFloat(sum).toFixed(2) };
            });
            setTimesheetData(rowsWithTotals);
            setRemark(res.data[0]?.final_remark || "");
          } else {
            setTimesheetData([]);
            setRemark("");
          }

          // Fetch hour minute
          const reqTime = { staff_id: staffId };
          const resTime = await dispatch(getStaffHourMinute({ req: reqTime, authToken: token })).unwrap();
          if (resTime?.data?.[0]?.hourminute) {
            setStaffHourMinute(resTime.data[0].hourminute);
          }
        } catch (error) {
          console.error("Error fetching timesheet for accordion:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStaffTimesheet();
    }, [data, weekOffset]);

    return (
      <div className="p-4" style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
        <div className="d-flex align-items-center mb-3 gap-3">
          <h5 className="m-0">Timesheet Details - {data.staff_name}</h5>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : timesheetData.length > 0 ? (
          <>
            <div style={{ opacity: 0.9 }}>
              <TimesheetDatatable
                rows={timesheetData}
                weekDays={weekDays}
                multipleFilter={{ staff_id: data.staff_id || data.id, week: weekOffset }}
                staffDetails={{}}
                isWeekSwitching={false}
                submitStatusAllKey={data.timesheet_status === "Submitted" ? 1 : 0}
                handleChangeTaskType={() => { }}
                selectCustomerData={() => { }}
                selectClientData={() => { }}
                selectJobData={() => { }}
                selectTaskData={() => { }}
                handleHoursInput={() => { }}
                handleDeleteRow={() => { }}
                openHistoryModal={() => { }}
                setActiveIndex={() => { }}
                setActiveField={() => { }}
                activeIndex={null}
                activeField={null}
                setIsModalOpen={() => { }}
                setModalText={() => { }}
                setSelectedRowIndex={() => { }}
                getTotalHoursFromKey={(key) => {
                  let total = 0;
                  timesheetData.forEach(row => {
                    total += parseFloat(row[key]) || 0;
                  });
                  return total;
                }}
                getGrandTotal={() => {
                  let total = 0;
                  timesheetData.forEach(row => {
                    total += parseFloat(row.total_hours) || 0;
                  });
                  return total.toFixed(2) + "h";
                }}
                isRowSaved={() => true}
                isRowLocked={() => true}
              />
            </div>
            {remark && (
              <div className="mt-3">
                <label className="form-label fw-bold">Final remark (weekly)</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: "60px" }}
                  value={remark}
                  disabled
                  readOnly
                ></textarea>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-3">No timesheet records found.</div>
        )}
      </div>
    );
  };

  const renderManagerReviewTable = () => (
    <>
      <div className="row mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search Staff..."
            className="form-control"
            value={managerReviewSearchTerm}
            onChange={(e) => handleManagerReviewSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="datatable-wrapper" style={{ position: "relative" }}>
        {managerReviewData.loading && (
          <div className="overlay">
            <div className="loader"></div>
          </div>
        )}

        {managerReviewData.rows && managerReviewData.rows.length > 0 ? (
          <>
            <ManagerReviewDatatable
              columns={managerReviewColumns}
              data={managerReviewData.rows}
              filter={false}
              pagination={false}
              expandableRows={true}
              expandableRowsComponent={ExpandedComponent}
              expandableRowDisabled={row => row.timesheet_status === "Missing"}
              expandOnRowClicked={true}
            />

            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil((managerReviewData.pagination?.total || 0) / managerReviewPageSize) || 1}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handleManagerReviewPageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={managerReviewPage - 1}
            />

            <select
              className="perpage-select"
              value={managerReviewPageSize}
              onChange={handleManagerReviewPageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </>
        ) : (
          !managerReviewData.loading && (
            <div className="text-center mt-5">
              <img
                src="/assets/images/No-data-amico.png"
                alt="No records available"
                style={{ width: "250px", height: "auto", objectFit: "contain" }}
              />
              <p>No data available.</p>
            </div>
          )
        )}
      </div>
    </>
  );




  return (
    <>
      <div className="container-fluid mt-4" style={{ position: "relative" }}>
        {(loading || exporting || staffDataAll.loading || staffDataWeekDataAll.loading || isExistStaffDataWeekDataAll.loading || staffDataWeekDataAllSubmitTImeSheet.loading || isAddingRow) && (
          <div className="overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
            <div className="loader"></div>
          </div>
        )}
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
            {isManagerReviewVisible && (
              <li role="presentation">
                <button id="manager-review-tab" data-bs-toggle="tab" data-bs-target="#manager-review-tab-pane" type="button" role="tab" aria-controls="manager-review-tab-pane" aria-selected="false" onClick={() => setHasFetchedManagerReview(true)}>Manager Review</button>
              </li>
            )}
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
                    <span> {getFormattedDate("current", "")}</span>
                  </p>
                </div>

                {/* <p className="timesheet-tab-content-para">Vikas Patel · One row per task, fill Mon–Sun hours in one go.</p> */}
              </div>
              <div className="timesheet-tab-content-header-right">
                <div className="timesheet-week-div">
                  <button className="timesheet-week-button" type="button" onClick={() => changeWeek(-1)} disabled={isWeekSwitching}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-4" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
                  </button>
                  <div className="timesheet-week-content-div">
                    <p className="timesheet-week-date">{weekDays?.monday ? `${weekDays.monday} – ${weekDays.sunday}` : ""}</p>
                    <p className="timesheet-week-text">
                      {weekOffset === 0
                        ? "Current Week"
                        : weekOffset === -1
                          ? "Previous Week"
                          : weekOffset < -1
                            ? `Previous Week -${Math.abs(weekOffset) - 1}`
                            : weekOffset === 1
                              ? "Next Week"
                              : `Next Week +${weekOffset - 1}`}
                    </p>
                  </div>
                  <button className="timesheet-week-button" type="button" onClick={() => changeWeek(1)} disabled={isWeekSwitching}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right size-4" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
                  </button>
                </div>
                <button type="button" className="btn btn-outline-info fw-bold" onClick={() => {
                  if (isWeekSwitching || weekOffset === 0) return;
                  setWeekOffset(0);
                  weekOffSetValue.current = 0;
                  GetTimeSheet(0);
                }}>Go to Current Week</button>
              </div>
            </div>


            <div className="row mt-3">
              {/* {["SUPERADMIN", "ADMIN", "MANAGEMENT"].includes(role) ? (
                <div className="form-group col-md-4">
                  <label className="form-label mb-2 ms-2">Select Staff</label>

                  <Select
                    id="tabSelect"
                    name="staff_id"
                    className="basic-multi-select"
                    options={staffOptions}
                    value={staffOptions.find(
                      (opt) => Number(opt.value) === Number(selectedStaff)
                    )}
                    onChange={(selectedOption) => {
                      // simulate e.target.value
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
              )} */}

              {staffDataWeekDataAll.data &&
                staffDataWeekDataAll.data.length > 0 ? (
                <div className="form-group col-md-4   pe-0">
                  <label className="form-label mb-2">Select Date</label>
                  <Select
                    id="tabSelect"
                    name="week"
                    className="basic-multi-select"
                    // options={weekOptions}
                    // defaultValue={currentValue}
                    options={weekOptionsWithPlaceholder}
                    value={currentValue || null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {
                      // simulate e.target.value
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
                    // options={weekOptions}
                    // defaultValue={currentValue}
                    options={weekOptionsWithPlaceholder}
                    value={currentValue || null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {
                      // simulate e.target.value
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
                    // options={weekOptions}
                    // defaultValue={currentValue}
                    options={lineMangerDataWithPlaceholder}
                    defaultValue={null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {
                      // simulate e.target.value
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
                    // options={weekOptions}
                    // defaultValue={currentValue}
                    options={weekOptionsWithPlaceholderSubmitTimeSheet}
                    defaultValue={null}
                    placeholder="-- Select --"
                    onChange={(selectedOption) => {
                      // simulate e.target.value
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


            <div className="timesheet-white-card mt-4">
              <div className="timesheet-whitediv-flex">
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Employee</p>
                  <p className="timesheet-white-card-value">
                    {staffOptions?.find((opt) => Number(opt.value) === Number(multipleFilter.staff_id))?.label || `${staffDetails?.first_name || ""} ${staffDetails?.last_name || ""}`.trim()}
                  </p>
                </div>
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Weekly required hours</p>
                  <p className="timesheet-white-card-value">{weeklyRequiredHours}</p>
                </div>
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Entered</p>
                  <p className="timesheet-white-card-value">{totalEnteredHoursNum.toFixed(2)}h</p>
                </div>
                <div className="timesheet-white-card-div-25">
                  <p className="timesheet-white-card-label">Status</p>
                  <p className="timesheet-white-card-value">
                    <span className="timesheet-white-card-status">
                      {submitStatusAllKey === 1 ? "Submitted" : (timeSheetRows.length > 0 && timeSheetRows.some(r => r.id != null) ? "Saved" : "Draft")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="timesheet-progress">
                <div className="timesheet-progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Task Rows</p>
                  <p className="timesheet-white-card-value-big">{timeSheetRows.length}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Total Hours</p>
                  <p className="timesheet-white-card-value-big">{totalEnteredHoursNum.toFixed(2)}h</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Submitted Hours</p>
                  <p className="timesheet-white-card-value-big timesheet-white-card-value-big-blue">{totalSubmittedHoursNum.toFixed(2)}h</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="timesheet-white-card">
                  <p className="timesheet-white-card-label">Draft Hours</p>
                  <p className="timesheet-white-card-value-big">{totalDraftHoursNum.toFixed(2)}h</p>
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
                    <button type="button" className="timesheet-table-header-btn" onClick={() => openHistoryModal()}>
                      <History size={16} className="me-1" /> View Logs
                    </button>
                    {submitStatusAllKey !== 1 && (
                      <button type="button" className="timesheet-table-header-btn" onClick={() => { if (submitStatusAllKey === 1) { sweatalert.fire({ icon: "error", title: "Cannot copy to a submitted timesheet." }); } else { setIsCopyModalOpen(true); } }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg> Copy previous week
                      </button>
                    )}
                    {/* <button className="timesheet-table-header-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg> Spread 40h Mon–Fri
                    </button>
                    <button className="timesheet-table-header-btn">
                      Clear hours
                    </button> */}
                    {submitStatusAllKey !== 1 && (
                      <button type="button" className="timesheet-table-header-add-task-btn" onClick={handleAddNewSheet} disabled={isAddingRow || staffDetails.id != multipleFilter.staff_id}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> Add task row</button>
                    )}
                    <button type="button" className="timesheet-table-header-btn" onClick={() => exportToCSV(timeSheetRows)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> Export</button>
                  </div>
                </div>
                <div className="mt-3">
                  <TimesheetDatatable
                    rows={timeSheetRows}
                    weekDays={weekDays}
                    multipleFilter={multipleFilter}
                    staffDetails={staffDetails}
                    isWeekSwitching={isWeekSwitching}
                    submitStatusAllKey={submitStatusAllKey}
                    handleChangeTaskType={handleChangeTaskType}
                    selectCustomerData={selectCustomerData}
                    selectClientData={selectClientData}
                    selectJobData={selectJobData}
                    selectTaskData={selectTaskData}
                    handleHoursInput={handleHoursInput}
                    handleDeleteRow={handleDeleteRow}
                    openHistoryModal={openHistoryModal}
                    setActiveIndex={setActiveIndex}
                    setActiveField={setActiveField}
                    activeIndex={activeIndex}
                    activeField={activeField}
                    setIsModalOpen={setIsModalOpen}
                    setModalText={setModalText}
                    setSelectedRowIndex={setSelectedRowIndex}
                    getTotalHoursFromKey={getTotalHoursFromKey}
                    getGrandTotal={getGrandTotalStr}
                    isRowSaved={isRowSaved}
                    isRowLocked={isRowLocked}

                  />
                </div>
                <div className="mt-3">
                  <label className="form-label">Final remark (weekly)</label>
                  <div className="timesheet-submit-div">
                    <textarea
                      className="form-control"
                      placeholder="e.g. Completed all assigned development tasks for this week."
                      style={{ minHeight: "60px" }}
                      value={remarkText || ""}
                      onChange={(e) => setRemarkText(e.target.value)}
                      disabled={submitStatusAllKey === 1}
                    ></textarea>
                  </div>
                  <div className="timesheet-submit-div">
                    <div className="timesheet-submit-div-left">
                      <p>Draft saves keep the timesheet editable. Submitting locks it for manager review.</p>
                    </div>
                    <div className="timesheet-submit-div-right">
                      {submitStatusAllKey === 0 && staffDetails.id == multipleFilter.staff_id && (
                        <>
                          <button type="button" className="btn btn-info" onClick={(e) => saveData(e, 0)} disabled={loading}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"></path></svg> {loading && saveAction === 0 ? "Saving..." : "Save"}</button>
                          <button type="button" className="btn btn-outline-success" onClick={(e) => saveData(e, 1)} disabled={loading}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg> {loading && saveAction === 1 ? "Submitting..." : "Submit"}</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {isManagerReviewVisible && (
            <div className="tab-pane fade" id="manager-review-tab-pane" role="tabpanel" aria-labelledby="manager-review-tab" tabindex="0">
              <div className="timesheet-tab-content-header">
                <div className="timesheet-tab-content-header-left">
                  <h3 className="timesheet-tab-content-heading">Manager Review</h3>
                  <p className="timesheet-tab-content-para">Track, filter and approve team timesheets.</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="timesheet-week-div">
                    <button className="timesheet-week-button" type="button" onClick={() => changeWeek(-1)} disabled={isWeekSwitching}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left size-4" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
                    </button>
                    <div className="timesheet-week-content-div">
                      <p className="timesheet-week-date">{weekDays?.monday ? `${weekDays.monday} - ${weekDays.sunday}` : ""}</p>
                      <p className="timesheet-week-text">
                        {weekOffset === 0
                          ? "Current Week"
                          : weekOffset === -1
                            ? "Previous Week"
                            : weekOffset < -1
                              ? `Previous Week -${Math.abs(weekOffset) - 1}`
                              : weekOffset === 1
                                ? "Next Week"
                                : `Next Week +${weekOffset - 1}`}
                      </p>
                    </div>
                    <button className="timesheet-week-button" type="button" onClick={() => changeWeek(1)} disabled={isWeekSwitching}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right size-4" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
                    </button>
                  </div>
                  <button type="button" className="btn btn-outline-info fw-bold" onClick={() => {
                    if (isWeekSwitching || weekOffset === 0) return;
                    setWeekOffset(0);
                    weekOffSetValue.current = 0;
                    GetTimeSheet(0);
                  }}>Go to Current Week</button>
                </div>
                <div className="timesheet-tab-content-header-right">
                 <button
  type="button"
  className="btn btn-outline-info fw-bold"
  onClick={() => exportManagerReviewCSV(managerReviewData.rows)}
  disabled={!managerReviewData.rows || managerReviewData.rows.length === 0}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> Export filtered
</button>
                </div>
              </div>
              {/* --- 4 Stat Cards (clickable) --- */}
              <div className="row mt-4">
                <div
                  className="col-md-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveReviewTab("all")}
                >
                  <div className={`timesheet-white-card review-stat-card ${activeReviewTab === "all" ? "review-stat-card--active" : ""}`}>
                    <p className="timesheet-white-card-label">Total Staff</p>
                    <p className="timesheet-white-card-value-big">{managerReviewCount}</p>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveReviewTab("submitted")}
                >
                  <div className={`timesheet-white-card review-stat-card ${activeReviewTab === "submitted" ? "review-stat-card--active review-stat-card--blue" : ""}`}>
                    <p className="timesheet-white-card-label">Submitted</p>
                    <p className="timesheet-white-card-value-big timesheet-white-card-value-big-blue">{submittedThisWeek}</p>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveReviewTab("saved")}
                >
                  <div className={`timesheet-white-card review-stat-card ${activeReviewTab === "saved" ? "review-stat-card--active review-stat-card--orange" : ""}`}>
                    <p className="timesheet-white-card-label">Saved Drafts</p>
                    <p className="timesheet-white-card-value-big">{savedThisWeek}</p>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveReviewTab("missing")}
                >
                  <div className={`timesheet-white-card review-stat-card ${activeReviewTab === "missing" ? "review-stat-card--active review-stat-card--red" : ""}`}>
                    <p className="timesheet-white-card-label">Missing</p>
                    <p className="timesheet-white-card-value-big timesheet-white-card-value-big-red">{missingLastWeek}</p>
                  </div>
                </div>
              </div>

              {/* --- 4 Filter Tabs Bar --- */}
              {/* <div className="review-filter-tabs mt-3">
                <button
                  type="button"
                  className={`review-filter-tab-btn ${activeReviewTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveReviewTab("all")}
                >
                  All Staff
                  <span className="review-tab-badge review-tab-badge--default">{managerReviewCount}</span>
                </button>
                <button
                  type="button"
                  className={`review-filter-tab-btn ${activeReviewTab === "submitted" ? "active" : ""}`}
                  onClick={() => setActiveReviewTab("submitted")}
                >
                  Submitted
                  <span className="review-tab-badge review-tab-badge--blue">{submittedThisWeek}</span>
                </button>
                <button
                  type="button"
                  className={`review-filter-tab-btn ${activeReviewTab === "saved" ? "active" : ""}`}
                  onClick={() => setActiveReviewTab("saved")}
                >
                  Saved Drafts
                  <span className="review-tab-badge review-tab-badge--orange">{savedThisWeek}</span>
                </button>
                <button
                  type="button"
                  className={`review-filter-tab-btn ${activeReviewTab === "missing" ? "active" : ""}`}
                  onClick={() => setActiveReviewTab("missing")}
                >
                  Missing
                  <span className="review-tab-badge review-tab-badge--red">{missingLastWeek}</span>
                </button>
              </div> */}

              <div className="timesheet-white-card mt-3">
                {activeReviewTab === "all" && (
                  <div>
                    <div className="timesheet-table-header-div">
                      <div className="timesheet-table-header-div-left">
                        <div className="tab-title"><h3 className="mt-0">All Staff</h3></div>

                      </div>
                    </div>
                    <div className="mt-3">
                      {renderManagerReviewTable()}
                    </div>
                  </div>
                )}

                {activeReviewTab === "submitted" && (
                  <div>
                    <div className="timesheet-table-header-div">
                      <div className="timesheet-table-header-div-left">
                        <div className="tab-title"><h3 className="mt-0">Submitted</h3></div>

                      </div>
                    </div>
                    <div className="mt-3">
                      {renderManagerReviewTable()}
                    </div>
                  </div>
                )}

                {activeReviewTab === "saved" && (
                  <div>
                    <div className="timesheet-table-header-div">
                      <div className="timesheet-table-header-div-left">
                        <div className="tab-title"><h3 className="mt-0">Saved Drafts</h3></div>

                      </div>
                    </div>
                    <div className="mt-3">
                      {renderManagerReviewTable()}
                    </div>
                  </div>
                )}

                {activeReviewTab === "missing" && (
                  <div>
                    <div className="timesheet-table-header-div">
                      <div className="timesheet-table-header-div-left">
                        <div className="tab-title"><h3 className="mt-0">Missing</h3></div>

                      </div>
                    </div>
                    <div className="mt-3">
                      {renderManagerReviewTable()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
      <CommonModal
        isOpen={isModalOpen}
        backdrop="static"
        size="lg"
        cancel_btn={false}
        btn_2="true"
        btn_name={"Save"}
        title={"Timesheet"}
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
                      label: selectedOption.label
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

      {isHistoryModalOpen && (
        <CommonModal
          isOpen={isHistoryModalOpen}
          backdrop="static"
          size="xl"
          cancel_btn={true}
          Submit_Cancel_Function={() => setIsHistoryModalOpen(false)}
          btn_2="false"
          title={"Row History Logs"}
          hideBtn={true}
          handleClose={() => setIsHistoryModalOpen(false)}
        >
          <div className="modal-body p-3">
            {rowHistoryLogs.length > 0 ? (
              (() => {

                const groupedLogs = rowHistoryLogs.reduce((acc, log) => {
                  if (!log.timesheet_row_id || log.timesheet_row_id === "0" || log.timesheet_row_id === 0) return acc;
                  if (!acc[log.timesheet_row_id]) {
                    acc[log.timesheet_row_id] = {
                      details: log,
                      logs: []
                    };
                  }
                  acc[log.timesheet_row_id].logs.push(log);
                  return acc;
                }, {});

                const hasSubmitLog = rowHistoryLogs.some(log => log.action_type === "SUBMIT");

                return (
                  <div className="accordion accordion-history-log" id="accordionHistoryLog">
                    {Object.entries(groupedLogs).map(([rowId, group], index) => {
                      const details = group.details;
                      const targetId = `collapse_${rowId}`;
                      const latestLog = group.logs.reduce((latest, current) => {
                        return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
                      }, group.logs[0]);
                      let displayStatus = latestLog?.action_type || "SAVE";
                      let headerStatusClass = "save-status";

                      // Check if any log has COPIED action_type
                      const copiedLog = group.logs.find(log => log.action_type === "COPIED");
                      let copiedFromWeek = null;
                      if (copiedLog && copiedLog.description) {
                        const match = copiedLog.description.match(/COPIED from (.+?) -/);
                        if (match) {
                          copiedFromWeek = match[1];
                        }
                      }

                      if (hasSubmitLog || submitStatusAllKey === 1) {
                        if (displayStatus === "DELETE") {
                          headerStatusClass = "delete-status";
                        } else {
                          displayStatus = "SUBMIT";
                          headerStatusClass = "submit-status";
                        }
                      } else {
                        if (displayStatus === "SUBMIT") headerStatusClass = "submit-status";
                        if (displayStatus === "UPDATE") headerStatusClass = "update-status";
                        if (displayStatus === "DELETE") headerStatusClass = "delete-status";
                        if (displayStatus === "SAVE") headerStatusClass = "save-status";
                        if (displayStatus === "COPIED") headerStatusClass = "copied-status";
                      }

                      return (
                        <div className="accordion-item mt-2" key={rowId}>
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#${targetId}`}
                              aria-expanded={index === 0 ? "true" : "false"}
                              aria-controls={targetId}
                            >
                              <div className="accordion-history-log-btn-div">
                                <div className="accordion-header-top-row">
                                  <span className="accordion-button-left-text">
                                    {index + 1}: {details.internal_external == 1 ? "Internal" : "External"}
                                    {details.internal_external == 2 && details.customer_name ? ` - ${details.customer_name}` : ""}
                                    {details.internal_external == 2 && details.client_name ? ` - ${details.client_name}` : ""}
                                  </span>
                                  <span className="accordion-button-right-text">
                                    Job: {(() => {
                                      if (details.internal_external == 1) {
                                        return details.internal_name || "N/A";
                                      } else {
                                        const currentRow = timeSheetRows.find(r => String(r.id) === String(rowId));
                                        if (currentRow) {
                                          if (currentRow.jobData && currentRow.jobData.length > 0) {
                                            const matched = currentRow.jobData.find(j => String(j.id) === String(details.job_name) || String(j.name) === String(details.job_name));
                                            if (matched) return matched.name;
                                          }
                                          if (currentRow.job_name) return currentRow.job_name;
                                        }
                                        return details.job_name || "N/A";
                                      }
                                    })()} | Task: {details.internal_external == 1 ? details.sub_internal_name || "N/A" : details.task_name || "N/A"}
                                  </span>
                                </div>
                                <div className="accordion-header-badges-row">
                                  {latestLog && (
                                    <span className={`table-status ${headerStatusClass}`}>
                                      {displayStatus}
                                    </span>
                                  )}
                                  {copiedFromWeek && (
                                    <span className="copied-from-badge">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                                      Copied from: {copiedFromWeek}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div id={targetId} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#accordionHistoryLog">
                            <div className="accordion-body p-0">
                              <div>
                                {(() => {

                                  const saveEvents = [];
                                  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
                                  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


                                  const eventMap = {};
                                  group.logs.forEach(log => {
                                    const timeKey = new Date(log.created_at).toISOString();
                                    if (!eventMap[timeKey]) {
                                      eventMap[timeKey] = {
                                        created_at: log.created_at,
                                        action_type: log.action_type,
                                        staff_name: `${log.staff_name} ${log.staff_surname}`,
                                        days: {},
                                        description: log.description
                                      };
                                    }
                                    if (log.entry_day) {
                                      const dayKey = log.entry_day.toLowerCase();
                                      eventMap[timeKey].days[dayKey] = {
                                        hours: log.hours_entered,
                                        description: log.description,
                                        filled_at: log.created_at
                                      };
                                    }
                                  });

                                  Object.values(eventMap).forEach(ev => saveEvents.push(ev));

                                  saveEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


                                  const getShortDate = (dayKey) => {
                                    const val = weekDays[dayKey];
                                    if (!val) return "";

                                    const parts = val.split(", ");
                                    if (parts.length > 1) {
                                      const dateParts = parts[1].split("/");
                                      return `${dateParts[0]}/${dateParts[1]}`;
                                    }
                                    return val;
                                  };


                                  const formatFilledAt = (dateStr) => {
                                    if (!dateStr) return "";
                                    const d = new Date(dateStr);
                                    const date = d.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" });
                                    const time = d.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
                                    return { date, time };
                                  };

                                  return (
                                    <table className="normal-table" style={{ fontSize: "13px" }}>
                                      <thead>
                                        <tr>
                                          <th style={{ minWidth: "100px" }}>Action By</th>
                                          <th style={{ minWidth: "70px", textAlign: "center" }}>Type</th>
                                          {dayKeys.map((dayKey, di) => (
                                            <th key={dayKey} style={{ textAlign: "center", minWidth: "85px" }}>
                                              <div>{dayLabels[di]}</div>
                                              <div style={{ fontSize: "10px", fontWeight: "normal", color: "#888" }}>{getShortDate(dayKey)}</div>
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {saveEvents.map((event, i) => {
                                          let displayActionType = event.action_type;
                                          let statusClass = "save-status";
                                          if (displayActionType === "SUBMIT") statusClass = "submit-status";
                                          if (displayActionType === "UPDATE") statusClass = "update-status";
                                          if (displayActionType === "DELETE") statusClass = "delete-status";
                                          if (displayActionType === "COPIED") statusClass = "copied-status";

                                          // Since saveEvents is sorted descending by created_at, i === 0 is the latest log
                                          if (i === 0 && (hasSubmitLog || submitStatusAllKey === 1) && displayActionType !== "DELETE") {
                                            displayActionType = "SUBMIT";
                                            statusClass = "submit-status";
                                          }

                                          return (
                                            <tr key={i}>
                                              <td style={{ whiteSpace: "nowrap" }}>{event.staff_name}</td>
                                              <td style={{ textAlign: "center" }}>
                                                <span className={`table-status ${statusClass}`} style={{ padding: '2px 8px', fontSize: '11px' }}>
                                                  {displayActionType}
                                                </span>
                                                {event.action_type === "DELETE" && (
                                                  <div style={{ fontSize: "10px", color: "#999", lineHeight: "1.2", marginTop: "4px" }}>
                                                    <div>{formatFilledAt(event.created_at).date}</div>
                                                    <div>{formatFilledAt(event.created_at).time}</div>
                                                  </div>
                                                )}
                                              </td>
                                              {dayKeys.map((dayKey) => {
                                                const dayData = event.days[dayKey];
                                                if (!dayData) {
                                                  return <td key={dayKey} style={{ textAlign: "center", color: "#ccc" }}>-</td>;
                                                }

                                                const parseHours = (val) => {
                                                  if (!val) return "0.00";
                                                  const strVal = val.toString().replace(':', '.');
                                                  return !isNaN(parseFloat(strVal)) ? parseFloat(strVal).toFixed(2) : val;
                                                };

                                                const isUpdate = event.action_type === "UPDATE" && dayData.description && dayData.description.includes("Changed hours from");
                                                let oldHours = null;
                                                let newHours = parseHours(dayData.hours);
                                                if (isUpdate) {
                                                  const match = dayData.description.match(/Changed hours from ([\d.:]+) to ([\d.:]+)/);
                                                  if (match) {
                                                    oldHours = parseHours(match[1]);
                                                    newHours = parseHours(match[2]);
                                                  }
                                                }

                                                const filledInfo = formatFilledAt(dayData.filled_at);

                                                return (
                                                  <td key={dayKey} style={{ textAlign: "center", verticalAlign: "middle", padding: "6px 4px" }}>
                                                    {isUpdate && oldHours !== null ? (
                                                      <div>
                                                        <span style={{ textDecoration: "line-through", color: "#999", fontSize: "11px", marginRight: "2px" }}>{oldHours}</span>
                                                        <span style={{ color: "#0d6efd", fontWeight: "600" }}>{newHours}</span>
                                                      </div>
                                                    ) : (
                                                      <div style={{ fontWeight: "600" }}>{parseHours(dayData.hours)}</div>
                                                    )}
                                                    {filledInfo && (
                                                      <div style={{ fontSize: "10px", color: "#999", lineHeight: "1.2", marginTop: "2px" }}>
                                                        <div>{filledInfo.date}</div>
                                                        <div>{filledInfo.time}</div>
                                                      </div>
                                                    )}
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <div className="text-center p-4 text-muted">No history logs found for this week.</div>
            )}
          </div>
        </CommonModal>
      )}

      {/* Manager Review Final Remark Modal */}
      <CommonModal
        isOpen={isManagerRemarkModalOpen}
        backdrop="static"
        size="lg"
        cancel_btn={false}
        btn_2="true"
        title="Final Remark"
        hideBtn={true}
        handleClose={() => setIsManagerRemarkModalOpen(false)}
      >
        <div className="modal-body">
          <div className="row">
            <div className="col-lg-12">
              <p>{managerRemarkText || "No Final Remark Found"}</p>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default TimesheetNewDesign;