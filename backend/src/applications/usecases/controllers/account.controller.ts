import { inject, injectable } from "inversify";
import { Account } from "../../../domain/entities/account.entity";
import { IRequest } from "../../../domain/interfaces/base.controller.interface";
import { AccountRepository } from "../../../infrastructure/database/repositories/account.repository";
import { UpdateAccountStatusUseCase } from "../updateAccountStatus.usecase";
import { BaseController } from "./base.controller";
import { TYPES } from "../../../di/types";
import { AppError } from "../../error/appError";
import { isUUID } from "validator";

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

    async updatedStatus(req: IRequest, res: any, next: any) {
        const { accountId } = req.params;
        try {
            if (!accountId || !isUUID(accountId)) {
                throw AppError.badRequest("Invalid account ID format");
            }
            const updatedAccount = await this.updateAccountStatusUseCase.execute({ accountId });
            return res.status(200).json(updatedAccount);
        } catch (error) {
            next(error)
        }
    }
}