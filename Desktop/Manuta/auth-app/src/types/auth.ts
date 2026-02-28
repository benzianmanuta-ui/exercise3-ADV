export interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  setupComplete: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  completeSetup: (data: {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  }) => void;
  logout: () => void;
}
