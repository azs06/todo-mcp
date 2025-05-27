# A simple MCP Server

A demonstration of a simple MCP server which works alongside <https://github.com/azs06/todo-sqlite-api>

## Usage

1. Install the dependencies:

```bash
git clone https://github.com/azs06/todo-sqlite-api.git
cd todo-sqlite-api
npm install
node server.js
```

2.Start the MCP server:

```bash
git clone https://github.com/azs06/todo-mcp.git
cd todo-mcp
npm install
```

3.Install bun

```bash
curl -fsSL https://bun.sh/install | bash 
# or
powershell -c "irm bun.sh/install.ps1 | iex"
```

4.Add the MCP server to VSCode:

- Open the command palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
- Search for "Add MCP Server" and select it.
- Enter bun /Absolute/path/to/todo-mcp/src/index.ts as the path to the MCP server.
- Give it a name, e.g., "Todo MCP Server".

Open GitHub Copilot and Select Agent. Click on the reload button, and MCP server and it's tools should be available.
