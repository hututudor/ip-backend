import { Response as ExpressResponse } from 'express';

export const Response
  = {
  success(data: any) {
    return (res: Response) => ({ status: 200, data, error: false });
  },

  unauthorized(data: any) {
    return (res: Response) => ({ status: 401, data, error: true });
  },

  noData() {
    return (res: Response) => ({ status: 409, error: false });
  },

  notFound(data: any) {
    return (res: Response) => ({ status: 404, data, error: true });
  },

  badRequest(data: any) {
    return (res: Response) => ({ status: 400, data, error: true });
  },
};
