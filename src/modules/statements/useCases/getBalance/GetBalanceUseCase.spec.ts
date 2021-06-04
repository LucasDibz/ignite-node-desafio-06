import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get the user balance", async () => {
    const user = await usersRepository.create({
      email: "user@email.com",
      name: "user",
      password: "123",
    });

    const deposit = await statementsRepository.create({
      amount: 500,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const withdraw = await statementsRepository.create({
      amount: 400,
      description: "withdraw test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toStrictEqual({
      statement: [deposit, withdraw],
      balance: 100,
    });
  });

  it("should not be able to get a balance of a non-existent user", async () => {
    expect(async () => {
      await statementsRepository.create({
        amount: 100,
        description: "test",
        type: OperationType.DEPOSIT,
        user_id: "not_user",
      });

      await getBalanceUseCase.execute({
        user_id: "not_user",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
