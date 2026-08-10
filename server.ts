import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`NENUNNA AI API running at http://localhost:${env.PORT}`);
  console.log(`Demo mode: ${env.DEMO_MODE}`);
});