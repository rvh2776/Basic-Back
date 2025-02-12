import { JwtService } from '@nestjs/jwt';
// import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { UserDto } from '../users/dtos/UserDto';

describe('authservice', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;

  const mockUser: Omit<UserDto, 'id'> = {
    name: 'Rafael',
    createdAt: '15/06/2024',
    password: 'Candela1#',
    rePassword: 'Candela1#',
    email: 'rafael.vh@gmail.com',
    phone: 26198761221,
    isAdmin: false,
    country: 'Argentina',
    address: 'Barrio: Don Bosco M: i casa: 8',
    city: 'Maipu, Mendoza',
    // orders: Order[''],
  };

  const usersDb = new Map<string, User>();

  beforeEach(async () => {
    // mockUsersService = {
    //   findByEmail: () => Promise.resolve(undefined),
    //   createUser: (user: Omit<User, 'id'>): Promise<User> =>
    //     Promise.resolve({
    //       ...user,
    //       isAdmin: false,
    //       id: '7a904eed-9370-43e6-98f2-c46b7910d84b',
    //     }),
    // };

    mockUsersService = {
      findByEmail: (email: string) => Promise.resolve(usersDb.get(email)),
      createUser: (user: Omit<User, 'id'>): Promise<User> => {
        const newUser = { ...user, id: '7a904eed-9370-43e6-98f2-c46b7910d84b' };
        usersDb.set(user.email, newUser as User);
        return Promise.resolve(newUser as User);
      },
    };

    const mockJwtService = {
      sign: (payload) => jwt.sign(payload, 'testSecret'),
      decode: (token) => jwt.decode(token),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Crear una instancia de AuthService', async () => {
    expect(authService).toBeDefined();
  });

  it('signUp() retorna error si el email ya existe en usuarios', async () => {
    mockUsersService.findByEmail = () => Promise.resolve(mockUser as UserDto);

    try {
      await authService.signUp(mockUser as UserDto);
    } catch (error) {
      expect(error.message).toEqual(
        `El email: ${mockUser.email} ya existe en el sistema`,
      );
    }
  });

  it('signUp() crear un nuevo usuario con password encriptado', async () => {
    const user = await authService.signUp(mockUser as UserDto);

    expect(user).toBeDefined();

    const createdUser = await mockUsersService.findByEmail(mockUser.email);
    expect(createdUser).toBeDefined();
    expect(createdUser.password).not.toEqual(mockUser.password);

    const isPasswordHashed = await bcrypt.compare(
      mockUser.password,
      createdUser.password,
    );
    expect(isPasswordHashed).toBe(true);
  });

  it('signIn() retorna error si el password es invalido', async () => {
    // mockUsersService.getUserByEmail = (email: string) =>
    //   Promise.resolve(mockUser as User);
    mockUsersService.findByEmail = () => Promise.resolve(mockUser as UserDto);

    try {
      await authService.validateUser(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error.message).toEqual('Email o password incorrectos');
    }
  });

  it('signIn() retorna error si el usuario no existe', async () => {
    try {
      await authService.validateUser(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error.message).toEqual('El usuario no existe');
    }
  });

  it('signIn() retorna un objeto con un mensaje y el token si el usuario y el password son validos', async () => {
    const mockUserVariant = {
      ...mockUser,
      password: await bcrypt.hash(mockUser.password, 10),
    };

    mockUsersService.findByEmail = () =>
      Promise.resolve(mockUserVariant as UserDto);

    const reponse = await authService.validateUser(
      mockUser.email,
      mockUser.password,
    );

    expect(reponse).toBeDefined();
    expect(reponse.token).toBeDefined();
    expect(reponse.success).toEqual('User logged in successfully');
  });
});
