import React, { useState } from "react";
import { Steps } from "antd";
import { Provider } from "./MultiStepFormContext";
import Service from "./Service";
import Engagement from "./Engagement";
import Paper from "./Paper";
import Information from "./Information";

const { Step } = Steps;

const detailsInitialState = {
    name: "",
    age: "",
    profession: ""
};

const addressInitialState = {
    customer: "",
    address2: "",
    city: ""
};

const renderStep = (step) => {
    switch (step) {
        case 0:
            return <Information />;
        case 1:
            return <Service />;
        case 2:
            return <Engagement />;
        case 3:
            return <Paper />;
        default:
            return null;
    }
};

const AddCustomer = () => {
    const [details, setDetails] = useState(detailsInitialState);
    const [address, setAddress] = useState(addressInitialState);
    const [currentStep, setCurrentStep] = useState(0);

    // Proceed to the next step
    const next = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Reset to the first step and clear state
            setCurrentStep(0);
            setDetails(detailsInitialState);
            setAddress(addressInitialState);
        }
    };

    // Go back to the previous step
    const prev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className='report-data mt-4'>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='tab-title'>
                    <h3 className='mt-0'>Create New Customer</h3>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="page-title-box">
                    <Provider value={{ details, setDetails, next, prev, address, setAddress }}>
                        <Steps current={currentStep}>
                            <Step title={"Customer Information"} />
                            <Step title={"Services"} />
                            <Step title={"Engagement Model"} />
                            <Step title={"Paper Work"} />
                        </Steps>
                        <main>{renderStep(currentStep)}</main>
                    </Provider>
                </div>
            </div>
        </div>
    );
};

export default AddCustomer;