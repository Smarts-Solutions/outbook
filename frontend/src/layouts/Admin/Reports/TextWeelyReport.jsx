import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getWeeklyReport, weeklyReportFilter } from '../../../ReduxStore/Slice/Report/ReportSlice';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const SlidingTable = () => {
  const navigate = useNavigate();
  const noDataImage = '/assets/images/No-data-amico.png';
  const StaffUserId = JSON.parse(localStorage.getItem('staffDetails'))?.id;
  const token = JSON.parse(localStorage.getItem('token'));
  const dispatch = useDispatch();
  const [columns] = useState(generateColumns(52));
  const [visibleColumns, setVisibleColumns] = useState(columns.slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weeklyReportData, setWeeklyReportData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [multipleFilter, setMultipleFilter] = useState({
    customer_id: "",
    job_status_type_id: "",
    processor_id: "",
    reviewer_id: ""
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);





  useEffect(() => {
    var CurrentWeek = getCurrentWeekNumber();
    setCurrentIndex(CurrentWeek)
    setVisibleColumns(columns.slice(CurrentWeek - 1, CurrentWeek + 9));
    getAllWeeklyReports();
    getFilterData()
  }, [multipleFilter, page, limit]);

  const getAllWeeklyReports = async () => {
    const req = {
      // Pagination state (must be before any usage)

      StaffUserId: StaffUserId,
      customer_id: multipleFilter.customer_id,
      job_status_type_id: multipleFilter.job_status_type_id,
      processor_id: multipleFilter.processor_id,
      reviewer_id: multipleFilter.reviewer_id,
      page,
      limit
    }
    const data = { req: req, authToken: token };
    await dispatch(getWeeklyReport(data)).unwrap()
      .then((res) => {
        if (res.status) {
          setWeeklyReportData(res.data);
          setTotalCount(res.totalCount || 0);
        }
        else {
          setWeeklyReportData([]);
          setTotalCount(0);
        }
      })
      .catch((err) => {
        console.log("err", err);
        setTotalCount(0);
      })
  };

  const getFilterData = async (data) => {
    const req = {
      StaffUserId: StaffUserId,
    }
    const data1 = { req: req, authToken: token };
    await dispatch(weeklyReportFilter(data1)).unwrap()

      .then((res) => {
        if (res.status) {
          setFilterData(res.data)
        }
        else {
          setFilterData([])
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
  };


  // Pagination state is already declared at the top
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

  // ...existing code...
  const slidePrev = () => {
    if (currentIndex - 10 >= 0) {
      const newIndex = currentIndex - 10;
      setVisibleColumns(columns.slice(newIndex, newIndex + 10));
      setCurrentIndex(newIndex);
    } else if (currentIndex > 0 && currentIndex < 10) {
      setVisibleColumns(columns.slice(1, currentIndex));
      setCurrentIndex(currentIndex);
    }
  };

  function getCurrentWeekNumber() {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  const handleOnClick = (row) => {
    navigate('/admin/report/jobs', { state: { job_ids: row?.job_ids } });
  }



  return (
    <div className='containr-fluid mt-5'>
      <div className='report-data'>
        <div className='mb-2'>
          <div className="row">
            <div className='col-md-2 pe-0'>
              {/* Searchable Customer Dropdown */}
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={
                  [
                    { value: "", label: "---select---" },
                    ...(filterData && filterData.customer
                      ? filterData.customer.map((data) => ({ value: data.customer_id, label: data.customer_name }))
                      : [])
                  ]
                }
                value={
                  filterData && filterData.customer
                    ? filterData.customer
                        .map((data) => ({ value: data.customer_id, label: data.customer_name }))
                        .find((opt) => opt.value === multipleFilter.customer_id)
                    : null
                }
                onChange={(selected) => {
                  setMultipleFilter({ ...multipleFilter, customer_id: selected ? selected.value : "" });
                }}
                placeholder="--- select ---"
              />
            </div>

            <div className='col-md-2 pe-0'>
              {/* Searchable Job Status Dropdown */}
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={
                  [
                    { value: "", label: "--- select ----" },
                    ...(filterData && filterData.job_status_type
                      ? filterData.job_status_type.map((data) => ({ value: data.job_status_type_id, label: data.job_status_type_name }))
                      : [])
                  ]
                }
                value={
                  filterData && filterData.job_status_type
                    ? filterData.job_status_type
                      .map((data) => ({ value: data.job_status_type_id, label: data.job_status_type_name }))
                      .find((opt) => opt.value === multipleFilter.job_status_type_id)
                    : null
                }
                onChange={(selected) => {
                  setMultipleFilter({ ...multipleFilter, job_status_type_id: selected ? selected.value : "" });
                }}
                placeholder="--- select ---"
              />
            </div>


            <div className='col-md-2 pe-0'>
              {/* Searchable Processor Dropdown */}
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={
                  [
                    { value: "", label: "--- select ---" },
                    ...(filterData && filterData.processor
                      ? filterData.processor.map((data) => ({ value: data.processor_id, label: data.processor_name }))
                      : [])
                  ]
                }
                value={
                  filterData && filterData.processor
                    ? filterData.processor
                      .map((data) => ({ value: data.processor_id, label: data.processor_name }))
                      .find((opt) => opt.value === multipleFilter.processor_id)
                    : null
                }
                onChange={(selected) => {
                  setMultipleFilter({ ...multipleFilter, processor_id: selected ? selected.value : "" });
                }}
                placeholder="--- select ---"
              />
            </div>

            <div className='col-md-2 pe-0'>
              {/* Searchable Reviewer Dropdown */}
              <Select
                id="tabSelect"
                className="basic-multi-select"
                classNamePrefix="react-select"
                isSearchable
                options={
                  [
                    { value: "", label: "--- select ---" },
                    ...(filterData && filterData.reviewer
                      ? filterData.reviewer.map((data) => ({ value: data.reviewer_id, label: data.reviewer_name }))
                      : [])
                  ]
                }
                value={
                  filterData && filterData.reviewer
                    ? filterData.reviewer
                      .map((data) => ({ value: data.reviewer_id, label: data.reviewer_name }))
                      .find((opt) => opt.value === multipleFilter.reviewer_id)
                    : null
                }
                onChange={(selected) => {
                  setMultipleFilter({ ...multipleFilter, reviewer_id: selected ? selected.value : "" });
                }}
                placeholder="--- select ---"
              />
            </div>
            <div className='col-md-1 pe-0'>
              {/* <button className="btn btn-info " onClick={() => setMultipleFilter({
                customer_id: "",
                job_status_type_id: "",
                processor_id: "",
                reviewer_id: ""
              })} disabled={currentIndex === 0}>
                Reset
              </button> */}
              <button className="btn btn-info " onClick={() => setMultipleFilter()} disabled={currentIndex === 0}>
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className='row'>
          <div>
            <button className="btn btn-info " onClick={slidePrev} disabled={currentIndex === 0}>
              Prev
            </button>
            <button className="btn btn-info ms-2" onClick={slideNext} disabled={currentIndex + 6 >= columns.length}>
              Next
            </button>
          </div>




        </div>
        <div className="table-wrapper">
          <table className="table ">
            <thead className='table-light table-head-blue'>
              <tr>
                <th className="fixed-column">Name</th>
                {visibleColumns && visibleColumns.map((col, index) => (
                  <th key={index}>Week {col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {
                weeklyReportData.length === 0 ?
                  <tr>
                    <td colSpan={visibleColumns.length + 1} className="text-center">
                      <img src={noDataImage} alt="No Data" style={{ width: '150px', height: '150px' }} />
                      <p>No data available</p>
                    </td>
                  </tr>
                  :
                  weeklyReportData && weeklyReportData?.map((data, index) => (
                    <tr key={index}>
                      <td className="fixed-column">{data?.customer_name}</td>
                      {Object.values(data?.weeks[0]).map((col, index1) => (
                        (visibleColumns[0] <= index1 + 1 &&
                          index1 + 1 <= visibleColumns[visibleColumns.length - 1]) ? (
                          <td key={index1}>
                            {col?.count === 0 ? "-" :
                              <div
                                style={{
                                  color: 'rgb(38, 189, 240)',
                                  cursor: 'pointer',
                                  display: 'flex',          
                                  justifyContent: 'center', 
                                  alignItems: 'center',    
                                  height: '100%',
                                }}
                                onClick={() => handleOnClick(col)}
                              >
                                {col.count}
                              </div>
                            }
                          </td>
                        ) : null
                      ))}
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        {/* Pagination Controls removed as requested */}
      </div>
    </div>
  );
};

export default SlidingTable;
