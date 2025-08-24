import type {
  DataUsers,
  UsersResponseI,
} from "../../interfaces/users/Users.Interfaces";
import { httpClient } from "../htttp.client.service";

export class UserService {
  private httpClient: typeof httpClient;

  constructor() {
    this.httpClient = httpClient;
  }

  async getUsers(): Promise<UsersResponseI> {
    const response = await this.httpClient.get("/users");
    return response.data;
  }

  async createUser(user: DataUsers): Promise<UsersResponseI> {
    const response = await this.httpClient.post("/users", user);
    return response.data;
  }

  async updateUser(user: DataUsers): Promise<UsersResponseI> {
    const response = await this.httpClient.put(`/users/${user.id}`, user);
    return response.data;
  }

  async deleteUser(id: string): Promise<UsersResponseI> {
    const response = await this.httpClient.delete(`/users/${id}`);
    return response.data;
  }

  async getUserById(id: string): Promise<UsersResponseI> {
    const response = await this.httpClient.get(`/users/${id}`);
    return response.data;
  }
}
