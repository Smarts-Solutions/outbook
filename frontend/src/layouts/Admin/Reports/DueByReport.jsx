import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { dueByReport } from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';

const DueByReport = () => {
    const dispatch = useDispatch();
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
                }
                else {
                    setDueByReport([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const columns = [
        { name: 'Count Of Customer', selector: row => row.customer_name, sortable: true },
        { name: 'Due Date Within 1 Month(s)', selector: row => row.due_within_1_month.count, sortable: true },
        { name: 'Due Date Within 2 Month(s)', selector: row => row.due_within_2_months.count, sortable: true },
        { name: 'Due Date Within 3 Month(s)', selector: row => row.due_within_3_months.count, sortable: true },
        { name: 'Due Date Within 4 Month(s)', selector: row => row.due_within_4_months.count, sortable: true },
        { name: 'Due Date Within 5 Month(s)', selector: row => row.due_within_5_months.count, sortable: true },
        { name: 'Due Date Within 6 Month(s)', selector: row => row.due_within_6_months.count, sortable: true },
        { name: 'Due Date Within 7 Month(s)', selector: row => row.due_within_7_months.count, sortable: true },
        { name: 'Due Date Within 8 Month(s)', selector: row => row.due_within_8_months.count, sortable: true },
        { name: 'Due Date Within 9 Month(s)', selector: row => row.due_within_9_months.count, sortable: true },
        { name: 'Due Date Within 10 Month(s)', selector: row => row.due_within_10_months.count, sortable: true },
        { name: 'Due Date Within 11 Month(s)', selector: row => row.due_within_11_months.count, sortable: true },
        { name: 'Due Date Within 12 Month(s)', selector: row => row.due_within_12_months.count, sortable: true },
        { name: 'Due Date Passed', selector: row => row.due_passed, sortable: true },
    ]

    return (
        <div>
            <div className='report-data'>
                <div className='row'>
                    <div className='col-md-7'>
                        <div className='tab-title'>
                            <h3>Due By Report</h3>
                        </div>
                        <div className='job-filter-btn '>
                            <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
                            <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
                        </div>
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