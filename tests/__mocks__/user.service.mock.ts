export const createMockUserService = () => ({
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  login: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
});
