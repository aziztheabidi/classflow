import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly repository: UsersRepository) {
    void this.repository;
  }
}
