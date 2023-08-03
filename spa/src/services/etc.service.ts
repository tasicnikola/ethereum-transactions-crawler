import { HttpMethod } from "../types/HttpMethod";

class ETCService {
  public static apiUrl = process.env.REACT_APP_ETC_API;

  public static sendRequest<T>(
    method: HttpMethod,
    url: string,
    body?: T
  ): Promise<any> {
    const requestOptions: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    };
    const requestUrl = `${this.apiUrl}/${url}`;

    return fetch(requestUrl, requestOptions)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}

export default ETCService;
