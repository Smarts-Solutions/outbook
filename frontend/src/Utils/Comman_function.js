import { ClientErrorMessages } from "./Common_Message";
import { Email_regex } from "./Common_regex";
import axios from "axios";

export const getDateRange = (tabId) => {
  const today = new Date();
  let startDate;
  let endDate;

  switch (tabId) {
    case "this-week":
      // Set start date to the previous Sunday
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);

      // Set end date to the upcoming Saturday
      endDate = new Date(today);
      endDate.setDate(today.getDate() + (6 - today.getDay()));
      endDate.setHours(23, 59, 59, 999);
      break;

    case "last-week":
      // Set start date to the previous week's Sunday
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() - 7);
      startDate.setHours(0, 0, 0, 0);

      // Set end date to the previous week's Saturday
      endDate = new Date(today);
      endDate.setDate(today.getDate() - today.getDay() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "this-month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "last-month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "last-quarter":
      const quarterStartMonth = Math.floor((today.getMonth() - 3) / 3) * 3;
      startDate = new Date(today.getFullYear(), quarterStartMonth, 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(today.getFullYear(), quarterStartMonth + 3, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "this-6-months":
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 6);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "this-year":
      startDate = new Date(today.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(today.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "last-year":
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(today.getFullYear() - 1, 11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      startDate = today;
      endDate = today;
      break;
  }

  return { startDate, endDate };
};

export const ScrollToViewFirstError = (newErrors) => {
  if (Object.keys(newErrors).length !== 0) {
    const errorField = Object.keys(newErrors)[0];

    const errorElement = document.getElementById(errorField);
    if (errorElement) {
      const elementPosition = errorElement.getBoundingClientRect().top + window.pageYOffset;

      const offset = 30;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  }
}

export const ScrollToViewFirstErrorContactForm = (errors) => {
  errors.forEach((errorObj, index) => {
    for (const field in errorObj) {
      if (errorObj[field]) {
        const fieldId = `${field}-${index}`;
        const errorElement = document.getElementById(fieldId);

        if (errorElement) {
          const elementPosition = errorElement.getBoundingClientRect().top + window.pageYOffset;
          const offset = 30;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth',
          });
        }
        return;
      }
    }
  });
};

const RemoveErrorFromErrors = (name, setErrors) => {
  setErrors((prevErrors) => {
    const updatedErrors = { ...prevErrors };
    delete updatedErrors[name];
    return updatedErrors;
  });
}

export const validate = (name, value, errors, setErrors) => {
  const newErrors = { ...errors };
  if (value != '' && !value?.trim() && ClientErrorMessages[name]) { 
    if (name === "email" || name === "phone") {
      delete newErrors[name]; 
      RemoveErrorFromErrors(name, setErrors);  
    } else {
      newErrors[name] = ClientErrorMessages[name];   
    }
  } else { 
    switch (name) {
      case "email":
        if (!Email_regex(value)) {
          newErrors[name] = "Please enter a valid email";
        } else {
          delete newErrors[name];   
          RemoveErrorFromErrors(name, setErrors);  
        }
        break;

      case "phone":
        if (!/^\d{9,12}$/.test(value)) {
          newErrors[name] = "Phone number must be between 9 to 12 digits";
        } else {
          delete newErrors[name];  
          RemoveErrorFromErrors(name, setErrors);
        }
        break;

      case "VATNumber":
        if (!/^[0-9+]*$/.test(value)) {
          newErrors[name] = "Please enter a valid VAT Number";
        } else {
          delete newErrors[name];   
          RemoveErrorFromErrors(name, setErrors);
        }
        break;

      default:
        delete newErrors[name];  
        RemoveErrorFromErrors(name, setErrors);
        break;
    }
  }
 
  ScrollToViewFirstError(newErrors);
 
  setErrors((prevErrors) => ({
    ...prevErrors,
    ...newErrors,
  }));
 
  return Object.keys(newErrors).length === 0;
};

export async function GET_IP(data, token) {
  try {
    const res = await axios.get(`https://api.ipify.org?format=json`)
    return await res.data.ip;
  }
  catch (err) {
  }
}

export const convertDate = (date) => {
  if (date) {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return "";
}

export const allowedTypes = 
  [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpg",
    "image/jpeg",
    "message/rfc822", // For .eml
    "application/vnd.ms-outlook", // For .msg
    "application/mbox", // For .mbox
    "application/vnd.ms-outlook-pst", // For .pst
    "application/vnd.ms-outlook-ost", // For .ost
    "text/vcard", // For .vcf
    "text/calendar", // For .ics
    "application/vnd.ms-outlook-template", // For .oft
    "text/csv", // For .csv
    "application/vnd.ms-excel", // For .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // For .xlsx

  ]

