export const globalResponse = (
  success: boolean,
  message: string,
  data: any,
): {
  success: boolean;
  message: string;
  data: any;
} => {
  const result = {
    success,
    message,
    data,
  };

  return result;
};
