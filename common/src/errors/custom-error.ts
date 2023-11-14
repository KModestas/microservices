// all our errors will extend this abstract class, allowing a single instance of check to be made in middlewares/error-handler
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // this line has to be added anytime we extend a built in javascript class like Error
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
