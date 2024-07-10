export const log = (...params: any) => {
  console.log(new Date(), ...params)
}

export const getErrorMessage = (errorCode: number): string => {
    switch (errorCode) {
      case 401:
        return "Invalid username or password";
      case 500:
        return "Internal server error";
      default:
        return "Unknown error";
    }
  };