import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./models/index.js";
import path from "path";
import { fileURLToPath } from "url";

// Controllers
import { isAuthenticated } from "./controllers/auth.js";
import { findUserByEmail, insertUser } from "./controllers/user.js";

// Routes
import { authRouter } from "./routes/auth.route.js";
import { userRouter } from "./routes/user.route.js";
import { productRouter } from "./routes/product.route.js";
import { cartRouter } from "./routes/cart.route.js";
import { orderRouter } from "./routes/order.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const FRONT_DOMAIN =
  process.env.FRONT_DOMAIN || "http://localhost:3000";

const SERVER_URL =
  process.env.SERVER_URL || "http://localhost:5000";

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://studio-chairs.vercel.app"
      : FRONT_DOMAIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", 1);

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

const pgSession = connectPgSimple(session);

app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),

    secret:
      process.env.SESSION_SECRET ||
      "development-session-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      maxAge: 1000 * 60 * 60 * 24 * 7,

      sameSite: "lax",
    },
  })
);

/*
|--------------------------------------------------------------------------
| Passport
|--------------------------------------------------------------------------
*/

app.use(passport.initialize());

app.use(passport.session());

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*
|--------------------------------------------------------------------------
| GitHub OAuth Strategy
|--------------------------------------------------------------------------
*/

passport.use(
  new GitHubStrategy(
    {
      clientID:
        process.env.GITHUB_CLIENT ||
        "dummy-client-id",

      clientSecret:
        process.env.GITHUB_SECRET ||
        "dummy-client-secret",

      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://studio-chairs.vercel.app/auth/github/callback"
          : `${SERVER_URL}/auth/github/callback`,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@github.local`;

        let user = await findUserByEmail(email);

        if (!user) {
          user = await insertUser(
            profile.displayName,
            email
          );
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

/*
|--------------------------------------------------------------------------
| Security Headers
|--------------------------------------------------------------------------
*/

app.use((req, res, next) => {
  res.setHeader(
    "Referrer-Policy",
    "no-referrer-when-downgrade"
  );

  next();
});

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "ecommerce-backend",
  });
});

/*
|--------------------------------------------------------------------------
| Root Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  const authorization = req.isAuthenticated()
    ? "Authenticated"
    : "Not Authenticated";

  res.status(200).json({
    authentication: `Hello, you are ${authorization}`,
  });
});

/*
|--------------------------------------------------------------------------
| GitHub Authentication
|--------------------------------------------------------------------------
*/

app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

app.get(
  "/auth/github/callback",

  passport.authenticate("github", {
    failureRedirect: `${FRONT_DOMAIN}/login`,
  }),

  (req, res) => {
    res.redirect(
      `${FRONT_DOMAIN}/?status=success`
    );
  }
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRouter);

app.use(
  "/api/users",
  isAuthenticated,
  userRouter
);

app.use(
  "/api/products",
  productRouter
);

app.use(
  "/api/cart",
  isAuthenticated,
  cartRouter
);

app.use(
  "/api/orders",
  isAuthenticated,
  orderRouter
);

/*
|--------------------------------------------------------------------------
| Production Frontend
|--------------------------------------------------------------------------
*/

const isProduction =
  process.env.NODE_ENV === "production";

if (isProduction) {
  const __filename =
    fileURLToPath(import.meta.url);

  const __dirname =
    path.dirname(__filename);

  app.use(
    express.static(
      path.join(
        __dirname,
        "../client/build"
      )
    )
  );

  app.get("/*", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../client/build",
        "index.html"
      )
    );
  });
}

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(
  (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    console.error(err.stack);

    res.status(500).send(
      "Something went wrong. We're working on fixing it."
    );
  }
);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(
    `Server is running: http://localhost:${PORT}`
  );
});
