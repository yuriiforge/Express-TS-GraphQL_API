import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../../src/modules/user/user.service';

const prismaMock = mockDeep<PrismaClient>();

const hashServiceMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};

let userService: UserService;

beforeEach(() => {
  mockReset(prismaMock);
  userService = new UserService(prismaMock, hashServiceMock as any);
});
describe('UserService', () => {
  describe('createUser', () => {
    test('should create a user with hashed password', async () => {
      hashServiceMock.hash.mockResolvedValue('hashed123');

      prismaMock.user.create.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@test.com',
        password: 'hashed123',
        age: 20,
      });

      const result = await userService.createUser({
        name: 'John',
        email: 'john@test.com',
        password: 'mypassword',
        age: 20,
      });

      expect(hashServiceMock.hash).toHaveBeenCalledWith('mypassword');
      expect(result.user.email).toBe('john@test.com');
      expect(result.user.password).toBe('hashed123');
      expect(result.token).toBeDefined();
    });

    test('should throw if password too short', async () => {
      await expect(
        userService.createUser({
          name: 'John',
          email: 'john@test.com',
          password: '123',
          age: 20,
        })
      ).rejects.toThrow('Password must be at least 8 characters long');
    });
  });

  describe('getUsers', () => {
    test('should return filtered users', async () => {
      prismaMock.user.findMany.mockResolvedValue([
        { id: 1, name: 'Alice', email: 'a@a.com', password: 'p', age: 20 },
      ]);

      const result = await userService.getUsers({
        query: 'Ali',
        skip: 0,
        take: 10,
      });

      expect(prismaMock.user.findMany).toHaveBeenCalled();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alice');
    });

    test('should return empty array if prisma returns null', async () => {
      prismaMock.user.findMany.mockResolvedValue(null as any);

      const result = await userService.getUsers({});

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    test('should return a user', async () => {
      prismaMock.user.findUniqueOrThrow.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'j@test.com',
        password: 'p',
        age: 20,
      });

      const user = await userService.getUserById(1);
      expect(user?.id).toBe(1);
    });

    test('should throw if user not found', async () => {
      prismaMock.user.findUniqueOrThrow.mockRejectedValue(
        new Error('Not found')
      );

      await expect(userService.getUserById(999)).rejects.toThrow('Not found');
    });
  });

  describe('updateUser', () => {
    test('should update user', async () => {
      prismaMock.user.update.mockResolvedValue({
        id: 1,
        name: 'NewName',
        email: 'test@test.com',
        password: 'p',
        age: 22,
      });

      const result = await userService.updateUser(1, { name: 'NewName' });

      expect(result.name).toBe('NewName');
    });
  });

  describe('deleteUser', () => {
    test('should delete user', async () => {
      prismaMock.user.delete.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@test.com',
        password: 'p',
        age: 20,
      });

      const result = await userService.deleteUser(1);

      expect(result.id).toBe(1);
    });
  });
});
