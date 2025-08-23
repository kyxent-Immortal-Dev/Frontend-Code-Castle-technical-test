import type { LoginDataI, LoginResponseI } from "../../interfaces/auth/LoginI";
import type { LogoutResponseI } from "../../interfaces/auth/LogoutI";
import type { RefreshResponseI } from "../../interfaces/auth/RefreshI";
import type { ProfileResponseI } from "../../interfaces/auth/ProfileI";
import type {
  RegisterDataI,
  RegisterResponseI,
} from "../../interfaces/auth/RegisterI";
import { httpClient } from "../htttp.client.service";

export class AuthService {
  private readonly httpClient: typeof httpClient;

  constructor() {
    this.httpClient = httpClient;
  }

  async login(data: Partial<LoginDataI>): Promise<LoginResponseI> {
    const response = await this.httpClient.post<LoginResponseI>("/login", data);
    return response.data;
  }

  async register(data: Partial<RegisterDataI>): Promise<RegisterResponseI> {
    const response = await this.httpClient.post<RegisterResponseI>(
      "/register",
      data
    );
    return response.data;
  }

  async logout(): Promise<LogoutResponseI> {
    const response = await this.httpClient.post<LogoutResponseI>("/logout");
    return response.data;
  }

  async profile(): Promise<ProfileResponseI> {
    const response = await this.httpClient.get<ProfileResponseI>("/profile");
    return response.data;
  }

  async refresh(): Promise<RefreshResponseI> {
    const response = await this.httpClient.post<RefreshResponseI>("/refresh");
    return response.data;
  }
}
