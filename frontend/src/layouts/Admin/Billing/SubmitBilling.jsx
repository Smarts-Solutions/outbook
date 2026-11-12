import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { getActiveCustomersBilling, getCustomerEngagementDetailsBilling, getClientsByCustomerBilling, getJobsBilling, getServicesBilling, getJobTypesBilling, getServicesByClientBilling, getTimesheetContributorsBilling, submitBillingApi } from '../../../Services/Billing/BillingService';
import { Steps } from 'antd';
const { Step } = Steps;
import { useNavigate, useLocation } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import { Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import sweatalert from "sweetalert2";

export const SubmitBilling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editSubmission || null;
  const [editSubmissionId, setEditSubmissionId] = useState(editData?.id || null);
  const [submitStep, setSubmitStep] = useState(1);

  // Form State
  const [practice, setPractice] = useState(
    editData?.customer_id
      ? {
        value: editData.customer_id,
        label: editData.customer_name || ("Customer #" + editData.customer_id),
      }
      : null
  );
  const [customersList, setCustomersList] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [engagement, setEngagement] = useState("alpha_adhoc");

  // Engagement State
  const [engagementModels, setEngagementModels] = useState([]);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [loadingEngagement, setLoadingEngagement] = useState(false);
  const [customerMeta, setCustomerMeta] = useState(null);
  // Fetch Active Customers based on logged in user role/access
  // Hierarchy States: Customer -> Client -> Job -> Service -> JobType
  // ---------------- Customer Infinite Scroll & Search States ----------------
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");
  const customerDebounceRef = useRef(null);

  // Track previous practice & client to avoid resetting states when going back/forth steps
  const prevPracticeIdRef = useRef(null);
  const prevNetAmountRef = useRef(null);
  const prevEngPracticeIdRef = useRef(null);
  const prevClientIdRef = useRef(null);

  // Function to load customers with pagination & search
  const fetchCustomersPaginated = async ({
    searchValue = "",
    pageNo = 1,
    append = false,
  }) => {
    try {
      setLoadingCustomers(true);
      const staffDetailsStr = localStorage.getItem("staffDetails");
      const staffDetails = staffDetailsStr ? JSON.parse(staffDetailsStr) : null;
      let token = null;
      try {
        const rawToken = localStorage.getItem("token");
        token = rawToken ? JSON.parse(rawToken) : null;
      } catch (e) {
        token = localStorage.getItem("token");
      }
      if (!token && staffDetails) {
        token = staffDetails.login_auth_token;
      }

      const payload = {
        StaffUserId: staffDetails?.id || null,
        search: searchValue,
        page: pageNo,
        limit: 20,
      };

      const res = await getActiveCustomersBilling(payload, token);
      if (res && res.status && Array.isArray(res.data)) {
        const formatted = res.data.map((c) => ({
          value: c.customer_id,
          label: c.trading_name,
          staff_id: c.staff_id,
        }));

        setCustomersList((prev) => {
          const combined = append ? [...prev, ...formatted] : formatted;
          const unique = Array.from(
            new Map(combined.map((item) => [item.value, item])).values()
          );
          return unique;
        });

        setCustomerHasMore(res.data.length === 20);
        setCustomerPage(pageNo);
      } else {
        if (!append) setCustomersList([]);
        setCustomerHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching customers paginated:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerSearch = (value, { action }) => {
    // Only search when user actually types (prevent react-select firing on input-blur or menu-close)
    if (action !== "input-change") return;

    clearTimeout(customerDebounceRef.current);
    customerDebounceRef.current = setTimeout(() => {
      setCustomerSearch(value);
      setCustomerPage(1);
      fetchCustomersPaginated({ searchValue: value, pageNo: 1, append: false });
    }, 400);
  };

  // ---------------- Client Infinite Scroll & Search States ----------------
  const [clientPage, setClientPage] = useState(1);
  const [clientHasMore, setClientHasMore] = useState(true);
  const [clientSearch, setClientSearch] = useState("");
  const clientDebounceRef = useRef(null);

  const fetchClientsPaginated = async ({
    searchValue = "",
    pageNo = 1,
    append = false,
    customerId = null,
  } = {}) => {
    const custId = customerId || practice?.value || editData?.customer_id;
    if (!custId) {
      setClientsList([]);
      return;
    }
    try {
      setLoadingClients(true);
      const payload = {
        customer_id: custId,
        search: searchValue,
        page: pageNo,
        limit: 20,
      };

      const res = await getClientsByCustomerBilling(payload, getAuthToken());
      if (res && res.status && Array.isArray(res.data)) {
        const formatted = res.data.map((c) => ({
          value: c.client_id,
          label: c.trading_name,
          client_id: c.client_id,
          customer_id: c.customer_id,
        }));

        setClientsList((prev) => {
          const combined = append ? [...prev, ...formatted] : formatted;
          // Keep pre-selected client if present in state/editData
          if (editData?.client_id && !combined.some((x) => x.value === editData.client_id)) {
            combined.unshift({
              value: editData.client_id,
              label: editData.client_name || ("Client #" + editData.client_id),
              client_id: editData.client_id,
              customer_id: editData.customer_id,
            });
          }
          const unique = Array.from(
            new Map(combined.map((item) => [item.value, item])).values()
          );
          return unique;
        });

        setClientHasMore(res.data.length === 20);
        setClientPage(pageNo);
      } else {
        if (!append) {
          if (editData?.client_id) {
            setClientsList([
              {
                value: editData.client_id,
                label: editData.client_name || ("Client #" + editData.client_id),
                client_id: editData.client_id,
                customer_id: editData.customer_id,
              },
            ]);
          } else {
            setClientsList([]);
          }
        }
        setClientHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching clients paginated:", err);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleClientSearch = (value, { action }) => {
    // Only search when user actually types (prevent react-select firing on input-blur or menu-close)
    if (action !== "input-change") return;

    clearTimeout(clientDebounceRef.current);
    clientDebounceRef.current = setTimeout(() => {
      setClientSearch(value);
      setClientPage(1);
      fetchClientsPaginated({ searchValue: value, pageNo: 1, append: false });
    }, 400);
  };

  const [clientsList, setClientsList] = useState(
    editData?.client_id
      ? [
        {
          value: editData.client_id,
          label: editData.client_name || ("Client #" + editData.client_id),
          client_id: editData.client_id,
          customer_id: editData.customer_id,
        },
      ]
      : []
  );
  const [selectedClient, setSelectedClient] = useState(
    editData?.client_id
      ? {
        value: editData.client_id,
        label: editData.client_name || ("Client #" + editData.client_id),
        client_id: editData.client_id,
        customer_id: editData.customer_id,
      }
      : null
  );
  const [loadingClients, setLoadingClients] = useState(false);

  const [jobsList, setJobsList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [servicesList, setServicesList] = useState(
    editData?.service_id
      ? [
        {
          value: editData.service_id,
          label: editData.service_name || ("Service #" + editData.service_id),
        },
      ]
      : []
  );
  const [selectedService, setSelectedService] = useState(
    editData?.service_id
      ? {
        value: editData.service_id,
        label: editData.service_name || ("Service #" + editData.service_id),
      }
      : null
  );
  const [loadingServices, setLoadingServices] = useState(false);

  const [jobTypesList, setJobTypesList] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [loadingJobTypes, setLoadingJobTypes] = useState(false);
  useEffect(() => {
    fetchCustomersPaginated({ searchValue: "", pageNo: 1, append: false });
  }, []);
  // Populate form when navigating from Edit button
  useEffect(() => {
    if (!editData) return;
    setEditSubmissionId(editData.id);

    // 1. Practice / Customer
    if (editData.customer_id) {
      setPractice({
        value: editData.customer_id,
        label: editData.customer_name || ("Customer #" + editData.customer_id),
      });
    }

    // 2. Client
    if (editData.client_id) {
      const clientObj = {
        value: editData.client_id,
        label: editData.client_name || ("Client #" + editData.client_id),
        client_id: editData.client_id,
        customer_id: editData.customer_id,
      };
      setSelectedClient(clientObj);
      setClientsList([clientObj]);
      prevClientIdRef.current = editData.client_id;
    }

    // 3. Service
    if (editData.service_id) {
      const serviceObj = {
        value: editData.service_id,
        label: editData.service_name || ("Service #" + editData.service_id),
      };
      setSelectedService(serviceObj);
      setServicesList([serviceObj]);
    }

    // 4. Job
    if (editData.job_id) {
      setSelectedJob({
        value: editData.job_id,
        label: editData.job_name || ("Job #" + editData.job_id),
      });
    }

    // 5. Period
    if (editData.period_type) setPeriodType(editData.period_type);
    if (editData.period_date) setPeriodDate(editData.period_date);

    // 6. Discount & Breakdown from calc_json
    if (editData.discount_pct) setDiscountPct(String(editData.discount_pct));

    let parsedCalc = editData.calc_json;
    if (typeof parsedCalc === 'string') {
      try {
        parsedCalc = JSON.parse(parsedCalc);
      } catch (e) { }
    }

    if (parsedCalc && typeof parsedCalc === 'object') {
      if (parsedCalc.adhoc) {
        if (parsedCalc.adhoc.role) setAdhocRole(parsedCalc.adhoc.role);
        if (parsedCalc.adhoc.hours != null) setAdhocHours(String(parsedCalc.adhoc.hours));
      }
      if (parsedCalc.fte) {
        if (parsedCalc.fte.accountants != null) setFteAccountantQty(String(parsedCalc.fte.accountants));
        if (parsedCalc.fte.bookkeepers != null) setFteBookkeeperQty(String(parsedCalc.fte.bookkeepers));
        if (parsedCalc.fte.payroll != null) setFtePayrollQty(String(parsedCalc.fte.payroll));
        if (parsedCalc.fte.tax != null) setFteTaxQty(String(parsedCalc.fte.tax));
        if (parsedCalc.fte.admin != null) setFteAdminQty(String(parsedCalc.fte.admin));
      }
      if (parsedCalc.percentage && parsedCalc.percentage.base != null) {
        setPercentageBaseAmount(String(parsedCalc.percentage.base));
      }
      if (parsedCalc.customised && parsedCalc.customised.count != null) {
        setCustomJobsCount(String(parsedCalc.customised.count));
      }
    }

    // 7. Contributors
    if (Array.isArray(editData.contributors) && editData.contributors.length > 0) {
      setContributors(
        editData.contributors.map((c, i) => ({
          id: c.id || (Date.now() + i),
          staff_id: c.staff_id,
          name: c.staff_name || c.name || 'Contributor',
          mode: c.amount && !c.pct ? "flat" : "pct",
          pct: c.pct != null ? String(c.pct) : "",
          amount: c.amount != null ? String(c.amount) : "",
        }))
      );
    }
  }, [editData]);


  // Fetch Customer Engagement Models when practice changes
  useEffect(() => {
    if (!practice || !practice.value) {
      prevEngPracticeIdRef.current = null;
      setEngagementModels([]);
      setSelectedEngagement([]);
      setCustomerMeta(null);
      return;
    }

    // Only refetch if the customer actually changed
    if (prevEngPracticeIdRef.current === practice.value) {
      return;
    }

    prevEngPracticeIdRef.current = practice.value;

    const fetchEngagement = async () => {
      try {
        setLoadingEngagement(true);
        const staffDetailsStr = localStorage.getItem("staffDetails");
        const staffDetails = staffDetailsStr ? JSON.parse(staffDetailsStr) : null;
        let token = null;
        try {
          const rawToken = localStorage.getItem("token");
          token = rawToken ? JSON.parse(rawToken) : null;
        } catch (e) {
          token = localStorage.getItem("token");
        }
        if (!token && staffDetails) {
          token = staffDetails.login_auth_token;
        }

        console.log("Fetching engagement for customer:", practice.value);
        const res = await getCustomerEngagementDetailsBilling(
          { customer_id: practice.value, StaffUserId: staffDetails?.id },
          token
        );

        if (res && res.status && res.data) {
          setCustomerMeta(res.data);
          const models = res.data.available_models || [];
          const formatted = models.map((m) => ({
            value: m.model_type,
            label: `${m.label} (${m.model_type})`,
            model: m,
          }));

          console.log("Engagement API Response:", res);
          console.log("Formatted models:", formatted);
          setEngagementModels(formatted);

          // Auto-select model or match editData engagement_model
          if (editData && editData.engagement_model) {
            const editModelNames = String(editData.engagement_model).toLowerCase();
            const matched = formatted.filter(f =>
              editModelNames.includes((f.value || '').toLowerCase()) ||
              editModelNames.includes((f.model?.label || '').toLowerCase())
            );
            if (matched.length > 0) {
              setSelectedEngagement(matched);
            } else if (formatted.length === 1) {
              setSelectedEngagement(formatted[0]);
            } else {
              // If not matched directly by string, default to available models or first
              setSelectedEngagement(formatted);
            }
          } else if (formatted.length === 1) {
            setSelectedEngagement(formatted[0]);
          } else {
            setSelectedEngagement(formatted);
          }
        } else {
          setEngagementModels([]);
          setSelectedEngagement([]);
          setCustomerMeta(null);
        }
      } catch (err) {
        console.error("Error fetching engagement models:", err);
        setEngagementModels([]);
        setSelectedEngagement([]);
      } finally {
        setLoadingEngagement(false);
      }
    };

    fetchEngagement();
  }, [practice]);

  // Helper to get auth token
  const getAuthToken = () => {
    try {
      const raw = localStorage.getItem("token");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return localStorage.getItem("token");
    }
  };

  // Reset Step 3 (Calculations, Hours, Quantities, Contributors)
  const resetStep3States = () => {
    setAdhocHours("");
    setFteAccountantQty("0");
    setFteBookkeeperQty("0");
    setFtePayrollQty("0");
    setFteTaxQty("0");
    setFteAdminQty("0");
    setPercentageBaseAmount("");
    setPercentageBaseAmounts({});
    setCustomJobsCount("");
    setDiscountPct("");
    setContributors([]);
    setTimesheetStaffList([]);
  };

  // Reset Step 2 (Client, Service, Period) & Step 3
  const resetStep2And3States = () => {
    setSelectedClient(null);
    setSelectedService(null);
    setServicesList([]);
    setJobsList([]);
    setSelectedJob(null);
    setJobTypesList([]);
    setSelectedJobType(null);
    setAssignmentName("");
    setPeriodType("Month");
    const defaultM = getTodayMonthValue();
    setRawDateValue(defaultM);
    setPeriodDate(formatPeriodDate("Month", defaultM));
    resetStep3States();
  };

  // 1. Fetch Clients and Reset children when Customer (practice) changes
  useEffect(() => {
    if (!practice || !practice.value) {
      prevPracticeIdRef.current = null;
      setClientsList([]);
      resetStep2And3States();
      return;
    }

    // If customer has not changed, do nothing
    if (prevPracticeIdRef.current === practice.value) {
      return;
    }

    // Check if this is initial editData load
    const isInitialEdit = editData && editData.customer_id === practice.value && !prevPracticeIdRef.current;
    prevPracticeIdRef.current = practice.value;

    if (!isInitialEdit) {
      // User manually picked another customer -> completely reset Step 2 and Step 3
      resetStep2And3States();
    }

    setClientPage(1);
    setClientSearch("");
    setClientHasMore(true);

    fetchClientsPaginated({ customerId: practice.value, searchValue: "", pageNo: 1, append: false });
  }, [practice]);

  // 2. Fetch Services STRICTLY from the Selected Client's existing jobs
  useEffect(() => {
    if (!selectedClient || !selectedClient.value) {
      prevClientIdRef.current = null;
      setServicesList([]);
      setSelectedService(null);
      resetStep3States();
      return;
    }

    // Prevent duplicate calls if client has not changed
    if (prevClientIdRef.current === selectedClient.value) {
      return;
    }

    prevClientIdRef.current = selectedClient.value;
    setSelectedService(null);
    setPeriodType("");
    setPeriodDate("");
    setRawDateValue("");
    resetStep3States();

    // Fetch services strictly belonging to this client's jobs
    const fetchClientServices = async () => {
      try {
        setLoadingServices(true);
        const res = await getServicesByClientBilling(
          { client_id: selectedClient.value },
          getAuthToken()
        );
        if (res && res.status && Array.isArray(res.data)) {
          const formatted = res.data.map((s) => ({
            value: s.service_id,
            label: s.service_name,
            latest_period_type: s.latest_period_type || null,
            latest_period_date: s.latest_period_date || null,
            period_types: Array.isArray(s.period_types) ? s.period_types : [],
            latest_year_end: s.latest_year_end || null,
          }));
          if (editData?.service_id && !formatted.some(s => s.value === editData.service_id)) {
            formatted.unshift({
              value: editData.service_id,
              label: editData.service_name || ("Service #" + editData.service_id),
              period_types: [],
            });
          }
          setServicesList(formatted);

          // Auto-select service and its latest period / date from jobs
          const applyServicePeriods = (srv) => {
            if (!srv) return;
            setSelectedService(srv);
            if (editData?.period_type && editData?.period_date) {
              setPeriodType(editData.period_type);
              setRawDateValue(editData.period_date);
              setPeriodDate(editData.period_date);
            } else if (srv.latest_period_type && srv.latest_period_date) {
              setPeriodType(srv.latest_period_type);
              setRawDateValue(srv.latest_period_date);
              setPeriodDate(srv.latest_period_date);
            }
          };

          if (editData?.service_id) {
            const foundService = formatted.find(s => s.value === editData.service_id);
            if (foundService) {
              applyServicePeriods(foundService);
            }
          } else if (formatted.length === 1) {
            applyServicePeriods(formatted[0]);
          }
        } else {
          if (editData?.service_id) {
            setServicesList([
              {
                value: editData.service_id,
                label: editData.service_name || ("Service #" + editData.service_id),
              },
            ]);
          } else {
            setServicesList([]);
          }
        }
      } catch (err) {
        console.error("Error fetching client services:", err);
        setServicesList([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchClientServices();
  }, [selectedClient]);

  // Format helper for dynamic calendar / period dates
  const formatPeriodDate = (type, val) => {
    if (!val) return "";
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    if (type === "Month") {
      // val is "YYYY-MM"
      const parts = val.split("-");
      if (parts.length === 2) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        return `${months[m] || ""} ${y}`.trim();
      }
      return val;
    }
    if (type === "Week") {
      // val is "YYYY-Www"
      const parts = val.split("-W");
      if (parts.length === 2) {
        return `Week ${parts[1]}, ${parts[0]}`;
      }
      return val;
    }
    if (type === "Quarter") {
      return val;
    }
    if (type === "One-Off" || type === "Year End") {
      // val is "YYYY-MM-DD"
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      }
      return val;
    }
    return val;
  };

  const getTodayMonthValue = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${m}`;
  };

  const getTodayDateValue = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  };

  const getTodayWeekValue = () => {
    const d = new Date();
    const oneJan = new Date(d.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
  };

  // Step 2 Form State
  const [assignmentName, setAssignmentName] = useState("");
  const [workType, setWorkType] = useState("Yearend");
  const [periodType, setPeriodType] = useState(editData?.period_type || "Month");
  const [periodDate, setPeriodDate] = useState(
    editData?.period_date || formatPeriodDate("Month", getTodayMonthValue())
  );
  const [rawDateValue, setRawDateValue] = useState(
    editData?.period_type === "Month" ? getTodayMonthValue() : ""
  );

  // Step 3 Multi-Model Dynamic Form States
  const [submitting, setSubmitting] = useState(false);
  // 1. Adhoc states: Selected role and hours
  const [adhocRole, setAdhocRole] = useState("adhoc_accountants");
  const [adhocHours, setAdhocHours] = useState("");

  // 2. FTE states: Quantity / Count overrides if needed (default from customer agreement)
  const [fteAccountantQty, setFteAccountantQty] = useState("0");
  const [fteBookkeeperQty, setFteBookkeeperQty] = useState("0");
  const [ftePayrollQty, setFtePayrollQty] = useState("0");
  const [fteTaxQty, setFteTaxQty] = useState("0");
  const [fteAdminQty, setFteAdminQty] = useState("0");

  // 3. Percentage Model state: Base amounts for each percentage category
  const [percentageBaseAmounts, setPercentageBaseAmounts] = useState({});
  const [percentageBaseAmount, setPercentageBaseAmount] = useState("");

  // 4. Customised Pricing state: Completed number of jobs
  const [customJobsCount, setCustomJobsCount] = useState("");

  // 5. Discount % state (Optional percentage discount applied on Gross Amount)
  const [discountPct, setDiscountPct] = useState("");

  // Contributors State & Staff Options from Timesheet
  const [contributors, setContributors] = useState([]);
  const [timesheetStaffList, setTimesheetStaffList] = useState([]);
  const [loadingContributors, setLoadingContributors] = useState(false);

  // Fetch timesheet staff when practice, selectedClient or selectedService changes
  useEffect(() => {
    // If editing existing submission and contributors already populated from editData, preserve them
    if (editData && Array.isArray(editData.contributors) && editData.contributors.length > 0) {
      return;
    }

    const fetchTimesheetStaff = async () => {
      if (!practice?.value || !selectedClient?.value) {
        setTimesheetStaffList([]);
        return;
      }

      try {
        setLoadingContributors(true);
        const payload = {
          customer_id: practice.value,
          client_id: selectedClient.value,
          service_id: selectedService?.value || null,
          period_date: periodDate || null,
        };

        const res = await getTimesheetContributorsBilling(payload, getAuthToken());
        if (res && res.status) {
          const list = (res.data && Array.isArray(res.data)) ? res.data : [];
          setTimesheetStaffList(list);

          // By default, add only the first contributor (user can add remaining via "Add contributor")
          if (list.length > 0) {
            const first = list[0];
            const newContributors = [
              {
                id: Date.now(),
                staff_id: first.staff_id,
                name: first.staff_name,
                total_hours: first.total_hours || null,
                mode: null, // "pct" or "flat"
                pct: "",
                amount: "",
              },
            ];

            setContributors(newContributors);
          } else {
            // No staff found for this client & service
            setContributors([]);
          }
        }
      } catch (err) {
        console.error("Error fetching timesheet contributors:", err);
      } finally {
        setLoadingContributors(false);
      }
    };

    fetchTimesheetStaff();
  }, [practice, selectedClient, selectedService, periodDate]);

  const engagementsData = {
    alpha_adhoc: {
      client: "Alpha Retail Ltd (Demo Accountants LLP)",
      serviceLine: "Accounts Finalisation",
      model: "Adhoc",
      manager: "Ravi Manager",
      currency: "GBP",
      rate: 22.0,
      subTitle: "Demo Accountants LLP — Adhoc — Accounts Finalisation",
    },
    peak_fte: {
      client: "Peak Digital Ltd (Acorn Accountancy LLP)",
      serviceLine: "Bookkeeping",
      model: "FTE",
      manager: "David Smith",
      currency: "GBP",
      rate: 1850.0,
      subTitle: "Acorn Accountancy LLP — FTE — Bookkeeping",
    },
    glen_adhoc: {
      client: "Glen View Hotels (Highland Chartered CPAs)",
      serviceLine: "Payroll",
      model: "Adhoc",
      manager: "Sarah Jenkins",
      currency: "GBP",
      rate: 25.0,
      subTitle: "Highland Chartered CPAs — Adhoc — Payroll",
    },
  };

  const selectedEngData = engagementsData[engagement] || engagementsData.alpha_adhoc;

  // Dynamic calculations based on selected engagement model(s)
  const activeEngagementsList = Array.isArray(selectedEngagement)
    ? selectedEngagement
    : selectedEngagement?.model
      ? [selectedEngagement]
      : [];

  // Helper to find model by type
  const getSelectedModelData = (type) => {
    const found = activeEngagementsList.find(
      (m) => m?.model?.model_type === type || m?.value === type
    );
    return found?.model || null;
  };

  const adhocModelData = getSelectedModelData("Adhoc");
  const fteModelData = getSelectedModelData("FTE");
  const percentageModelData = getSelectedModelData("Percentage");
  const customisedModelData = getSelectedModelData("Customised");

  // 1. Adhoc Amount
  const getAdhocHourlyRate = () => {
    if (!adhocModelData?.details) return 0;
    const rateVal = adhocModelData.details[adhocRole];
    return parseFloat(rateVal) || 0;
  };
  const adhocRate = getAdhocHourlyRate();
  const adhocHoursNum = parseFloat(adhocHours) || 0;
  const adhocTotal = adhocHoursNum * adhocRate;

  // 2. FTE Amount
  const calculateFteTotal = () => {
    if (!fteModelData?.details) return 0;
    const d = fteModelData.details;
    const accQty = parseFloat(fteAccountantQty) || 0;
    const accFee = parseFloat(d.fee_per_accountant) || 0;

    const bkQty = parseFloat(fteBookkeeperQty) || 0;
    const bkFee = parseFloat(d.fee_per_bookkeeper) || 0;

    const prQty = parseFloat(ftePayrollQty) || 0;
    const prFee = parseFloat(d.fee_per_payroll_expert) || 0;

    const txQty = parseFloat(fteTaxQty) || 0;
    const txFee = parseFloat(d.fee_per_tax_expert) || 0;

    const adQty = parseFloat(fteAdminQty) || 0;
    const adFee = parseFloat(d.fee_per_admin_staff) || 0;

    return (accQty * accFee) + (bkQty * bkFee) + (prQty * prFee) + (txQty * txFee) + (adQty * adFee);
  };
  const fteTotal = calculateFteTotal();

  // 3. Percentage Amount across all configured fields
  const getPercentageModelFields = () => {
    if (!percentageModelData?.details) return [];
    const d = percentageModelData.details;
    const allDefs = [
      { key: "total_outsourcing", label: "Total Outsourcing" },
      { key: "accountants", label: "Accountants" },
      { key: "bookkeepers", label: "Bookkeepers" },
      { key: "payroll_experts", label: "Payroll Experts" },
      { key: "tax_experts", label: "Tax Experts" },
      { key: "admin_staff", label: "Admin/Other Staff" },
    ];
    // Filter only those fields where percentage value is entered / exists
    return allDefs
      .map((def) => {
        const val = parseFloat(d[def.key]);
        return {
          ...def,
          pct: !isNaN(val) && val > 0 ? val : null,
        };
      })
      .filter((item) => item.pct !== null);
  };

  const percentageFieldsList = getPercentageModelFields();

  const calculatePercentageTotal = () => {
    if (percentageFieldsList.length === 0) return 0;
    return percentageFieldsList.reduce((acc, f) => {
      const baseVal = parseFloat(percentageBaseAmounts[f.key]) || 0;
      return acc + (baseVal * f.pct) / 100;
    }, 0);
  };

  const percentageTotal = calculatePercentageTotal();

  // 4. Customised Pricing Amount (matches selectedService)
  const getCustomPricingDetails = () => {
    if (!customisedModelData?.details || !Array.isArray(customisedModelData.details)) {
      return { costPerJob: 0, maxJobs: 0 };
    }
    let match = null;
    if (selectedService?.value) {
      match = customisedModelData.details.find((c) => String(c.service_id) === String(selectedService.value));
    }
    if (!match) {
      match = customisedModelData.details[0];
    }
    return {
      costPerJob: parseFloat(match?.cost_per_job) || 0,
      maxJobs: parseFloat(match?.minimum_number_of_jobs) || 0,
    };
  };
  const { costPerJob: customCostPerJob, maxJobs: customMaxJobs } = getCustomPricingDetails();
  const customJobsCountNum = parseFloat(customJobsCount) || 0;
  const customTotal = customJobsCountNum * customCostPerJob;

  // Gross Total across all active models
  let grandTotal = 0;
  if (adhocModelData) grandTotal += adhocTotal;
  if (fteModelData) grandTotal += fteTotal;
  if (percentageModelData) grandTotal += percentageTotal;
  if (customisedModelData) grandTotal += customTotal;

  // Gross & Discount calculations
  const grossAmount = grandTotal;
  const discountPctNum = Math.min(100, Math.max(0, parseFloat(discountPct) || 0));
  const discountAmt = (grossAmount * discountPctNum) / 100;
  const netAmount = Math.max(0, grossAmount - discountAmt);

  // Calculate total allocated percentage & amount across all contributors
  // Net Amount is the basis (£ netAmount)
  const computeContributorValues = (c, net) => {
    if (c.mode === "pct" && c.pct !== "") {
      const p = parseFloat(c.pct) || 0;
      const amt = net > 0 ? parseFloat(((net * p) / 100).toFixed(2)) : 0;
      return { pct: p, amount: amt };
    }
    if (c.mode === "flat" && c.amount !== "") {
      const amt = parseFloat(c.amount) || 0;
      const p = net > 0 ? parseFloat(((amt / net) * 100).toFixed(2)) : 0;
      return { pct: p, amount: amt };
    }
    return { pct: 0, amount: 0 };
  };

  // Exact penny-balanced calculation of contributor values
  const getBalancedContributors = (list, net) => {
    if (!list || list.length === 0) return { list: [], totalAmt: 0, totalPct: 0, remAmt: 0, remPct: 0 };

    let totalPct = 0;
    let totalAmt = 0;

    const values = list.map((c) => {
      const v = computeContributorValues(c, net);
      totalPct += v.pct;
      totalAmt += v.amount;
      return { ...c, calculatedPct: v.pct, calculatedAmt: v.amount };
    });

    totalPct = parseFloat(totalPct.toFixed(2));
    totalAmt = parseFloat(totalAmt.toFixed(2));

    // If total percentage is strictly 100%, guarantee sum of amounts exactly equals netAmount (no 1 penny mismatch)
    if (totalPct === 100) {
      totalAmt = net;
    }

    const remAmt = parseFloat(Math.max(0, net - totalAmt).toFixed(2));
    const remPct = parseFloat(Math.max(0, 100 - totalPct).toFixed(2));

    return {
      list: values,
      totalAmt,
      totalPct,
      remAmt,
      remPct,
    };
  };

  const balanced = getBalancedContributors(contributors, netAmount);
  const totalAllocatedPct = balanced.totalPct;
  const totalAllocatedAmt = balanced.totalAmt;
  const remainingAmt = balanced.remAmt;
  const remainingPct = balanced.remPct;

  // Check if exactly 100% and exact net amount is distributed
  // If 100% discount is applied (netAmount === 0), contributor allocation is not required (£0 billable)
  const isFullyAllocated = netAmount === 0
    ? true
    : (totalAllocatedPct === 100 && Math.abs(totalAllocatedAmt - netAmount) < 0.001);

  // Distribute equally across current contributors
  const handleDistributeEqually = () => {
    if (!contributors || contributors.length === 0) return;
    const count = contributors.length;
    const equalPct = parseFloat((100 / count).toFixed(2));

    // Distribute percentages so they sum to exactly 100%
    setContributors(
      contributors.map((c, idx) => {
        let p = equalPct;
        if (idx === count - 1) {
          p = parseFloat((100 - equalPct * (count - 1)).toFixed(2));
        }
        const amt = netAmount > 0 ? parseFloat(((netAmount * p) / 100).toFixed(2)) : 0;
        return {
          ...c,
          mode: "pct",
          pct: String(p),
          amount: amt > 0 ? String(amt) : "",
        };
      })
    );
  };

  // Synchronize contributors when netAmount changes (e.g. hours, rates or discounts change)
  useEffect(() => {
    if (prevNetAmountRef.current === null) {
      prevNetAmountRef.current = netAmount;
      return;
    }
    if (prevNetAmountRef.current === netAmount) {
      return;
    }
    prevNetAmountRef.current = netAmount;

    setContributors((prev) =>
      prev.map((c) => {
        if (c.mode === "pct" && c.pct !== "") {
          const p = parseFloat(c.pct) || 0;
          const amt = netAmount > 0 ? parseFloat(((netAmount * p) / 100).toFixed(2)) : 0;
          return {
            ...c,
            amount: amt > 0 ? String(amt) : "",
          };
        } else if (c.mode === "flat" && c.amount !== "") {
          const amt = parseFloat(c.amount) || 0;
          const p = netAmount > 0 ? parseFloat(((amt / netAmount) * 100).toFixed(2)) : 0;
          return {
            ...c,
            pct: p > 0 ? String(p) : "",
          };
        }
        return c;
      })
    );
  }, [netAmount]);

  const handleAddContributor = () => {
    // Find first staff from timesheet list that is not yet selected in contributors
    const unselected = timesheetStaffList.find(
      (ts) => !contributors.some((c) => String(c.staff_id) === String(ts.staff_id))
    ) || timesheetStaffList[0] || {};

    setContributors([
      ...contributors,
      {
        id: Date.now(),
        staff_id: unselected.staff_id || null,
        name: unselected.staff_name || "",
        total_hours: unselected.total_hours || null,
        mode: null,
        pct: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveContributor = (id) => {
    setContributors(contributors.filter((c) => c.id !== id));
  };

  const handleContributorChange = (id, field, value) => {
    setContributors((prevContribs) => {
      const updated = prevContribs.map((c) => {
        if (c.id !== id) return c;
        if (field === "staff_id") {
          const selectedObj = timesheetStaffList.find((s) => String(s.staff_id) === String(value));
          return {
            ...c,
            staff_id: Number(value),
            name: selectedObj?.staff_name || c.name,
            total_hours: selectedObj?.total_hours || null,
          };
        }

        // Percentage Input Change (Freely editable by user)
        if (field === "pct") {
          if (value === "") {
            return { ...c, mode: null, pct: "", amount: "" };
          }
          let numVal = parseFloat(value);
          if (isNaN(numVal) || numVal < 0) numVal = 0;

          const calculatedAmt = netAmount > 0 ? parseFloat(((netAmount * numVal) / 100).toFixed(2)) : 0;
          return {
            ...c,
            mode: "pct",
            pct: value,
            amount: calculatedAmt > 0 ? String(calculatedAmt) : "",
          };
        }

        // Flat Amount Input Change (Freely editable by user)
        if (field === "amount") {
          if (value === "") {
            return { ...c, mode: null, pct: "", amount: "" };
          }
          let numVal = parseFloat(value);
          if (isNaN(numVal) || numVal < 0) numVal = 0;

          const calculatedPct = netAmount > 0 ? parseFloat(((numVal / netAmount) * 100).toFixed(2)) : 0;
          return {
            ...c,
            mode: "flat",
            amount: value,
            pct: calculatedPct > 0 ? String(calculatedPct) : "",
          };
        }

        return { ...c, [field]: value };
      });

      // Exact Penny Balancing:
      // If the sum of entered percentages is exactly 100%, ensure the sum of amounts exactly equals netAmount
      // by adjusting the rounding difference (e.g. ±£0.01) on the currently edited row or last row
      if (netAmount > 0) {
        let currentTotalPct = 0;
        let currentTotalAmt = 0;
        updated.forEach((c) => {
          const vals = computeContributorValues(c, netAmount);
          currentTotalPct += vals.pct;
          currentTotalAmt += vals.amount;
        });

        currentTotalPct = parseFloat(currentTotalPct.toFixed(2));
        currentTotalAmt = parseFloat(currentTotalAmt.toFixed(2));

        if (Math.abs(currentTotalPct - 100) < 0.001) {
          const diff = parseFloat((netAmount - currentTotalAmt).toFixed(2));
          if (Math.abs(diff) > 0 && Math.abs(diff) <= 0.05) {
            // Find row to adjust penny difference
            const targetIndex = updated.findIndex((c) => c.id === id);
            const adjustIndex = targetIndex >= 0 ? targetIndex : updated.length - 1;
            if (adjustIndex >= 0 && updated[adjustIndex].amount !== "") {
              const adjustedAmt = parseFloat((parseFloat(updated[adjustIndex].amount) + diff).toFixed(2));
              updated[adjustIndex] = {
                ...updated[adjustIndex],
                amount: String(adjustedAmt),
              };
            }
          }
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!practice || !practice.value) {
      sweatalert.fire({
        icon: "warning",
        title: "Customer Required",
        text: "Please select an Accounting Practice / Customer.",
        confirmButtonColor: "#26bdf0",
      });
      return;
    }

    if (!selectedClient || !selectedClient.value) {
      sweatalert.fire({
        icon: "warning",
        title: "Client Required",
        text: "Please select a Client in Step 2.",
        confirmButtonColor: "#26bdf0",
      });
      return;
    }

    if (!selectedService || !selectedService.value) {
      sweatalert.fire({
        icon: "warning",
        title: "Service Required",
        text: "Please select a Service in Step 2.",
        confirmButtonColor: "#26bdf0",
      });
      return;
    }

    if (grandTotal <= 0) {
      sweatalert.fire({
        icon: "warning",
        title: "Billable Amount Required",
        text: "Billable figures must result in an amount greater than £0.00.",
        confirmButtonColor: "#26bdf0",
      });
      return;
    }

    // --- ENGAGEMENT MODEL VALIDATIONS ---

    // 1. FTE Resource Agreement Caps Validation
    if (fteModelData && fteModelData.details) {
      const fteChecks = [
        {
          label: "Accountants",
          val: parseFloat(fteAccountantQty) || 0,
          limit: parseFloat(fteModelData.details.number_of_accountants) || 0,
        },
        {
          label: "Bookkeepers",
          val: parseFloat(fteBookkeeperQty) || 0,
          limit: parseFloat(fteModelData.details.number_of_bookkeepers) || 0,
        },
        {
          label: "Payroll Experts",
          val: parseFloat(ftePayrollQty) || 0,
          limit: parseFloat(fteModelData.details.number_of_payroll_experts) || 0,
        },
        {
          label: "Tax Experts",
          val: parseFloat(fteTaxQty) || 0,
          limit: parseFloat(fteModelData.details.number_of_tax_experts) || 0,
        },
        {
          label: "Admin Staff",
          val: parseFloat(fteAdminQty) || 0,
          limit: parseFloat(fteModelData.details.number_of_admin_staff) || 0,
        },
      ];

      for (const check of fteChecks) {
        if (check.limit > 0 && check.val > check.limit) {
          sweatalert.fire({
            icon: "warning",
            title: "Agreement Limit Exceeded",
            text: `Cannot bill ${check.val} ${check.label}. The customer agreement allows a maximum of ${check.limit} ${check.label}.`,
            confirmButtonColor: "#26bdf0",
          });
          return;
        }
        if (check.val < 0) {
          sweatalert.fire({
            icon: "warning",
            title: "Invalid Quantity",
            text: `${check.label} quantity cannot be negative.`,
            confirmButtonColor: "#26bdf0",
          });
          return;
        }
      }
    }

    // 2. Customised Pricing Max Jobs Validation
    if (customisedModelData) {
      if (customJobsCount !== "" && (!Number.isInteger(Number(customJobsCount)) || Number(customJobsCount) < 0)) {
        sweatalert.fire({
          icon: "warning",
          title: "Invalid Completed Jobs",
          text: "Completed jobs must be a whole positive integer (no decimal points allowed).",
          confirmButtonColor: "#26bdf0",
        });
        return;
      }
      if (customMaxJobs > 0 && customJobsCountNum > customMaxJobs) {
        sweatalert.fire({
          icon: "warning",
          title: "Maximum Jobs Exceeded",
          text: `Completed jobs (${customJobsCountNum}) cannot be greater than the agreed limit of ${customMaxJobs} jobs.`,
          confirmButtonColor: "#26bdf0",
        });
        return;
      }
    }

    // 3. Adhoc Hours Validation
    if (adhocModelData) {
      if (adhocHoursNum < 0) {
        sweatalert.fire({
          icon: "warning",
          title: "Invalid Hours",
          text: "Adhoc hours cannot be negative.",
          confirmButtonColor: "#26bdf0",
        });
        return;
      }
    }

    // 4. Percentage Turnover Validation
    if (percentageModelData) {
      for (const field of percentageFieldsList) {
        const val = parseFloat(percentageBaseAmounts[field.key]) || 0;
        if (val < 0) {
          sweatalert.fire({
            icon: "warning",
            title: "Invalid Base Amount",
            text: `Base value for ${field.label} cannot be negative.`,
            confirmButtonColor: "#26bdf0",
          });
          return;
        }
      }
    }

    if (!isFullyAllocated) {
      sweatalert.fire({
        icon: "warning",
        title: "Revenue Allocation Incomplete",
        text: `Revenue split across contributors must total exactly 100% (£${netAmount.toFixed(2)}). Currently allocated: ${totalAllocatedPct}% (£${totalAllocatedAmt.toFixed(2)}). Remaining: £${remainingAmt.toFixed(2)} (${remainingPct}%).`,
        confirmButtonColor: "#26bdf0",
      });
      return;
    }

    try {
      setSubmitting(true);

      const staffDetailsStr = localStorage.getItem("staffDetails");
      const staffDetails = staffDetailsStr ? JSON.parse(staffDetailsStr) : null;
      let token = null;
      try {
        const rawToken = localStorage.getItem("token");
        token = rawToken ? JSON.parse(rawToken) : null;
      } catch (err) {
        token = localStorage.getItem("token");
      }
      if (!token && staffDetails) {
        token = staffDetails.login_auth_token;
      }

      // Generate clean Nomisma period label e.g. "Sep-26"
      const periodLabel = periodDate?.trim() || "Period";
      const nomismaDescription = `${selectedClient.label} - ${selectedService.label} - ${periodDate}`;

      // Detailed calc json breakdown
      const calcBreakdown = {
        adhoc: adhocModelData ? { role: adhocRole, rate: adhocRate, hours: adhocHoursNum, total: adhocTotal } : null,
        fte: fteModelData ? {
          total: fteTotal,
          accountants: fteAccountantQty !== "" ? parseFloat(fteAccountantQty) || 0 : 0,
          bookkeepers: fteBookkeeperQty !== "" ? parseFloat(fteBookkeeperQty) || 0 : 0,
          payroll: ftePayrollQty !== "" ? parseFloat(ftePayrollQty) || 0 : 0,
          tax: fteTaxQty !== "" ? parseFloat(fteTaxQty) || 0 : 0,
          admin: fteAdminQty !== "" ? parseFloat(fteAdminQty) || 0 : 0,
        } : null,
        percentage: percentageModelData ? {
          items: percentageFieldsList.map((f) => ({
            key: f.key,
            label: f.label,
            pct: f.pct,
            base: parseFloat(percentageBaseAmounts[f.key]) || 0,
            subtotal: ((parseFloat(percentageBaseAmounts[f.key]) || 0) * f.pct) / 100,
          })),
          total: percentageTotal,
        } : null,
        customised: customisedModelData ? { service: selectedService.label, costPerJob: customCostPerJob, count: customJobsCountNum, total: customTotal } : null,
        grossAmount: grossAmount,
        discountPct: discountPctNum,
        discountAmt: discountAmt,
        netAmount: netAmount,
        grandTotal: netAmount,
      };

      const payload = {
        StaffUserId: staffDetails?.id || null,
        edit_submission_id: editSubmissionId || null,
        submission_id: editSubmissionId || null,
        customer_id: practice.value,
        client_id: selectedClient.value,
        service_id: selectedService.value,
        job_id: selectedJob?.value || null,
        period_type: periodType,
        period_date: periodDate,
        period_label: periodLabel,
        engagement_model: activeEngagementsList.map((m) => m?.label || m?.value).join(", "),
        calc_json: calcBreakdown,
        gross_amount: grossAmount,
        discount_pct: discountPctNum,
        discount_amt: discountAmt,
        net_amount: netAmount,
        currency: "GBP",
        nomisma_description: nomismaDescription,
        // Keep existing manager_id if editing an existing submission, or backend will resolve staff's Line Manager
        manager_id: editData?.manager_id || null,
        contributors: contributors.map((c, idx) => {
          const vals = computeContributorValues(c, netAmount);
          // If netAmount is 0 (100% discount), ensure total pct sums to 100% across contributors so backend validation passes
          let defaultPct = vals.pct;
          if (netAmount === 0 && totalAllocatedPct === 0) {
            defaultPct = idx === 0 ? 100 : 0;
          }
          return {
            staff_id: c.staff_id || staffDetails?.id || 1,
            staff_name: c.name,
            pct: parseFloat(defaultPct.toFixed(2)) || 0,
            amount: 0,
          };
        }),
      };

      const res = await submitBillingApi(payload, token);

      if (res && res.status) {
        await sweatalert.fire({
          icon: "success",
          title: editSubmissionId ? "Billing Updated!" : "Billing Submitted!",
          text: editSubmissionId ? `Billing of £${netAmount.toFixed(2)} updated successfully.` : `Billing of £${netAmount.toFixed(2)} submitted successfully. Sent to your Account Manager for approval.`,
          confirmButtonColor: "#26bdf0",
        });
        navigate("/admin/billing/dashboard");
      } else if (res && res.isDuplicate) {
        sweatalert.fire({
          icon: "error",
          title: "Duplicate Billing Attempt",
          text: res.message || "Billing has already been submitted for this client for this period.",
          confirmButtonColor: "#26bdf0",
        });
      } else {
        sweatalert.fire({
          icon: "error",
          title: "Submission Failed",
          text: res?.message || "Something went wrong while submitting billing.",
          confirmButtonColor: "#26bdf0",
        });
      }
    } catch (error) {
      console.error("Error submitting billing:", error);
      sweatalert.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to submit billing.",
        confirmButtonColor: "#26bdf0",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep1Continue = () => {
    if (!practice || !practice.value) {
      sweatalert.fire({
        icon: "warning",
        title: "Customer Required",
        text: "Please select an Accounting Practice / Customer before continuing.",
        confirmButtonColor: "#26bdf0",
      });
      return false;
    }

    const hasEngagement = Array.isArray(selectedEngagement)
      ? selectedEngagement.length > 0
      : Boolean(selectedEngagement?.value);

    if (!hasEngagement) {
      sweatalert.fire({
        icon: "warning",
        title: "Engagement Model Required",
        text: "Please select at least one Engagement Model for this customer before continuing.",
        confirmButtonColor: "#26bdf0",
      });
      return false;
    }

    setSubmitStep(2);
    return true;
  };

  const handleStep2Continue = () => {
    if (!selectedClient || !selectedClient.value) {
      sweatalert.fire({
        icon: "warning",
        title: "Client Required",
        text: "Please select a Client before continuing.",
        confirmButtonColor: "#26bdf0",
      });
      return false;
    }

    if (!selectedService || !selectedService.value) {
      sweatalert.fire({
        icon: "warning",
        title: "Service Required",
        text: "Please select a Service before continuing.",
        confirmButtonColor: "#26bdf0",
      });
      return false;
    }

    if (!periodType) {
      sweatalert.fire({
        icon: "warning",
        title: "Billing Period Required",
        text: "Please select a Billing Period type before continuing.",
        confirmButtonColor: "#26bdf0",
      });
      return false;
    }

    if (!periodDate || !periodDate.trim()) {
      sweatalert.fire({
        icon: "warning",
        title: "Period Date Required",
        text: "Please provide a Period Date before continuing.",
        confirmButtonColor: "#26bdf0",
      });
      return false;
    }

    setSubmitStep(3);
    return true;
  };

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="submit" />

        <div className="report-data mt-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Header Title & Subtitle */}
              <div className="mb-4">
                <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: "20px" }}>
                  Submit billing
                </h4>
                <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                  {selectedEngData.subTitle}
                </p>
              </div>

              {/* Stepper Navigation (Outbooks Antd Steps standard) */}
              <div className="mb-4 pb-2 border-bottom">
                <Steps
                  current={submitStep - 1}
                  onChange={(step) => {
                    const targetStep = step + 1;
                    if (targetStep === submitStep) return;
                    if (targetStep === 1) {
                      setSubmitStep(1);
                      return;
                    }
                    if (targetStep === 2) {
                      if (!practice || !practice.value || (Array.isArray(selectedEngagement) ? selectedEngagement.length === 0 : !selectedEngagement?.value)) {
                        handleStep1Continue();
                        return;
                      }
                      setSubmitStep(2);
                      return;
                    }
                    if (targetStep === 3) {
                      if (!practice || !practice.value || (Array.isArray(selectedEngagement) ? selectedEngagement.length === 0 : !selectedEngagement?.value)) {
                        handleStep1Continue();
                        return;
                      }
                      if (!selectedClient || !selectedClient.value || !selectedService || !selectedService.value || !periodType || !periodDate?.trim()) {
                        handleStep2Continue();
                        return;
                      }
                      setSubmitStep(3);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Step title="Practice & engagement" />
                  <Step title="Assignment & period" />
                  <Step title="Figures, revenue split & submit" />
                </Steps>
              </div>
              {/* ================= STEP 1: Practice & Engagement ================= */}
              {submitStep === 1 && (
                <div>
                  <div className="row g-3 mb-4 align-items-end">
                    {/* 1. Customer Name */}
                    <div className="col-lg-6 col-md-6">
                      <label className="form-label fw-medium">Customer Name</label>
                      <Select
                        isClearable={true}
                        closeMenuOnSelect={true}
                        className="shadow-sm select-staff rounded-pill"
                        isSearchable={true}
                        isLoading={loadingCustomers}
                        options={customersList}
                        value={practice}
                        onChange={(selected) => setPractice(selected)}
                        onInputChange={(val, actionMeta) => handleCustomerSearch(val, actionMeta)}
                        onMenuScrollToBottom={() => {
                          if (customerHasMore && !loadingCustomers) {
                            fetchCustomersPaginated({
                              searchValue: customerSearch,
                              pageNo: customerPage + 1,
                              append: true,
                            });
                          }
                        }}
                        onMenuOpen={() => {
                          if (customersList.length === 0) {
                            fetchCustomersPaginated({ searchValue: "", pageNo: 1, append: false });
                          }
                        }}
                        placeholder="Select..."
                      />
                    </div>

                    {/* 2. Engagement Model */}
                    <div className="col-lg-6 col-md-6">
                      <label className="form-label fw-medium">Engagement Model</label>
                      <Select
                        isMulti={true}
                        isClearable={true}
                        closeMenuOnSelect={false}
                        className="shadow-sm select-staff rounded-pill"
                        isSearchable={true}
                        isLoading={loadingEngagement}
                        isDisabled={!practice || loadingEngagement}
                        options={engagementModels}
                        value={selectedEngagement}
                        onChange={(selected) => setSelectedEngagement(selected || [])}
                        placeholder={
                          !practice
                            ? "Select..."
                            : loadingEngagement
                              ? "Loading..."
                              : engagementModels.length === 0
                                ? "No engagement model"
                                : "Select..."
                        }
                      />
                    </div>
                  </div>



                  {/* Actions Bar for Step 1 */}
                  <div className="d-flex align-items-center justify-content-end pt-4 mt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-info text-white d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-pill shadow-sm"
                      onClick={handleStep1Continue}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: Assignment & Period ================= */}
              {submitStep === 2 && (
                <div>
                  {/* Context Summary Box */}
                  <div className="card bg-light border mb-4">
                    <div className="card-body p-3">
                      <div className="row g-3" style={{ fontSize: "13px" }}>
                        <div className="col-lg-3 col-md-4 col-sm-6">
                          <span className="text-muted d-block mb-1">Customer</span>
                          <span className="fw-bold text-dark fs-6">{practice?.label || selectedEngData.client}</span>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                          <span className="text-muted d-block mb-1">Engagement Model</span>
                          <div className="d-flex flex-wrap gap-1">
                            {Array.isArray(selectedEngagement) && selectedEngagement.length > 0 ? (
                              selectedEngagement.map((m, i) => (
                                <span key={i} className="badge bg-white text-info border px-2 py-1 fw-semibold">
                                  {m.label}
                                </span>
                              ))
                            ) : selectedEngagement?.label ? (
                              <span className="badge bg-white text-info border px-2 py-1 fw-semibold">
                                {selectedEngagement.label}
                              </span>
                            ) : (
                              <span className="badge bg-light text-dark border px-2 py-1">
                                {selectedEngData.model}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <span className="text-muted d-block mb-1">Account Manager</span>
                          <span className="fw-semibold text-dark fs-6">
                            {customerMeta?.account_manager || "—"}
                          </span>
                        </div>

                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <span className="text-muted d-block mb-1">Line Manager</span>
                          <span className="fw-semibold text-dark fs-6">
                            {customerMeta?.line_manager || customerMeta?.account_manager || "—"}
                          </span>
                        </div>

                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <span className="text-muted d-block mb-1">Currency</span>
                          <span className="fw-semibold text-dark fs-6">{selectedEngData.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form fields: Client Name & Service Type (from client's jobs) */}
                  <div className="row g-4 mb-4">
                    {/* Client Name Dropdown */}
                    <div className="col-lg-6 col-md-6">
                      <label className="form-label text-muted small mb-1 fw-medium">
                        Client Name
                      </label>
                      <Select
                        isClearable={true}
                        closeMenuOnSelect={true}
                        className="shadow-sm select-staff rounded-pill"
                        isSearchable={true}
                        isLoading={loadingClients}
                        isDisabled={!practice}
                        options={clientsList}
                        value={selectedClient}
                        onChange={(selected) => {
                          setSelectedClient(selected);
                          setSelectedService(null);
                          resetStep3States();
                        }}
                        onInputChange={(val, actionMeta) => handleClientSearch(val, actionMeta)}
                        onMenuScrollToBottom={() => {
                          if (clientHasMore && !loadingClients) {
                            fetchClientsPaginated({
                              searchValue: clientSearch,
                              pageNo: clientPage + 1,
                              append: true,
                            });
                          }
                        }}
                        onMenuOpen={() => {
                          // Only fetch if not already loaded
                          if (clientsList.length === 0 && practice) {
                            fetchClientsPaginated({ searchValue: "", pageNo: 1, append: false });
                          }
                        }}
                        placeholder={
                          !practice
                            ? "Select a customer first..."
                            : loadingClients && clientsList.length === 0
                              ? "Loading clients..."
                              : clientsList.length === 0
                                ? "No clients found for this customer"
                                : "Select Client..."
                        }
                      />
                    </div>

                    {/* Services Dropdown (populated from client's jobs) */}
                    <div className="col-lg-6 col-md-6">
                      <label className="form-label text-muted small mb-1 fw-medium">
                        Service
                      </label>
                      <Select
                        isClearable={true}
                        closeMenuOnSelect={true}
                        className="shadow-sm select-staff rounded-pill"
                        isSearchable={true}
                        isLoading={loadingServices}
                        isDisabled={!selectedClient || loadingServices}
                        options={servicesList}
                        value={selectedService}
                        onChange={(selected) => {
                          setSelectedService(selected);
                          resetStep3States();
                          if (selected?.latest_period_type && selected?.latest_period_date) {
                            setPeriodType(selected.latest_period_type);
                            setRawDateValue(selected.latest_period_date);
                            setPeriodDate(selected.latest_period_date);
                          } else if (selected?.latest_year_end) {
                            setPeriodType("Year End");
                            setRawDateValue(selected.latest_year_end);
                            setPeriodDate(formatPeriodDate("Year End", selected.latest_year_end));
                          }
                        }}
                        placeholder={
                          !selectedClient
                            ? "Select client first..."
                            : loadingServices
                              ? "Loading services..."
                              : servicesList.length === 0
                                ? "No services found"
                                : "Select Service..."
                        }
                      />
                    </div>
                  </div>

                  {/* Billing Period row */}
                  {(() => {
                    const isServiceSelected = Boolean(selectedService && selectedService.value);
                    const availablePeriodTypes = selectedService?.period_types && selectedService.period_types.length > 0
                      ? selectedService.period_types
                      : [];
                    const currentTypeObj = availablePeriodTypes.find((pt) => pt.type === periodType);
                    const availableDates = currentTypeObj ? currentTypeObj.dates : [];
                    const hasJobPeriods = availablePeriodTypes.length > 0;

                    return (
                      <div className="row g-4 mb-4">
                        {/* 1. Billing Period Dropdown */}
                        <div className="col-lg-6 col-md-6">
                          <label className="form-label text-muted small mb-1 fw-medium">
                            Billing Period
                          </label>
                          <select
                            className="form-select shadow-sm rounded-pill"
                            disabled={!isServiceSelected || !hasJobPeriods}
                            value={periodType || ""}
                            onChange={(e) => {
                              const newType = e.target.value;
                              setPeriodType(newType);
                              const foundTypeObj = availablePeriodTypes.find((pt) => pt.type === newType);
                              if (foundTypeObj && foundTypeObj.dates && foundTypeObj.dates.length > 0) {
                                const firstVal = foundTypeObj.dates[0];
                                setRawDateValue(firstVal);
                                setPeriodDate(firstVal);
                              } else {
                                setRawDateValue("");
                                setPeriodDate("");
                              }
                            }}
                          >
                            {!isServiceSelected ? (
                              <option value="">Please select a service first</option>
                            ) : !hasJobPeriods ? (
                              <option value="">No Billing Period Found</option>
                            ) : (
                              availablePeriodTypes.map((pt) => (
                                <option key={pt.type} value={pt.type}>
                                  {pt.type}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        {/* 2. Period Date / Values Dropdown (Always Dropdown, Non-editable) */}
                        <div className="col-lg-6 col-md-6">
                          <label className="form-label text-muted small mb-1 fw-medium">
                            Period Date {periodDate ? `(${periodDate})` : ""}
                          </label>
                          <select
                            className="form-select shadow-sm rounded-pill"
                            disabled={!isServiceSelected || !hasJobPeriods || availableDates.length === 0}
                            value={periodDate || ""}
                            onChange={(e) => {
                              setPeriodDate(e.target.value);
                              setRawDateValue(e.target.value);
                            }}
                          >
                            {!isServiceSelected ? (
                              <option value="">Please select a service first</option>
                            ) : availableDates.length === 0 ? (
                              <option value="">No dates available</option>
                            ) : (
                              availableDates.map((dVal) => (
                                <option key={dVal} value={dVal}>
                                  {dVal}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Actions Bar for Step 2 */}
                  <div className="d-flex align-items-center justify-content-between pt-4 mt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 fw-medium rounded-pill shadow-sm"
                      onClick={() => setSubmitStep(1)}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-info text-white d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-pill shadow-sm"
                      onClick={handleStep2Continue}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: Figures, Revenue Split & Submit ================= */}
              {submitStep === 3 && (
                <div>
                  {/* Dynamic Engagement Model Figures Cards */}
                  <div className="mb-4">
                    {/* --- Model 1: Adhoc / PAYG / Hourly --- */}
                    {adhocModelData && (
                      <div className="card border shadow-sm mb-4">
                        <div
                          className="card-header py-2 px-3 d-flex justify-content-between align-items-center"
                          style={{ backgroundColor: "#eaf3fa", borderBottom: "1px solid #d2e4f3" }}
                        >
                          <span className="fw-semibold text-dark">
                            Adhoc / PAYG / Hourly — Figures
                          </span>
                          <span className="badge bg-white text-info border">Adhoc Model</span>
                        </div>
                        <div className="card-body p-3">
                          <div className="row g-3">
                            <div className="col-md-5">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Select Role
                              </label>
                              <select
                                className="form-select shadow-sm rounded-pill"
                                value={adhocRole}
                                onChange={(e) => setAdhocRole(e.target.value)}
                              >
                                {adhocModelData.details.adhoc_accountants && (
                                  <option value="adhoc_accountants">
                                    Accountants (£{parseFloat(adhocModelData.details.adhoc_accountants).toFixed(2)}/hr)
                                  </option>
                                )}
                                {adhocModelData.details.adhoc_bookkeepers && (
                                  <option value="adhoc_bookkeepers">
                                    Bookkeepers (£{parseFloat(adhocModelData.details.adhoc_bookkeepers).toFixed(2)}/hr)
                                  </option>
                                )}
                                {adhocModelData.details.adhoc_payroll_experts && (
                                  <option value="adhoc_payroll_experts">
                                    Payroll Experts (£{parseFloat(adhocModelData.details.adhoc_payroll_experts).toFixed(2)}/hr)
                                  </option>
                                )}
                                {adhocModelData.details.adhoc_tax_experts && (
                                  <option value="adhoc_tax_experts">
                                    Tax Experts (£{parseFloat(adhocModelData.details.adhoc_tax_experts).toFixed(2)}/hr)
                                  </option>
                                )}
                                {adhocModelData.details.adhoc_admin_staff && (
                                  <option value="adhoc_admin_staff">
                                    Admin/Other Staff (£{parseFloat(adhocModelData.details.adhoc_admin_staff).toFixed(2)}/hr)
                                  </option>
                                )}
                              </select>
                            </div>

                            <div className="col-md-3">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Number of Hours
                              </label>
                              <input
                                type="number" onWheel={(e) => e.target.blur()}
                                min="0"
                                step="0.5"
                                className="form-control shadow-sm rounded-pill"
                                placeholder="e.g. 15"
                                value={adhocHours}
                                onChange={(e) => setAdhocHours(e.target.value)}
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Adhoc Subtotal
                              </label>
                              <input
                                type="text"
                                className="form-control bg-light fw-bold text-info"
                                readOnly
                                value={`£ ${adhocTotal.toFixed(2)}`}
                                style={{ borderRadius: "50px" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- Model 2: FTE / Dedicated Staffing --- */}
                    {fteModelData && (
                      <div className="card border shadow-sm mb-4">
                        <div
                          className="card-header py-2 px-3 d-flex justify-content-between align-items-center"
                          style={{ backgroundColor: "#eaf3fa", borderBottom: "1px solid #d2e4f3" }}
                        >
                          <span className="fw-semibold text-dark">
                            FTE / Dedicated Staffing — Resource Breakdown
                          </span>
                          <span className="badge bg-white text-info border">FTE Model</span>
                        </div>
                        <div className="card-body p-3">
                          <div className="table-responsive">
                            <table className="table table-bordered table-sm mb-2 align-middle">
                              <thead className="table-light">
                                <tr>
                                  <th>Role</th>
                                  <th style={{ width: "130px" }}>Agreement Qty</th>
                                  <th style={{ width: "150px" }}>Fee Per Resource</th>
                                  <th style={{ width: "150px" }}>Billable Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fteModelData.details.number_of_accountants > 0 && (
                                  <tr>
                                    <td>
                                      Accountants
                                      <div className="small text-muted" style={{ fontSize: "11px" }}>
                                        Max agreed: {fteModelData.details.number_of_accountants}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        max={fteModelData.details.number_of_accountants}
                                        className={`form-control form-control-sm text-center ${(parseFloat(fteAccountantQty) || 0) > parseFloat(fteModelData.details.number_of_accountants) ? "is-invalid border-danger text-danger fw-bold" : ""
                                          }`}
                                        value={fteAccountantQty}
                                        onChange={(e) => setFteAccountantQty(e.target.value)}
                                      />
                                      {(parseFloat(fteAccountantQty) || 0) > parseFloat(fteModelData.details.number_of_accountants) && (
                                        <div className="text-danger small mt-1" style={{ fontSize: "11px" }}>
                                          Exceeds max ({fteModelData.details.number_of_accountants})
                                        </div>
                                      )}
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_accountant || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((parseFloat(fteAccountantQty) || 0) * (parseFloat(fteModelData.details.fee_per_accountant) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_bookkeepers > 0 && (
                                  <tr>
                                    <td>
                                      Bookkeepers
                                      <div className="small text-muted" style={{ fontSize: "11px" }}>
                                        Max agreed: {fteModelData.details.number_of_bookkeepers}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        max={fteModelData.details.number_of_bookkeepers}
                                        className={`form-control form-control-sm text-center ${(parseFloat(fteBookkeeperQty) || 0) > parseFloat(fteModelData.details.number_of_bookkeepers) ? "is-invalid border-danger text-danger fw-bold" : ""
                                          }`}
                                        value={fteBookkeeperQty}
                                        onChange={(e) => setFteBookkeeperQty(e.target.value)}
                                      />
                                      {(parseFloat(fteBookkeeperQty) || 0) > parseFloat(fteModelData.details.number_of_bookkeepers) && (
                                        <div className="text-danger small mt-1" style={{ fontSize: "11px" }}>
                                          Exceeds max ({fteModelData.details.number_of_bookkeepers})
                                        </div>
                                      )}
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_bookkeeper || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((parseFloat(fteBookkeeperQty) || 0) * (parseFloat(fteModelData.details.fee_per_bookkeeper) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_payroll_experts > 0 && (
                                  <tr>
                                    <td>
                                      Payroll Experts
                                      <div className="small text-muted" style={{ fontSize: "11px" }}>
                                        Max agreed: {fteModelData.details.number_of_payroll_experts}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        max={fteModelData.details.number_of_payroll_experts}
                                        className={`form-control form-control-sm text-center ${(parseFloat(ftePayrollQty) || 0) > parseFloat(fteModelData.details.number_of_payroll_experts) ? "is-invalid border-danger text-danger fw-bold" : ""
                                          }`}
                                        value={ftePayrollQty}
                                        onChange={(e) => setFtePayrollQty(e.target.value)}
                                      />
                                      {(parseFloat(ftePayrollQty) || 0) > parseFloat(fteModelData.details.number_of_payroll_experts) && (
                                        <div className="text-danger small mt-1" style={{ fontSize: "11px" }}>
                                          Exceeds max ({fteModelData.details.number_of_payroll_experts})
                                        </div>
                                      )}
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_payroll_expert || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((parseFloat(ftePayrollQty) || 0) * (parseFloat(fteModelData.details.fee_per_payroll_expert) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_tax_experts > 0 && (
                                  <tr>
                                    <td>
                                      Tax Experts
                                      <div className="small text-muted" style={{ fontSize: "11px" }}>
                                        Max agreed: {fteModelData.details.number_of_tax_experts}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        max={fteModelData.details.number_of_tax_experts}
                                        className={`form-control form-control-sm text-center ${(parseFloat(fteTaxQty) || 0) > parseFloat(fteModelData.details.number_of_tax_experts) ? "is-invalid border-danger text-danger fw-bold" : ""
                                          }`}
                                        value={fteTaxQty}
                                        onChange={(e) => setFteTaxQty(e.target.value)}
                                      />
                                      {(parseFloat(fteTaxQty) || 0) > parseFloat(fteModelData.details.number_of_tax_experts) && (
                                        <div className="text-danger small mt-1" style={{ fontSize: "11px" }}>
                                          Exceeds max ({fteModelData.details.number_of_tax_experts})
                                        </div>
                                      )}
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_tax_expert || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((parseFloat(fteTaxQty) || 0) * (parseFloat(fteModelData.details.fee_per_tax_expert) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_admin_staff > 0 && (
                                  <tr>
                                    <td>
                                      Admin Staff
                                      <div className="small text-muted" style={{ fontSize: "11px" }}>
                                        Max agreed: {fteModelData.details.number_of_admin_staff}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        max={fteModelData.details.number_of_admin_staff}
                                        className={`form-control form-control-sm text-center ${(parseFloat(fteAdminQty) || 0) > parseFloat(fteModelData.details.number_of_admin_staff) ? "is-invalid border-danger text-danger fw-bold" : ""
                                          }`}
                                        value={fteAdminQty}
                                        onChange={(e) => setFteAdminQty(e.target.value)}
                                      />
                                      {(parseFloat(fteAdminQty) || 0) > parseFloat(fteModelData.details.number_of_admin_staff) && (
                                        <div className="text-danger small mt-1" style={{ fontSize: "11px" }}>
                                          Exceeds max ({fteModelData.details.number_of_admin_staff})
                                        </div>
                                      )}
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_admin_staff || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((parseFloat(fteAdminQty) || 0) * (parseFloat(fteModelData.details.fee_per_admin_staff) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="d-flex justify-content-end align-items-center gap-2 pt-2">
                            <span className="text-muted fw-medium">FTE Subtotal:</span>
                            <span className="fs-6 fw-bold text-info">£ {fteTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- Model 3: Percentage Model --- */}
                    {percentageModelData && (
                      <div className="card border shadow-sm mb-4">
                        <div
                          className="card-header py-2 px-3 d-flex justify-content-between align-items-center"
                          style={{ backgroundColor: "#eaf3fa", borderBottom: "1px solid #d2e4f3" }}
                        >
                          <span className="fw-semibold text-dark">
                            Percentage Model — Breakdown
                          </span>
                          <span className="badge bg-white text-info border">Percentage Model</span>
                        </div>
                        <div className="card-body p-3">
                          {percentageFieldsList.length === 0 ? (
                            <div className="text-muted small py-2">
                              No percentage figures defined in customer agreement.
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-bordered table-sm mb-2 align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Role / Category</th>
                                    <th style={{ width: "130px" }} className="text-center">Agreed %</th>
                                    <th style={{ width: "220px" }}>Base Value (£)</th>
                                    <th style={{ width: "150px" }}>Billable Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {percentageFieldsList.map((f) => {
                                    const baseVal = percentageBaseAmounts[f.key] || "";
                                    const baseNum = parseFloat(baseVal) || 0;
                                    const rowSubtotal = (baseNum * f.pct) / 100;
                                    return (
                                      <tr key={f.key}>
                                        <td className="fw-medium text-dark">{f.label}</td>
                                        <td className="text-center">
                                          <span className="badge bg-light text-primary border px-3 py-1 fw-bold fs-12">
                                            {f.pct}%
                                          </span>
                                        </td>
                                        <td>
                                          <div className="input-group input-group-sm">
                                            <span className="input-group-text py-0 px-2 bg-light text-muted">£</span>
                                            <input
                                              type="number"
                                              min="0"
                                              step="any"
                                              onWheel={(e) => e.target.blur()}
                                              className="form-control form-control-sm"
                                              placeholder="e.g. 10000"
                                              value={baseVal}
                                              onChange={(e) =>
                                                setPercentageBaseAmounts({
                                                  ...percentageBaseAmounts,
                                                  [f.key]: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td className="fw-bold text-dark">
                                          £ {rowSubtotal.toFixed(2)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                          <div className="d-flex justify-content-end align-items-center gap-2 pt-2">
                            <span className="text-muted fw-medium">Percentage Subtotal:</span>
                            <span className="fs-6 fw-bold text-info">£ {percentageTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- Model 4: Customised Pricing --- */}
                    {customisedModelData && (
                      <div className="card border shadow-sm mb-4">
                        <div
                          className="card-header py-2 px-3 d-flex justify-content-between align-items-center"
                          style={{ backgroundColor: "#eaf3fa", borderBottom: "1px solid #d2e4f3" }}
                        >
                          <span className="fw-semibold text-dark">
                            Customised Pricing — Figures
                          </span>
                          <span className="badge bg-white text-info border">Customised Model</span>
                        </div>
                        <div className="card-body p-3">
                          <div className="row g-3 align-items-end">
                            <div className="col-md-4">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Selected Service
                              </label>
                              <input
                                type="text"
                                className="form-control bg-light fw-semibold"
                                readOnly
                                value={selectedService?.label || "Service"}
                                style={{ borderRadius: "50px" }}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Cost Per Job
                              </label>
                              <input
                                type="text"
                                className="form-control bg-light fw-bold"
                                readOnly
                                value={`£ ${customCostPerJob.toFixed(2)}`}
                                style={{ borderRadius: "50px" }}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Completed Jobs {customMaxJobs > 0 && <span className="text-secondary">(Max: {customMaxJobs})</span>}
                              </label>
                              <input
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                min="0"
                                step="1"
                                max={customMaxJobs > 0 ? customMaxJobs : undefined}
                                className={`form-control shadow-sm rounded-pill ${customJobsCount !== "" && customMaxJobs > 0 && customJobsCountNum > customMaxJobs ? "is-invalid border-danger text-danger fw-bold" : ""
                                  }`}
                                placeholder={customMaxJobs > 0 ? `Max: ${customMaxJobs}` : "e.g. 5"}
                                value={customJobsCount}
                                onKeyDown={(e) => {
                                  // Disallow decimal point, e, +, -
                                  if (e.key === "." || e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                  }
                                }}
                                onChange={(e) => {
                                  // Clean input strictly to digits only
                                  const cleanVal = e.target.value.replace(/[^0-9]/g, "");
                                  setCustomJobsCount(cleanVal);
                                }}
                              />
                              {customJobsCount !== "" && customMaxJobs > 0 && customJobsCountNum > customMaxJobs && (
                                <div className="text-danger small mt-1" style={{ fontSize: "11px" }}>
                                  Maximum {customMaxJobs} allowed
                                </div>
                              )}
                            </div>
                            <div className="col-md-3">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Custom Subtotal
                              </label>
                              <input
                                type="text"
                                className="form-control bg-light fw-bold text-info"
                                readOnly
                                value={`£ ${customTotal.toFixed(2)}`}
                                style={{ borderRadius: "50px" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- Discount % Input (Placed Above Grand Total) --- */}
                    <div className="card border shadow-sm mb-4">
                      <div
                        className="card-header py-2 px-3 d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: "#eaf3fa", borderBottom: "1px solid #d2e4f3" }}
                      >
                        <span className="fw-semibold text-dark">
                          Discount (Optional)
                        </span>
                        <span className="badge bg-white text-info border">
                          Percentage Discount
                        </span>
                      </div>
                      <div className="card-body p-3">
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label text-muted small mb-1 fw-medium">
                              Discount % (Optional)
                            </label>
                            <div className="position-relative">
                              <input
                                type="number" onWheel={(e) => e.target.blur()}
                                min="0"
                                step="any"
                                className="form-control shadow-sm rounded-pill pe-4"
                                placeholder="e.g. 10"
                                value={discountPct}
                                onChange={(e) => setDiscountPct(e.target.value)}
                              />
                              <span
                                className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted fw-bold"
                                style={{ zIndex: 5, pointerEvents: "none" }}
                              >
                                %
                              </span>
                            </div>
                            <div style={{ minHeight: "18px", marginTop: "4px" }}>
                              {discountPctNum > 0 && (
                                <small className="text-muted d-block" style={{ fontSize: "11.5px" }}>
                                  {discountPctNum}% of £{grossAmount.toFixed(2)} ={" "}
                                  <strong className="text-danger">- £{discountAmt.toFixed(2)}</strong>
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label text-muted small mb-1 fw-medium">
                              Gross Amount
                            </label>
                            <input
                              type="text"
                              className="form-control bg-light text-dark fw-bold rounded-pill"
                              readOnly
                              value={`£ ${grossAmount.toFixed(2)}`}
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label text-muted small mb-1 fw-medium">
                              Discount Amount
                            </label>
                            <input
                              type="text"
                              className={`form-control bg-light fw-bold rounded-pill ${discountAmt > 0 ? "text-danger" : "text-muted"
                                }`}
                              readOnly
                              value={
                                discountAmt > 0
                                  ? `- £ ${discountAmt.toFixed(2)}`
                                  : "£ 0.00"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* --- Grand Total Calculation Summary Banner --- */}
                    <div
                      className="card border shadow-sm p-3 mb-4"
                      style={{ backgroundColor: "#fafbfc", borderLeft: "5px solid #26bdf0" }}
                    >
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                          <span className="small text-muted d-block">
                            Nomisma Description Line:
                          </span>
                          <span className="fw-semibold text-dark">
                            {selectedClient?.label || "Client"} - {selectedService?.label || "Service"} - {periodDate}
                          </span>
                          {discountPctNum > 0 && (
                            <span
                              className="badge ms-2"
                              style={{
                                backgroundColor: "#ffebe9",
                                color: "#df2c2c",
                                border: "1px solid #ffd1cd",
                                fontSize: "11.5px",
                                fontWeight: "600",
                              }}
                            >
                              {discountPctNum}% Discount Applied (-£{discountAmt.toFixed(2)})
                            </span>
                          )}
                        </div>
                        <div className="text-end">
                          <span className="text-muted small d-block">Grand Total Net Billable</span>
                          <span className="fs-4 fw-bold text-info">
                            £ {netAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Split Section */}
                  <div className="card border mb-4">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                          <h6 className="fw-bold text-dark mb-0">
                            Revenue split — who worked on this?
                          </h6>
                          <small className="text-muted" style={{ fontSize: "12px" }}>
                            Assigned staff (Reviewer, Allocated To, Allocated To Other) and staff who logged timesheet
                          </small>
                        </div>
                        {contributors.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary fw-medium rounded-pill px-3 shadow-sm"
                            onClick={handleDistributeEqually}
                            title="Distribute 100% equally among all selected contributors"
                          >
                            ⚡ Distribute Equally
                          </button>
                        )}
                      </div>

                      <div className="row g-2 mb-2 text-muted small fw-medium">
                        <div className="col-5">Contributor</div>
                        <div className="col-3 text-center">% Share</div>
                        <div className="col-3 text-center">Flat Amount (£)</div>
                        <div className="col-1"></div>
                      </div>

                      {loadingContributors ? (
                        <div className="py-2 text-center text-muted small">
                          <span className="spinner-border spinner-border-sm me-2 text-info" role="status" />
                          Checking assigned staff and timesheets for this customer, client & service...
                        </div>
                      ) : contributors.length === 0 ? (
                        <div className="py-3 px-3 text-center bg-light rounded text-muted small border mb-2">
                          <span className="fw-semibold text-secondary">No assigned staff or timesheet entries found</span> for this client & service.
                        </div>
                      ) : (
                        contributors.map((c) => (
                          <div key={c.id} className="row g-2 align-items-center mb-2">
                            {/* Contributor Name (Fixed label, no focus, no click) */}
                            <div className="col-5">
                              <input
                                type="text"
                                className="form-control form-control-sm bg-light fw-medium text-dark"
                                readOnly
                                tabIndex={-1}
                                style={{ pointerEvents: "none", userSelect: "none" }}
                                value={c.name || "Staff"}
                              />
                            </div>

                            {/* Percentage Share Input */}
                            <div className="col-3">
                              <div className="input-group input-group-sm">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="any"
                                  onWheel={(e) => e.target.blur()}
                                  className={`form-control form-control-sm text-end ${c.mode === "flat" ? "bg-light text-muted" : ""}`}
                                  value={c.mode === "flat" ? (c.amount !== "" && netAmount > 0 ? String(parseFloat(((parseFloat(c.amount) / netAmount) * 100).toFixed(2))) : "") : c.pct}
                                  placeholder="0"
                                  disabled={c.mode === "flat"}
                                  title={c.mode === "flat" ? "Calculated from Flat Amount. Clear Flat to enter %." : "Enter percentage share"}
                                  onChange={(e) =>
                                    handleContributorChange(c.id, "pct", e.target.value)
                                  }
                                />
                                <span className="input-group-text py-0 px-2">%</span>
                              </div>
                            </div>

                            {/* Flat Amount Input */}
                            <div className="col-3">
                              <div className="input-group input-group-sm">
                                <span className="input-group-text py-0 px-2">£</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  onWheel={(e) => e.target.blur()}
                                  className={`form-control form-control-sm text-end ${c.mode === "pct" ? "bg-light text-muted" : ""}`}
                                  value={c.mode === "pct" ? (c.pct !== "" && netAmount > 0 ? String(parseFloat(((netAmount * parseFloat(c.pct)) / 100).toFixed(2))) : "") : c.amount}
                                  placeholder="0.00"
                                  disabled={c.mode === "pct"}
                                  title={c.mode === "pct" ? "Calculated from % Share. Clear % to enter Flat £." : "Enter flat amount in £"}
                                  onChange={(e) =>
                                    handleContributorChange(c.id, "amount", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            {/* Remove Contributor Button */}
                            <div className="col-1 text-center">
                              {contributors.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-link text-danger p-0"
                                  onClick={() => handleRemoveContributor(c.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      <div className="mt-2 d-flex justify-content-between align-items-center">
                        {(contributors.length < timesheetStaffList.length) && (
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm fw-semibold"
                            onClick={handleAddContributor}
                          >
                            <Plus size={14} className="me-1" /> Add contributor
                          </button>
                        )}

                        {/* Remaining / Over-allocated indicator */}
                        {netAmount > 0 && (
                          <span style={{ fontSize: "14px" }}>
                            {totalAllocatedPct > 100 ? (
                              <span className="text-danger fw-bold">
                                ⚠ Over-allocated by: £{(totalAllocatedAmt - netAmount).toFixed(2)} ({(totalAllocatedPct - 100).toFixed(2)}%)
                              </span>
                            ) : (
                              <span className="text-muted fw-medium">
                                Remaining:{" "}
                                <strong
                                  style={{ fontSize: "15px" }}
                                  className={isFullyAllocated ? "text-success" : "text-danger"}
                                >
                                  £{remainingAmt.toFixed(2)} ({remainingPct}%)
                                </strong>
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className="text-muted fw-semibold" style={{ fontSize: "14px" }}>
                          Total Allocated:
                        </span>
                        <span
                          className={`fw-bold ${isFullyAllocated ? "text-success" : "text-danger"
                            }`}
                          style={{ fontSize: "15px" }}
                        >
                          £{totalAllocatedAmt.toFixed(2)} of £{netAmount.toFixed(2)} ({totalAllocatedPct}% {isFullyAllocated ? "✓" : totalAllocatedPct > 100 ? "⚠ Exceeds 100% — must be 100%" : "— must be 100%"})
                        </span>
                      </div>
                      {totalAllocatedPct > 100 && (
                        <div className="alert alert-danger py-1 px-2 mt-2 mb-0 small text-center fw-medium">
                          Total allocation exceeds 100%. Please adjust percentages or flat amounts before submitting.
                        </div>
                      )}
                      {totalAllocatedPct < 100 && netAmount > 0 && totalAllocatedPct > 0 && (
                        <div className="alert alert-warning py-1 px-2 mt-2 mb-0 small text-center fw-medium">
                          Revenue allocation incomplete ({totalAllocatedPct}% of 100%). Remaining {remainingPct}% (£{remainingAmt.toFixed(2)}) must be allocated.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Helper / Validation warning */}
                  {grandTotal <= 0 && (
                    <p className="text-muted small mb-2">
                      To continue: Billable figures must result in an amount greater than £0.00.
                    </p>
                  )}

                  {/* Approval info callout */}
                  <div
                    className="p-3 mb-4 rounded"
                    style={{
                      backgroundColor: "#f0f9ff",
                      borderLeft: "4px solid #26bdf0",
                      fontSize: "13px",
                    }}
                  >
                    On submit, this goes to <strong>{customerMeta?.account_manager || customerMeta?.line_manager || "Account Manager"}</strong> for approval,
                    then to Credit Control.
                  </div>

                  {/* Bottom Actions for Step 3 */}
                  <div className="d-flex align-items-center justify-content-between pt-4 mt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 fw-medium rounded-pill shadow-sm"
                      onClick={() => setSubmitStep(2)}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-info text-white px-4 py-2 fw-semibold rounded-pill shadow-sm"
                      disabled={grandTotal <= 0 || !isFullyAllocated || submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? "Saving..." : editSubmissionId ? "Update Billing" : "Submit for approval"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitBilling;
