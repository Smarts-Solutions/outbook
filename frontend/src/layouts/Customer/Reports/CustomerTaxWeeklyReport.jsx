import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CustomerTaxWeeklyReport as fetchTaxWeeklyReport, CustomerTaxWeeklyReportFilter as fetchTaxWeeklyReportFilter } from '../../../ReduxStore/Slice/Report/CustomerReportSlice';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import ExportToExcel from '../../../Components/ExtraComponents/ExportToExcel';

const CustomerTaxWeeklyReport = () => {
  const navigate = useNavigate();
  const noDataImage = '/assets/images/No-data-amico.png';
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
    const startIndex = Math.max(0, CurrentWeek - 1);
    setCurrentIndex(startIndex);
    setVisibleColumns(columns.slice(startIndex, startIndex + 10));
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
    if (currentIndex + 1 < columns.length) {
      const newIndex = currentIndex + 1;
      setVisibleColumns(columns.slice(newIndex, newIndex + 10));
      setCurrentIndex(newIndex);
    }
  };

  const slidePrev = () => {
    if (currentIndex - 1 >= 0) {
      const newIndex = currentIndex - 1;
      setVisibleColumns(columns.slice(newIndex, newIndex + 10));
      setCurrentIndex(newIndex);
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
    { label: 'Name', key: 'customer_name' },
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
      ...weekData,
      grand_total: row.Grand_Total?.count || 0
    };
  });

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '25px',
      padding: '2px 10px',
      borderColor: '#ddd',
      boxShadow: 'none',
      fontSize: '14px',
      minHeight: '38px',
      '&:hover': {
        borderColor: '#26bdf0'
      }
    })
  };

  return (
    <div className='containr-fluid mt-5'>
      <div className='report-data'>
        <div className='mb-2'>
          <div className="row">
            <div className='col-md-2 pe-0'>
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "---Select---" },
                  ...(filterData?.customer ? filterData.customer.map(d => ({ value: d.customer_id, label: d.customer_name })) : [])
                ]}
                value={multipleFilter.customer_id === "" ? { value: "", label: "---Select---" } : (filterData?.customer?.map(d => ({ value: d.customer_id, label: d.customer_name })).find(o => o.value === multipleFilter.customer_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, customer_id: selected ? selected.value : "" })}
                placeholder="---Select---"
              />
            </div>

            <div className='col-md-2 pe-0'>
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "--- Select ----" },
                  ...(filterData?.job_status_type ? filterData.job_status_type.map(d => ({ value: d.job_status_type_id, label: d.job_status_type_name })) : [])
                ]}
                value={multipleFilter.job_status_type_id === "" ? { value: "", label: "--- Select ----" } : (filterData?.job_status_type?.map(d => ({ value: d.job_status_type_id, label: d.job_status_type_name })).find(o => o.value === multipleFilter.job_status_type_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, job_status_type_id: selected ? selected.value : "" })}
                placeholder="--- Select ----"
              />
            </div>

            <div className='col-md-2 pe-0'>
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "--- Select ---" },
                  ...(filterData?.processor ? filterData.processor.map(d => ({ value: d.processor_id, label: d.processor_name })) : [])
                ]}
                value={multipleFilter.processor_id === "" ? { value: "", label: "--- Select ---" } : (filterData?.processor?.map(d => ({ value: d.processor_id, label: d.processor_name })).find(o => o.value === multipleFilter.processor_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, processor_id: selected ? selected.value : "" })}
                placeholder="--- Select ---"
              />
            </div>

            <div className='col-md-2 pe-0'>
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={[
                  { value: "", label: "--- Select ---" },
                  ...(filterData?.reviewer ? filterData.reviewer.map(d => ({ value: d.reviewer_id, label: d.reviewer_name })) : [])
                ]}
                value={multipleFilter.reviewer_id === "" ? { value: "", label: "--- Select ---" } : (filterData?.reviewer?.map(d => ({ value: d.reviewer_id, label: d.reviewer_name })).find(o => o.value === multipleFilter.reviewer_id))}
                onChange={(selected) => setMultipleFilter({ ...multipleFilter, reviewer_id: selected ? selected.value : "" })}
                placeholder="--- Select ---"
              />
            </div>

            <div className='col-md-1 pe-0'>
              <button className="btn btn-info " onClick={clearFilter} disabled={currentIndex === 0}>
                Reset
              </button>
            </div>
            <div className='col-md-3'>
              <ExportToExcel apiData={exportData} fileName={'Weekly_Report'} headers={headers} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div>
            <button className="btn btn-info " onClick={slidePrev} disabled={currentIndex === 0}>
              Prev
            </button>
            <button className="btn btn-info ms-2" onClick={slideNext} disabled={currentIndex + 10 >= columns.length}>
              Next
            </button>
          </div>
        </div>
        <div className="table-wrapper mt-3">
          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}
          <table className="table">
            <thead className='table-light table-head-blue'>
              <tr>
                <th className="fixed-column">Name</th>
                {visibleColumns && visibleColumns.map((col, index) => (
                  <th key={index}>Week {col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeklyReportData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="text-center">
                    <img src={noDataImage} alt="No Data" style={{ width: '150px', height: '150px' }} />
                    <p>No data available</p>
                  </td>
                </tr>
              ) : (
                weeklyReportData && weeklyReportData?.map((data, index) => (
                  <tr key={index}>
                    <td className="fixed-column">{data?.customer_name}</td>
                    {visibleColumns.map((colNum) => {
                      const weekKey = `WE_${colNum}_${currentYear}`;
                      const weekData = data.weeks?.[0]?.[weekKey];
                      return (
                        <td key={colNum} className="text-center">
                          {weekData?.count > 0 ? (
                            <div
                              style={{
                                color: 'rgb(38, 189, 240)',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                              }}
                              onClick={() => handleOnClick(weekData)}
                            >
                              {weekData.count}
                            </div>
                          ) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerTaxWeeklyReport;
