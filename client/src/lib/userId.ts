const USER_ID_KEY = 'user_id';

function generateId(): string {
  const random = Math.random().toString(36).slice(2, 9);
  return `user_id_${Date.now()}_${random}`;
}

export function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);

  if (!id) {
    id = generateId();
    localStorage.setItem(USER_ID_KEY, id);
  }

  return id;
}