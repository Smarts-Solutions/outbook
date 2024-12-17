import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProfile } from "../../ReduxStore/Slice/Staff/staffSlice";

const Profile = () => {
  const dispatch = useDispatch(); 
  const [getProfileDetails, setGetProfileDetails] = useState([]);

  const id = JSON.parse(localStorage.getItem("staffDetails")).id;

  const Profile = async (e) => {
    const req = { id: id };
    await dispatch(getProfile(req))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setGetProfileDetails(response.data);
        } else {
          setGetProfileDetails([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  
  useEffect(() => {
    Profile();
  }, []);

  return (
    <div className="container">
      <div className="main-body mt-3">
        <div className="card">
          <div className="card-body">
            <div className="dastyle-profile">
              <div className="row py-3">
                <div className="col-lg-4 align-self-center mb-3 mb-lg-0">
                  <div className="dastyle-profile-main justify-content-center">
                    <div className="">
                      <img
                        src="assets/images/users/profile.png"
                        alt="Admin"
                        className="rounded-circle"
                        width={200}
                      />
                    </div>
                    <div className="dastyle-profile_user-detail">
                      {/* <h5 className="dastyle-user-name">{getProfileDetails && getProfileDetails.first_name}</h5> */}
                      {/* <p className="mb-0 dastyle-user-name-post">UI/UX Designer, India</p> */}
                    </div>
                  </div>
                </div>
                {/*end col*/}
                <div className="col-lg-8 ml-auto align-self-center">
                  <ul className="list-unstyled personal-detail mb-0">
                    <li className=" mb-3">
                      <i className=" ti-user mr-2 text-secondary font-22 align-middle" />{" "}
                      <b>Full Name : </b>
                      {getProfileDetails &&
                        getProfileDetails.first_name +
                          " " +
                          getProfileDetails.last_name || 'NA'}
                    </li>
                    <li className="mb-3">
                      <i className="fa-regular fa-phone mr-2 text-secondary font-22 align-middle" />{" "}
                      <b>Phone :</b>{" "}
                      {getProfileDetails && getProfileDetails.phone || 'NA'}
                    </li>
                    <li className="mb-3">
                      <i className="fa-regular fa-envelope text-secondary font-22 align-middle mr-2" />{" "}
                      <b>Email :</b>{" "}
                      {getProfileDetails && getProfileDetails.email || 'NA'}
                    </li>
                    <li className="mb-3">
                      <i className="fa-regular fa-power-off text-secondary font-22 align-middle mr-2" />{" "}
                      <b>Status :</b>{" "}
                      {getProfileDetails && getProfileDetails.status==1 ? "Active" : "Inactive"}
                    </li>
                    {/* <li className="">
                      <button className="btn btn-info">
                        <i className="fa fa-edit pe-2"></i>Edit{" "}
                      </button>
                    </li> */}
                  </ul>
                </div>
              </div>
              {/*end row*/}
            </div>
            {/*end f_profile*/}
          </div>
        </div> 
      </div>
    </div>
  );
};

export default Profile;
