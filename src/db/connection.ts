import mysql from "mysql";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: mysql.Connection;

  private constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "app-web-am",
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }


  public getConnection(): mysql.Connection {
    return this.connection;
  }
}

const connection = DatabaseConnection.getInstance().getConnection();
export default connection;
