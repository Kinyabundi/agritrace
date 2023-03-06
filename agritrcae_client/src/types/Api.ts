interface IApiSuccessResponse<T> {
  status: "ok";
  msg: string;
  data?: T;
}
interface IApiErrorResponse {
  status: "error" | "failure" | "not-ready";
  msg: string;
}

export type IApiResponse<T = any> = IApiSuccessResponse<T> | IApiErrorResponse;
