import React, { useState, useEffect, useRef } from "react";

const CustomMultiselect = () => {
  const options = [
    { 
      id: 1, 
      label: "Option 1", 
      subOptions: [
        { id: 11, label: "Sub Option 1" }, 
        { id: 12, label: "Sub Option 2", subOptions: [{ id: 121, label: "Sub Sub Option 1" }] } 
      ] 
    },
    { 
      id: 2, 
      label: "Option 2", 
      subOptions: [
        { id: 21, label: "Sub Option 3" }
      ]
    },
    { id: 3, label: "Option 3", subOptions: [] },
    { 
      id: 4, 
      label: "Option 4", 
      subOptions: [
        { id: 41, label: "Sub Option 4" },
        { id: 42, label: "Sub Option 5", subOptions: [{ id: 421, label: "Sub Sub Option 2" }] }
      ]
    },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openMainOption, setOpenMainOption] = useState(null);
  const [openSubDropdowns, setOpenSubDropdowns] = useState({});
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // If dropdown is closing, close all subdropdowns
      setOpenMainOption(null);
      setOpenSubDropdowns({});
    }
  };

  const handleCheckboxChange = (optionId, hasSubOptions) => {
    const isOptionSelected = selectedOptions.includes(optionId);

    // If the option is being selected, open subdropdowns if it has any
    if (!isOptionSelected) {
      setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, optionId]);
      if (hasSubOptions) {
        setOpenSubDropdowns({ [optionId]: true });
      }
    } else {
      // Option is being deselected, but subdropdowns should stay open if there are other selected options
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((id) => id !== optionId)
      );
    }
  };

  const handleOptionClick = (optionId, hasSubOptions) => {
    if (openMainOption === optionId) {
      // Toggle the currently open main option
      setOpenMainOption(null);
      setOpenSubDropdowns({});
    } else {
      // Open the new main option and close any other open subdropdowns
      setOpenMainOption(optionId);
      setOpenSubDropdowns({});
      if (hasSubOptions) {
        setOpenSubDropdowns({ [optionId]: true });
      }
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setOpenMainOption(null);
      setOpenSubDropdowns({});
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderSubOptions = (subOptions) => {
    return (
      <div className="sub-dropdown-menu">
        {subOptions.map((subOption) => (
          <div key={subOption.id} className="dropdown-item-wrapper">
            <label className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedOptions.includes(subOption.id)}
                onChange={() => handleCheckboxChange(subOption.id, subOption.subOptions && subOption.subOptions.length > 0)}
              />
              {subOption.label}
            </label>
            {openSubDropdowns[subOption.id] && subOption.subOptions && subOption.subOptions.length > 0 && (
              renderSubOptions(subOption.subOptions)
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="custom-multiselect" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="multiselect dropdown-toggle">
        <span className="multiselect-selected-text">Select options</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div key={option.id} className="dropdown-item-wrapper">
              <label className="dropdown-item" onClick={() => handleOptionClick(option.id, option.subOptions.length > 0)}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleCheckboxChange(option.id, option.subOptions.length > 0)}
                />
                {option.label}
              </label>
              {openMainOption === option.id && option.subOptions.length > 0 && (
                renderSubOptions(option.subOptions)
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMultiselect;
