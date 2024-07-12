import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    private readonly users = [
        {
            userId: 1,
            email: 'john@john.com',
            password: 'nhoj',
            roles: ['admin']
        },
        {
            userId: 2,
            email: 'maria@maria.com',
            password: 'airam',
        },
    ];

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }
}