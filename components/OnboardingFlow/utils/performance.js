export const createMemoizedCallback = (callback, dependencies) => {
    return React.useCallback(callback, dependencies);
  };
  
  export const createMemoizedValue = (computation, dependencies) => {
    return React.useMemo(computation, dependencies);
  };