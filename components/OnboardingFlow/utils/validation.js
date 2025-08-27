export const validateName = (name) => {
    return name.trim().length >= 2;
  };
  
  export const validateRegion = (region) => {
    return region !== '';
  };