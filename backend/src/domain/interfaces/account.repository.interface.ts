import { Account } from "../entities/account.entity";
import { IBaseRepository } from "./base.repository";

export interface IAccountRepository extends IBaseRepository<Account> {
    findAll(): Promise<Account[]>;
}