export class HttpError extends Error {
  statusCode: number;

  constructor(message: string | undefined, statusCode: number | undefined) {
    super(message);

    this.statusCode = statusCode || 500;
  }
}

export class TypedHttpError extends HttpError {
  type: string;

  constructor(message: string | undefined, type: string | undefined, statusCode: number | undefined) {
    super(message, statusCode);

    this.type = type || 'UNKNOWN';
  }
}