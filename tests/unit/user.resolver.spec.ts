import { createMockUserService } from '../__mocks__/user.service.mock';
import {
  __setUserService,
  userResolvers,
} from '../../src/modules/user/user.resolver';

describe('UserResolvers', () => {
  let mockService: any;

  beforeEach(() => {
    mockService = createMockUserService();
    __setUserService(mockService);
  });

  describe('Query.users', () => {
    it('returns list of users', async () => {
      mockService.getUsers.mockResolvedValue([{ id: 1, email: 'a@test.com' }]);

      const result = await userResolvers.Query.users(
        null,
        { query: '', skip: 0, first: 10 },
        {} as any
      );

      expect(mockService.getUsers).toHaveBeenCalledWith({
        query: '',
        skip: 0,
        take: 10,
      });

      expect(result).toEqual([{ id: 1, email: 'a@test.com' }]);
    });
  });

  describe('Query.me', () => {
    it('throws when no userId', async () => {
      await expect(
        userResolvers.Query.me(null, {}, { userId: null } as any)
      ).rejects.toThrow('You are not authorized');
    });

    it('returns current user', async () => {
      mockService.getUserById.mockResolvedValue({
        id: 1,
        email: 'me@test.com',
      });

      const result = await userResolvers.Query.me(null, {}, {
        userId: '1',
      } as any);

      expect(mockService.getUserById).toHaveBeenCalledWith(1);
      expect(result.email).toBe('me@test.com');
    });
  });

  describe('Mutation.createUser', () => {
    it('creates user', async () => {
      mockService.createUser.mockResolvedValue({
        user: {
          id: 10,
          email: 'new@test.com',
        },
        token: 'TEST_TOKEN',
      });

      const result = await userResolvers.Mutation.createUser(
        null,
        {
          data: { name: 'Yurii', email: 'new@test.com', password: '12345678' },
        },
        {} as any
      );

      expect(mockService.createUser).toHaveBeenCalledWith({
        name: 'Yurii',
        email: 'new@test.com',
        password: '12345678',
      });

      expect(result.user.id).toBe(10);
      expect(result.token).toBe('TEST_TOKEN');
    });
  });

  describe('Mutation.updateUser', () => {
    it('updates user', async () => {
      mockService.updateUser.mockResolvedValue({
        id: 1,
        name: 'Updated',
      });

      const result = await userResolvers.Mutation.updateUser(
        null,
        { id: 1, data: { name: 'Updated' } },
        {} as any
      );

      expect(mockService.updateUser).toHaveBeenCalledWith(1, {
        name: 'Updated',
      });

      expect(result.name).toBe('Updated');
    });
  });

  describe('Mutation.deleteUser', () => {
    it('deletes user', async () => {
      mockService.deleteUser.mockResolvedValue({ id: 1 });

      const result = await userResolvers.Mutation.deleteUser(
        null,
        { id: 1 },
        {} as any
      );

      expect(mockService.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });
});
