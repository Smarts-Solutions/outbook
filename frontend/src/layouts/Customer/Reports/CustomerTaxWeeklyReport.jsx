import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CustomerTaxWeeklyReport as fetchTaxWeeklyReport, CustomerTaxWeeklyReportFilter as fetchTaxWeeklyReportFilter } from '../../../ReduxStore/Slice/Report/CustomerReportSlice';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import ExportToExcel from '../../../Components/ExtraComponents/ExportToExcel';
import { Download } from "lucide-react";

const CustomerTaxWeeklyReport = () => {
  const navigate = useNavigate();
  const noDataImage = '/assets/images/No-data-amico.png';
  const StaffUserId = JSON.parse(localStorage.getItem('staffDetails'))?.id;
  const token = JSON.parse(localStorage.getItem('token'));
  const dispatch = useDispatch();
  
  const [columns] = useState(generateColumns(53));
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weeklyReportData, setWeeklyReportData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multipleFilter, setMultipleFilter] = useState({
    customer_id: "",
    job_status_type_id: "",
    processor_id: "",
    reviewer_id: ""
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    var CurrentWeek = getCurrentWeekNumber();
    setCurrentIndex(CurrentWeek);
    setVisibleColumns(generateColumns(53).slice(CurrentWeek - 1, CurrentWeek + 9));
    getFilterData();
  }, []);

  useEffect(() => {
    getAllWeeklyReports();
  }, [multipleFilter]);

  const getAllWeeklyReports = async () => {
    setLoading(true);
    const req = {
      customer_id: multipleFilter.customer_id,
      job_status_type_id: multipleFilter.job_status_type_id,
      processor_id: multipleFilter.processor_id,
      reviewer_id: multipleFilter.reviewer_id,
    };
    const data = { req: req, authToken: token };
    await dispatch(fetchTaxWeeklyReport(data)).unwrap()
      .then((res) => {
        if (res.status) {
          setWeeklyReportData(res.data);
        } else {
          setWeeklyReportData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getFilterData = async () => {
    const data = { authToken: token };
    await dispatch(fetchTaxWeeklyReportFilter(data)).unwrap()
      .then((res) => {
        if (res.status) {
          setFilterData(res.data);
        } else {
          setFilterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function generateColumns(num) {
    const cols = [];
    for (let i = 1; i <= num; i++) {
      cols.push(i);
    }
    return cols;
  }

  const slideNext = () => {
    if (currentIndex + 10 < columns.length) {
      const newIndex = currentIndex + 10;
      setVisibleColumns(columns.slice(newIndex, newIndex + 10));
      setCurrentIndex(newIndex);
    }
  };

  const slidePrev = () => {
    if (currentIndex - 10 >= 0) {
      const newIndex = currentIndex - 10;
      setVisibleColumns(columns.slice(newIndex, newIndex + 10));
      setCurrentIndex(newIndex);
    } else if (currentIndex > 0 && currentIndex < 10) {
      setVisibleColumns(columns.slice(0, 10));
      setCurrentIndex(0);
    }
  };

  function getCurrentWeekNumber() {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  const handleOnClick = (row) => {
    if (!row?.job_ids) return;
    navigate('/customer/report/jobs', { state: { job_ids: row.job_ids } });
  };

  const clearFilter = () => {
    setMultipleFilter({
      customer_id: "",
      job_status_type_id: "",
      processor_id: "",
      reviewer_id: ""
    });
  };

  const headers = [
    { label: 'Customer Name', key: 'customer_name' },
    { label: 'Job Status', key: 'job_status' },
    ...Array.from({ length: 53 }, (_, i) => ({ label: `Week ${i + 1}`, key: `week_${i + 1}` })),
    { label: 'Grand Total', key: 'grand_total' }
  ];

  const exportData = weeklyReportData.map(row => {
    const weekData = {};
    if (row.weeks && row.weeks[0]) {
        for (let i = 1; i <= 53; i++) {
            const weekKey = `WE_${i}_${currentYear}`;
            weekData[`week_${i}`] = row.weeks[0][weekKey]?.count || 0;
        }
    }
    return {
      customer_name: row.customer_name,
      job_status: row.job_status,
      ...weekData,
      grand_total: row.Grand_Total?.count || 0
    };
  });

  return (
    <div className='container-fluid mt-2'>
      <div className='report-data'>
        <div className="row mb-5">
            <div className="col-md-7">
                <div className="tab-title">
                    <h3>Tax Weekly Status Report</h3>
                </div>
            </div>
        </div>

        <div className='mb-4'>
          <div className="row g-2">
            <div className='col-md-2 pe-0'>
              <Select
                id="customerSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "--- Select Customer ---" },
                  ...(filterData?.customer ? filterData.customer.map(d => ({ value: d.customer_id, label: d.customer_name })) : [])
                ]}
                value={multipleFilter.customer_id === "" ? { value: "", label: "--- Select Customer ---" } : (filterData?.customer?.map(d => ({ value: d.customer_id, label: d.customer_name })).find(o => o.value === multipleFilter.customer_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, customer_id: selected ? selected.value : "" })}
                placeholder="Customer"
              />
            </div>

            <div className='col-md-2 pe-0'>
              <Select
                id="statusSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "--- Select Status ---" },
                  ...(filterData?.job_status_type ? filterData.job_status_type.map(d => ({ value: d.job_status_type_id, label: d.job_status_type_name })) : [])
                ]}
                value={multipleFilter.job_status_type_id === "" ? { value: "", label: "--- Select Status ---" } : (filterData?.job_status_type?.map(d => ({ value: d.job_status_type_id, label: d.job_status_type_name })).find(o => o.value === multipleFilter.job_status_type_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, job_status_type_id: selected ? selected.value : "" })}
                placeholder="Job Status"
              />
            </div>

            <div className='col-md-2 pe-0'>
              <Select
                id="processorSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "--- Select Processor ---" },
                  ...(filterData?.processor ? filterData.processor.map(d => ({ value: d.processor_id, label: d.processor_name })) : [])
                ]}
                value={multipleFilter.processor_id === "" ? { value: "", label: "--- Select Processor ---" } : (filterData?.processor?.map(d => ({ value: d.processor_id, label: d.processor_name })).find(o => o.value === multipleFilter.processor_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, processor_id: selected ? selected.value : "" })}
                placeholder="Processor"
              />
            </div>

            <div className='col-md-2 pe-0'>
              <Select
                id="reviewerSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "--- Select Reviewer ---" },
                  ...(filterData?.reviewer ? filterData.reviewer.map(d => ({ value: d.reviewer_id, label: d.reviewer_name })) : [])
                ]}
                value={multipleFilter.reviewer_id === "" ? { value: "", label: "--- Select Reviewer ---" } : (filterData?.reviewer?.map(d => ({ value: d.reviewer_id, label: d.reviewer_name })).find(o => o.value === multipleFilter.reviewer_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, reviewer_id: selected ? selected.value : "" })}
                placeholder="Reviewer"
              />
            </div>

            <div className='col-md-1 pe-0'>
              <button className="btn btn-outline-secondary w-100 fw-bold" onClick={clearFilter}>
                Reset
              </button>
            </div>
            
            <div className='col-md-3 text-end'>
              <ExportToExcel apiData={exportData} fileName={'Customer_Tax_Weekly_Report'} headers={headers} />
            </div>
          </div>
        </div>

        <div className='row mb-3 align-items-center'>
            <div className='col-md-6 d-flex gap-2'>
                <button className="btn btn-sm btn-info px-4 fw-bold" onClick={slidePrev} disabled={currentIndex <= 0}>
                Prev
                </button>
                <button className="btn btn-sm btn-info px-4 fw-bold" onClick={slideNext} disabled={currentIndex + 10 >= columns.length}>
                Next
                </button>
            </div>
            <div className="col-md-6 text-end text-muted small">
                Showing Weeks {visibleColumns[0]} to {visibleColumns[visibleColumns.length - 1]}
            </div>
        </div>

        <div className="datatable-wrapper mt-minus position-relative">
          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className='table-light'>
                <tr>
                  <th className="bg-light sticky-left" style={{ minWidth: '200px' }}>Customer Name</th>
                  <th style={{ minWidth: '150px' }}>Job Status</th>
                  {visibleColumns.map((col) => (
                    <th key={col} className="text-center" style={{ minWidth: '80px' }}>Week {col}</th>
                  ))}
                  <th className="text-center bg-light sticky-right" style={{ minWidth: '100px' }}>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {weeklyReportData.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length + 3} className="text-center py-5">
                      <img src={noDataImage} alt="No Data" style={{ width: '150px' }} />
                      <p className="mt-3 text-muted">No records found</p>
                    </td>
                  </tr>
                ) : (
                  weeklyReportData.map((data, index) => (
                    <tr key={index}>
                      <td className="bg-white sticky-left fw-medium">{data?.customer_name}</td>
                      <td><span className="badge bg-soft-info text-info">{data?.job_status}</span></td>
                      {visibleColumns.map((colNum) => {
                        const weekKey = `WE_${colNum}_${currentYear}`;
                        const weekData = data.weeks?.[0]?.[weekKey];
                        return (
                          <td key={colNum} className="text-center">
                            {weekData?.count > 0 ? (
                              <span 
                                className="text-primary fw-bold cursor-pointer hover-underline"
                                onClick={() => handleOnClick(weekData)}
                              >
                                {weekData.count}
                              </span>
                            ) : (
                              <span className="text-muted opacity-50">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center bg-white sticky-right fw-bold text-dark">
                         <span 
                            className="cursor-pointer text-primary"
                            onClick={() => handleOnClick(data.Grand_Total)}
                         >
                            {data.Grand_Total?.count || 0}
                         </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        .sticky-left { position: sticky; left: 0; z-index: 1; border-right: 2px solid #eee !important; }
        .sticky-right { position: sticky; right: 0; z-index: 1; border-left: 2px solid #eee !important; }
        .cursor-pointer { cursor: pointer; }
        .hover-underline:hover { text-decoration: underline; }
        .bg-soft-info { background-color: rgba(38, 189, 240, 0.1); }
      `}</style>
    </div>
  );
};

export default CustomerTaxWeeklyReport;
