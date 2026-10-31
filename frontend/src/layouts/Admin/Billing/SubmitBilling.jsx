import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { getActiveCustomersBilling, getCustomerEngagementDetailsBilling, getClientsByCustomerBilling, getJobsBilling, getServicesBilling, getJobTypesBilling, getServicesByClientBilling, submitBillingApi } from '../../../Services/Billing/BillingService';
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
      } catch (e) {}
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
          pct: parseFloat(c.pct) || 0,
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
          { customer_id: practice.value },
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

  // 1. Fetch Clients and Reset children when Customer (practice) changes
  useEffect(() => {
    if (!practice || !practice.value) {
      prevPracticeIdRef.current = null;
      setClientsList([]);
      setSelectedClient(null);
      setServicesList([]);
      setSelectedService(null);
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
      // User manually picked another customer -> reset child selections
      setSelectedClient(null);
      setJobsList([]);
      setSelectedJob(null);
      setServicesList([]);
      setSelectedService(null);
      setJobTypesList([]);
      setSelectedJobType(null);
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
      return;
    }

    // Prevent duplicate calls if client has not changed
    if (prevClientIdRef.current === selectedClient.value) {
      return;
    }

    prevClientIdRef.current = selectedClient.value;
    setSelectedService(null);

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
            latest_year_end: s.latest_year_end || null,
          }));
          if (editData?.service_id && !formatted.some(s => s.value === editData.service_id)) {
            formatted.unshift({
              value: editData.service_id,
              label: editData.service_name || ("Service #" + editData.service_id),
            });
          }
          setServicesList(formatted);
          if (editData?.service_id) {
            const foundService = formatted.find(s => s.value === editData.service_id);
            if (foundService) {
              setSelectedService(foundService);
              if (!editData.period_type && foundService.latest_year_end) {
                setPeriodType("Year End");
                setRawDateValue(foundService.latest_year_end);
                setPeriodDate(formatPeriodDate("Year End", foundService.latest_year_end));
              }
            }
          } else if (formatted.length === 1) {
            const singleService = formatted[0];
            setSelectedService(singleService);
            if (singleService.latest_year_end) {
              setPeriodType("Year End");
              setRawDateValue(singleService.latest_year_end);
              setPeriodDate(formatPeriodDate("Year End", singleService.latest_year_end));
            }
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
  const [fteAccountantQty, setFteAccountantQty] = useState("");
  const [fteBookkeeperQty, setFteBookkeeperQty] = useState("");
  const [ftePayrollQty, setFtePayrollQty] = useState("");
  const [fteTaxQty, setFteTaxQty] = useState("");
  const [fteAdminQty, setFteAdminQty] = useState("");

  // 3. Percentage Model state: Base Invoice/Turnover amount
  const [percentageBaseAmount, setPercentageBaseAmount] = useState("");

  // 4. Customised Pricing state: Completed number of jobs
  const [customJobsCount, setCustomJobsCount] = useState("");

  // 5. Discount % state (Optional percentage discount applied on Gross Amount)
  const [discountPct, setDiscountPct] = useState("");

  // Contributors State
  const [contributors, setContributors] = useState([
    { id: 1, name: "Ravi Manager", pct: 100 },
  ]);

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
    const accQty = fteAccountantQty !== "" ? parseFloat(fteAccountantQty) || 0 : parseFloat(d.number_of_accountants) || 0;
    const accFee = parseFloat(d.fee_per_accountant) || 0;

    const bkQty = fteBookkeeperQty !== "" ? parseFloat(fteBookkeeperQty) || 0 : parseFloat(d.number_of_bookkeepers) || 0;
    const bkFee = parseFloat(d.fee_per_bookkeeper) || 0;

    const prQty = ftePayrollQty !== "" ? parseFloat(ftePayrollQty) || 0 : parseFloat(d.number_of_payroll_experts) || 0;
    const prFee = parseFloat(d.fee_per_payroll_expert) || 0;

    const txQty = fteTaxQty !== "" ? parseFloat(fteTaxQty) || 0 : parseFloat(d.number_of_tax_experts) || 0;
    const txFee = parseFloat(d.fee_per_tax_expert) || 0;

    const adQty = fteAdminQty !== "" ? parseFloat(fteAdminQty) || 0 : parseFloat(d.number_of_admin_staff) || 0;
    const adFee = parseFloat(d.fee_per_admin_staff) || 0;

    return (accQty * accFee) + (bkQty * bkFee) + (prQty * prFee) + (txQty * txFee) + (adQty * adFee);
  };
  const fteTotal = calculateFteTotal();

  // 3. Percentage Amount
  const percentageOutsourceVal = parseFloat(percentageModelData?.details?.total_outsourcing) || 0;
  const baseAmountNum = parseFloat(percentageBaseAmount) || 0;
  const percentageTotal = (baseAmountNum * percentageOutsourceVal) / 100;

  // 4. Customised Pricing Amount (matches selectedService)
  const getCustomCostPerJob = () => {
    if (!customisedModelData?.details || !Array.isArray(customisedModelData.details)) return 0;
    if (selectedService?.value) {
      const match = customisedModelData.details.find((c) => String(c.service_id) === String(selectedService.value));
      if (match) return parseFloat(match.cost_per_job) || 0;
    }
    // Default to first item if not matched
    return parseFloat(customisedModelData.details[0]?.cost_per_job) || 0;
  };
  const customCostPerJob = getCustomCostPerJob();
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

  const totalAllocation = contributors.reduce(
    (acc, curr) => acc + (parseFloat(curr.pct) || 0),
    0
  );

  const handleAddContributor = () => {
    setContributors([
      ...contributors,
      { id: Date.now(), name: "Priya Sharma", pct: 0 },
    ]);
  };

  const handleRemoveContributor = (id) => {
    setContributors(contributors.filter((c) => c.id !== id));
  };

  const handleContributorChange = (id, field, value) => {
    setContributors(
      contributors.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
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

    if (totalAllocation !== 100) {
      sweatalert.fire({
        icon: "warning",
        title: "Revenue Allocation",
        text: "Revenue split across contributors must total exactly 100%.",
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
          accountants: fteAccountantQty !== "" ? fteAccountantQty : fteModelData.details.number_of_accountants,
          bookkeepers: fteBookkeeperQty !== "" ? fteBookkeeperQty : fteModelData.details.number_of_bookkeepers,
          payroll: ftePayrollQty !== "" ? ftePayrollQty : fteModelData.details.number_of_payroll_experts,
          tax: fteTaxQty !== "" ? fteTaxQty : fteModelData.details.number_of_tax_experts,
          admin: fteAdminQty !== "" ? fteAdminQty : fteModelData.details.number_of_admin_staff,
        } : null,
        percentage: percentageModelData ? { base: baseAmountNum, pct: percentageOutsourceVal, total: percentageTotal } : null,
        customised: customisedModelData ? { service: selectedService.label, costPerJob: customCostPerJob, count: customJobsCountNum, total: customTotal } : null,
        grossAmount: grossAmount,
        discountPct: discountPctNum,
        discountAmt: discountAmt,
        netAmount: netAmount,
        grandTotal: netAmount,
      };

      const payload = {
        StaffUserId: staffDetails?.id || null,
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
        manager_id: customerMeta?.account_manager_id || null,
        contributors: contributors.map((c) => ({
          staff_id: c.staff_id || staffDetails?.id || 1,
          staff_name: c.name,
          pct: parseFloat(c.pct) || 0,
        })),
      };

      const res = await submitBillingApi(payload, token);

      if (res && res.status) {
        await sweatalert.fire({
          icon: "success",
          title: editSubmissionId ? "Billing Updated!" : "Billing Submitted!",
          text: editSubmissionId ? `Billing of £${netAmount.toFixed(2)} updated successfully.` : `Billing of £${netAmount.toFixed(2)} submitted successfully. Sent to ${customerMeta?.account_manager || "Account Manager"} for approval.`,
          confirmButtonColor: "#26bdf0",
        });
        navigate("/admin/billing/approvals");
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
                        <div className="col-lg-3 col-md-6">
                          <span className="text-muted d-block mb-1">Customer</span>
                          <span className="fw-bold text-dark fs-6">{practice?.label || selectedEngData.client}</span>
                        </div>

                        <div className="col-lg-3 col-md-6">
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

                        <div className="col-lg-3 col-md-6">
                          <span className="text-muted d-block mb-1">Account manager</span>
                          <span className="fw-semibold text-dark fs-6">
                            {customerMeta?.account_manager || "—"}
                          </span>
                        </div>

                        <div className="col-lg-3 col-md-6">
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
                          if (selected?.latest_year_end) {
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
                  <div className="row g-4 mb-4">
                    <div className="col-lg-6 col-md-6">
                      <label className="form-label text-muted small mb-1 fw-medium">
                        Billing Period
                      </label>
                      <select
                        className="form-select shadow-sm rounded-pill"
                        value={periodType}
                        onChange={(e) => {
                          const newType = e.target.value;
                          setPeriodType(newType);
                          if (newType === "Month") {
                            const val = getTodayMonthValue();
                            setRawDateValue(val);
                            setPeriodDate(formatPeriodDate("Month", val));
                          } else if (newType === "Week") {
                            const val = getTodayWeekValue();
                            setRawDateValue(val);
                            setPeriodDate(formatPeriodDate("Week", val));
                          } else if (newType === "Quarter") {
                            const currentYear = new Date().getFullYear();
                            const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
                            const defaultQ = `Q${currentQuarter} ${currentYear}`;
                            setRawDateValue(defaultQ);
                            setPeriodDate(defaultQ);
                          } else if (newType === "One-Off") {
                            const val = getTodayDateValue();
                            setRawDateValue(val);
                            setPeriodDate(formatPeriodDate("One-Off", val));
                          } else if (newType === "Year End") {
                            const val = selectedService?.latest_year_end || getTodayDateValue();
                            setRawDateValue(val);
                            setPeriodDate(formatPeriodDate("Year End", val));
                          }
                        }}
                      >
                        <option value="Year End">Year End</option>
                        <option value="Month">Month</option>
                        <option value="Week">Week</option>
                        <option value="Quarter">Quarter</option>
                        <option value="One-Off">One-Off</option>
                      </select>
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <label className="form-label text-muted small mb-1 fw-medium">
                        Period Date {periodDate ? `(${periodDate})` : ""}
                      </label>
                      {periodType === "Month" && (
                        <input
                          type="month"
                          className="form-control shadow-sm rounded-pill"
                          value={rawDateValue || getTodayMonthValue()}
                          onChange={(e) => {
                            setRawDateValue(e.target.value);
                            setPeriodDate(formatPeriodDate("Month", e.target.value));
                          }}
                        />
                      )}

                      {periodType === "Week" && (
                        <input
                          type="week"
                          className="form-control shadow-sm rounded-pill"
                          value={rawDateValue || getTodayWeekValue()}
                          onChange={(e) => {
                            setRawDateValue(e.target.value);
                            setPeriodDate(formatPeriodDate("Week", e.target.value));
                          }}
                        />
                      )}

                      {periodType === "Quarter" && (
                        <select
                          className="form-select shadow-sm rounded-pill"
                          value={periodDate}
                          onChange={(e) => {
                            setPeriodDate(e.target.value);
                            setRawDateValue(e.target.value);
                          }}
                        >
                          {(() => {
                            const currentYear = new Date().getFullYear();
                            const years = [currentYear - 1, currentYear, currentYear + 1];
                            const options = [];
                            years.forEach((yr) => {
                              ["Q1", "Q2", "Q3", "Q4"].forEach((q) => {
                                const qLabel = `${q} ${yr}`;
                                options.push(
                                  <option key={qLabel} value={qLabel}>
                                    {qLabel}
                                  </option>
                                );
                              });
                            });
                            return options;
                          })()}
                        </select>
                      )}

                      {periodType === "Year End" && (
                        <input
                          type="date"
                          className="form-control shadow-sm rounded-pill"
                          value={rawDateValue || getTodayDateValue()}
                          onChange={(e) => {
                            setRawDateValue(e.target.value);
                            setPeriodDate(formatPeriodDate("Year End", e.target.value));
                          }}
                        />
                      )}

                      {periodType === "One-Off" && (
                        <input
                          type="date"
                          className="form-control shadow-sm rounded-pill"
                          value={rawDateValue || getTodayDateValue()}
                          onChange={(e) => {
                            setRawDateValue(e.target.value);
                            setPeriodDate(formatPeriodDate("One-Off", e.target.value));
                          }}
                        />
                      )}
                    </div>
                  </div>

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
                                    <td>Accountants</td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        className="form-control form-control-sm text-center"
                                        placeholder={fteModelData.details.number_of_accountants}
                                        value={fteAccountantQty}
                                        onChange={(e) => setFteAccountantQty(e.target.value)}
                                      />
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_accountant || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((fteAccountantQty !== "" ? parseFloat(fteAccountantQty) || 0 : parseFloat(fteModelData.details.number_of_accountants) || 0) * (parseFloat(fteModelData.details.fee_per_accountant) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_bookkeepers > 0 && (
                                  <tr>
                                    <td>Bookkeepers</td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        className="form-control form-control-sm text-center"
                                        placeholder={fteModelData.details.number_of_bookkeepers}
                                        value={fteBookkeeperQty}
                                        onChange={(e) => setFteBookkeeperQty(e.target.value)}
                                      />
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_bookkeeper || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((fteBookkeeperQty !== "" ? parseFloat(fteBookkeeperQty) || 0 : parseFloat(fteModelData.details.number_of_bookkeepers) || 0) * (parseFloat(fteModelData.details.fee_per_bookkeeper) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_payroll_experts > 0 && (
                                  <tr>
                                    <td>Payroll Experts</td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        className="form-control form-control-sm text-center"
                                        placeholder={fteModelData.details.number_of_payroll_experts}
                                        value={ftePayrollQty}
                                        onChange={(e) => setFtePayrollQty(e.target.value)}
                                      />
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_payroll_expert || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((ftePayrollQty !== "" ? parseFloat(ftePayrollQty) || 0 : parseFloat(fteModelData.details.number_of_payroll_experts) || 0) * (parseFloat(fteModelData.details.fee_per_payroll_expert) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_tax_experts > 0 && (
                                  <tr>
                                    <td>Tax Experts</td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        className="form-control form-control-sm text-center"
                                        placeholder={fteModelData.details.number_of_tax_experts}
                                        value={fteTaxQty}
                                        onChange={(e) => setFteTaxQty(e.target.value)}
                                      />
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_tax_expert || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((fteTaxQty !== "" ? parseFloat(fteTaxQty) || 0 : parseFloat(fteModelData.details.number_of_tax_experts) || 0) * (parseFloat(fteModelData.details.fee_per_tax_expert) || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {fteModelData.details.number_of_admin_staff > 0 && (
                                  <tr>
                                    <td>Admin Staff</td>
                                    <td>
                                      <input
                                        type="number" onWheel={(e) => e.target.blur()}
                                        min="0"
                                        className="form-control form-control-sm text-center"
                                        placeholder={fteModelData.details.number_of_admin_staff}
                                        value={fteAdminQty}
                                        onChange={(e) => setFteAdminQty(e.target.value)}
                                      />
                                    </td>
                                    <td>£ {parseFloat(fteModelData.details.fee_per_admin_staff || 0).toFixed(2)}</td>
                                    <td className="fw-bold">
                                      £ {((fteAdminQty !== "" ? parseFloat(fteAdminQty) || 0 : parseFloat(fteModelData.details.number_of_admin_staff) || 0) * (parseFloat(fteModelData.details.fee_per_admin_staff) || 0)).toFixed(2)}
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
                            Percentage Model — Figures
                          </span>
                          <span className="badge bg-white text-info border">Percentage Model</span>
                        </div>
                        <div className="card-body p-3">
                          <div className="row g-3 align-items-end">
                            <div className="col-md-5">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Base Invoice / Turnover Value (£)
                              </label>
                              <input
                                type="number" onWheel={(e) => e.target.blur()}
                                min="0"
                                className="form-control shadow-sm rounded-pill"
                                placeholder="e.g. 10000"
                                value={percentageBaseAmount}
                                onChange={(e) => setPercentageBaseAmount(e.target.value)}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Agreed Percentage
                              </label>
                              <input
                                type="text"
                                className="form-control bg-light fw-bold"
                                readOnly
                                value={`${percentageOutsourceVal}%`}
                                style={{ borderRadius: "50px" }}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label text-muted small mb-1 fw-medium">
                                Percentage Subtotal
                              </label>
                              <input
                                type="text"
                                className="form-control bg-light fw-bold text-info"
                                readOnly
                                value={`£ ${percentageTotal.toFixed(2)}`}
                                style={{ borderRadius: "50px" }}
                              />
                            </div>
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
                                Completed Jobs
                              </label>
                              <input
                                type="number" onWheel={(e) => e.target.blur()}
                                min="0"
                                className="form-control shadow-sm rounded-pill"
                                placeholder="e.g. 5"
                                value={customJobsCount}
                                onChange={(e) => setCustomJobsCount(e.target.value)}
                              />
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
                                max="100"
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
                              className={`form-control bg-light fw-bold rounded-pill ${
                                discountAmt > 0 ? "text-danger" : "text-muted"
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
                      <div className="mb-3">
                        <h6 className="fw-bold text-dark mb-0">
                          Revenue split — who worked on this?
                        </h6>
                        <small className="text-muted" style={{ fontSize: "12px" }}>
                          Assign the billed amount across contributors
                        </small>
                      </div>

                      <div className="row g-2 mb-2 text-muted small fw-medium">
                        <div className="col-8">Contributor</div>
                        <div className="col-3">% share</div>
                        <div className="col-1"></div>
                      </div>

                      {contributors.map((c) => (
                        <div key={c.id} className="row g-2 align-items-center mb-2">
                          <div className="col-8">
                            <select
                              className="form-select form-select-sm"
                              value={c.name}
                              onChange={(e) =>
                                handleContributorChange(c.id, "name", e.target.value)
                              }
                            >
                              <option value="Ravi Manager">Ravi Manager</option>
                              <option value="Priya Sharma">Priya Sharma</option>
                              <option value="Rahul Verma">Rahul Verma</option>
                              <option value="David Smith">David Smith</option>
                            </select>
                          </div>
                          <div className="col-3">
                            <input
                              type="number" onWheel={(e) => e.target.blur()}
                              className="form-control form-control-sm text-end"
                              value={c.pct}
                              onChange={(e) =>
                                handleContributorChange(c.id, "pct", e.target.value)
                              }
                            />
                          </div>
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
                      ))}

                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm fw-semibold"
                          onClick={handleAddContributor}
                        >
                          <Plus size={14} className="me-1" /> Add contributor
                        </button>
                      </div>

                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center small">
                        <span className="text-muted">Total allocated:</span>
                        <span
                          className={`fw-bold ${
                            totalAllocation === 100 ? "text-success" : "text-danger"
                          }`}
                        >
                          {totalAllocation}% {totalAllocation === 100 && "✓"}
                        </span>
                      </div>
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
                    On submit, this goes to <strong>{customerMeta?.account_manager || "Account Manager"}</strong> for approval,
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
                      disabled={grandTotal <= 0 || totalAllocation !== 100 || submitting}
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
