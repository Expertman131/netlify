# Beauty Tracker MCP Server

MCP-сервер (Model Context Protocol) для проекта Beauty Tracker, разработанный для расширения возможностей AI-агентов при работе с платформой управления салонами красоты.

## Быстрый старт

1. Клонируй репозиторий
2. Установи зависимости: `npm install`
3. Запусти локально: `netlify dev`
4. Деплой на Netlify — MCP будет доступен по /mcp

## MCP клиент

```json
{
  "mcpServers": {
    "beauty-tracker": {
      "command": "npx",
      "args": [
        "mcp-remote@latest",
        "https://lvlupgames.ru/mcp"
      ]
    }
  }
}
```
```

---

**Проверь и дополни файлы, если что-то не совпадает!**  
Если нужно — пришли содержимое любого файла, и я проверю его или помогу исправить.  
Когда всё будет готово — Netlify сможет корректно собрать и запустить твой MCP-сервер!
