const customTimesheetModel = require("../../models/customTimesheetModel");

// We delegate to our custom model so we don't affect the existing project
const handleAction = async (data) => {
  const { action } = data;
  
  switch (action) {
    case "get_customers_filter":
      return await customTimesheetModel.get_customers_filter_custom(data);
    case "get_clients_filter":
      return await customTimesheetModel.get_clients_filter_custom(data);
    case "get_jobs_filter":
      return await customTimesheetModel.get_jobs_filter_custom(data);
    case "getstaffbyfilter":
      return await customTimesheetModel.getStaffByFilter_custom(data);
    case "get":
      return await customTimesheetModel.getStaff_custom(data);
    case "get_active_line_managers":
      return await customTimesheetModel.get_active_line_managers_custom(data);
    case "get_my_line_managers":
      return await customTimesheetModel.get_my_line_managers_custom(data);
    case "getStaffWithRole":
      return await customTimesheetModel.getStaffWithRole_custom(data);
    default:
      return { status: false, message: "Invalid action for custom timesheet" };
  }
};

module.exports = {
  handleAction,
};
