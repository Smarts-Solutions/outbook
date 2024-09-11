import React, { useState, useRef, useEffect } from 'react';

function CustomMultiSelect({ options, placeholder, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const selectRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);



  const handleOptionClick = (e,option) => {

    const isSelected = selectedOptions.includes(option);
    let updatedOptions;
    
    if (isSelected) {
      updatedOptions = selectedOptions.filter((item) => item !== option);
    } else {
      updatedOptions = [...selectedOptions, option];
    }
    
    setSelectedOptions(updatedOptions);
    if (onChange) onChange(updatedOptions);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-multi-select-container w-100" ref={selectRef}>
      <div className="custom-multi-select-header form-control" onClick={toggleDropdown}>
        {selectedOptions.length > 0
          ? selectedOptions.map((option) => option.label).join(', ')
          : placeholder}
  
        <span className={`arrow fa ${isOpen ? 'open' : 'fa'}`}>&#xf107;</span>
      </div>
      {isOpen && (
        <ul className="custom-multi-select-options">
          {options.map((option, index) => (
            <li
              key={index}
              className={`custom-multi-select-option ${
                selectedOptions.includes(option) ? 'selected' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={(e) => handleOptionClick(e,option)}
              />
              <span className="form-control" onClick={() => handleOptionClick(option)}>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomMultiSelect;
