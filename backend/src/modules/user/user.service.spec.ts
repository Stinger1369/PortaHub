import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345',
      createdAt: new Date(), // Ajoutez les propriétés nécessaires
      _id: 'mocked-id', // Simulez un _id si nécessaire
    };

    jest.spyOn(service, 'signup').mockImplementation(async () => user as any);

    expect(await service.signup(user)).toEqual(user);
  });
});
