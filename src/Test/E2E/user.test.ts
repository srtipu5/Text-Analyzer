import request from "supertest";
import app from "../../Provider/HttpServer";
import DatabaseClient from "../../Provider/DatabaseClient";
import { log } from "../../Util/Helper";
import { UserModel } from "../../Database/Model/UserModel";

describe("User End-to-End Test", () => {
//   let token: string;
  beforeAll(async () => {
    await DatabaseClient.connect();
    
    // const authResponse = await request(app)
    //   .post("/api/auth")
    //   .send({ username: "testUsername", password: "testPassword" });
    // token = authResponse.body.token;
  });
  

  it("GET /user/list should return an array of users or null", async () => {
    const response = await request(app).get("/user/list");
    expect(response.status).toBe(200);
    if(response.body){
        expect(Array.isArray(response.body)).toBe(true);
        const validateUser = (user: UserModel) => {
            expect(user).toHaveProperty('id', expect.any(Number));
            expect(user).toHaveProperty('email', expect.any(String));
            expect(user).toHaveProperty('password', expect.any(String));
            expect(user).toHaveProperty('role', expect.any(String));
            
          };
          
        response.body.forEach(validateUser);
    }else{
        expect(response.body).toBe(null);
    }

  });

//   it("POST /api/auth should return a token with valid credentials", async () => {
//     const response = await request(app)
//       .post("/api/auth")
//       .send({ username: "testUsername", password: "testPassword" });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("token");
//   });

//   it("GET /api/auth-employee should return an array of hierarchical employees", async () => {
//     const response = await request(app)
//       .get("/api/auth-employee?id=1")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });

  afterAll(() => {
    DatabaseClient.close();
  });
});
