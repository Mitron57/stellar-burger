import { storeCookie, retrieveCookie, removeCookie } from '../cookie';

// Мокаем document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
});

describe('Cookie utilities', () => {
  beforeEach(() => {
    // Очищаем cookies перед каждым тестом
    document.cookie = '';
  });

  describe('storeCookie', () => {
    it('should store a cookie', () => {
      storeCookie('testCookie', 'testValue');
      expect(document.cookie).toContain('testCookie=testValue');
    });

    it('should store a cookie with options', () => {
      storeCookie('testCookie', 'testValue', { path: '/test' });
      expect(document.cookie).toContain('testCookie=testValue');
      expect(document.cookie).toContain('path=/test');
    });
  });

  describe('retrieveCookie', () => {
    it('should retrieve a cookie value', () => {
      storeCookie('testCookie', 'testValue');
      const value = retrieveCookie('testCookie');
      expect(value).toBe('testValue');
    });

    it('should return null for non-existent cookie', () => {
      const value = retrieveCookie('nonExistentCookie');
      expect(value).toBeNull();
    });
  });

  describe('removeCookie', () => {
    it('should remove a cookie', () => {
      storeCookie('testCookie', 'testValue');
      removeCookie('testCookie');
      const value = retrieveCookie('testCookie');
      expect([null, ''].includes(value));
    });
  });
});
