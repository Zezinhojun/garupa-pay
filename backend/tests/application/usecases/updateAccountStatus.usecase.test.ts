import { AppError } from "../../../src/applications/error/appError";
import { UpdateAccountStatusUseCase } from "../../../src/applications/usecases/updateAccountStatus.usecase"
import { Account } from "../../../src/domain/entities/account.entity";
import { accountRepositoryMock, mockAccount } from "../../utils/Mocks"

describe('UpdateAccountStatus usecase', () => {
    let sut: UpdateAccountStatusUseCase
    let accountMock: Account;

    beforeEach(() => {
        accountMock = new Account(mockAccount);
        sut = new UpdateAccountStatusUseCase(accountRepositoryMock)
    })

    it('should deactivate account if it is active', async () => {
        const deactivateSpy = jest.spyOn(accountMock, 'deactivateAccount');

        accountRepositoryMock.findById = jest.fn().mockResolvedValue(accountMock);
        accountRepositoryMock.update = jest.fn().mockResolvedValue(accountMock);

        const result = await sut.execute({ accountId: '1' });

        expect(result.isActive).toBe(false);
        expect(deactivateSpy).toHaveBeenCalled();
        expect(accountRepositoryMock.update).toHaveBeenCalledWith('1', accountMock);
    });

    it('should throw an error if account not found', async () => {
        accountRepositoryMock.findById = jest.fn().mockResolvedValue(null);

        await expect(sut.execute({ accountId: 'non-existent-id' }))
            .rejects
            .toThrow(AppError.notFound("Account not found"));
    });

    it('should activate account if it is inactive', async () => {
        const inactiveAccount = new Account({
            ...mockAccount,
            isActive: false,
        });

        const activateSpy = jest.spyOn(inactiveAccount, 'activateAccount');

        accountRepositoryMock.findById = jest.fn().mockResolvedValue(inactiveAccount);
        accountRepositoryMock.update = jest.fn().mockResolvedValue(inactiveAccount);

        const result = await sut.execute({ accountId: '1' });

        expect(result.isActive).toBe(true);
        expect(activateSpy).toHaveBeenCalled();
        expect(accountRepositoryMock.update).toHaveBeenCalledWith('1', inactiveAccount);
    });

    it('should call accountRepository.update', async () => {
        const account = new Account(mockAccount);
        accountRepositoryMock.findById = jest.fn().mockResolvedValue(account);
        accountRepositoryMock.update = jest.fn().mockResolvedValue(account);

        await sut.execute({ accountId: '1' });

        expect(accountRepositoryMock.update).toHaveBeenCalledWith('1', account);
    });
})