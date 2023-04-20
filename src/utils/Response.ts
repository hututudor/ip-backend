export interface Response {
  status: number;
  data: any;
}

export const Response = {
  success: (data: any) => ({
    status: 200,
    data: { error: false, ...data },
  }),
  badRequest: (data: any) => ({
    status: 400,
    data: { error: true, ...data },
  }),
  unauthorized: (data: any) => ({
    status: 401,
    data: { error: true, ...data },
  }),
  noData: () => ({
    status: 409,
    data: { error: false },
  }),
  notFound: (data: any) => ({
    status: 404,
    data: { error: true, ...data },
  }),
};
