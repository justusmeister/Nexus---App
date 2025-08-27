export const LightTheme = {
  dark: false,
  colors: {
    // === Grundfarben ===
    background: "#FDFDFD",   // leicht dunkler als #FFFFFF
    text: "#1A1A1A",
    primary: "#2F80ED",
    card: "#F5F5F5",         // leicht dunkler für besseren Kontrast zu Weiß
    border: "#DADADA",       // minimal dunkler

    // === Kalenderfarben ===
    calendarExam: "#F2C94C",
    calendarHoliday: "#9AD8F5",
    calendarEvent: "#B05FD5",
    calendarWeekend: "#E0E0E0",
    calendarTodayBorder: "#2F80ED",

    // === Stundenplan ===
    lessonDefault: "#E4EEF9",

    // === Statusfarben ===
    warning: "#E54848",      // leicht dunkler für besseren Textkontrast
    success: "#219653",

    emailBox: "#2F80ED",
    deadlineBox: "#E54848",
    newsBox: "#219653",
    

    // === Subject Colors ===
    subjectColors: [
      "#E54848", "#F2994A", "#F2C94C", "#219653",
      "#6FCF97", "#2F80ED", "#56CCF2", "#9B51E0",
      "#B05FD5", "#795548", "#607D8B", "#34495E"
    ],

    iconBg: {
      primary: "#2F80ED",   // sattes Blau
      warning: "#E54848",   // sattes Rot
      success: "#27AE60",   // sattes Grün
      exam: "#CFAF1D",      // sattes Gelb
      neutral: "#4B5563"    // sattes Grau
    }
  },
  fonts: {
    regular: "Inter_500Regular",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10, lg: 16 },
  bottomTabTint: "systemThinMaterialLight",
};

export const DarkTheme = {
  dark: true,
  colors: {
    // === Grundfarben ===
    background: "#0C0C0E",   // weniger hart als #000000
    text: "#FFFFFF",
    primary: "#2F80ED",
    card: "#1F1F21",         // leicht heller
    border: "#4A4A4D",       // etwas heller

    // === Kalenderfarben ===
    calendarExam: "#F2C94C",
    calendarHoliday: "#6CBFDD",
    calendarEvent: "#B96DD8",
    calendarWeekend: "#3E3E40",
    calendarTodayBorder: "#2F80ED",

    // === Stundenplan ===
    lessonDefault: "#33465B",

    // === Statusfarben ===
    warning: "#FF5C5C",
    success: "#27AE60",

    emailBox: "#2F80ED",
    deadlineBox: "#FF5C5C",
    newsBox: "#27AE60",
    
    // === Subject Colors ===
    subjectColors: [
      "#E54848", "#F2994A", "#F2C94C", "#219653",
      "#6FCF97", "#2F80ED", "#56CCF2", "#9B51E0",
      "#B96DD8", "#795548", "#607D8B", "#34495E"
    ],

    iconBg: {
      primary: "#2F80ED",   // sattes Blau
      warning: "#E54848",   // sattes Rot
      success: "#27AE60",   // sattes Grün
      exam: "#CFAF1D",      // sattes Gelb
      neutral: "#4B5563"    // sattes Grau
    }
    
  },
  fonts: {
    regular: "Inter_500Regular",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10, lg: 16 },
  bottomTabTint: "systemThinMaterialDark"
};
