import { ClientErrorMessages } from "./Common_Message";
import { Email_regex } from "./Common_regex";
import axios from "axios";
import dayjs from "dayjs";

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
  // if (value != ''  && !value?.trim() && ClientErrorMessages[name]) { 
  //   if (name === "email" || name === "phone") {
  //     delete newErrors[name]; 
  //     RemoveErrorFromErrors(name, setErrors);  
  //   } else {
  //     newErrors[name] = ClientErrorMessages[name];   
  //   }
  // }
  if (value != ''&& typeof value === "string" && value.trim() === "" && ClientErrorMessages[name]) { 
    if (name === "email" || name === "phone") {
      delete newErrors[name];
      RemoveErrorFromErrors(name, setErrors);
    } else {
      newErrors[name] = ClientErrorMessages[name];
    }
  }
  
  else { 
   
    switch (name) {
      // case "email":
      //   if (!Email_regex(value)) {
      //     newErrors[name] = "Please enter a valid email";
      //   } else {
      //     delete newErrors[name];   
      //     RemoveErrorFromErrors(name, setErrors);  
      //   }
      //   break;

      // case "phone":
      //   if (!/^\d{9,12}$/.test(value)) {
      //     newErrors[name] = "Phone number must be between 9 to 12 digits";
      //   } else {
      //     delete newErrors[name];  
      //     RemoveErrorFromErrors(name, setErrors);
      //   }
      //   break;

      // case "VATNumber":
      //   if (!/^[0-9+]*$/.test(value)) {
      //     newErrors[name] = "Please enter a valid VAT Number";
      //   } else {
      //     delete newErrors[name];   
      //     RemoveErrorFromErrors(name, setErrors);
      //   }
      //   break;

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

export const convertDate1 = (date) => {
  if (date) {
    return dayjs(date).format('DD-MM-YYYY');
  }else {
    return "";
  }
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
  ];

export const promptJobStatusOtp = async (Swal, initialSeconds = 600, alreadySent = false) => {
  let timerInterval = null;
  let remaining = initialSeconds > 0 ? initialSeconds : 600;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const statusNote = alreadySent
    ? "An active OTP was already sent to the authorized person's phone for this job."
    : "An OTP has been sent to the authorized person's phone to approve changes to this locked job.";

  const result = await Swal.fire({
    title: "Enter OTP",
    html: `
      <div style="font-size: 14px; color: #555; margin-bottom: 12px; line-height: 1.5;">
        ${statusNote}
      </div>
      <div style="margin-bottom: 15px; font-size: 15px; font-weight: 600; color: #0284c7;">
        OTP Valid for: <span id="swal-otp-timer" style="color: #dc2626; font-size: 16px; font-weight: 700;">${formatTime(remaining)}</span>
      </div>
      <input id="swal-otp-input" class="swal2-input custom-otp-swal-input" placeholder="Enter 6-digit OTP" style="margin: 0 auto; text-align: center; letter-spacing: 2px; font-weight: 600; font-size: 18px; max-width: 260px;" autofocus autocomplete="off" maxlength="6" />
    `,
    showCancelButton: true,
    confirmButtonText: "Verify",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "custom-otp-swal-popup",
      confirmButton: "custom-otp-swal-confirm",
      cancelButton: "custom-otp-swal-cancel",
    },
    didOpen: () => {
      const inputEl = document.getElementById("swal-otp-input");
      const timerEl = document.getElementById("swal-otp-timer");
      if (inputEl) inputEl.focus();

      timerInterval = setInterval(() => {
        remaining -= 1;
        if (timerEl) {
          if (remaining > 0) {
            timerEl.textContent = formatTime(remaining);
          } else {
            timerEl.textContent = "Expired";
            timerEl.style.color = "#b91c1c";
            clearInterval(timerInterval);
          }
        }
      }, 1000);
    },
    willClose: () => {
      if (timerInterval) clearInterval(timerInterval);
    },
    preConfirm: () => {
      const inputEl = document.getElementById("swal-otp-input");
      const val = inputEl ? inputEl.value.trim() : "";
      if (!val) {
        Swal.showValidationMessage("Please enter the OTP!");
        return false;
      }
      return val;
    },
  });

  return result.value || null;
};


