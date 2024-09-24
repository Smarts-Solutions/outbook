module.exports = function (app) {
    // Auth Route
    app.use(require("./auth/authRoutes"));
    app.use(require("./rolePermissions/rolePermissionRoutes"));
    app.use(require("./systemTypes/systemTypeRoutes"));
    app.use(require("./services/serviceRoutes"));
    app.use(require("./jobTypeTask/jobTypeTaskRoutes"));
    app.use(require("./companies/companyRoutes"));
    app.use(require("./customers/customerRoutes"));
    app.use(require("./client/clientRoutes"));
    app.use(require("./job/jobRoutes"));
    app.use(require("./dashboard/dashboardRoutes"));

};