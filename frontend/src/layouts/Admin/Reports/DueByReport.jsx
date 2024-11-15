import React, { useState, useEffect  } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { dueByReport } from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';
import { json, useNavigate } from 'react-router-dom';

const DueByReport = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    const [getDueByReport, setDueByReport] = useState([]);

    useEffect(() => {
        DueReport();
    }, []);

    const DueReport = async () => {
        const data = { req: {}, authToken: token };
        await dispatch(dueByReport(data))
            .unwrap()
            .then((res) => {
                if (res.status) {
                    setDueByReport(res.data);
                    
                    console.log(res.data[0].due_within_1_months);
                    
                    const jsonString = res.data[0].due_within_1_months.toString();

// Parse the string into a JSON object
const jsonObject = JSON.parse(jsonString);

// Now you can access the properties of the parsed JSON object
// console.log(jsonObject);
                }
                else {
                    setDueByReport([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleOnClick = (ids) => {
        navigate('/admin/report/jobs', { state: { job_ids: ids } });
      }
    const columns = [
         { name: 'Count Of Customer', 
            selector: row => row.customer_name, 
            sortable: true },

            
        { name: 'Due Date Within 1 Month(s)', 
            cell: (row) => (
                row.due_within_1_months.count > 0 ? (
                  <div 
                    style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }} 
                    onClick={() => handleOnClick(row.due_within_1_months.job_ids)}
                  >
                    {JSON.parse(row.due_within_1_months.count)}
                  </div>
                ) : (
                  <div>{row.due_within_1_months.count}</div>
                )
              ),
             sortable: true,
           
        },

        { name: 'Due Date Within 2 Month(s)', 
            cell: (row) => (
                row.due_within_2_months.count > 0 ? (
                  <div 
                    style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }} 
                    onClick={() => handleOnClick(row.due_within_2_months.job_ids)}
                  >
                    {row.due_within_2_months.count}
                  </div>
                ) : (
                  <div>{row.due_within_2_months.count}</div>
                )
              ),
             sortable: true,
           
        },

        { name: 'Due Date Within 3 Month(s)',
            cell: (row) => (
                row.due_within_3_months.count > 0 ? (
                    <div

                        style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }}
                        onClick={() => handleOnClick(row.due_within_3_months.job_ids)}
                    >
                        {row.due_within_3_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_3_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 4 Month(s)',
            cell: (row) => (
                row.due_within_4_months.count > 0 ? (
                    <div

                        style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }}
                        onClick={() => handleOnClick(row.due_within_4_months.job_ids)}
                    >
                        {row.due_within_4_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_4_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 5 Month(s)',
            cell: (row) => (
                row.due_within_5_months.count > 0 ? (
                    <div

                        style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }}
                        onClick={() => handleOnClick(row.due_within_5_months.job_ids)}
                    >
                        {row.due_within_5_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_5_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 6 Month(s)',
            cell: (row) => (
                row.due_within_6_months.count > 0 ? (
                    <div

                        style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }}
                        onClick={() => handleOnClick(row.due_within_6_months.job_ids)}
                    >
                        {row.due_within_6_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_6_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 7 Month(s)',
            cell: (row) => (
                row.due_within_7_months.count > 0 ? (
                    <div

                        style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }}
                        onClick={() => handleOnClick(row.due_within_7_months.job_ids)}
                    >
                        {row.due_within_7_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_7_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 8 Month(s)',
            cell: (row) => (
                row.due_within_8_months.count > 0 ? (
                    <div style={{ color: 'rgb(38, 189, 240)', cursor:
                        'pointer' }}
                        onClick={() => handleOnClick(row.due_within_8_months.job_ids)}
                    >
                        {row.due_within_8_months.count}
                    </div>
                ) : (
                    <div>{row.due_within_8_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 9 Month(s)',
            cell: (row) => (
                row.due_within_9_months.count > 0 ? (
                    <div style={{ color: 'rgb(38, 189, 240)', cursor:
                        'pointer' }}
                        onClick={() => handleOnClick(row.due_within_9_months.job_ids)}
                    >
                        {row.due_within_9_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_9_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 10 Month(s)',
            cell: (row) => (
                row.due_within_10_months.count > 0 ? (
                    <div style={{ color: 'rgb(38, 189, 240)', cursor:
                        'pointer' }}
                        onClick={() => handleOnClick(row.due_within_10_months.job_ids)}
                    >
                        {row.due_within_10_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_10_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 11 Month(s)',
            cell: (row) => (
                row.due_within_11_months.count > 0 ? (
                    <div style={{ color: 'rgb(38, 189, 240)', cursor:
                        'pointer' }}
                        onClick={() => handleOnClick(row.due_within_11_months.job_ids)}
                    >
                        {row.due_within_11_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_11_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Within 12 Month(s)',
            cell: (row) => (
                row.due_within_12_months.count > 0 ? (
                    <div style={{ color: 'rgb(38, 189, 240)', cursor:
                        'pointer' }}
                        onClick={() => handleOnClick(row.due_within_12_months.job_ids)}
                    >
                        {row.due_within_12_months.count}
                        </div>
                ) : (
                    <div>{row.due_within_12_months.count}</div>
                )
            ),
            sortable: true,
        },

        { name: 'Due Date Passed',
            cell: (row) => (
                row.due_passed.count > 0 ? (
                    <div style={{ color: 'rgb(38, 189, 240)', cursor:
                        'pointer' }}
                        onClick={() => handleOnClick(row.due_passed.job_ids)}
                    >
                        {row.due_passed.count}
                        </div>
                ) : (
                    <div>{row.due_passed.count}</div>
                )
            ),
            sortable: true,
        },

    ]

    return (
        <div>
            <div className='report-data'>
                <div className='row'>
                    <div className='col-md-7'>
                        <div className='tab-title mb-5'>
                            <h3>Due By Report</h3>
                        </div>
                        {/* <div className='job-filter-btn '>
                            <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
                            <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
                        </div> */}
                    </div>
                </div>
                <div className='datatable-wrapper mt-minus'>
                    <Datatable
                        filter={true}
                        columns={columns} data={getDueByReport && getDueByReport} />
                </div>
            </div>
        </div>
    )
}

export default DueByReport