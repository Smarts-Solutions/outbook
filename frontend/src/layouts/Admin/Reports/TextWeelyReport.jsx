import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getWeeklyReport, weeklyReportFilter } from '../../../ReduxStore/Slice/Report/ReportSlice';

const SlidingTable = () => {
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





  useEffect(() => {
    var CurrentWeek = getCurrentWeekNumber();
    setCurrentIndex(CurrentWeek)
    setVisibleColumns(columns.slice(CurrentWeek - 1, CurrentWeek + 9));

    getAllWeeklyReports();
    getFilterData()
  }, [multipleFilter]);

  const getAllWeeklyReports = async () => {
    const req = {
      StaffUserId: StaffUserId,
      customer_id: multipleFilter.customer_id,
      job_status_type_id: multipleFilter.job_status_type_id,
      processor_id: multipleFilter.processor_id,
      reviewer_id: multipleFilter.reviewer_id
    }
    const data = { req: req, authToken: token };
    await dispatch(getWeeklyReport(data)).unwrap()
      .then((res) => {
        if (res.status) {
          setWeeklyReportData(res.data)
        }
        else {
          setWeeklyReportData([])
        }
      })
      .catch((err) => {
        console.log("err", err);
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

  return (
    <div className='containr-fluid mt-5'>
      <div className='report-data'>
        <div className='mb-2 d-flex justify-content-between'>

          <div className="row">

            <div className='col-md-3 pe-0'>
              <select className="form-select" id="tabSelect"
                value={multipleFilter.customer_id}
                onChange={(e) => setMultipleFilter({ ...multipleFilter, customer_id: e.target.value })}

              >
                <option value="">Select Customer</option>
                {filterData && filterData?.customer?.map((data, index) => (
                  <option key={index} value={data.customer_id}>{data.customer_name}</option>
                ))}

              </select>

            </div>

            <div className='col-md-3 pe-0'>
              <select className="form-select" id="tabSelect"
                value={multipleFilter.job_status_type_id}
                onChange={(e) => setMultipleFilter({ ...multipleFilter, job_status_type_id: e.target.value })}
              >
                <option value="">Select Job Status</option>
                {filterData && filterData?.job_status_type?.map((data, index) => (
                  <option key={index} value={data.job_status_type_id}>{data.job_status_type_name}</option>
                ))}
              </select>

            </div>


            <div className='col-md-3 pe-0'>
              <select className="form-select" id="tabSelect"
                value={multipleFilter.processor_id}
                onChange={(e) => setMultipleFilter({ ...multipleFilter, processor_id: e.target.value })}
              >
                <option value="">Select Processor</option>
                {filterData && filterData?.processor?.map((data, index) => (
                  <option key={index} value={data.processor_id}>{data.processor_name}</option>
                ))}

              </select>

            </div>

            <div className='col-md-2 pe-0'>
              <select className="form-select" id="tabSelect"
                value={multipleFilter.reviewer_id}
                onChange={(e) => setMultipleFilter({ ...multipleFilter, reviewer_id: e.target.value })}
              >
                <option value="">Select Reviewer</option>
                {filterData && filterData?.reviewer?.map((data, index) => (
                  <option key={index} value={data.reviewer_id}>{data.reviewer_name}</option>
                ))}
              </select>
            </div>
            <div className='col-md-1 pe-0'>
            <button className="btn btn-info " onClick={() => setMultipleFilter({
              customer_id: "",
              job_status_type_id: "",
              processor_id: "",
              reviewer_id: ""
            })} disabled={currentIndex === 0}>
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
              {weeklyReportData && weeklyReportData.map((data, index) => (
                <tr key={index}>
                  <td className="fixed-column">{data.customer_name}</td>
                  {Object.values(data.weeks[index]).map((col, index1) => (
                    (visibleColumns[0] <= index1 + 1 && index1 + 1 <= visibleColumns[visibleColumns.length - 1]) ? (
                      <td key={index1}>{col.count == 0 ? "-" : col.count}</td>
                    ) : null
                  ))}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SlidingTable;
