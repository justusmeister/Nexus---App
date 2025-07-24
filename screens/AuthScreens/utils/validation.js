export const validateEmail = (email) => {
    if (!email) {
      return "Bitte E-Mail eingeben";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Ungültige E-Mail-Adresse";
    }
    return "";
  };
  
  export const validatePassword = (password) => {
    if (!password) {
      return "Bitte Passwort eingeben";
    }
    if (password.length < 8) {
      return "Passwort muss mindestens 8 Zeichen haben";
    }
    if (!/\d/.test(password)) {
      return "Passwort muss mindestens eine Zahl enthalten";
    }
    return "";
  };
  
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return "Bitte Passwort bestätigen";
    }
    if (confirmPassword !== password) {
      return "Passwörter stimmen nicht überein";
    }
    return "";
  };
  
  export const validateRegistration = ({ email, password, confirmPassword }) => {
    const errors = {};
    
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };