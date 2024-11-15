import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getWeeklyReport } from '../../../ReduxStore/Slice/Report/ReportSlice';

const SlidingTable = () => {
  const StaffUserId = JSON.parse(localStorage.getItem('staffDetails'))?.id;
  const token = JSON.parse(localStorage.getItem('token'));
  const dispatch = useDispatch();
  const [columns] = useState(generateColumns(52));
  const [visibleColumns, setVisibleColumns] = useState(columns.slice(0, 6));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weeklyReportData, setWeeklyReportData] = useState([]);



  console.log("weeklyReportData", weeklyReportData);
  useEffect(() => {
    getAllWeeklyReports();
  }, []);

  const getAllWeeklyReports = async () => {
    const req = {
      StaffUserId: StaffUserId,
      customer_id: "",
      job_status_type_id: "",
      processor_id: "",
      reviewer_id: ""
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


  function generateColumns(num) {
    const cols = [];
    for (let i = 1; i <= num; i++) {
      cols.push(`Week ${i}`);
    }
    return cols;
  }

  const slideNext = () => {
    if (currentIndex + 6 < columns.length) {
      const newIndex = currentIndex + 6;
      setVisibleColumns(columns.slice(newIndex, newIndex + 6));
      setCurrentIndex(newIndex);
    }
  };

  const slidePrev = () => {
    if (currentIndex - 6 >= 0) {
      const newIndex = currentIndex - 6;
      setVisibleColumns(columns.slice(newIndex, newIndex + 6));
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className='containr-fluid mt-5'>
      <div className='report-data'>
        <div className='mb-2'>
          <button className="btn btn-info " onClick={slidePrev} disabled={currentIndex === 0}>
            Prev
          </button>
          <button className="btn btn-info ms-2" onClick={slideNext} disabled={currentIndex + 6 >= columns.length}>
            Next
          </button>
        </div>
        <div className="table-wrapper">
          <table className="table table-striped">
            <thead className='table-light table-head-blue'>
              <tr>
                <th className="fixed-column">Name</th>
                {visibleColumns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeklyReportData.map((data, index) => (
                <tr key={index}>
                  {console.log(Object.values(data))}
                  <td className="fixed-column">{data.customer_name}</td>
                  {Object.values(data).map((col, index) => (
                    <td key={index}>cpp</td>
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
