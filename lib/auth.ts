
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.authState.user = JSON.parse(userData);
        this.authState.isAuthenticated = true;
      }
    }
    return this.authState.user;
  }

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@ticket.com' && password === 'demo123') {
          const user: User = {
            id: '1',
            email,
            name: 'Demo User',
            phone: '+1234567890',
            isVerified: true
          };
          this.authState.user = user;
          this.authState.isAuthenticated = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
          }
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  register(userData: { email: string; password: string; name: string; phone: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          isVerified: false
        };
        this.authState.user = user;
        this.authState.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        resolve(user);
      }, 1000);
    });
  }

  logout(): void {
    this.authState.user = null;
    this.authState.isAuthenticated = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  verifyEmail(code: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === '123456') {
          if (this.authState.user) {
            this.authState.user.isVerified = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(this.authState.user));
            }
          }
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return !!userData;
    }
    return this.authState.isAuthenticated;
  }
}

export const authService = AuthService.getInstance();
