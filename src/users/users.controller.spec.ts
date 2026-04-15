import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = { id: 1, name: 'John', email: 'john@example.com', role: 'alumno' };

  const mockUsersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', () => {
      mockUsersService.findAll.mockReturnValue([mockUser]);
      expect(controller.findAll()).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      mockUsersService.findById.mockReturnValue(mockUser);
      expect(controller.findOne('1')).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when not found', async () => {
      mockUsersService.findById = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a user', () => {
      const dto = { name: 'Jane', email: 'jane@example.com', password: 'password123', role: 'alumno' };
      mockUsersService.create.mockResolvedValue({ id: 2, name: 'Jane', email: 'jane@example.com', role: 'alumno' });
      expect(controller.create(dto)).resolves.toEqual(expect.objectContaining({ name: 'Jane' }));
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const dto = { name: 'Updated' };
      mockUsersService.update.mockReturnValue({ ...mockUser, ...dto });
      expect(controller.update('1', dto)).toEqual({ ...mockUser, ...dto });
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when not found', async () => {
      mockUsersService.update = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      mockUsersService.remove.mockReturnValue(mockUser);
      expect(controller.remove('1')).toEqual(mockUser);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when not found', async () => {
      mockUsersService.remove = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});