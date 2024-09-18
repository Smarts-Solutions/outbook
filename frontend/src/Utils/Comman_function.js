import { ClientErrorMessages } from "./Common_Message";
import { Email_regex } from "./Common_regex";

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
  if (!value && ClientErrorMessages[name]) {
    newErrors[name] = ClientErrorMessages[name];
  }
  else {
    switch (name) {
      case "email":
        if (!Email_regex(value)) {
          newErrors[name] = "Please enter valid Email";
        } else {
          delete newErrors[name];
          RemoveErrorFromErrors(name, setErrors);
        }
        break;

      case "phone":
        if (!/^\d{9,12}$/.test(value)) {
          newErrors[name] = "Phone Number must be between 9 to 12 digits";
        } else {
          delete newErrors[name];
          RemoveErrorFromErrors(name, setErrors);
        }
        break;
      case "VATNumber":
        if (!/^[0-9+]*$/.test(value)) {
          newErrors[name] = "Please enter valid VAT Number";
        } else {
          delete newErrors[name];
          RemoveErrorFromErrors(name, setErrors);
        }
      default:
        delete newErrors[name];
        RemoveErrorFromErrors(name, setErrors);
        break;
    }
  }

  ScrollToViewFirstError(newErrors);

  if (Object.keys(newErrors).length !== 0) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
  }

  return Object.keys(newErrors).length === 0;
};
