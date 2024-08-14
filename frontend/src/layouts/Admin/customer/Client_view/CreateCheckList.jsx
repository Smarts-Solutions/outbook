import React from 'react'

const CreateCheckList = () => {
  return (
   
    <div className="container-fluid">
      <div className="content-title">
        <div className="tab-title">
          <h3 className="mt-0">Create New Checklist</h3>
        </div>
      </div>
      <div className="report-data mt-4">
        <div>
          <div className="row">
            <div className="col-lg-4 mt-4">
              <div className=" row">
                {/* <label className="col-lg-12" htmlFor="VAT_Registered">
                  Service Type <span className="text-danger">*</span>
                </label> */}
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    id="VAT_Registered"
                    name="VAT_Registered"
                  >
                    <option value="">Please Select  Service Type</option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className=" row">
                {/* <label className="col-lg-12" htmlFor="VAT_Registered">
                  Job Type <span className="text-danger">*</span>
                </label> */}
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    id="VAT_Registered"
                    name="VAT_Registered"
                  >
                    <option value="">Please Select Job Type</option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className=" row">
                {/* <label className="col-lg-12" htmlFor="VAT_Registered">
                  Client Type <span className="text-danger">*</span>
                </label> */}

                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    id="VAT_Registered"
                    name="VAT_Registered"
                  >
                    <option value="">Please Select Client Type</option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="mb-3 row flex-column">
                {/* <label className="col-lg-12" htmlFor="Trading_Address">
                  Check List Name<span className="text-danger">*</span>
                </label> */}
                <div>
                  <input
                    type="text"
                    className="form-control"
                    id="Trading_Address"
                    placeholder="Check List Name"
                    name="Trading_Address"
                    autoComplete="new-email"
                    defaultValue=""
                  />
                  <div className="invalid-feedback">
                    Please enter Trading Address
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className=" row">
                {/* <label className="col-lg-12" htmlFor="VAT_Registered">
                  Status
                </label> */}
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    id="VAT_Registered"
                    name="VAT_Registered"
                  >
                    <option value="">Please Select Status</option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            class="table-responsive
table-card mt-3 mb-1"
          >
            <table
              className="table align-middle table-nowrap"
              id="customerTable"
            >
              <thead className="table-striped">
                <tr>
                  <th className="" data-="customer_name">
                    Task Name
                  </th>
                  <th className="" data-="email">
                    Budgeted Hour
                  </th>
                  <th className="" data-="action">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="list form-check-all">
                <tr className="tabel_new">
                
                  <td >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Perform bank reconciliation"
                    />
                  </td>
                  <td >
                    <input
                      type="text"
                      className="form-control"
                      placeholder={10}
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <div>
                        <button className="edit-icon">
                          <i className="ti-plus" />
                        </button>
                        <button className="delete-icon">
                          <i className="ti-trash" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                 
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Gather bank statments"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={10}
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <div>
                        <button className="edit-icon">
                          <i className="ti-plus" />
                        </button>
                        <button className="delete-icon">
                          <i className="ti-trash" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="tabel_new">
                 
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Reconcile VAT ledger"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={10}
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <div>
                        <button className="edit-icon">
                          <i className="ti-plus" />
                        </button>
                        <button className="delete-icon">
                          <i className="ti-trash" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="noresult" style={{ display: "none" }}>
              <div className="text-center">
                <lord-icon
                  src="https://cdn.lordicon.com/msoeawqm.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#08a88a"
                  style={{ width: 75, height: 75 }}
                />
                <h5 className="mt-2">Sorry! No Result Found</h5>
                <p className="text-muted mb-0">
                  We've searched more than 150+ Orders We did not find any
                  orders for you search.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCheckList