import { Client } from "@notionhq/client";

export default class Notion {
  constructor(token, databaseId) {
    this.client = new Client({ auth: token });
    this.databaseId = databaseId;
  }

  async createNotionEntry(entryData) {
    await this.client.pages.create({
      parent: {
        database_id: this.databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: entryData.name,
              },
            },
          ],
        },
        Username: {
          rich_text: [
            {
              text: {
                content: entryData.username,
              },
            },
          ],
        },
        Password: {
          rich_text: [
            {
              text: {
                content: entryData.password,
              },
            },
          ],
        },
        Server: {
          select: {
            name: "SFTPGO",
          },
        },
      },
    });
  }
}
