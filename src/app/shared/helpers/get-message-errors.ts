export function getErrors(errors: any): string[] {
  if (Array.isArray(errors)) {
    return getErrorsFromArray(errors);
  }

  console.log("errors not array");
  return new Array(errors["error"]["Message"]);
}

export function getErrorsFromArray(errors: any[]): string[] {
  if (typeof errors[0] === "string" && errors[0].toString().length > 1) return errors;
  if (errors[0].toString().toLowerCase().includes("exception")) return new Array(errors[1]);
  if (errors[0].toString().length == 1) return [errors.join("")];
  let errorMessages = errors[0] as string[];
  let errorsArray = [];

  for (let prop in errorMessages) {
    errorsArray = errorsArray.concat(errorMessages[prop]);
  }
  return errorsArray;
}
