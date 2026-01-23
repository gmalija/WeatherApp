export interface HttpClientRequestOptions {
  query?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T>(url: string, options?: HttpClientRequestOptions): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, options?: HttpClientRequestOptions): Promise<T> {
    const { query, headers } = options ?? {};

    const queryString = query
      ? Object.entries(query)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
      : '';

    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const response = await fetch(fullUrl, { headers });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status} ${response.statusText}`;

      try {
        const errorBody = await response.text();
        if (errorBody) {
          console.error('API Error Response:', errorBody);
          errorMessage += ` - ${errorBody}`;
        }
      } catch (e) {
        // Ignore if we can't read the error body
      }

      console.error('Failed request URL:', fullUrl.replace(/apikey=[^&]+/, 'apikey=***'));
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as T;

    return json;
  }
}
