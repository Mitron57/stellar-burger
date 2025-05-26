import accountReducer, {
  accountDefaultState,
  authenticateUserAction,
  signOutAction
} from '../account-slice';

describe('account slice', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(accountReducer(undefined, { type: 'unknown' })).toEqual(
        accountDefaultState
      );
    });
  });

  describe('authenticateUserAction async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: authenticateUserAction.pending.type };
      const result = accountReducer(accountDefaultState, action);

      expect(result.isProcessing).toBe(true);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const mockUser = { email: 'test@test.com', name: 'Test User' };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };

      const action = {
        type: authenticateUserAction.fulfilled.type,
        payload: {
          user: mockUser,
          ...mockTokens
        }
      };
      const result = accountReducer(accountDefaultState, action);

      expect(result.isProcessing).toBe(false);
      expect(result.currentUser).toEqual(mockUser);
      expect(result.hasAccess).toBe(true);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Authentication failed';
      const action = {
        type: authenticateUserAction.rejected.type,
        error: { message: errorMessage }
      };
      const result = accountReducer(accountDefaultState, action);

      expect(result.isProcessing).toBe(false);
      expect(result.errorMessage).toBe(errorMessage);
      expect(result.hasAccess).toBe(false);
    });
  });

  describe('signOutAction async thunk', () => {
    it('should handle fulfilled state', () => {
      const initialState = {
        ...accountDefaultState,
        currentUser: { email: 'test@test.com', name: 'Test User' },
        hasAccess: true
      };

      const action = { type: signOutAction.fulfilled.type };
      const result = accountReducer(initialState, action);

      expect(result.currentUser).toBe(null);
      expect(result.hasAccess).toBe(false);
      expect(result.isProcessing).toBe(false);
      expect(result.errorMessage).toBe(null);
    });
  });
});
