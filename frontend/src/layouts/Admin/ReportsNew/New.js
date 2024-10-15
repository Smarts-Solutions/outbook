import React, { useState } from "react";

const New = () => { 
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
        <div>
            <div className="card-body">
                <div id="customerList">
                    <div className="row">
                        <div className="table-responsive table-card mt-3 mb-1">
                            <table className="table align-middle table-nowrap" id="customerTable">
                                <thead className="table-light">
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
                                    {/* Team Member 1 */}
                                    <tr className="tabel_new">
                                        <td className="d-flex">
                                            <i
                                                onClick={() => toggleRow('teamMember1')}
                                                className="exp_icon ri-add-circle-fill"
                                            />
                                            <span>Team Member 1</span>
                                        </td>
                                        <td>23</td>
                                        <td>23</td>
                                        <td>8</td>
                                        <td>4 </td>
                                        <td>3 </td>
                                        <td>8</td>
                                        <td>4 </td>
                                        <td>23</td>
                                    </tr>

                                    {/* Customers of Team Member 1 */}
                                    {expandedRows.teamMember1 && (
                                        <>
                                            <tr>
                                                <td className="ml-2 d-flex">
                                                    <i
                                                        onClick={() => toggleRow('customer1')}
                                                        className="exp_icon ri-add-circle-fill"
                                                    />
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

                                            {/* Clients of Customer 1 */}
                                            {expandedRows.customer1 && (
                                                <>
                                                    <tr>
                                                        <td className="ml-4 d-flex">
                                                            <i
                                                                onClick={() => toggleRow('client1')}
                                                                className="exp_icon ri-add-circle-fill"
                                                            />
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

                                                    {/* Jobs of Client 1 */}
                                                    {expandedRows.client1 && (
                                                        <>
                                                            <tr>
                                                                <td className="ml-6">Job 1</td>
                                                                <td>4</td>
                                                                <td>2</td>
                                                                <td>2</td>
                                                                <td>1</td>
                                                                <td>1</td>
                                                                <td>8</td>
                                                                <td>4</td>
                                                                <td>23</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="ml-6">Job 2</td>
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

                                    {/* Team Member 2 */}
                                    <tr className="tabel_new">
                                        <td className="d-flex">
                                            <i
                                                onClick={() => toggleRow('teamMember2')}
                                                className="exp_icon ri-add-circle-fill"
                                            />
                                            <span>Team Member 2</span>
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

                                    {/* Customers of Team Member 2 */}
                                    {expandedRows.teamMember2 && (
                                        <>
                                            <tr>
                                                <td className="ml-2 d-flex">
                                                    <i
                                                        onClick={() => toggleRow('customer2')}
                                                        className="exp_icon ri-add-circle-fill"
                                                    />
                                                    <span>Customer 2</span>
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

                                            {/* Clients of Customer 2 */}
                                            {expandedRows.customer2 && (
                                                <>
                                                    <tr>
                                                        <td className="ml-4 d-flex">
                                                            <i
                                                                onClick={() => toggleRow('client2')}
                                                                className="exp_icon ri-add-circle-fill"
                                                            />
                                                            <span>Client 2</span>
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

                                                    {/* Jobs of Client 2 */}
                                                    {expandedRows.client2 && (
                                                        <>
                                                            <tr>
                                                                <td className="ml-6">Job 1</td>
                                                                <td>4</td>
                                                                <td>2</td>
                                                                <td>2</td>
                                                                <td>1</td>
                                                                <td>1</td>
                                                                <td>8</td>
                                                                <td>4</td>
                                                                <td>23</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="ml-6">Job 2</td>
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
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
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
                                                <i className="mdi mdi-chevron-right" />
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
    );
};

export default New;
