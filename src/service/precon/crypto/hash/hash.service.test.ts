import { HashService } from "@/src/service/precon/crypto/hash/hash.service";

describe("hash service", () => {
  it("generates same result for same strings", () => {
    const one = new HashService({ secret: "12345" }).stringToHash("test", 32);
    const two = new HashService({ secret: "12345" }).stringToHash("test", 32);
    expect(one).toBe(two);
    expect(one.length).toBe(32);
  });
  it("generates different result for different secrets", () => {
    const one = new HashService({ secret: "12345" }).stringToHash("test", 32);
    const two = new HashService({ secret: "22345" }).stringToHash("test", 32);
    expect(one).not.toBe(two);
  });
  it("finds record", () => {
    const one = new HashService({ secret: "12345" }).stringToHash("test1", 32);
    const two = new HashService({ secret: "12345" }).stringToHash("test2", 32);
    const found = new HashService({ secret: "12345" }).challengeArray(two, [
      "test1",
      "test2",
    ]);
    expect(found).toBe("test2");
  });
});
