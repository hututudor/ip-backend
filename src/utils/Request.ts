import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { IncomingHttpHeaders } from 'http';
import { Response } from '../utils/Response';

export interface Request {
  body: any;
  headers: Record<string, string>;
  params: any;
  query: any;
  userId: any;
}

const convertHeaders = (
  headers: IncomingHttpHeaders,
): Record<string, string> => {
  const convertedHeaders: Record<string, string> = {};

  for (const key in headers) {
    const headerValue = headers[key];
    if (Array.isArray(headerValue)) {
      convertedHeaders[key] = headerValue.join(', ');
    } else if (headerValue !== undefined) {
      convertedHeaders[key] = headerValue;
    }
  }

  return convertedHeaders;
};

const createRequest = (req: ExpressRequest): Request => {
  return {
    body: req.body,
    headers: convertHeaders(req.headers),
    params: req.params,
    query: req.query,
    userId: req.userId,
  };
};

export const handleRequest =
  (handler: (request: Request) => Response | Promise<Response>) =>
  async (req: ExpressRequest, res: ExpressResponse) => {
    const { status, data } = await handler(createRequest(req));
    res.status(status).json(data);
  };
