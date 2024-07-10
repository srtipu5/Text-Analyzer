import { createConnection } from "typeorm";
import { UserModel } from "../Database/Model/UserModel";
import { TextModel } from "../Database/Model/TextModel";
import { log } from "../Util/Helper";

let connection: any;
export default {
  async connect() {
    try {
      connection = await createConnection({
        type: "postgres",
        host: process.env.DB_HOST as string,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USER as string,
        password: process.env.DB_PASS as string,
        database: process.env.DB_NAME as string,
        entities: [UserModel, TextModel],
        synchronize: false,
        logging: false
      });
      log(`Connected to DB ... ${process.env.DB_HOST}`);
    } catch (error) {
      log("DB Connection Failed !", error);
    }
  },

  async close() {
    try {
      await connection.close();
      log("DB Connection Closed.");
    } catch (error) {
      log("Failed to close DB connection", error);
    }
  },
};
