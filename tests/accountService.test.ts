import { AccountService } from '../src/services/account/AccountService';
import { Repository } from 'typeorm';
import { Account } from '../src/entities/account';
import { People } from '../src/entities/people';
import AppDataSource from '../src';
import { CreateAccountRequest, ListAccountRequest } from '../src/services/account/types';

jest.mock('../src/index.ts', () => ({
  getRepository: jest.fn()
}));

describe('AccountService', () => {
  let accountService: AccountService;
  let mockAccountRepository: jest.Mocked<Repository<Account>>;
  let mockPeopleRepository: jest.Mocked<Repository<People>>;

  beforeEach(() => {
    mockAccountRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    } as unknown as jest.Mocked<Repository<Account>>;
    
    mockPeopleRepository = {
      findOne: jest.fn()
    } as unknown as jest.Mocked<Repository<People>>;

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Account) return mockAccountRepository;
      if (entity === People) return mockPeopleRepository;
    });

    accountService = new AccountService();
  });

  describe('createAccount', () => {
    it('should return error if branch length is not 3', async () => {
      const request: CreateAccountRequest = { branch: '12', account: '1234567-8', ownerId: 'owner-id' };
      const result = await accountService.createAccount(request);
      expect(result).toEqual(new Error('Branch deve apenas conter 3 digitos!'));
    });

    it('should return error if account mask is invalid', async () => {
      const request: CreateAccountRequest = { branch: '123', account: '12345678', ownerId: 'owner-id' };
      const result = await accountService.createAccount(request);
      expect(result).toEqual(new Error('A conta deve estar no padrão XXXXXXX-X!'));
    });

    it('should return error if account already exists', async () => {
      const request: CreateAccountRequest = { branch: '123', account: '1234567-8', ownerId: 'owner-id' };
      mockAccountRepository.findOne.mockResolvedValueOnce({} as Account);
      const result = await accountService.createAccount(request);
      expect(result).toEqual(new Error('Uma conta ja existe com este valor!'));
    });

    it('should create account successfully', async () => {
      const request: CreateAccountRequest = { branch: '123', account: '1234567-8', ownerId: 'owner-id' };
      const owner = { id: 'owner-id' } as People;
      const newAccount = { id: 'account-id', branch: '123', account: '1234567-8', createdAt: new Date(), updatedAt: new Date() } as Account;

      mockPeopleRepository.findOne.mockResolvedValueOnce(owner);
      mockAccountRepository.findOne.mockResolvedValueOnce(null);
      mockAccountRepository.create.mockReturnValue(newAccount);
      mockAccountRepository.save.mockResolvedValueOnce(newAccount);

      const result = await accountService.createAccount(request);
      expect(result).toEqual({
        id: newAccount.id,
        branch: newAccount.branch,
        account: newAccount.account,
        createdAt: newAccount.createdAt,
        updatedAt: newAccount.updatedAt
      });
    });
  });

  describe('listAllAccountsByOwner', () => {
    it('should list accounts by owner ID successfully', async () => {
      const request: ListAccountRequest = { ownerId: 'owner-id' };
      const accounts = [
        { id: 'account-id', branch: '123', account: '1234567-8', createdAt: new Date(), updatedAt: new Date() }
      ] as Account[];

      mockAccountRepository.find.mockResolvedValueOnce(accounts);

      const result = await accountService.listAllAccountsByOwner(request);
      expect(result).toEqual(accounts.map(({ amount, ...rest }) => rest));
    });

    it('should return empty array if no accounts found for owner ID', async () => {
      const request: ListAccountRequest = { ownerId: 'owner-id' };
      mockAccountRepository.find.mockResolvedValueOnce([]);
      const result = await accountService.listAllAccountsByOwner(request);
      expect(result).toEqual([]);
    });
  });

  describe('getBallance', () => {
    it('should return error if account does not exist', async () => {
      const accountId = 'non-existent-account-id';
      mockAccountRepository.findOne.mockResolvedValueOnce(null);
      const result = await accountService.getBallance(accountId);
      expect(result).toEqual(new Error('Conta inexistente!'));
    });

    it('should return the account balance as an absolute value', async () => {
      const accountId = 'account-id';
      const account = { id: accountId, amount: -500 } as Account;
      mockAccountRepository.findOne.mockResolvedValueOnce(account);
      const result = await accountService.getBallance(accountId);
      expect(result).toStrictEqual({"balance": 500});
    });
  });
});
