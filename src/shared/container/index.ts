import { container } from "tsyringe";

import { IStatementsRepository } from "../../modules/statements/repositories/IStatementsRepository";
import { StatementsRepository } from "../../modules/statements/repositories/StatementsRepository";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";
import { UsersRepository } from "../../modules/users/repositories/UsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IStatementsRepository>(
  "StatementsRepository",
  StatementsRepository
);
