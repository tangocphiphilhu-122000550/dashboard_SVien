// ================================================================================
//  CHẾ ĐỘ DEMO (OFFLINE / NO BE & DB)
//  Code cũ kết nối Backend/Database thực tế đã được comment lại đầy đủ ở bên dưới.
// ================================================================================

export const DEFAULT_DEMO_USER = {
  id: 'demo-student-01',
  name: 'Nguyễn Văn An',
  full_name: 'Nguyễn Văn An',
  email: 'demo@student.edu.vn',
  mssv: 'SV2023001',
  class_name: 'CNTT K18',
  role: 'sinh_vien',
  avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=3b82f6&color=fff&size=128',
  level: 'Intermediate',
};

const ACCESS_TOKEN_KEYS = ['access_token', 'auth_access_token', 'token'];
const USER_KEYS = ['auth_user', 'currentUser', 'user'];
const LOGGED_OUT_KEY = 'auth_logged_out';

const readJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const getApiBaseUrl = () => 'http://demo-mode.local';

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return '';
  for (const key of ACCESS_TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }
  if (window.localStorage.getItem(LOGGED_OUT_KEY) === 'true') {
    return '';
  }
  return 'demo-token-123456';
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  for (const key of USER_KEYS) {
    const parsed = readJson(window.localStorage.getItem(key));
    if (parsed) return parsed;
  }
  if (window.localStorage.getItem(LOGGED_OUT_KEY) === 'true') {
    return null;
  }
  persistAuthUser(DEFAULT_DEMO_USER);
  return DEFAULT_DEMO_USER;
};

export const persistAuthUser = (user) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LOGGED_OUT_KEY);
  window.localStorage.setItem('auth_user', JSON.stringify(user));
};

export const persistAccessToken = (token) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('access_token', token);
};

export const clearAuthSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOGGED_OUT_KEY, 'true');
  ACCESS_TOKEN_KEYS.forEach((key) => window.localStorage.removeItem(key));
  USER_KEYS.forEach((key) => window.localStorage.removeItem(key));
};

export const fetchCurrentUser = async (token) => {
  return getStoredUser();
};

export const sendActivityHeartbeat = async (token = getStoredAccessToken()) => {
  return true;
};

export const loginWithCredentials = async ({ identifier, password }) => {
  const trimmedIdentifier = (identifier || '').trim();
  const isEmail = trimmedIdentifier.includes('@');

  let user = getStoredUser();

  if (!user || user.id === DEFAULT_DEMO_USER.id) {
    user = {
      id: `user-${Date.now()}`,
      name: trimmedIdentifier ? (isEmail ? trimmedIdentifier.split('@')[0] : trimmedIdentifier) : DEFAULT_DEMO_USER.name,
      full_name: trimmedIdentifier ? (isEmail ? trimmedIdentifier.split('@')[0] : trimmedIdentifier) : DEFAULT_DEMO_USER.full_name,
      email: isEmail ? trimmedIdentifier : `student_${trimmedIdentifier || 'demo'}@student.edu.vn`,
      mssv: isEmail ? 'SV2023001' : (trimmedIdentifier || 'SV2023001'),
      class_name: 'CNTT K18',
      role: 'sinh_vien',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedIdentifier || 'Nguyen Van An')}&background=3b82f6&color=fff&size=128`,
      level: 'Intermediate',
    };
  }

  const token = `demo-token-${Date.now()}`;
  persistAuthUser(user);
  persistAccessToken(token);

  return { user, accessToken: token };
};

export const registerWithCredentials = async ({ email, password, fullName, className }) => {
  const user = {
    id: `user-${Date.now()}`,
    name: fullName.trim(),
    full_name: fullName.trim(),
    email: email.trim(),
    mssv: `SV${Math.floor(100000 + Math.random() * 900000)}`,
    class_name: className.trim(),
    role: 'sinh_vien',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=3b82f6&color=fff&size=128`,
    level: 'Beginner',
  };

  persistAuthUser(user);
  persistAccessToken(`demo-token-${Date.now()}`);
  return user;
};

export const sendForgotPasswordEmail = async (email) => {
  return `[Chế độ Demo] Đã tạo liên kết đặt lại mật khẩu cho ${email || 'bạn'}. Bạn có thể tiến hành đặt lại mật khẩu.`;
};

export const verifyResetPasswordToken = async (token) => {
  return true;
};

export const resetPasswordWithToken = async ({ token, password, confirmPassword }) => {
  return 'Đặt lại mật khẩu (Demo) thành công! Bạn có thể đăng nhập bằng mật khẩu mới.';
};

export const refreshCurrentSession = async (token = getStoredAccessToken()) => {
  const newAccessToken = `demo-token-${Date.now()}`;
  persistAccessToken(newAccessToken);
  return newAccessToken;
};

export const sendOverdueEmailAPI = async ({ exerciseTitle, courseName, overdueLabel, deadline }) => {
  return { success: true, message: 'Đã giả lập gửi email nhắc trễ bài qua client.' };
};

export const logoutCurrentSession = async (token) => {
  clearAuthSession();
};

/*
================================================================================
  CODE CŨ: KẾT NỐI BACKEND / DATABASE THỰC TẾ (REAL BACKEND & DB INTEGRATION)
  - Bạn có thể bỏ comment khối code bên dưới khi muốn kết nối lại với Backend/DB.
================================================================================

const ORIGINAL_API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const originalRequest = async (path, options = {}) => {
  const response = await fetch(`${ORIGINAL_API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Yêu cầu thất bại';
    throw new ApiError(message, response.status, data);
  }

  return data;
};

const originalGetAuthHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const originalRequestWithRefresh = async (path, options = {}, token = getStoredAccessToken()) => {
  try {
    return await originalRequest(path, {
      ...options,
      headers: {
        ...originalGetAuthHeader(token),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    if (error.status !== 401 || !token) {
      throw error;
    }

    const refreshedToken = await originalRefreshCurrentSession(token);

    return originalRequest(path, {
      ...options,
      headers: {
        ...originalGetAuthHeader(refreshedToken),
        ...(options.headers || {}),
      },
    });
  }
};

const originalSha256Hex = async (value) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

// --- CÁC HÀM BACKEND GỐC KHỦNG (ORIGINAL CALLS TO BE / DB) ---

// export const fetchCurrentUserOriginal = async (token) => {
//   const response = await originalRequestWithRefresh('/api/auth/me', { method: 'GET' }, token);
//   return response?.data?.user || null;
// };

// export const sendActivityHeartbeatOriginal = async (token = getStoredAccessToken()) => {
//   if (!token) return false;
//   const response = await originalRequestWithRefresh('/api/auth/heartbeat', { method: 'POST' }, token);
//   return response === true;
// };

// export const loginWithCredentialsOriginal = async ({ identifier, password }) => {
//   const hashedPassword = await originalSha256Hex(password);
//   const trimmedIdentifier = identifier.trim();
//   const isEmail = trimmedIdentifier.includes('@');
//   const payload = isEmail
//     ? { email: trimmedIdentifier, password: hashedPassword }
//     : { mssv: trimmedIdentifier, password: hashedPassword };

//   const response = await originalRequest('/api/auth/login', {
//     method: 'POST',
//     body: JSON.stringify(payload),
//   });
//   const user = response?.data?.user || null;
//   const accessToken = response?.data?.access_token || '';
//   if (accessToken) persistAccessToken(accessToken);
//   if (user) persistAuthUser(user);
//   return { user, accessToken };
// };

// export const registerWithCredentialsOriginal = async ({ email, password, fullName, className }) => {
//   const hashedPassword = await originalSha256Hex(password);
//   const response = await originalRequest('/api/auth/register', {
//     method: 'POST',
//     body: JSON.stringify({
//       email: email.trim(),
//       password: hashedPassword,
//       full_name: fullName.trim(),
//       class_name: className.trim(),
//     }),
//   });
//   return response?.data?.user || null;
// };

// export const sendForgotPasswordEmailOriginal = async (email) => {
//   const response = await originalRequest('/api/auth/forgot-password', {
//     method: 'POST',
//     body: JSON.stringify({ email: email.trim() }),
//   });
//   return response?.message || 'Nếu email tồn tại, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu.';
// };

// export const verifyResetPasswordTokenOriginal = async (token) => {
//   const query = new URLSearchParams({ token: token.trim() }).toString();
//   const response = await originalRequest(`/api/auth/verify-reset-token?${query}`, { method: 'GET' });
//   return Boolean(response?.valid || response?.success);
// };

// export const resetPasswordWithTokenOriginal = async ({ token, password, confirmPassword }) => {
//   const hashedPassword = await originalSha256Hex(password);
//   const hashedConfirmPassword = await originalSha256Hex(confirmPassword);
//   const response = await originalRequest('/api/auth/reset-password', {
//     method: 'POST',
//     body: JSON.stringify({
//       token: token.trim(),
//       password: hashedPassword,
//       confirmPassword: hashedConfirmPassword,
//     }),
//   });
//   return response?.message || 'Đặt lại mật khẩu thành công.';
// };

// export const originalRefreshCurrentSession = async (token = getStoredAccessToken()) => {
//   const response = await originalRequest('/api/auth/refresh-token', {
//     method: 'POST',
//     headers: originalGetAuthHeader(token),
//   });
//   const accessToken = response?.data?.access_token || '';
//   if (!accessToken) throw new Error('Không làm mới được phiên đăng nhập.');
//   persistAccessToken(accessToken);
//   return accessToken;
// };

// export const sendOverdueEmailAPIOriginal = async ({ exerciseTitle, courseName, overdueLabel, deadline }) => {
//   return await originalRequestWithRefresh('/api/exercises/send-overdue-email', {
//     method: 'POST',
//     body: JSON.stringify({ exerciseTitle, courseName, overdueLabel, deadline }),
//   });
// };

// export const logoutCurrentSessionOriginal = async (token) => {
//   if (!token) {
//     clearAuthSession();
//     return;
//   }
//   await originalRequestWithRefresh('/api/auth/logout', { method: 'POST' }, token);
// };
================================================================================
*/
