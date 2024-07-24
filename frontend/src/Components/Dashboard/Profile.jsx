import React, { useEffect , useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../ReduxStore/Slice/Staff/staffSlice';
 

const Profile = () => {
    const dispatch = useDispatch();
    const [getProfileDetails, setGetProfileDetails] = useState([]);
  
    const id = JSON.parse(localStorage.getItem("staffDetails")).id

    
    const Profile = async (e) => {
        const req = { id: id  }
        await dispatch(getProfile(req))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setGetProfileDetails(response.data)   
                }
                else{
                    setGetProfileDetails([])   
                }

            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    
    

    useEffect(() => {
        Profile()
    },[])


 
    return (
        <div className="container">
            <div className="main-body mt-3">

                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                        alt="Admin"
                                        className="rounded-circle"
                                        width={150}
                                    />
                                    <div className="mt-3">
                                        <h4>{getProfileDetails && getProfileDetails.first_name}</h4>
                                        {/* <p className="text-secondary mb-1">Full Stack Developer</p>
                                        <p className="text-muted font-size-sm">
                                            Bay Area, San Francisco, CA
                                        </p>
                                        <button className="btn btn-primary">Follow</button>
                                        <button className="btn btn-outline-primary">Message</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-8">
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Full Name</h6>
                                    </div>
                                    <div className="col-sm-9 ">{getProfileDetails && getProfileDetails.first_name + " " +  getProfileDetails.last_name}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Email</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{getProfileDetails && getProfileDetails.email}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Phone</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{getProfileDetails && getProfileDetails.phone}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Status</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{getProfileDetails && getProfileDetails.status}</div>
                                </div>
                               
                                 
                                <hr />
                                <div className="row">
                                    <div className="col-sm-12">
                                        <a
                                            className="btn btn-info "
                                            target="__blank"
                                            href="https://www.bootdey.com/snippets/view/profile-edit-data-and-skills"
                                        >
                                            Edit
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile