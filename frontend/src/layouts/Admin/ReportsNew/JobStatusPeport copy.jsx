import React, { useState } from "react";

const data = [
    { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
    // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' }
  ];
const JobStatusReport = () => { 

    const [expandedRows, setExpandedRows] = useState({
        teamMember1: false,
        customer1: false,
        client1: false,
        teamMember2: false,
        customer2: false,
        client2: false,
      });

    const toggleRow = (rowKey) => {
        setExpandedRows((prevState) => ({
          ...prevState,
          [rowKey]: !prevState[rowKey],
        }));
      };
    
    return (
        <>
          <div className='report-data'>
            <div className='datatable-wrapper mt-minus'>
              <div className="card-body">
                <div id="customerList">
                  <div className="row">
                    <div className="table-responsive report-table table-card mt-4 mb-1">
                      <div className='tab-title mb-3'>
                        <h3>Job Status Report</h3>
                      </div>
                      <table className="table align-middle table-nowrap" id="customerTable">
                        <thead className="table-light table-light table-head-blue">
                          <tr>
                            <th>Team Member Name</th>
                            <th>Task1</th>
                            <th>Task2</th>
                            <th>Task3</th>
                            <th>Total</th>
                            <th>Processor</th>
                            <th>Reviewer</th>
                            <th>Other</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {
                            data.map((item, index) => (
                              <React.Fragment key={`teamMember${index + 1}`}>
                                <tr className="tabel_new">
                                  <td className="d-flex">
                                    <span
                                      onClick={() => toggleRow(`teamMember${index + 1}`)}
                                      className="mx-1 pointer Plas-center"
                                    >
                                      {expandedRows[`teamMember${index + 1}`] ? '-' : '+'}
                                    </span>
                                    <span>{item.CustomerName}</span>
                                  </td>
                                  <td>23</td>
                                  <td>23</td>
                                  <td>8</td>
                                  <td>4</td>
                                  <td>3</td>
                                  <td>8</td>
                                  <td>4</td>
                                  <td>23</td>
                                </tr> 
                                {expandedRows[`teamMember${index + 1}`] && (
                                  <>
                                    <tr key="customer1">
                                      <td className="d-flex ms-2">
                                        <span
                                          onClick={() => toggleRow('customer1')}
                                          className="mx-1 pointer Plas-center"
                                        >
                                          {expandedRows.customer1 ? '-' : '+'}
                                        </span>
                                        <span>Customer 1</span>
                                      </td>
                                      <td>23</td>
                                      <td>23</td>
                                      <td>8</td>
                                      <td>4</td>
                                      <td>3</td>
                                      <td>8</td>
                                      <td>4</td>
                                      <td>23</td>
                                    </tr>

                                    {expandedRows.customer1 && (
                                      <>
                                        <tr key="client1">
                                          <td className="d-flex ms-3">
                                            <span
                                              onClick={() => toggleRow('client1')}
                                              className="mx-1 pointer Plas-center"
                                            >
                                              {expandedRows.client1 ? '-' : '+'}
                                            </span>
                                            <span>Client 1</span>
                                          </td>
                                          <td>23</td>
                                          <td>23</td>
                                          <td>8</td>
                                          <td>4</td>
                                          <td>3</td>
                                          <td>8</td>
                                          <td>3</td>
                                          <td>23</td>
                                        </tr>

                                        {expandedRows.client1 && (
                                          <>
                                            <tr key="job1 mx-5">
                                              <td className="d-flex ms-5">
                                                Job 1
                                              </td>
                                              <td>4</td>
                                              <td>2</td>
                                              <td>2</td>
                                              <td>1</td>
                                              <td>1</td>
                                              <td>8</td>
                                              <td>4</td>
                                              <td>23</td>
                                            </tr>
                                            <tr key="job2">
                                              <td className="d-flex ms-5">
                                                Job 2
                                              </td>
                                              <td>3</td>
                                              <td>2</td>
                                              <td>8</td>
                                              <td>4</td>
                                              <td>3</td>
                                              <td>8</td>
                                              <td>4</td>
                                              <td>23</td>
                                            </tr>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </React.Fragment>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className="row align-items-center gy-2 text-center text-sm-start">
                      <div className="col-sm">
                        <div className="text-muted">
                          Showing <span className="fw-semibold">1-2</span> of{" "}
                          <span className="fw-semibold">13</span> Records
                        </div>
                      </div>
                      <div className="col-sm-auto">
                        <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center justify-content-sm-start">
                          <li className="page-item disabled">
                            <a href="#" className="page-link">
                              <b>
                                <i className="fa fa-angle-left" />
                              </b>
                            </a>
                          </li>
                          <li className="page-item active">
                            <a href="#" className="page-link">
                              1
                            </a>
                          </li>
                          <li className="page-item">
                            <a href="#" className="page-link">
                              2
                            </a>
                          </li>
                          <li className="page-item">
                            <a href="#" className="page-link">
                              <b>
                                <i className="fa fa-angle-right" />
                              </b>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    

        </>
                
    );
};

export default JobStatusReport;
