import request from "supertest";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import app from "../src/server";
import { connectTestDB, disconnectTestDB } from "./testDatabase"; 

/**
 * Tests to be added
 * registerUser : done
 * handleLogin : done
 * incorrect login : done
 * handleLogout
 * refreshHandler
 * verifyJWT
 */

let reg_user={
  "user": "Badass",
  "pwd": "maulamere"
}

let bad_user={
  "user": "Badass",
  "pwd": "nomaula"
}


describe('User API Tests', () =>{

    beforeAll(async () => {
        await connectTestDB();
      });
    
      afterAll(async () => {
        await disconnectTestDB();
      });

      it("should register new user", async ()=>{

        const res = await request(app)
        .post('/users/register')
        .send(reg_user)
        .set("Content-Type", "application/json");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });

      it("should login new user", async () =>{
        const res =await request(app)
        .post('/users/login')
        .send(reg_user)
        .set("Content-Type", "application/json");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        console.log(res.body.data);
      });

      it("should send incorrect password", async () =>{
        const res =await request(app)
        .post('/users/login')
        .send(bad_user)
        .set("Content-Type", "application/json");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
      });

});