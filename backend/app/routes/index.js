module.exports = function (app) {
    // Auth Route
    app.use(require("./auth/authRoutes"));
    app.use(require("./rolePermissions/rolePermissionRoutes"));
    app.use(require("./systemTypes/systemTypeRoutes"));
    app.use(require("./services/serviceRoutes"));
    app.use(require("./jobTypeTask/jobTypeTaskRoutes"));
  
};