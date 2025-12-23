import { PGlite } from '@electric-sql/pglite'

export const db = new PGlite('idb://vue-pglite-todo')

export const initDB = async () => {
  await db.exec(`
        CREATE TABLE IF NOT EXISTS account (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        );

        CREATE TABLE IF NOT EXISTS todo (
            id SERIAL PRIMARY KEY,
            account_id INTEGER REFERENCES account(id),
            title TEXT,
            completed BOOLEAN DEFAULT FALSE
        );
    `)
}

export const login = async (username: string, password: string) => {
  const result = await db.query(
    `
        SELECT id FROM account WHERE username = $1 AND password = $2
    `,
    [username, password],
  )
  return (result.rows[0] as { id: number })?.id
}

export const register = async (username: string, password: string) => {
  await db.query(
    `
        INSERT INTO account (username, password) VALUES ($1, $2)
    `,
    [username, password],
  )
}

export interface Todo {
  id: number
  title: string
  completed: boolean
}

export const getTodos = async (accountId: number) => {
  const result = await db.query(
    `
        SELECT id, title, completed FROM todo WHERE account_id = $1
    `,
    [accountId],
  )
  return result.rows as Todo[]
}

export const addTodo = async (accountId: number, title: string) => {
  await db.query(
    `
        INSERT INTO todo (account_id, title) VALUES ($1, $2)
    `,
    [accountId, title],
  )
}

export const updateTodo = async (id: number, completed: boolean) => {
  await db.query(
    `
        UPDATE todo SET completed = $1 WHERE id = $2
    `,
    [completed, id],
  )
}
