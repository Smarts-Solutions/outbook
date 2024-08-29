

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