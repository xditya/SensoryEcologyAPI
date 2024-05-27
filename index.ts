import { Application, Router } from "oak";
import { getData, setData } from "./database.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.redirect("https://xditya.me");
});

router.get("/set", async (ctx) => {
  const url = ctx.request.url;
  const searchParams = url.searchParams;
  const params = new Map<string, string>();

  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }

  if (
    params.get("light") != undefined &&
    params.get("temperature") != undefined &&
    params.get("gas") != undefined
  ) {
    await setData(
      Number(params.get("light")!),
      Number(params.get("temperature")!),
      Number(params.get("gas")!)
    );
  }
  ctx.response.status = 200;
  ctx.response.body = { status: "done" };
});

router.get("/get", async (ctx) => {
  const data = await getData();
  ctx.response.status = 200;
  ctx.response.body = data;
});

// function randomIntFromInterval(min: number, max: number) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// router.get("/get", (ctx) => {
//   ctx.response.body = {
//     light: randomIntFromInterval(1, 20),
//     temperature: randomIntFromInterval(1, 20),
//     gas: randomIntFromInterval(1, 20),
//   };
// });

const app = new Application();
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => console.log(e));

console.log("> Started listeneing on PORT 8000!");

await app.listen({ port: 8000 });
