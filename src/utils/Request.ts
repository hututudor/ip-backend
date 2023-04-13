export class _req {
  _header: any;
  _body: any;

  constructor(header: any = {}, body: any = {}) {
    this._header = header;
    this._body = body;
  }

  get header(): any {
    return this._header;
  }

  get body(): any {
    return this._body;
  }
  set header(header: any) {
    this._header = header;
  }

  set body(body: any) {
    this._body = body;
  }
}