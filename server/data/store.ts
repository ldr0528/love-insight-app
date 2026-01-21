export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, this should be hashed
  nickname: string;
  phone: string;
  isVip: boolean;
  joinDate: string;
}

// Initial Mock Data
export const users: User[] = [
  { id: '1001', username: 'Lin1001', password: '123', nickname: 'Lin1001', phone: '13800138000', isVip: false, joinDate: '2023-01-01' },
  { id: '1002', username: 'Lin1002', password: '123', nickname: 'Lin1002', phone: '13800138001', isVip: true, joinDate: '2023-01-02' },
  { id: '1003', username: 'Lin1003', password: '123', nickname: 'Lin1003', phone: '13800138002', isVip: false, joinDate: '2023-01-03' },
  { id: '8888', username: 'Lin8888', password: '123', nickname: 'Lin8888', phone: '13888888888', isVip: true, joinDate: '2023-05-20' },
];

export const addUser = (user: User) => {
  users.push(user);
};

export const findUserByUsername = (username: string) => {
  return users.find(u => u.username === username);
};

export const findUserById = (id: string) => {
  return users.find(u => u.id === id);
};

export const deleteUserById = (id: string) => {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};
