export const checkDeadlineRemainingTime = (dueDate) => {
  const [day, month, year] = dueDate.split(".").map(Number);
  const submissionDate = new Date(year + 2000, month - 1, day, 7, 0, 0);
  const currentDate = new Date();

  const differenceInMilliseconds = submissionDate - currentDate;
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  const diffInDays = differenceInHours / 24;
  const diffInMonths = diffInDays / 30;

  if (differenceInMilliseconds < 0) {
    // Abgelaufenen Zeit in Stunden
    let expiredTime = -1 * (differenceInMilliseconds / (1000 * 60 * 60));

    // Überprüfung ob die Zeit weniger als 1 Stunde beträgt
    expiredTime =
      expiredTime >= 1
        ? Math.round(expiredTime)
        : parseFloat(expiredTime.toFixed(2));

    // Return mit in Minuten wenn Zeit weniger als 1 Stunde entspricht
    if (expiredTime < 1) {
      expiredTimeInMinutes = Math.floor((parseFloat(expiredTime.toFixed(2)) % 1) * 60);

      return {
        time: `seit ${expiredTimeInMinutes} Minuten abgelaufen`,
        isWithinTwoDays: 0,
      };
    }

    // Return mit in Stunden wenn Zeit weniger als 1 Tag entspricht
    if (expiredTime < 24) {
      return {
        time: `seit ${expiredTime} Stunden abgelaufen`,
        isWithinTwoDays: 0,
      };
    }

    // Return mit in Tagen und Stunden wenn Zeit weniger als 2 Tagen entspricht
    // Sonst Return delete zum löschen der Deadline
    if (expiredTime >= 24 && expiredTime < 48) {
      // Abgelaufene Zeit in Tagen
      const days = Math.floor(expiredTime / 24);
      // Abgelaufene Zeit in Stunden 
      const hours = Math.floor(expiredTime % 24);
      return {
        time: `seit ${days} Tag ${hours >= 1
          ? `und ${hours} Stunde${hours === 1 ? "" : "n"}`
          : ""
          } abgelaufen`,
        isWithinTwoDays: 0,
      };
    } else if (expiredTime >= 48) {
      return {
        time: "delete",
        isWithinTwoDays: -1,
      };
    }
  }

  switch (true) {
    case differenceInMinutes < 60: {
      const remainingMinutes = Math.round(differenceInMinutes);
      return {
        time: `${remainingMinutes} Minute${remainingMinutes === 1 ? "" : "n"}`,
        isWithinTwoDays: 1,
      };
    }

    case differenceInHours < 24: {
      const remainingHours = Math.round(differenceInHours);
      return {
        time: `${remainingHours} Stunde${remainingHours === 1 ? "" : "n"}`,
        isWithinTwoDays: 1,
      };
    }

    case diffInDays < 2: {
      const fullDays = Math.floor(diffInDays);
      const remainingHours = Math.round((diffInDays - fullDays) * 24);
      return {
        time: `${fullDays} Tag${fullDays === 1 ? "" : "e"}${remainingHours > 0
          ? ` und ${remainingHours} Stunde${remainingHours === 1 ? "" : "n"}`
          : ""
          }`,
        isWithinTwoDays: 1,
      };
    }

    case diffInDays < 28: {
      const fullDays = Math.round(diffInDays);
      const weeks = Math.floor(fullDays / 7);
      const remainingDays = fullDays % 7;
      return {
        time: `${weeks > 0 ? `${weeks} Woche${weeks === 1 ? "" : "n"}` : ""}${remainingDays > 0
          ? `${weeks > 0 ? " und " : ""}${remainingDays} Tag${remainingDays === 1 ? "" : "e"
          }`
          : ""
          }`,
        isWithinTwoDays: 2,
      };
    }

    case diffInMonths < 6: {
      const fullMonths = Math.floor(diffInMonths);
      const remainingDays = Math.round((diffInMonths - fullMonths) * 30);
      const remainingWeeks = Math.floor(remainingDays / 7);
      return {
        time: `${fullMonths > 0 ? `${fullMonths} Monat${fullMonths === 1 ? "" : "e"}` : ""}${remainingWeeks > 0
          ? `${fullMonths > 0 ? " und " : ""}${remainingWeeks} Woche${remainingWeeks === 1 ? "" : "n"
          }`
          : ""
          }`,
        isWithinTwoDays: 2,
      };
    }

    default: {
      const roundedMonths = Math.round(diffInDays / 30);
      return {
        time: `${roundedMonths} Monat${roundedMonths === 1 ? "" : "e"}`,
        isWithinTwoDays: 2,
      };
    }
  }
};
