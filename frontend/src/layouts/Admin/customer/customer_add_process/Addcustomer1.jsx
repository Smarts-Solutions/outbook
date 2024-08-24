import React, { useState, useEffect ,useRef} from "react";
import { Steps } from "antd";
import { Provider } from "./MultiStepFormContext";
import Service from "./Service";
import Engagement from "./Engagement";
import Paper from "./Paper";
import Information from "./Information";


let detailsInitialState = {
    name: "",
    age: "",
    profession: "",
    status: 1
};

let addressInitialState = {
    customer: "",
    address2: "",
    city: "",
    coustomerId: 0

};

const AddCustomer = () => {

    const [details, setDetails] = useState(detailsInitialState);
    const [address, setAddress] = useState(addressInitialState);
    // const [coustomerId, setCoustomerId] = useState("");
    // const [currentStep, setCurrentStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = localStorage.getItem('currentStep');
        return savedStep !== null ? Number(savedStep) : 0;
    });

    const [coustomerId, setCoustomerId] = useState(() => {
        const savedId = localStorage.getItem('coustomerId');
        return savedId !== null ? savedId : "";
    });
    
    // const currentStep = useRef(0);

    const { Step } = Steps;

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


    const next = (data) => {
        setCoustomerId(data);
        localStorage.setItem('coustomerId', data);
        if (currentStep < 3) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            localStorage.setItem('currentStep', nextStep);
        } else {
            setCurrentStep(0);
            localStorage.setItem('currentStep', 0);
            setDetails(detailsInitialState);
            setAddress(addressInitialState);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            localStorage.setItem('currentStep', prevStep);
        }
    };

    useEffect(() => {
        addressInitialState.coustomerId = coustomerId;
        // setAddress({ ...addressInitialState, coustomerId });
        setAddress(coustomerId)
    }, [coustomerId]);

    return (

        <>
          <div className='content-title'>
                <div className='tab-title'>
                            <h3 className='mt-0'>Create New Customer</h3>
                        </div>
                </div>
        <div className='report-data mt-4'>
            {/* <div className='d-flex justify-content-between align-items-center'>
                <div className='tab-title'>
                    <h3 className='mt-0'>Create New Customer</h3>
                </div>
            </div> */}
            <div className="col-sm-12">
                <div className="page-title-box">
               
                    <Provider value={{ details, setDetails, next, prev, address, setAddress }}>
                        <Steps current={currentStep}>
                            <Step title="Customer Information" />
                            <Step title="Services" />
                            <Step title="Engagement Model" />
                            <Step title="Paper Work" />
                        </Steps>
                        <main>{renderStep(currentStep)}</main>
                    </Provider>
                </div>
            </div>
        </div>
        </>
    );
};

export default AddCustomer;
