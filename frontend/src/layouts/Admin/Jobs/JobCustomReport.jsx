import React, { useState, useEffect } from 'react';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import { getAllCustomerDropDown, JobAction, getAllTaskByStaff, getTimesheetReportData } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import * as XLSX from "xlsx";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import dayjs from "dayjs";
import sweatalert from "sweetalert2";


function JobCustomReport() {
  const noDataImage = '/assets/images/No-data-amico.png';
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [options, setOptions] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = staffDetails?.role;
  const [showData, setShowData] = useState([]);

  //console.log("showData ", showData);

  const [accountManagerAllData, setAccountManagerAllData] = useState([]);
  const [allocatedToAllData, setAllocatedToAllData] = useState([]);
  const [reviewerAllData, setReviewerAllData] = useState([]);
  const [otherStaffAllData, setOtherStaffAllData] = useState([]);
  const [customerAllData, setCustomerAllData] = useState([]);
  const [clientAllData, setClientAllData] = useState([]);
  const [jobAllData, setJobAllData] = useState([]);
  const [serviceAllData, setServiceAllData] = useState([]);
  const [jobTypeAllData, setJobTypeAllData] = useState([]);
  const [statusAllData, setStatusAllData] = useState([]);

  




  const [taskAllData, setTaskAllData] = useState([]);

  const [internalJobAllData, setInternalJobAllData] = useState([]);
  const [internalTaskAllData, setInternalTaskAllData] = useState([]);


  const [getAllFilterData, setGetAllFilterData] = useState([]);
  // set filter id
  const [filterId, setFilterId] = useState(null);

  console.log("filterId -------  ", filterId);
  console.log("getAllFilterData ", getAllFilterData);





  const [filters, setFilters] = useState({
    groupBy: ["job_id"],
    internal_external: "0",
    fieldsToDisplay: null,
    fieldsToDisplayId: null,
    staff_id: null,
    customer_id: null,
    client_id: null,
    job_id: null,
    task_id: null,
    internal_job_id: null,
    internal_task_id: null,
    timePeriod: "this_month",
    displayBy: "Weekly",
    fromDate: null,
    toDate: null,
  });

  let lastGroupValue = filters?.groupBy[filters?.groupBy?.length - 1];


  function formatStringToTitleCase(text, key) {
    if (!text) return "";

    if (key == 'date') {
      return dayjs(text).format('DD-MM-YYYY');
    }

    return text
      .replace(/_/g, " ")                 // underscores → spaces
      .toLowerCase()                      // make all lowercase first
      .replace(/\b\w/g, char => char.toUpperCase()) // capitalize first letter of each word
      .trim();
  }


  //  console.log("lastGroupValue ", lastGroupValue);

  // Get All Jobs
  const GetAllJobs = async () => {
    // External get All jobs
    const req = { action: "getByCustomer", customer_id: "" };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.job_id,
            label: item.job_code_id
          }));
          setJobAllData(data);
        } else {
          setJobAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return

  };

  const getAllFilters = async () => {
    var req = { action: "getAllFilters", type: "timesheet_report" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {

          console.log("getAllFilters response ", response.data);
          const data = response?.data?.map((item) => ({

            value: item.id,
            // label: `Group By : [${JSON.parse(item?.groupBy)}]  ⮞ Staff : ${item.staff_fullname}  ⮞ Customer : ${item.customer_name}  ⮞ Client : ${item.client_name}  ⮞ Job : ${item.job_name}  ⮞ Task : ${item.task_name}  ⮞ Internal Job : ${item.internal_job_name}  ⮞ Internal Task : ${item.internal_task_name}`,
            label: `
            Group By : [${(JSON.parse(item?.groupBy))?.map(item => item.replace(/_id$/i, ""))}]<br/>
            ${item.staff_fullname ? `⮞ Staff : ${item.staff_fullname}<br/>` : ""}
            ${item.customer_name ? `⮞ Customer : ${item.customer_name}<br/>` : ""}
            ${item.client_name ? `⮞ Client : ${item.client_name}<br/>` : ""}
            ${item.job_name ? `⮞ Job : ${item.job_name}<br/>` : ""}
            ${item.task_name ? `⮞ Task : ${item.task_name}<br/>` : ""}
            ${item.internal_job_name ? `⮞ Internal Job : ${item.internal_job_name}<br/>` : ""}
            ${item.internal_task_name ? `⮞ Internal Task : ${item.internal_task_name}<br/>` : ""}
            ${item.timePeriod ? `⮞ Time Period : ${formatStringToTitleCase(item.timePeriod)}<br/>` : ""}
            ${item.displayBy ? `⮞ Display By : ${formatStringToTitleCase(item.displayBy)}<br/>` : ""}
            ${!['', null, 'null', undefined].includes(item.fromDate) ? `⮞ From Date : ${formatStringToTitleCase(item.fromDate, 'date')}<br/>` : ""}
            ${!['', null, 'null', undefined].includes(item.toDate) ? `⮞ To Date : ${formatStringToTitleCase(item.toDate, 'date')}` : ""}
          `,

            filters: item.filter_record
          }));
          setGetAllFilterData(data);
        } else {
          setGetAllFilterData([]);
        }
      })
      .catch((error) => {
        return;
      });
  }

  useEffect(() => {
    GetAllJobs();
    getAllFilters();
  }, []);

  // Get All Customers
  const GetAllCustomer = async () => {
    const req = { action: "get_dropdown" };
    const data = { req: req, authToken: token };
    await dispatch(getAllCustomerDropDown(data)).unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.trading_name
          }));
          setCustomerAllData(data);
        } else {
          setCustomerAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

    
   // Get All Clients
  const GetAllClient = async () => {
    const req = { action: "get", customer_id: "" };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.client_name + " (" + item.client_code + ")"
          }));
          setClientAllData(data);
        } else {
          setClientAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  // All Type Staff Get
  const staffData = async (role_id) => {
    //  console.log("role ", role);
    if(['',null,undefined].includes(role_id)){
      return
    }
    if(Number(role_id) == 4){
    if (role?.toUpperCase() === "SUPERADMIN") {
      var req = { action: "getStaffWithRole", role_id: role_id || "" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            // console.log("response.data ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`
            }));
            setAccountManagerAllData(data);
          } else {
            setAccountManagerAllData([]);
          }
        })
        .catch((error) => {
          return;
        });

    } else {
      let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

      data = data?.map((item) => ({
        value: item.id,
        label: item.email
      }));
      setAccountManagerAllData(data);
    }
    }

    else if(Number(role_id) == 3){
      if (role?.toUpperCase() === "SUPERADMIN") {
      var req = { action: "getStaffWithRole", role_id: role_id || "" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            // console.log("response.data ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`
            }));
            setAllocatedToAllData(data);
          } else {
            setAllocatedToAllData([]);
          }
        })
        .catch((error) => {
          return;
        });

    } else {
      let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

      data = data?.map((item) => ({
        value: item.id,
        label: item.email
      }));
      setAllocatedToAllData(data);
    }
    }

    else if(Number(role_id) == 6){
      if (role?.toUpperCase() === "SUPERADMIN") {
      var req = { action: "getStaffWithRole", role_id: role_id || "" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            // console.log("response.data ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`
            }));
            setReviewerAllData(data);
          } else {
            setReviewerAllData([]);
          }
        })
        .catch((error) => {
          return;
        });

    } else {
      let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

      data = data?.map((item) => ({
        value: item.id,
        label: item.email
      }));
      setReviewerAllData(data);
    }
    }
   
    else if(role_id == 'other'){
      if (role?.toUpperCase() === "SUPERADMIN") {
      var req = { action: "getStaffWithRole", role_id: role_id || "" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            // console.log("response.data ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`
            }));
            setOtherStaffAllData(data);
          } else {
            setOtherStaffAllData([]);
          }
        })
        .catch((error) => {
          return;
        });

    } else {
      let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

      data = data?.map((item) => ({
        value: item.id,
        label: item.email
      }));
      setOtherStaffAllData(data);
    }
    }
    else{
      return
    }

  };

   // Get All Service
  const GetAllService = async () => {

      var req = { action: "getAllService" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name
            }));
            setServiceAllData(data);
          } else {
            setServiceAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return
    
   
  };

   // Get All Service
  const GetAllJobType = async () => {

      var req = { action: "getAllJobType" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.type
            }));
            setJobTypeAllData(data);
          } else {
            setJobTypeAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return
    
   
  };

    // Get All Status
  const GetAllStatus = async () => {

      var req = { action: "getAllStatus" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name
            }));
            setStatusAllData(data);
          } else {
            setStatusAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return
    
   
  };

  

  



  



  // Get All task
  const GetAllTask = async (internal_external) => {
    if (internal_external == "0") {
      var req = { action: "getInternalTasks" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {

            // console.log("Internal tasks response: ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name
            }));
            setInternalTaskAllData(data);
          } else {
            setInternalTaskAllData([]);
          }
        })
        .catch((error) => {
          return;
        });

      // External Task
      var req = { action: "get" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.task_id,
              label: item.task_name
            }));
            setTaskAllData(data);
          } else {
            setTaskAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return
    }
    else if (internal_external == "1") {
      var req = { action: "getInternalTasks" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {

            // console.log("Internal tasks response: ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name
            }));
            setInternalTaskAllData(data);
          } else {
            setInternalTaskAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return
    }
    else if (internal_external == "2") {
      // External Task
      const req = { action: "get" };
      const data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.task_id,
              label: item.task_name
            }));
            setTaskAllData(data);
          } else {
            setTaskAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return
    }
  };

  const exportToCSV = (data) => {
    if (!data || !data.rows || data.rows.length === 0) {
      alert("No data to export!");
      return;
    }

    //  Headers dynamically from data.columns
    //  const headers = data.columns;
    const colMap = {
      staff_id: "Staff Name",
      customer_id: "Customer Name",
      client_id: "Client Name",
      job_id: "Job Name",
      task_id: "Task Name",
      total_hours: "Total Hours",
      task_type: "Task Type"

    };
    const headers = data.columns.map(col => colMap[col] || col);


    const rows = data.rows.map((row) => {
      return data.columns.map((col) => {
        let val = row[col];
        if (val === undefined || val === null) val = "-";

        if (typeof val === "string" && val.includes(",")) val = `"${val}"`;
        return val;
      });
    });

    //  CSV content
    const csvContent = [headers, ...rows]
      .map((r) => r.join(",")) // join by comma
      .join("\n"); // join rows by newline

    //  Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TimeSheetReportData.csv";
    link.click();
  };

  const handleFilterChange = (e) => {

    if (Array.isArray(e)) {
      // this case is for multi-select (Group By)
      const values = e.map((opt) => opt.value);
      const labels = e.map((opt) => opt.label);
      //console.log("Filter changed (multi): ", "groupBy", values, labels);
      setOptions([]);
      let gropByArray = sortByReference(values)
      setFilters((prev) => ({
        ...prev,
        fieldsToDisplay: null,
        fieldsToDisplayId: null,
        groupBy: sortByReference(gropByArray)
      }));

      return; // multi-select

    }




    const { key, value, label } = e.target;
    // console.log("Filter changed: ", key, value, label);
    // if (key === "fieldsToDisplay") {

    //   //console.log("Fields to Display changed field: ", value);

    //   if ([null, undefined, ""].includes(value)) {
    //     setFilters((prev) => ({
    //       ...prev,
    //       [key]: null,
    //       [key + "Id"]: null
    //     }));
    //   } else {
    //     setFilters((prev) => ({
    //       ...prev,
    //       [key]: label,
    //       [key + "Id"]: value
    //     }));
    //   }

    // }


    if (key === "staff_id" || key === "customer_id" || key === "client_id" || key === "job_id" || key === "task_id" || key === "internal_job_id" || key === "internal_task_id") {
      if ([null, undefined, ""].includes(value)) {
        setFilters((prev) => ({
          ...prev,
          [key]: null
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [key]: value
        }));
      }
    }

    else if (key === "internal_external") {

      let remainingPart = filters?.groupBy

      if (value == "1") {
        setOptions([])
        let remainingPart = filters?.groupBy?.filter(item => item !== 'customer_id' && item !== 'client_id');

        let lastIndexValue = remainingPart[remainingPart.length - 1];

        let fieldsToDisplayId = null;
        if (lastIndexValue == 'staff_id') {
          if (filters?.groupBy.some(item => ['customer_id', 'client_id'].includes(item))) {
            fieldsToDisplayId = null
          } else {
            fieldsToDisplayId = filters.fieldsToDisplayId
          }
          staffData()
        } else {
          fieldsToDisplayId = null
        }


        setFilters((prev) => ({
          ...prev,
          [key]: value,
          groupBy: remainingPart,
          fieldsToDisplay: null,
          fieldsToDisplayId: fieldsToDisplayId
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [key]: value
        }));
      }


      let lastIndexValue = remainingPart[remainingPart.length - 1];
      if (lastIndexValue == 'job_id') {
        setOptions([])
        GetAllJobs()
      }
      else if (lastIndexValue == 'task_id') {
        setOptions([])
        GetAllTask(value)
      }
      else if (lastIndexValue == 'staff_id') {
        setOptions([])
        staffData()
      }

    }

    else if (key == "timePeriod") {

      setFilters((prev) => ({
        ...prev,
        fromDate: null,
        toDate: null,
        [key]: value,
      }));
    }

    else if (key == "fromDate") {
      if (value > filters.toDate) {
        setFilters((prev) => ({
          ...prev,
          toDate: value,
        }));
      }

      setFilters((prev) => ({
        ...prev,
        fromDate: value,
      }));
    }

    else {
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }));
    }




  };

  const addAndRemoveGroupBy = (value, type) => {
    if (type == 'add') {
      if (value == 'job_id') {
        GetAllJobs()
      }
      else if (value == 'customer_id') {
        GetAllCustomer()
      }
      else if (value == 'client_id') {
        GetAllClient()
      }
      else if (value == 'account_manager_id') {
        staffData(4)  // role_id 4 for account manager
      }
      else if(value == "allocated_to_id"){
        staffData(3)  // role_id 3 for staff
      }
      else if(value == "reviewer_id"){
        staffData(6)  // role_id 2 for reviewer
      }
      else if(value == "allocated_to_other_id"){
        staffData('other')  // role_id 5 for allocated to other
      }
      else if (value == 'service_id') {
        GetAllService()
      }
      else if (value == 'job_type_id') {
        GetAllJobType()
      }
      else if (value == 'status_type_id') {
        GetAllStatus()
      }

    }

    else if (type == 'remove') {

      // console.log("Removed value: ---------------- ", value);

      if (value == 'job_id') {
        setJobAllData([]);
        setFilters((prev) => ({
          ...prev,
          job_id: null
        }));

      }
      else if (value == 'customer_id') {
        setCustomerAllData([]);
        setFilters((prev) => ({
          ...prev,
          [value]: null
        }));

      }

      else if (value == 'staff_id') {

        setFilters((prev) => ({
          ...prev,
          [value]: null
        }));

      }
      else if (value == 'client_id') {
        setClientAllData([]);
        setFilters((prev) => ({
          ...prev,
          [value]: null
        }));

      }


      else if (value == 'task_id') {
        if (filters.internal_external == "0") {
          setTaskAllData([]);
          setInternalTaskAllData([]);
          setFilters((prev) => ({
            ...prev,
            task_id: null,
            internal_task_id: null
          }));
        } else if (filters.internal_external == "1") {
          setInternalTaskAllData([]);
          setFilters((prev) => ({
            ...prev,
            internal_task_id: null
          }));
        } else if (filters.internal_external == "2") {
          setTaskAllData([]);
          setFilters((prev) => ({
            ...prev,
            task_id: null
          }));
        }
      }



    }
  }

  const callFilterApi = async () => {
    // Call your filter API here
    // console.log("Calling filter API with filters: ", filters);
    const req = { action: "get", filters: filters };
    const data = { req: req, authToken: token };
    await dispatch(getTimesheetReportData(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setShowData(response.data);
        } else {
          setShowData([]);
        }
      })
      .catch((error) => {
        return;
      });


  };

  useEffect(() => {
    if (filters.fieldsToDisplay !== null || role?.toUpperCase() === "SUPERADMIN") {
      // callFilterApi();
    }
  }, [filters.fieldsToDisplay, filters.timePeriod, filters.fromDate, filters.toDate, filters.displayBy, filters.internal_external, filters.groupBy, filters.staff_id, filters.customer_id, filters.client_id, filters.job_id, filters.task_id, filters.internal_job_id, filters.internal_task_id]);


  //console.log("filters ", filters);

  const resetFunction = () => {
    setFilters({
      groupBy: [],
      internal_external: "2",
      fieldsToDisplay: null,
      fieldsToDisplayId: null,
      staff_id: null,
      customer_id: null,
      client_id: null,
      job_id: null,
      task_id: null,
      internal_job_id: null,
      internal_task_id: null,
      timePeriod: "",
      displayBy: "",
      fromDate: null,
      toDate: null,
    })
    setFilterId(null)
    setShowData([]);


    setCustomerAllData([]);
    setClientAllData([]);
    setJobAllData([]);
    setTaskAllData([]);
    setInternalJobAllData([]);
    setInternalTaskAllData([]);

    //staffData();
  }

  const optionGroupBy = [
    { value: "job_id", label: "Job Name" },
    { value: "customer_id", label: "Customer Name" },
    { value: "client_id", label: "Client Name" },
    { value: "account_manager_id", label: "Account Manager Name" },
    { value: "allocated_to_id", label: "Allocated To" },
    { value: "reviewer_id", label: "Reviewer" },
    { value: "allocated_to_other_id", label: "Allocated To (Other)" },
    { value: "service_id", label: "Service Type" },
    { value: "job_type_id", label: "Job Type" },
    { value: "status_type_id", label: "Status" },
    { value: "line_manager_id", label: "Line Manager" },
  ];

  const labels = {
    job_id: "Job Name",
    customer_id: "Customer Name",
    account_manager_id: "Account Manager Name",
    service_id: "Service Type",
    job_type_id: "Job Type",
    status_type_id: "Status",
    detailed_status_id: "Detailed Status",
    allocated_to_id: "Allocated To",
    allocated_to_other_id: "Allocated To (Other)",
    reviewer_id: "Reviewer",
    line_manager_id: "Line Manager",
  };



  const orderMap = {};
  for (let i = 0; i < optionGroupBy.length; i++) {
    orderMap[optionGroupBy[i].value] = i;
  }

  // sabse fast function
  function sortByReference(selected) {
    if (!Array.isArray(selected) || selected.length <= 1) return selected;
    return selected.slice().sort((a, b) => orderMap[a] - orderMap[b]);
  }


  //  console.log("Filters: ", filters);

  const saveFilterFunction = async () => {

    if (filters?.groupBy?.length == 0) {
      sweatalert.fire({
        title: 'Warning',
        text: 'Please select group by one value',
        icon: 'warning',
        confirmButtonText: 'OK'
      });

      return
    }

    var req = { action: "saveFilters", filters: filters, id: filterId, type: "timesheet_report" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {

          sweatalert.fire({
            title: 'Success',
            text: response.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          getAllFilters();

        } else {
          sweatalert.fire({
            title: 'Error',
            text: 'Failed to save filters. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });

        }
      })
      .catch((error) => {
        return;
      });



  }

  const handleFilterSelect = (selected) => {
    setFilterId(selected.value);
    // set filters from selected
    // console.log("selected  1 --", selected);
    let selectedFilter = getAllFilterData?.find((opt) => Number(opt?.value) === Number(selected?.value));

    //console.log("selectedFilter  2 --", selectedFilter);
    if (selectedFilter != undefined && selectedFilter.filters) {
      let parsedFilters = {};
      try {

        parsedFilters = JSON.parse(selectedFilter.filters);
        //console.log("Parsed Filters: 4  ", parsedFilters);
        setFilters(parsedFilters);
        callFilterApi();
      } catch (e) {
        console.error("Error parsing filters JSON: ", e);
      }
    } else {

      setFilters({
        groupBy: ["staff_id"],
        internal_external: "0",
        fieldsToDisplay: null,
        fieldsToDisplayId: null,
        staff_id: null,
        customer_id: null,
        client_id: null,
        job_id: null,
        task_id: null,
        internal_job_id: null,
        internal_task_id: null,
        timePeriod: "this_month",
        displayBy: "Weekly",
        fromDate: null,
        toDate: null,
      })

    }
  };

  const deleteFilterIdFunction = async () => {
    // confirm before delete
    const result = await sweatalert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      var req = { action: "deleteFilterId", filterId: filterId, type: "timesheet_report" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {

            sweatalert.fire({
              title: 'Success',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            getAllFilters();
            resetFunction();

          } else {
            sweatalert.fire({
              title: 'Error',
              text: 'Failed to save filters. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });

          }
        })
        .catch((error) => {
          return;
        });
    } else {
      return
    }


  }



  return (
    <div className="container-fluid pb-3">
      {/* Page Title */}
      <div className="content-title">
        <div className="tab-title mb-3">
          <div className="row align-items-start">
            <div className="col-12 col-sm-7 ">
              <div>
                <h3 className="mt-0">Timesheet Reports</h3>

              </div>

              {/* <div className='w-50 mt-2'>
                <label className="form-label fw-medium form-label fw-medium mt-2 mb-1">
                  Select Saved Filters
                </label>
                <Select
                  options={[
                    { value: "", label: "Select..." },
                    ...getAllFilterData,
                  ]}
                  value={
                    getAllFilterData && getAllFilterData.length > 0
                      ? getAllFilterData.find(
                        (opt) => Number(opt.value) === Number(filterId)
                      ) || null
                      : null
                  }
                  onChange={handleFilterSelect}
                  isSearchable
                  className="shadow-sm select-staff rounded-pill"
                />


                {
                  !['', null, undefined].includes(filterId) ?

                    <i className="fa fa-trash"
                      title="Delete Filter"
                      onClick={() => deleteFilterIdFunction()}
                      style={{ cursor: "pointer", color: "red" }}
                    ></i>

                    : ""
                }


              </div> */}
              <div className='w-50 mt-2'>
                <label className="form-label fw-medium mt-2 mb-1">
                  Select Saved Filters
                </label>

                <div className="d-flex align-items-center gap-2">
                  <Select
                    // options={[
                    //   { value: "", label: "Select..." },
                    //   ...getAllFilterData,
                    // ]}
                    options={[
                      { value: "", label: "Select..." },
                      ...getAllFilterData.map(opt => ({
                        value: opt.value,
                        label: <span dangerouslySetInnerHTML={{ __html: opt.label }} />
                      }))
                    ]}
                    value={
                      getAllFilterData && getAllFilterData.length > 0
                        ? getAllFilterData.find(
                          (opt) => Number(opt.value) === Number(filterId)
                        ) || null
                        : null
                    }
                    onChange={handleFilterSelect}
                    isSearchable
                    className="shadow-sm select-staff rounded-pill flex-grow-1"
                  />

                  {

                    !['', null, undefined].includes(filterId) && (
                      <i
                        className="fa fa-trash"
                        title="Delete Filter"
                        onClick={() => deleteFilterIdFunction()}
                        style={{ cursor: "pointer", color: "red" }}
                      ></i>
                    )
                  }

                </div>
              </div>


            </div>

            {/* get filters Dropdown */}



            {/* end get filters Dropdown */}






            <div className="col-12 col-sm-5">
              <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                <button className="btn btn-info" id="btn-export"
                  onClick={() => exportToCSV(showData)}>
                  Export Data
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row mb-3">
        <div className="col-12">
          <h5 className="fw-semibold mb-0">Timesheet Reports</h5>
        </div>
      </div> */}

      {/* Filters Section */}
      <div className="row g-3 mb-3 bg-light p-3  mt-4 rounded shadow-sm align-items-end">
        {/* Group By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Group By</label>
          {console.log("optionGroupBy --- ", optionGroupBy.filter((opt) => filters.groupBy.includes(opt.value)))}
          <Select
            isMulti
            options={optionGroupBy}
            value={optionGroupBy.filter((opt) => filters.groupBy.includes(opt.value))}
            onChange={(selectedOptions, actionMeta) => {
              // console.log("Selected Options:", selectedOptions);
              //console.log("Action Meta:", actionMeta);

              if (actionMeta.action === "remove-value") {
                console.log("Removed value:", actionMeta.removedValue.value);
                addAndRemoveGroupBy(actionMeta.removedValue.value, 'remove');
              }
              if (actionMeta.action === "select-option") {
                console.log("Added value:", actionMeta.option.value);
                addAndRemoveGroupBy(actionMeta.option.value, 'add');
              }
              handleFilterChange(selectedOptions);
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>


        {/* Field To Display Job */}
        {(filters?.groupBy?.includes('job_id')) && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Job
            </label>
            <Select
              options={[
                { value: "", label: "Select..." },
                ...jobAllData,
              ]}
              value={
                jobAllData && jobAllData.length > 0
                  ? jobAllData.find((opt) => Number(opt.value) === Number(filters.job_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "job_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}


        {/* Field To Display Customer */}
        {filters?.groupBy?.includes('customer_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Customer
            </label>
            <Select
              options={[
                { value: "", label: "Select..." },
                ...customerAllData,
              ]}
              value={
                customerAllData && customerAllData.length > 0
                  ? customerAllData.find((opt) => Number(opt.value) === Number(filters.customer_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "customer_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Client */}
        {filters?.groupBy?.includes('client_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Client
            </label>
            <Select
              options={[
                { value: "", label: "Select..." },
                ...clientAllData,
              ]}
              value={
                clientAllData && clientAllData.length > 0
                  ? clientAllData.find((opt) => Number(opt.value) === Number(filters.client_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "client_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Account Manager  */}
        {filters?.groupBy?.includes('account_manager_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Account Manager
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...accountManagerAllData,
              ]}
              value={
                accountManagerAllData && accountManagerAllData.length > 0
                  ? accountManagerAllData.find((opt) => Number(opt.value) === Number(filters.account_manager_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "account_manager_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

         {/* Field To Display Allocated To */}
        {filters?.groupBy?.includes('allocated_to_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Allocated To
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...allocatedToAllData,
              ]}
              value={
                allocatedToAllData && allocatedToAllData?.length > 0
                  ? allocatedToAllData?.find((opt) => Number(opt.value) === Number(filters.allocated_to_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "allocated_to_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

          {/* Field To Display Reviewer  */}
        {filters?.groupBy?.includes('reviewer_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Reviewer
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...reviewerAllData,
              ]}
              value={
                reviewerAllData && reviewerAllData?.length > 0
                  ? reviewerAllData?.find((opt) => Number(opt.value) === Number(filters.reviewer_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "reviewer_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

          {/* Field To Display Allocated Other  */}
        {filters?.groupBy?.includes('allocated_to_other_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Allocated To (Other)
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...otherStaffAllData,
              ]}
              value={
                otherStaffAllData && otherStaffAllData?.length > 0
                  ? otherStaffAllData?.find((opt) => Number(opt.value) === Number(filters.allocated_to_other_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "allocated_to_other_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

         {/* Field To Display Services  */}
        {filters?.groupBy?.includes('service_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Service
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...serviceAllData,
              ]}
              value={
                serviceAllData && serviceAllData?.length > 0
                  ? serviceAllData?.find((opt) => Number(opt.value) === Number(filters.service_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "service_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}


           {/* Field To Display Job Type  */}
        {filters?.groupBy?.includes('job_type_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Job Type
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...jobTypeAllData,
              ]}
              value={
                jobTypeAllData && jobTypeAllData?.length > 0
                  ? jobTypeAllData?.find((opt) => Number(opt.value) === Number(filters.job_type_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "job_type_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

          {/* Field To Display Status  */}
        {filters?.groupBy?.includes('status_type_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Select Status
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...statusAllData,
              ]}
              value={
                statusAllData && statusAllData?.length > 0
                  ? statusAllData?.find((opt) => Number(opt.value) === Number(filters.status_type_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "status_type_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}


        {/* Time Period */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Time Period</label>
          <select
            className="form-select shadow-sm"
            id="timePeriod"
            value={filters.timePeriod}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "timePeriod", value: selected.target.value },
              })
            }
          >
            <option value={""}>--Select--</option>
            <option value={"this_week"}>This week</option>
            <option value={"last_week"}>Last Week</option>
            <option value={"this_month"}>This month</option>
            <option value={"last_month"}>Last Month</option>
            <option value={"this_quarter"}>This quarter</option>
            <option value={"last_quarter"}>Last quarter</option>
            <option value={"this_year"}>This year</option>
            <option value={"last_year"}>Last year</option>
            <option value={"custom"}>Custom</option>
          </select>
        </div>



        {/* From Date  And To Date */}
        {filters.timePeriod == "custom" && (
          <>
            {/* <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">From Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            id="fromDate"
            value={filters.fromDate}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "fromDate", value: selected.target.value },
              })
            }
          />
        </div>

        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">To Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            id="toDate"
            value={filters.toDate}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "toDate", value: selected.target.value },
              })
            }
          />
        </div> */}
            {/* From Date */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">From Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="fromDate"
                value={filters.fromDate}
                //  min={today} 
                onChange={(selected) =>
                  handleFilterChange({
                    target: { key: "fromDate", value: selected.target.value },
                  })
                }
              />
            </div>

            {/* To Date */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">To Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="toDate"
                value={filters.toDate}
                min={filters.fromDate || today}
                onChange={(selected) =>
                  handleFilterChange({
                    target: { key: "toDate", value: selected.target.value },
                  })
                }
                disabled={!filters.fromDate}
              />
            </div>
          </>
        )}


        {/* Display By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Display By</label>
          <select
            className="form-select shadow-sm"
            id="displayBy"
            value={filters.displayBy}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "displayBy", value: selected.target.value },
              })
            }
          >
            <option value={""}>--Select--</option>
            <option value={"Daily"}>Daily</option>
            <option value={"Weekly"}>Weekly</option>
            <option value={"Monthly"}>Monthly</option>
            <option value={"Fortnightly"}>Fortnightly</option>
            <option value={"Quarterly"}>Quarterly</option>
            <option value={"Yearly"}>Yearly</option>
          </select>
        </div>
        {/* Reset Button */}
        <div className="col-lg-4 col-md-6">
          <button
            className="btn btn-outline-secondary shadow-sm rounded-pill border-3 fw-bold"
            id="btn-reset"
            onClick={() => resetFunction()}
          >
            Clear Filter
          </button>
          <button
            className="btn btn-info shadow-sm rounded-pill ms-3"
            id="btn-reset"
            onClick={() => saveFilterFunction()}
          >
            Save Filters
          </button>
        </div>



      </div>


      {/* Filtered Data Display */}
      <div className='datatable-container'>
        {/* <h6>Filtered Data:</h6> */}
        {
          //console.log("showData?.rows ", showData?.rows)
        }
        {showData?.rows == undefined || showData?.rows?.length === 0 ? (
          <div className='text-center'>
            <img
              src={noDataImage}
              alt="No records available"
              style={{ width: '250px', height: 'auto', objectFit: 'contain' }}
            />
            <p className='fs-16'>There are no records to display</p>
          </div>
        ) : (
          <div className='table-responsive fixed-table-header'>
            <table
              className="table rdt_Table"
            // className="table table-bordered"
            // style={{
            //   fontSize: "14px",
            //   width: "100%",
            //   overflowX: "auto",
            //   display: "block",
            // }}
            >
              <thead
              // className="rdt_TableHead"
              >
                <tr
                  className="rdt_TableHeadRow"
                >
                  {showData?.columns?.map((col, idx) => (
                    <th className='border-bottom-0' key={idx}
                      style={{ fontSize: "15px", fontWeight: "bold", minWidth: "130px" }}
                    >
                      {getColumnName(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {showData?.rows?.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {showData?.columns?.map((col, colIdx) => (
                      <td key={colIdx} style={{ padding: "10px", }}>
                        {row[col] !== undefined ? row[col] : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )}
      </div>
    </div>
  );

}


function getColumnName(columnKey) {
  const dayMap = {
    staff_id: "Staff",
    customer_id: "Customer",
    client_id: "Client",
    job_id: "Job",
    task_id: "Task",
    total_hours: "Total Hours",
    total_records: "Total Records",
    task_type: "Task Type"
  };

  // ✅ check if columnKey is a date string (yyyy-mm-dd format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(columnKey)) {
    const date = new Date(columnKey); // convert string to Date
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${columnKey} ${days[date.getDay()]} (hrs)`;
  }

  // fallback from map
  return dayMap[columnKey] || columnKey;
}

export default JobCustomReport;
