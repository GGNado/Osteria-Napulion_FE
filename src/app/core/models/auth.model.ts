export interface LoginDTO {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imageUrl: string;
}

export interface UserDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imageUrl: string;
}

export interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    roles?: string[];
}
