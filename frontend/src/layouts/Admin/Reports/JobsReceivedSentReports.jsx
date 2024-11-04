import React, { useState, useEffect } from "react";
import { ReceivedSentReport } from "../../../ReduxStore/Slice/Report/ReportSlice";
import { useDispatch } from "react-redux";

const JobsReceivedSentReports = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [receivedSentData, setReceivedSentData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;  

    useEffect(() => {
        ReceivedSentData();
    }, []);

    const ReceivedSentData = async () => {
        const data = { req: {}, authToken: token };
        await dispatch(ReceivedSentReport(data))
            .unwrap()
            .then((res) => {
                if (res.status) {
                    setReceivedSentData(res.data);
                } else {
                    setReceivedSentData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const toggleRow = (index) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(receivedSentData.length / itemsPerPage);
    const paginatedData = receivedSentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <div className='report-data'>
                <div className='row mb-5'>
                    <div className='col-lg-12'>
                        <div className='tab-title'>
                            <h3>Job Status Report</h3>
                        </div>
                    </div>
                </div>
                <div className='datatable-wrapper mt-minus'>
                    <div className="card-body">
                        <div id="customerList">
                            <div className="row">
                                <div className="table-responsive table-card mt-3 mb-1">
                                    <table className="table align-middle table-nowrap" id="customerTable">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Months</th>
                                                <th>Jobs Received</th>
                                                <th>Draft Sent</th>
                                            </tr>
                                        </thead>
                                        <tbody className="list form-check-all">
                                            {paginatedData.map((data, index) => (
                                                <React.Fragment key={index}>
                                                    <tr className="tabel_new">
                                                        <td className="d-flex">
                                                            <i 
                                                                onClick={() => toggleRow(index)}
                                                                className={`exp_icon ${expandedRows[index] ? "ri-add-circle-fill" : "ri-add-circle-fill"}`}
                                                            />
                                                            <span>{data.month_name}</span>
                                                        </td>
                                                        <td>{data.job_received}</td>
                                                        <td>{data.draft_count}</td>
                                                    </tr>
                                                    {expandedRows[index] && (
                                                        data.week.map((week, i) => (
                                                            <tr key={i}>
                                                                <td>Week {week.week_number}</td>
                                                                <td>{week.job_received}</td>
                                                                <td>{week.draft_count}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="row align-items-center gy-2 text-center text-sm-start">
                                    <div className="col-sm">
                                        <div className="text-muted">
                                            Showing <span className="fw-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="fw-semibold">{Math.min(currentPage * itemsPerPage, receivedSentData.length)}</span> of <span className="fw-semibold">{receivedSentData.length}</span> Records
                                        </div>
                                    </div>
                                    <div className="col-sm-auto">
                                        <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center justify-content-sm-start">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button onClick={() => handlePageChange(currentPage - 1)} className="page-link">
                                                    <i className="fa fa-angle-left" />
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                    <button onClick={() => handlePageChange(i + 1)} className="page-link">
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                <button onClick={() => handlePageChange(currentPage + 1)} className="page-link">
                                                    <i className="mdi mdi-chevron-right" />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsReceivedSentReports;
