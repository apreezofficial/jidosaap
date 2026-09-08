export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string | null;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("jidosapp_token");
  }

  private getWorkspaceId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("jidosapp_workspace_id");
  }

  public setToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("jidosapp_token", token);
    } else {
      localStorage.removeItem("jidosapp_token");
    }
  }

  public setWorkspaceId(workspaceId: string | null) {
    if (typeof window === "undefined") return;
    if (workspaceId) {
      localStorage.setItem("jidosapp_workspace_id", workspaceId);
    } else {
      localStorage.removeItem("jidosapp_workspace_id");
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}/${endpoint.replace(/^\//, "")}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const workspaceId = this.getWorkspaceId();
    if (workspaceId) {
      headers["X-Workspace-Id"] = workspaceId;
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json: ApiResponse<T> = await res.json();

      if (!res.ok && !json.error) {
        return {
          success: false,
          error: {
            code: `HTTP_${res.status}`,
            message: res.statusText || "Request failed",
          },
        };
      }

      return json;
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: err.message || "Unable to communicate with JidoSapp API",
        },
      };
    }
  }

  public get<T = any>(endpoint: string, query?: Record<string, string | number | boolean>) {
    let path = endpoint;
    if (query) {
      const q = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null) q.append(k, String(v));
      });
      const qs = q.toString();
      if (qs) path += (path.includes("?") ? "&" : "?") + qs;
    }
    return this.request<T>(path, { method: "GET" });
  }

  public post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
