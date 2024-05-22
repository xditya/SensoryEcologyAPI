import { Application, Router } from "oak";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.redirect("https://xditya.me");
});

router.get("/get", (ctx) => {
  ctx.response.body = { light: 12, temperature: 12, gas: 12 };
});

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
