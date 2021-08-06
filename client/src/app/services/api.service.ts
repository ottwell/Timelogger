import { IApiEntity } from "../interfaces/IApiEntity";

export class ApiService {
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  public async get(relativeUrl: string): Promise<IApiEntity | IApiEntity[]> {
    const _resp = await fetch(`${this._baseUrl}/${relativeUrl}`, {
      headers: {
        Accept: "application/json",
      },
    });
    if (_resp.status !== 200) throw _resp.statusText;
    const _body = await _resp.json();
    return _body.value ? _body.value : undefined;
  }

  public async post(relativeUrl: string, body: any): Promise<IApiEntity> {
    const _resp = await fetch(`${this._baseUrl}/${relativeUrl}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (_resp.status > 299) throw _resp.statusText;
    const _body = await _resp.json();
    return _body;
  }

  public async patch(relativeUrl: string, body: any): Promise<void> {
    const _resp = await fetch(`${this._baseUrl}/${relativeUrl}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (_resp.status > 299) throw _resp.statusText;
  }
}
