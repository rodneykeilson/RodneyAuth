type User = {
    id: string;
    email: string;
    name: string;
    authenticatorSecret?: string;
};

let users: User[] = [];

export async function findUserByEmail(email: string): Promise<User | undefined> {
    return users.find(user => user.email === email);
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
        id: `user_${Date.now()}`,
        ...userData,
    };
    users.push(newUser);
    return newUser;
}

export async function getUsers() {
    return users;
}
