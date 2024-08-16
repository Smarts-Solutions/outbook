import React from 'react'
import Datatable from '../../Components/ExtraComponents/Datatable';

const Status = () => {
  const data = [
    { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },

  ];


  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName, sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
    { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
    { name: 'Account Manager', selector: row => row.JobType, sortable: true },


    {
      name: 'Actions',
      cell: row => (
        <div>
          <button className='edit-icon' onClick={() => handleEdit(row)}> <i className="ti-pencil" /></button>
          <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-trash" /></button>

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  function handleEdit(row) {
    console.log('Editing row:', row);
  }

  function handleDelete(row) {
    console.log('Deleting row:', row);
  }
  return (
    <div>
      <div className='container-fluid'>
      <div className='content-title'>
                <div className='tab-title'>
                            <h3 className='mt-0'>Status</h3>
                        </div>
                </div>
        <div className='report-data mt-4 '>
          <div className='d-flex justify-content-end align-items-center'>
            {/* <div className='tab-title'>
              <h3 className='mt-0'>Status</h3>
            </div> */}
            <div>
              <button type="button"

                data-bs-toggle="modal"
                data-bs-target="#exampleModal" className='btn btn-info text-white float-end ms-2'> <i className="fa fa-plus" />Add Status</button>
              <button type="button"

                className='btn btn-info text-white float-end '>View Log</button>

            </div>
          </div>
          <div className='datatable-wrapper mt-minus'>



            <Datatable
              filter={true}
              columns={columns} data={data} />
          </div>
        </div>
        {/* <!-- Button trigger modal --> */}


        {/* <!-- Modal --> */}
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog  modal-dialog-centered">
            <div class="modal-content">
              <div class=" bg-info modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Set Default Access</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form className="tablelist-form">
                  <div className="modal-body">
                    <div className="mb-3" id="modal-id" style={{ display: "none" }}>
                      <label htmlFor="id-field" className="form-label">
                        ID
                      </label>
                      <input
                        type="text"
                        id="id-field"
                        className="form-control"
                        placeholder="ID"
                        readOnly=""
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="customername-field" className="form-label">
                        Status Name
                      </label>
                      <input
                        type="text"
                        id="customername-field"
                        className="form-control"
                        placeholder="Enter Status Name"
                        required=""
                      />
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">
                          Status Type
                        </label>
                        <select
                          id="VAT_dropdown1"
                          className="form-select mb-3"
                          aria-label="Default select example"
                          style={{ color: "#8a8c8e !important" }}
                        >
                          <option selected="">Pending</option>
                          <option value={1}>Hold</option>
                          {/* <option value="1">Missing Paperworks
                                              </option> */}
                          <option value={1}>Completed</option>
                        </select>
                      </div>
                    </div>
                    {/* <div class="mb-3">
                                      <label for="customername-field" class="form-label">Link status</label>
                                      <input type="text" id="phone-field" class="form-control"
                                          placeholder="Outbooks Outsourcing Pvt Ltd" required />
                                  </div> */}
                  </div>

                </form>


              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Save </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



  )
}

export default Status


