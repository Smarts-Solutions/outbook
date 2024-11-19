import React from 'react'
import {useNavigate} from 'react-router-dom'

const Hierarchy = ({ show, active, data , NumberOfActive }) => {

    console.log("data", data)
    console.log("show", show)
    console.log("active", active)
    console.log("NumberOfActive", NumberOfActive)
    
   
  
    const navigate = useNavigate()
    const fun = (navigateTo , active) => {
        if(active<navigateTo){
            return
        }
        if(active == 1){
            navigate('/admin/customer')
        }
        if(active == 2 && navigateTo == 1){
            navigate('/admin/customer')
        }
        if(active == 2 && navigateTo == 2){
            window.history.back()
        }
        if(active == 3 && navigateTo == 1){
            navigate('/admin/customer')
        }
        if(active == 3 && navigateTo == 2){
            window.history.back()
            window.history.back()
        }
        if(active == 3 && navigateTo == 3){
            window.history.back()
        }
  
    }
    return (
        <div>
            <div className="row">
                <div className={`${show.length == 2 ? 'col-6' : show.length == 3 ? 'col-9' : 'col-12'}`}>
                    <div className="breadcrumb">
                        <a  className="active col-lg-3" onClick={(e)=>fun(1 ,active)}>
                            <span className="breadcrumb__inner">
                                <span className="breadcrumb__title">{show[0]}</span>
                                <span className="breadcrumb__desc">{ data?.customer?.trading_name}</span>
                                {/* {active==1 ?  <span>{NumberOfActive}</span> : ""  } */}
                            </span>
                        </a>
                        <a  className={`${active>=2 ? 'active' : ''} col-lg-3`}  onClick={(e)=>fun(2 , active)}>
                            <span className="breadcrumb__inner">
                                <span className="breadcrumb__title">{show[1]}</span>
                                <span className="breadcrumb__desc">{active>=2 && show[1]=="Job" ? data?.job?.job_code_id : active>=2 && show[1]=="Client" ?  data?.client?.client_name : "" }</span>
                             {active==1 ?  <span>{NumberOfActive ? "(" +NumberOfActive+")" : ""}</span> : ""  }
                            </span>
                        </a>
                        {show.length >= 3 ? <a  className={`${active>=3 ? 'active' : ''} col-3`} onClick={(e)=>fun(3, active)}>
                            <span className="breadcrumb__inner">
                                <span className="breadcrumb__title">{show[2]}</span>
                                <span className="breadcrumb__desc">{active>=3 ? data?.job?.job_code_id : ""}</span>
                                {active==2 ?  <span>{NumberOfActive ? "(" +NumberOfActive+")" : ""}</span> : ""  }
                            </span>
                        </a> : ''
                        }
                        {
                            show.length == 4 ? <a  className={`${active>=4 ? 'active' : ''} col-3`} onClick={(e)=>fun(4 , active)}>
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">{show[3]}</span>
                                     
                                </span>
                            </a> : ''
                        }


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hierarchy