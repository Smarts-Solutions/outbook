
/*--TABLE:- ROLES */
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    hourminute VARCHAR(100) DEFAULT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/*--TABLE:- PERMISSIONS   */
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/*--TABLE:- ROLE PERMISSIONS  */

CREATE TABLE `role_permissions` (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE (role_id,permission_id)
);


/*--TABLE:- STAFF USERS - LOGIN ACCESS  */
CREATE TABLE staffs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_code VARCHAR(10) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    hourminute VARCHAR(100) DEFAULT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_by  INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    login_auth_token TEXT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);



/*--TABLE:- STATUS TYPE */
CREATE TABLE status_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



/*--TABLE:- SERVICES */
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



/*--TABLE:- STAFF COMPETANCY */
CREATE TABLE staff_competencies (
    staff_id INT NOT NULL,
    service_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    UNIQUE (staff_id,service_id)
);


/*--TABLE:- JOB TYPE */
CREATE TABLE job_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    type VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    FOREIGN KEY (service_id) REFERENCES services(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/*--TABLE:- Task */
CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    service_id INT NOT NULL,
    job_type_id INT NOT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (job_type_id) REFERENCES job_types(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (name,service_id,job_type_id)
);



/*--TABLE:- CLIENT TYPE */
CREATE TABLE client_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO client_types (type, status) VALUES
('SoleTrader', '1'),
('Company', '1'),
('Partnership', '1'),
('Individual', '1');


/*--TABLE:- CLIENT INDUSTRY TYPE */
CREATE TABLE client_industry_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_type VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/*--TABLE:- COUNTRIES */
CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    currency VARCHAR(50) NOT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/*--TABLE:- CUSTOMER CONTACT PERSON ROLE */
CREATE TABLE customer_contact_person_role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



/*--TABLE:- CUSTOMERS   */
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_type ENUM('1', '2' , '3') NOT NULL DEFAULT '1' COMMENT '1: SoleTrader, 2: Company , 3:Partnership',
    staff_id INT NOT NULL,
    account_manager_id INT NOT NULL COMMENT 'Only staff members who are account managers',
    trading_name VARCHAR(100) NOT NULL UNIQUE,
    customer_code VARCHAR(100) NOT NULL UNIQUE,
    trading_address VARCHAR(200) DEFAULT NULL,
    vat_registered ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: yes',
    vat_number VARCHAR(20) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    customerJoiningDate DATE DEFAULT NULL,
    customerSource INT DEFAULT NULL,
    customerSubSource INT DEFAULT NULL,
    form_process ENUM('0', '1' ,'2','3','4') NOT NULL DEFAULT '0' COMMENT '0: Pending All, 1: Customer Information Complete ,2: Services Complete ,3:Engagement Model Complete ,4:Paper Work Complete',
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (account_manager_id) REFERENCES staffs(id)
);

CREATE TABLE customer_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    UNIQUE (customer_id,service_id)
);


/* Customer Service Task */
CREATE TABLE customer_service_task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    task_id INT NOT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (task_id) REFERENCES task(id),
    UNIQUE (customer_id,service_id,task_id)
);

/* Can a multiplayer account manager be allocated to one service? */

CREATE TABLE `customer_service_account_managers` (
    customer_service_id INT NOT NULL,
    account_manager_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_service_id) REFERENCES customer_services(id),
    FOREIGN KEY (account_manager_id) REFERENCES staffs(id),
    UNIQUE (customer_service_id,account_manager_id)
);

/*--TABLE:- CUSTOMERS COMPANY INFORMATION  */
CREATE TABLE customer_company_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    company_status VARCHAR(100) DEFAULT NULL,
    company_number VARCHAR(50) DEFAULT NULL,
    registered_office_address LONGTEXT NOT NULL,
    incorporation_date DATE NOT NULL,
    incorporation_in LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

/*--TABLE:- CUSTOMERS CONTACT DETAILS */
CREATE TABLE customer_contact_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    contact_person_role_id INT(11) NULL DEFAULT '0',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    alternate_email VARCHAR(100) DEFAULT NULL,
    phone_code VARCHAR(10) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    alternate_phone VARCHAR(20) DEFAULT NULL,
    residential_address TEXT DEFAULT NULL,
    authorised_signatory_status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: off, 1: on',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (contact_person_role_id) REFERENCES customer_contact_person_role(id)
);

/*--TABLE:- CUSTOMERS ENGAGEMENT MODEL  */  
CREATE TABLE customer_engagement_model (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    fte_dedicated_staffing ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
    percentage_model ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
    adhoc_payg_hourly ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
    customised_pricing ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

/*--TABLE:- CUSTOMERS ENGAGEMENT MODEL FTE/Dedicated Staffing */ 
CREATE TABLE customer_engagement_fte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_engagement_model_id INT NOT NULL,
    number_of_accountants INT NOT NULL,
    fee_per_accountant DECIMAL(10, 2) NOT NULL,
    number_of_bookkeepers INT NOT NULL,
    fee_per_bookkeeper DECIMAL(10, 2) NOT NULL,
    number_of_payroll_experts INT NOT NULL,
    fee_per_payroll_expert DECIMAL(10, 2) NOT NULL,
    number_of_tax_experts INT NOT NULL,
    fee_per_tax_expert DECIMAL(10, 2) NOT NULL,
    number_of_admin_staff INT NOT NULL,
    fee_per_admin_staff DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_engagement_model_id) REFERENCES customer_engagement_model(id)
);

/*--TABLE:- CUSTOMERS ENGAGEMENT MODEL PERCENTAGE MODEL*/
CREATE TABLE customer_engagement_percentage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_engagement_model_id INT NOT NULL,
    total_outsourcing DECIMAL(15, 2) NOT NULL,
    accountants DECIMAL(10, 2) NOT NULL,
    bookkeepers DECIMAL(10, 2) NOT NULL,
    payroll_experts DECIMAL(10, 2) NOT NULL,
    tax_experts DECIMAL(10, 2) NOT NULL,
    admin_staff DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_engagement_model_id) REFERENCES customer_engagement_model(id)
);

/*--TABLE:- CUSTOMERS ENGAGEMENT MODEL Adhoc/PAYG/Hourly*/
CREATE TABLE customer_engagement_adhoc_hourly (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_engagement_model_id INT NOT NULL,
    adhoc_accountants DECIMAL(10, 2) NOT NULL,
    adhoc_bookkeepers DECIMAL(10, 2) NOT NULL,
    adhoc_payroll_experts DECIMAL(10, 2) NOT NULL,
    adhoc_tax_experts DECIMAL(10, 2) NOT NULL,
    adhoc_admin_staff DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_engagement_model_id) REFERENCES customer_engagement_model(id)
);

/*--TABLE:- CUSTOMERS ENGAGEMENT MODEL CUSTOMISED PRICING  */
CREATE TABLE customer_engagement_customised_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_engagement_model_id INT NOT NULL,
    minimum_number_of_jobs INT NOT NULL,
    job_type_id INT DEFAULT NULL,
    service_id INT DEFAULT NULL,
    cost_per_job DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_engagement_model_id) REFERENCES customer_engagement_model(id),
    FOREIGN KEY (job_type_id) REFERENCES job_types(id)
);

/*--TABLE:- CUSTOMERS PAPER WORK  */
CREATE TABLE customer_paper_work (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

 /*--TABLE:- CUSTOMERS DOCUMENTS  */
    CREATE TABLE customer_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    );


/*--TABLE:- CLIENTS   */
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_type ENUM('1', '2' , '3' , '4') NOT NULL DEFAULT '1' COMMENT '1: SoleTrader, 2: Company , 3:Partnership , 4 : Individual',
    customer_id INT NOT NULL,
    client_industry_id INT DEFAULT 0,
    trading_name VARCHAR(100) NOT NULL UNIQUE,
    client_code VARCHAR(100) NOT NULL UNIQUE,
    trading_address VARCHAR(255) DEFAULT NULL,
    vat_registered ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
    vat_number VARCHAR(20) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (client_industry_id) REFERENCES client_industry_types(id)
);

/*--TABLE:- CLIENTS COMPANY INFORMATION  */
CREATE TABLE client_company_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    company_status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    company_number VARCHAR(50) DEFAULT NULL,
    registered_office_address LONGTEXT NOT NULL,
    incorporation_date DATE NOT NULL,
    incorporation_in VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

/*--TABLE:- CLIENTS CONTACT DETAILS */
CREATE TABLE client_contact_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    role INT DEFAULT 0,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    alternate_email VARCHAR(100) DEFAULT NULL,
    phone_code VARCHAR(6) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    alternate_phone_code VARCHAR(6) DEFAULT NULL,
    alternate_phone VARCHAR(20) DEFAULT NULL,
    residential_address TEXT DEFAULT NULL,
    authorised_signatory_status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: off, 1: on',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (role) REFERENCES customer_contact_person_role(id)
);

/*--TABLE:- CLIENT DOCUMENTS  */
    CREATE TABLE client_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
    );

/*--TABLE:- CREATE JOB   */
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_created_id INT NOT NULL,
    job_id VARCHAR(100) NOT NULL UNIQUE,
    account_manager_id INT NOT NULL COMMENT 'Only staff members who are account managers',
    customer_id INT NOT NULL,
    client_id INT NOT NULL,
    client_job_code VARCHAR(50) DEFAULT NULL,
    customer_contact_details_id INT NOT NULL,
    service_id INT NOT NULL,
    job_type_id INT NOT NULL,
    budgeted_hours VARCHAR(100) DEFAULT NULL,
    reviewer INT DEFAULT NULL, 
    allocated_to INT DEFAULT NULL,
    allocated_on  DATE DEFAULT NULL,
    date_received_on  DATE DEFAULT NULL,
    year_end VARCHAR(7) DEFAULT NULL,
    total_preparation_time VARCHAR(100) DEFAULT NULL,
    review_time VARCHAR(100) DEFAULT NULL,
    feedback_incorporation_time VARCHAR(100) DEFAULT NULL,
    total_time VARCHAR(100) DEFAULT NULL,
    engagement_model VARCHAR(255) DEFAULT NULL,
    expected_delivery_date  DATE DEFAULT NULL,
    due_on  DATE DEFAULT NULL,
    submission_deadline  DATE DEFAULT NULL,
    customer_deadline_date  DATE DEFAULT NULL,
    sla_deadline_date  DATE DEFAULT NULL,
    internal_deadline_date  DATE DEFAULT NULL,
    filing_Companies_required ENUM('0', '1') DEFAULT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
    filing_Companies_date  DATE DEFAULT NULL,
    filing_hmrc_required ENUM('0', '1') DEFAULT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
    filing_hmrc_date  DATE DEFAULT NULL,
    opening_balance_required ENUM('0', '1') DEFAULT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
    opening_balance_date  DATE DEFAULT NULL,
    number_of_transaction DECIMAL(10, 2) DEFAULT NULL,
    number_of_balance_items INT DEFAULT NULL,
    turnover DECIMAL(15, 2) DEFAULT NULL,
    number_of_employees INT DEFAULT NULL,
    vat_reconciliation ENUM('0', '1') DEFAULT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
    bookkeeping ENUM('0', '1') DEFAULT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
    processing_type ENUM('1', '2') DEFAULT NULL DEFAULT '1' COMMENT '1: Manual, 2: Software',
    invoiced ENUM('0', '1') DEFAULT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
    currency INT DEFAULT 0,
    invoice_value DECIMAL(15, 2) DEFAULT NULL,
    invoice_date  DATE DEFAULT NULL,
    invoice_hours VARCHAR(100) DEFAULT NULL,
    invoice_remark TEXT DEFAULT NULL,
    status_type  INT DEFAULT NULL,
    total_hours VARCHAR(100) DEFAULT NULL,
    total_hours_status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_manager_id) REFERENCES staffs(id),
    FOREIGN KEY (staff_created_id) REFERENCES staffs(id),
    FOREIGN KEY (reviewer) REFERENCES staffs(id),
    FOREIGN KEY (allocated_to) REFERENCES staffs(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (customer_contact_details_id) REFERENCES customer_contact_details(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (job_type_id) REFERENCES job_types(id),
    FOREIGN KEY (currency) REFERENCES countries(id)
    );


    /*--TABLE:- CHECKLIST  */  
    CREATE TABLE checklists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        service_id INT NOT NULL,
        job_type_id INT NOT NULL,
        client_type_id INT NOT NULL,
        check_list_name VARCHAR(100) NOT NULL,
        status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id),
        FOREIGN KEY (job_type_id) REFERENCES job_types(id),
        FOREIGN KEY (client_type_id) REFERENCES client_types(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    );


    /*--TABLE:- CHECKLIST  */  
    CREATE TABLE checklist_tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        checklist_id INT NOT NULL,
        task_id INT NOT NULL,
        task_name VARCHAR(100) NOT NULL,
        budgeted_hour VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (checklist_id) REFERENCES checklists(id),
        FOREIGN KEY (task_id) REFERENCES task(id),
        UNIQUE (checklist_id,task_id)
    );

    /*--TABLE:- MASTER STATUS */
    CREATE TABLE master_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        status_type_id INT NOT NULL
        status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (status_type_id) REFERENCES status_types(id)
    );

    INSERT INTO master_status (name, status) VALUES
    ('To Be started','1'),
    ('WIP','1'),
    ('Hold – Missing Paperwork','1'),
    ('Hold – Query Responses Awaited','1'),
    ('To Be Reviewed','1'),
    ('WIP - Fixing Errors','1'),
    ('Draft Sent for Approval','1');

    
     /*--TABLE:- CLIENTS JOBS TASKS  */  
    CREATE TABLE client_job_task (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        client_id INT NOT NULL,
        -- checklist_id INT NOT NULL,
        task_id INT NOT NULL,
        task_status INT NOT NULL,
        time VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (checklist_id) REFERENCES checklists(id),
        FOREIGN KEY (task_id) REFERENCES task(id),
        FOREIGN KEY (task_status) REFERENCES master_status(id),
        UNIQUE (job_id,client_id,task_id)
    );
    
     /*--TABLE:- CHECKLIST  */  
    CREATE TABLE statuses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        master_status_id INT NOT NULL,
        status_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (master_status_id) REFERENCES master_status(id)
    );


    /*--TABLE:- TASK TIMESHEET  */  
    CREATE TABLE task_timesheet (
        id INT AUTO_INCREMENT PRIMARY KEY,
        checklist_task_id INT NOT NULL,
        job_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (checklist_task_id) REFERENCES checklist_tasks(id),
        FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

    /*--TABLE:- JOB TIMELINE PENDING */ 


    /*--TABLE:- MISSING LOGS  */  
    CREATE TABLE missing_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        missing_log ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
        missing_paperwork ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
        missing_log_sent_on DATE DEFAULT NULL,
        missing_log_prepared_date DATE DEFAULT NULL,
        missing_log_title VARCHAR(100) DEFAULT NULL,
        missing_log_reviewed_by INT DEFAULT NULL,
        missing_log_reviewed_date DATE DEFAULT NULL,
        missing_paperwork_received_on DATE DEFAULT NULL,
        status ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: Incomplete, 1: Complete',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (missing_log_reviewed_by) REFERENCES staffs(id)
    );

    /*--TABLE:- MISSING LOGS DOCUMNET */
    CREATE TABLE missing_logs_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        missing_log_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (missing_log_id) REFERENCES missing_logs(id)
    );

    
     /*--TABLE:- QUERIES   */  
    CREATE TABLE queries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        queries_remaining ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
        query_title VARCHAR(100) DEFAULT NULL,
        reviewed_by ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
        missing_queries_prepared_date DATE DEFAULT NULL,
        query_sent_date DATE DEFAULT NULL,
        response_received ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
        response VARCHAR(255) DEFAULT NULL,
        final_query_response_received_date DATE DEFAULT NULL,
        status ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: Incomplete, 1: Complete',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id)
        -- FOREIGN KEY (reviewed_by) REFERENCES staffs(id)
    );

    /*--TABLE:- QUERIES DOCUMNET */
    CREATE TABLE queries_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (query_id) REFERENCES queries(id)
    );


     /*--TABLE:- DRAFTS   */  
    CREATE TABLE drafts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        draft_sent_on DATE DEFAULT NULL,
        draft_title VARCHAR(100) DEFAULT NULL,
        final_draft_sent_on DATE DEFAULT NULL,
        feedback_received ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
        updated_amendment ENUM('1', '2','3','4') NOT NULL DEFAULT '1' COMMENT '1:Amendment, 2: Update ,2: Both ,2: None',
        feedback TEXT,
        was_it_complete ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id)
    );



    /*--TABLE:- JOB DOCUMENTS  */
    CREATE TABLE job_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

   /*--TABLE:- STAFF LOGS DOCUMENTS  */
 CREATE TABLE staff_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  date DATE NOT NULL,
  module_name VARCHAR(100) NOT NULL,
  log_message TEXT NOT NULL,
  permission_type VARCHAR(50) NOT NULL,
  ip VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staffs(id)
);

/*--TABLE:- Incorporation in DOCUMENTS  */
 CREATE TABLE incorporation_in (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/*--TABLE:- customer source  DOCUMENTS  */
 CREATE TABLE customer_source (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/*--TABLE:- customer sub source  DOCUMENTS  */
 CREATE TABLE customer_sub_source (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_source_id INT NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_source_id) REFERENCES customer_source(id)
);

-- TABLE FOR INTERNAL
CREATE TABLE internal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABLE FOR SUB INTERNAL
CREATE TABLE sub_internal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    internal_id INT NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (internal_id) REFERENCES internal(id)
);

-- TABLE FOR TIMESHEET
CREATE TABLE timesheet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    task_type ENUM('1', '2') NOT NULL DEFAULT '1' COMMENT '1: Internal, 2: External',
    customer_id INT NOT NULL DEFAULT 0,
    client_id INT NOT NULL DEFAULT 0,
    job_id INT NOT NULL,
    task_id INT NOT NULL,
    monday_date  DATE DEFAULT NULL,
    monday_hours VARCHAR(100) DEFAULT NULL,
    tuesday_date  DATE DEFAULT NULL,
    tuesday_hours VARCHAR(100) DEFAULT NULL,
    wednesday_date  DATE DEFAULT NULL,
    wednesday_hours VARCHAR(100) DEFAULT NULL,
    thursday_date  DATE DEFAULT NULL,
    thursday_hours VARCHAR(100) DEFAULT NULL,
    friday_date  DATE DEFAULT NULL,
    friday_hours VARCHAR(100) DEFAULT NULL,
    saturday_date  DATE DEFAULT NULL,
    saturday_hours VARCHAR(100) DEFAULT NULL,
    sunday_date  DATE DEFAULT NULL,
    sunday_hours VARCHAR(100) DEFAULT NULL,
    remark TEXT DEFAULT NULL,
    status ENUM('0', '1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
    submit_status ENUM('0', '1') NOT NULL DEFAULT '0' COMMENT '0: enable, 1: disable',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (task_id) REFERENCES task(id)
);



CREATE TABLE sharepoint_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    access_token LONGTEXT NULL,
    refresh_token LONGTEXT NULL,
    client_id TEXT NULL,
    client_secret TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



    


