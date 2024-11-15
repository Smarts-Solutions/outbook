import React, { useState } from 'react';

const SlidingTable = () => {
  const [columns] = useState(generateColumns(52));  
  const [visibleColumns, setVisibleColumns] = useState(columns.slice(0, 6)); 
  const [currentIndex, setCurrentIndex] = useState(0);  

  const getAllWeeklyReports = () => {
    const req = {
      
    }
  };

  function generateColumns(num) {
    const cols = [];
    for (let i = 1; i <= num; i++) {
      cols.push(`Column ${i}`);
    }
    return cols;
  }

  const slideNext = () => {
    if (currentIndex + 6 < columns.length) {
      const newIndex = currentIndex + 6;
      setVisibleColumns(columns.slice(newIndex, newIndex + 6));
      setCurrentIndex(newIndex);
    }
  };

  const slidePrev = () => {
    if (currentIndex - 6 >= 0) {
      const newIndex = currentIndex - 6;
      setVisibleColumns(columns.slice(newIndex, newIndex +6));
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className='containr-fluid mt-5'> 
    <div className='report-data'>
      <div className='mb-2'>
      <button className="btn btn-info " onClick={slidePrev} disabled={currentIndex === 0}>
        Prev
      </button>
      <button className="btn btn-info ms-2" onClick={slideNext} disabled={currentIndex + 6 >= columns.length}>
        Next
      </button>
      </div>
      <div className="table-wrapper">
        <table className="table table-striped">
          <thead className='table-light table-head-blue'>
            <tr>
              <th className="fixed-column">Name</th>
              {visibleColumns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fixed-column">1</td>
              {visibleColumns.map((col, index) => (
                <td key={index}>{`${col} Data`}</td>
              ))}
            </tr>
            <tr>
              <td className="fixed-column">2</td>
              {visibleColumns.map((col, index) => (
                <td key={index}>{`${col} Data`}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default SlidingTable;
