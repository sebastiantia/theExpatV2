declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    ACCESS_KEY_ID: string;
    ACCESS_SECRET: string;
    SENDER_EMAIL: string;
    COOKIE_SECRET: string;
    PORT: string;
    PRODUCTION_URL: string;
    API_URL: string;
    BUCKET_NAME: string;
    REDIS_URL: string;
    NODE_ENV: string;
  }
}