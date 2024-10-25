import React, { useState } from "react";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import ExpandableTable from '../../../Components/ExtraComponents/ExpandableTable';
import { ChevronDown , ChevronUp } from 'lucide-react';
const CustomerTable = () => {
    const [isOpen, setIsOpen] = useState(false);

    const data = [
        { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },

    ];

    const columns = [

        {
            name: 'Trading Name',
            // cell: (row) => (
            //     <div>
            //         <span onClick={(e) => console.log(e.target)} className="mx-3 pointer  Plas-center">
            //             +
            //         </span>
            //         {row.TradingName}
            //     </div>
            // ),
            sortable: true
        },

        { name: 'Customer Code', selector: row => row.Code, sortable: true },
        { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
        { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
        { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
        { name: 'Account Manager', selector: row => row.JobType, sortable: true },
    ]
    return (
        <div style={{ marginBottom: "10px" }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: "pointer",
                    backgroundColor: "#f0f0f0",
                    padding: "10px",
                    borderRadius: "5px",
                }}
            >
                {isOpen ? <span onClick={(e) => console.log(e.target)} className="mx-3 pointer  Plas-cente"><ChevronDown/>Customer</span> :
                    <span onClick={(e) => console.log(e.target)} className="mx-3 pointer "><ChevronUp/>Customer</span>}


            </div>
            {isOpen && (
                <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
                    <ExpandableTable
                        columns={columns}
                        data={data}
                        filter={false}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomerTable;

