import { endianness } from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { beforeEach, expect, test } from "vitest";
import { execaSync as execa } from "execa";
import { Miniflare } from "miniflare";

const __dirname = dirname(fileURLToPath(import.meta.url));

execa("npm", ["run", "build"], { cwd: __dirname, stdio: "inherit" });

let mf: Miniflare;

beforeEach(() => {
  mf = new Miniflare({
    scriptPath: "./dist/worker.js",
  });
});

test("basic", async () => {
  const res = await mf.dispatchFetch("http://localhost:8787/api");
  const body = await res.text();

  const obj = {
    __dirname: expect.any(String),
    __filename: expect.any(String),
    cwd: expect.any(String),
    global: !!global,
    Buffer: !!Buffer,
    process: !!process,
    endianness: !!endianness,
    /* XMLHttpRequest: true,
    XMLHttpRequestUpload: true,
    XMLHttpRequestEventTarget: true, */
  };

  console.log(body)
  expect(JSON.parse(body)).toBe(obj);
});
