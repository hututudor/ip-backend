import { Request as ExpressRequest } from 'express';
import { IncomingHttpHeaders } from 'http';

export interface Request {
  body: any;
  headers: Record<string, string>;
  params: any;
  query: any;
}

const convertHeaders = (headers: IncomingHttpHeaders): Record<string, string> => {
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

export const createRequest = (req: ExpressRequest): Request => {
  return {
    body: req.body,
    headers: convertHeaders(req.headers),
    params: req.params,
    query: req.query,
  };
};
