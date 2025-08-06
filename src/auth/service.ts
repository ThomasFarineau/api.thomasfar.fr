
export class AuthService {

  constructor() {
  }

  async login(username: string, password: string) {
    return {
      id: "user-id",
      mail: "user-mail",
      role: "user-role"
    }
  }

  async logout(token: string): Promise<void> {
    console.log(`Logging out token: ${token}`);
  }
}