import { Response } from 'express';

export class _res {
  success(data: any) {
    return (res: Response) => res.status(200).json(data);
  }

  unauthorized(data: any) {
    return (res: Response) => res.status(401).json({ error: true, data });
  }

  noData() {
    return (res: Response) => res.status(409).json({ error: false });
  }
}