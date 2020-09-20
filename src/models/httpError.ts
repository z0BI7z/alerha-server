class HttpError extends Error {
  statusCode: number;

  constructor(message: string | undefined, statusCode: number | undefined) {
    super(message);

    this.statusCode = statusCode || 500;
  }
}

export default HttpError;