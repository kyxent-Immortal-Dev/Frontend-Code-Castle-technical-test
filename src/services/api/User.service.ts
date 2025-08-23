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

}
