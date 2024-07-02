import { input, password } from "@inquirer/prompts";
import Client from "./client.js";
import Notion from "./notion.js";

const {
  NOTION_TOKEN,
  NOTION_DATABASE_ID,
  SFTPGO_ENDPOINT,
  SFTPGO_USER,
  SFTPGO_PASSWD,
  S3_BUCKET_NAME,
  S3_BUCKET_REGION,
  S3_ACCESS_KEY_ID,
  S3_ENDPOINT,
} = process.env;

const notion = new Notion(NOTION_TOKEN, NOTION_DATABASE_ID);

const otp = await input({ message: "Enter OTP" });

const client = new Client(SFTPGO_ENDPOINT);
await client.login(SFTPGO_USER, SFTPGO_PASSWD, otp);
const coop = await input({ message: "Enter Coop" });
const transpoter = await input({ message: "Enter Transpoter" });
const access_secret = await password({ message: "Enter access secret" });
const data = await client.addUser(coop, transpoter, {
  access_secret,
  s3config: {
    bucket: S3_BUCKET_NAME,
    region: S3_BUCKET_REGION,
    access_key: S3_ACCESS_KEY_ID,
    endpoint: S3_ENDPOINT,
  },
});
notion.createNotionEntry({
  name: data.username,
  username: data.username,
  password: data.password,
});
