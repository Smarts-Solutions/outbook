import React from 'react'

const Hierarchy = ({ show, active, id }) => {
    console.log(show, active, id)
    return (
        <div>
            <div className="row">
                <div className={`${show.length == 2 ? 'col-6' : show.length == 3 ? 'col-9' : 'col-12'}`}>
                    <div className="breadcrumb">
                        <a href="#" className="active col-lg-3">
                            <span className="breadcrumb__inner">
                                <span className="breadcrumb__title">{show[0]}</span>
                                <span className="breadcrumb__desc">{id.trading_address}</span>
                            </span>
                        </a>
                        <a href="#" className={`${active>=2 ? 'active' : ''} col-lg-3`} >
                            <span className="breadcrumb__inner">
                                <span className="breadcrumb__title">{show[1]}</span>
                                <span className="breadcrumb__desc">Second Item</span>
                            </span>
                        </a>
                        {show.length >= 3 ? <a href="#" className={`${active>=3 ? 'active' : ''} col-3`}>
                            <span className="breadcrumb__inner">
                                <span className="breadcrumb__title">{show[2]}</span>
                                <span className="breadcrumb__desc">Third Item</span>
                            </span>
                        </a> : ''
                        }
                        {
                            show.length == 4 ? <a href="#" className={`${active>=4 ? 'active' : ''} col-3`}>
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">{show[3]}</span>
                                    <span className="breadcrumb__desc">Fourth Item</span>

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