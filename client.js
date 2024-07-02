import axios from "axios";
import https from "https";
import { generate } from "generate-password";

export default class Client {
  constructor(baseURL) {
    console.info(`Base URL: ${baseURL}`);
    this.axios = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  async setBearerToken(token) {
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  async login(username, password, otp) {
    const auth = Buffer.from(`${username}:${password}`).toString("base64");
    const { data } = await this.axios.get("/api/v2/token", {
      headers: {
        Authorization: `Basic ${auth}`,
        "X-SFTPGO-OTP": otp,
      },
    });
    await this.setBearerToken(data.access_token);
    return data;
  }

  async getUser(username) {
    const { data } = await this.axios.get(`/api/v2/users/${username}`);
    return data;
  }

  async addUser(coop, transpoter, config = {}) {
    const password = generate({
      length: 16,
      numbers: true,
      excludeSimilarCharacters: true,
      symbols: true,
      strict: true,
    });
    const { data } = await this.axios.post("/api/v2/users/", {
      username: `${coop}_${transpoter}`,
      password,
      status: 1,
      permissions: { "/": ["*"] },
      filesystem: {
        provider: 1,
        s3config: {
          key_prefix: `${coop}/${transpoter}/`,
          force_path_style: true,
          access_secret: {
            status: "Plain",
            payload: config.access_secret,
          },
          ...config.s3config,
        },
      },
    });
    return {
      username: data.username,
      password,
    };
  }
}
