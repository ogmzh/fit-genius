export type DatabaseTableEnum =
  typeof DatabaseTables[keyof typeof DatabaseTables];

const DatabaseTables = {
  CLIENTS: "clients",
} as const;

export default DatabaseTables;
