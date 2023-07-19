const HttpError = (status, massage) => {
  const error = new Error();
  error.massage = massage;
  error.status = status;

  return error;
};

export default HttpError;
