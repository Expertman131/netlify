import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CallToolResult,
  ReadResourceResult,
  JSONRPCError
} from "@modelcontextprotocol/sdk/types.js";

// Netlify serverless function обработчик
export default async (req) => {
  try {
    // Для stateless MCP используем только POST запросы
    if (req.method === "POST") {
      // Конвертируем объект Request в Node.js Request
      const { req: nodeReq, res: nodeRes } = toReqRes(req);
      const server = getServer();

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      await server.connect(transport);

      const body = await req.json();
      await transport.handleRequest(nodeReq, nodeRes, body);

      nodeRes.on("close", () => {
        console.log("Request closed");
        transport.close();
        server.close();
      });

      return toFetchResponse(nodeRes);
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("MCP error:", error);
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: '',
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

// Функция для создания MCP сервера
function getServer() {
  // Инициализируем MCP Server
  const server = new McpServer(
    {
      name: "beauty-tracker-mcp",
      version: "1.0.0",
    },
    { capabilities: { logging: {} } }
  );

  // Добавляем инструмент для получения информации о проекте
  server.tool(
    "get-project-info",
    "Получает основную информацию о проекте Beauty Tracker",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              projectName: "Beauty Tracker",
              description: "Система управления салонами красоты",
              version: "1.0.0",
              features: [
                "Управление клиентами",
                "Запись на услуги",
                "Расписание специалистов",
                "Бонусная система",
                "Интеграции с внешними сервисами"
              ]
            }),
          },
        ],
      };
    }
  );

  // Добавляем ресурс с документацией
  server.resource(
    "beauty-tracker-docs",
    "beauty://docs",
    { mimeType: "text/plain" },
    async () => {
      return {
        contents: [
          {
            uri: "beauty://docs",
            text: `Beauty Tracker - система управления салонами красоты
              
Основные компоненты:
- Фронтенд: React, Next.js, TailwindCSS, shadcn/ui
- Бэкенд: Supabase (PostgreSQL, Auth, Edge Functions)
- Интеграции: Внешние API (Wazzup, Telegram, Email)
              
Основная документация доступна через проект.`,
          },
        ],
      };
    }
  );

  return server;
};

// Конфигурация для маршрутизации
export const config = {
  path: "/mcp"
};
