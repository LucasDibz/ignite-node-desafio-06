import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to create a deposit statement", async () => {
    const user = await usersRepository.create({
      email: "user@email.com",
      name: "user",
      password: "123",
    });

    const response = await createStatementUseCase.execute({
      amount: 100,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(response).toHaveProperty("id");
  });

  it("should be able to create a withdraw statement", async () => {
    const user = await usersRepository.create({
      email: "user@email.com",
      name: "user",
      password: "123",
    });

    await createStatementUseCase.execute({
      amount: 500,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const response = await createStatementUseCase.execute({
      amount: 400,
      description: "withdraw test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a withdraw statement with insufficient funds", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: "user@email.com",
        name: "user",
        password: "123",
      });

      await createStatementUseCase.execute({
        amount: 500,
        description: "withdraw test",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to create any statement with a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 250,
        description: "statement test",
        type: OperationType.DEPOSIT,
        user_id: "not_user",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
