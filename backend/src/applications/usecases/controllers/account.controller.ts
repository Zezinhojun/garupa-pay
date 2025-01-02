import { inject, injectable } from "inversify";
import { Account } from "../../../domain/entities/account.entity";
import { IRequest } from "../../../domain/interfaces/base.controller.interface";
import { AccountRepository } from "../../../infrastructure/database/repositories/account.repository";
import { UpdateAccountStatusUseCase } from "../updateAccountStatus.usecase";
import { BaseController } from "./base.controller";
import { TYPES } from "../../../di/types";

@injectable()
export class AccountController extends BaseController<Account> {
    constructor(
        @inject(TYPES.AccountRepository)
        private readonly accountRepository: AccountRepository,
        @inject(TYPES.UpdateAccountStatusUseCase)
        private readonly updateAccountStatusUseCase: UpdateAccountStatusUseCase
    ) {
        super(accountRepository);
    }

    async updatedStatus(req: IRequest, res: any) {
        const { accountId } = req.params;

        if (!accountId) {
            return res.status(400).json({ error: "Id is required" });
        }

        try {
            const updatedAccount = await this.updateAccountStatusUseCase.execute({ accountId });
            return res.status(200).json(updatedAccount);
        } catch (error) {
            const errorMessage = (error as Error).message;
            return res.status(500).json({ error: errorMessage });
        }
    }
}