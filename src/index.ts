import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import server from "./Provider/HttpServer";
import database from "./Provider/DatabaseClient";
import { redis } from "./Provider/RedisCache";
import { log } from "./Util/Helper";

server.listen(process.env.HTTP_PORT, async () => {
  await database.connect();
  // await redis.connect();
  log(
    `[server]: Server is running at http://localhost:${process.env.HTTP_PORT}`
  );
});
