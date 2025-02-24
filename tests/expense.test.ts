import request from "supertest";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import app from "../src/server";
import { connectTestDB, disconnectTestDB } from "./testDatabase";

const expense = {
  title: "Test title",
  description: "Test description",
  amount: 1000,
  budget: "Personal",
  category: "Test category",
  subcategory: "Test subcategory"
}

const expectedKeys = [
  "title",
  "description",
  "amount",
  "budget",
  "category",
  "subcategory",
  "_id",
  "createdAt",
  "updatedAt"
];


describe('Expense API tests', () => {
  let id: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it("should create a new expense on POST", async () => {
    const res = await request(app)
      .post("/expenses")
      .send(expense)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    for (const key of expectedKeys) {
      expect(res.body.data).toHaveProperty(key);
    }
    for (const key in expense) {
      expect(res.body.data[key]).toBe(expense[key as keyof typeof expense]);
    }
    expect(res.body.data._id).toBeTruthy();
    id = res.body.data._id;
  });

  it("should return created expenses on GET", async () => {
    expect(id).toBeTruthy();
    const res = await request(app).get(`/expenses/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    for (const key in expense) {
      expect(res.body.data[key]).toBe(expense[key as keyof typeof expense]);
    }
    for (const key of expectedKeys) {
      expect(res.body.data).toHaveProperty(key);
    }
  });

});
