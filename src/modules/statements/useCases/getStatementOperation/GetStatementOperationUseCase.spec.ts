import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get a statement operation", async () => {
    const user = await usersRepository.create({
      email: "user@email.com",
      name: "user",
      password: "123",
    });

    const statement = await statementsRepository.create({
      amount: 500,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    });

    expect(statementOperation).toBe(statement);
  });

  it("should not be able to get the statement operation of a non-existent user", async () => {
    expect(async () => {
      const statement = await statementsRepository.create({
        amount: 500,
        description: "deposit test",
        type: OperationType.DEPOSIT,
        user_id: "user_id",
      });

      await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: "not_user",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a non-existent statement operation", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: "user@email.com",
        name: "user",
        password: "123",
      });

      await getStatementOperationUseCase.execute({
        statement_id: "not_statement",
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
