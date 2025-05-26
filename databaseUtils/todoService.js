import db from './database';
import { v4 as uuidv4 } from 'uuid';

export const addTodo = async (todo, dueDate, priority, type, attachments) => {
  const id = uuidv4();
  const attJSON = JSON.stringify(attachments ?? []);

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO todos (id, todo, dueDate, priority, type, attachments)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [id, todo, dueDate ?? null, priority, type, attJSON],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getTodos = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM todos;`,
        [],
        (_, { rows }) => {
          const todos = rows._array.map(t => ({
            ...t,
            attachments: JSON.parse(t.attachments ?? '[]'),
          }));
          resolve(todos);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteTodo = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM todos WHERE id = ?;`,
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const updateTodo = (id, todo, dueDate, priority, type, attachments) => {
  const attJSON = JSON.stringify(attachments ?? []);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE todos SET todo = ?, dueDate = ?, priority = ?, type = ?, attachments = ? WHERE id = ?;`,
        [todo, dueDate ?? null, priority, type, attJSON, id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};
