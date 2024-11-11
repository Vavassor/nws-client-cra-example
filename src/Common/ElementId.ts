export const sanitizeId = (value: string) => {
  return value.replace(/\s/g, "");
};
