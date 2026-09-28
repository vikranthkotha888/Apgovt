import { UserProfile, UserRole } from '../types/governance';
import { AuthSession, UserCategory, getUserCategoryFromRole, getPermissionsForCategory } from '../types/auth';
import { DEMO_USERS } from '../data/governanceData';

const SESSION_STORAGE_KEY = 'ap_gov_secure_session_v1';

export class MockAuthService {
  /**
   * Initializes or restores session from storage.
   */
  static getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      
      // Check session validity (8 hour expiry)
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  /**
   * Generates a secure session token and persists state.
   */
  static createSession(user: UserProfile, explicitCategory?: UserCategory): AuthSession {
    const category = explicitCategory || getUserCategoryFromRole(user.role);
    const token = `ap_sec_${category.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours session

    const session: AuthSession = {
      user,
      category,
      token,
      loginTime: now.toISOString(),
      expiresAt: expires.toISOString(),
      permissions: getPermissionsForCategory(category)
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  /**
   * Clears session (Logout).
   */
  static clearSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  /**
   * Authenticate with email/mobile and password.
   */
  static async loginWithCredentials(
    identifier: string,
    pass: string,
    selectedCategory: UserCategory
  ): Promise<AuthSession> {
    // Simulated network delay
    await new Promise(res => setTimeout(res, 350));

    // Match existing demo user or generate mock session
    let matchedUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === identifier.toLowerCase() ||
           u.phone?.replace(/\s+/g, '').includes(identifier.replace(/\s+/g, ''))
    );

    if (!matchedUser) {
      if (selectedCategory === 'Administrator') {
        matchedUser = DEMO_USERS[0]; // CM
      } else if (selectedCategory === 'Official') {
        matchedUser = DEMO_USERS[4]; // Collector
      } else {
        matchedUser = DEMO_USERS[DEMO_USERS.length - 1]; // Citizen
      }
    }

    return this.createSession(matchedUser, selectedCategory);
  }

  /**
   * Quick role-switch login.
   */
  static loginAsPreset(user: UserProfile): AuthSession {
    const category = getUserCategoryFromRole(user.role);
    return this.createSession(user, category);
  }
}
