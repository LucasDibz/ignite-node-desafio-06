import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create an user", async () => {
    const response = await createUserUseCase.execute({
      name: "test",
      email: "test@email.com",
      password: "123",
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create an existing user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user1",
        email: "user@email.com",
        password: "1234",
      });

      await createUserUseCase.execute({
        name: "user2",
        email: "user@email.com",
        password: "4321",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
