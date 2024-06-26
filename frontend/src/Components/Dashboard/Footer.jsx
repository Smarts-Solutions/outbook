import React, { useState, useEffect } from 'react';


const Footer = () => {

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
      // Update the current year when the component mounts
      setCurrentYear(new Date().getFullYear());
    }, []); // Empty dependency array ensures this effect runs only once
  
  return (
    <div className='footer'>
         <p className='mb-0'> © {currentYear} Outbooks.</p>
    </div>
  )
}

export default Footer