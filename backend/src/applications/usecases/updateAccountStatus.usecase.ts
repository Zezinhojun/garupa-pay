import { inject, injectable } from "inversify";
import { Account } from "../../domain/entities/account.entity";
import { AccountRepository } from "../../infrastructure/database/repositories/account.repository";
import { TYPES } from "../../di/types";

export interface UpdateAccountStatusDTO {
    accountId: string;
}

@injectable()
export class UpdateAccountStatusUseCase {
    private readonly accountRepository: AccountRepository;


    constructor(
        @inject(TYPES.AccountRepository)
        accountRepository: AccountRepository) {
        this.accountRepository = accountRepository;
    }

    async execute(input: UpdateAccountStatusDTO): Promise<Account> {
        const { accountId } = input;

        const account = await this.accountRepository.findById(accountId)


        if (!account) {
            throw new Error('Account not found');
        }

        if (account.isActive) {
            account.deactivateAccount();
        } else {
            account.activateAccount();
        }

        await this.accountRepository.update(accountId, account);
        return account;
    }
}