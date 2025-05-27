import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

type updateObject = {
  status?: string;
  priority?: string;
};

const apiUrl = "http://localhost:3000";

const server = new McpServer({
  name: "todo-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool("get-todos", "Get all todo items", {}, async () => {
  const response = await fetch(`${apiUrl}/todos`);
  const todos = await response.json();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(todos, null, 2),
      },
    ],
  };
});

server.tool(
  "add-todo",
  "Add a new todo item",
  {
    title: z.string().describe("The title of the todo item"),
    description: z.string().describe("The description of the todo item"),
  },
  async ({ title, description }) => {
    const response = await fetch(`${apiUrl}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, description }),
    });
    const todo = await response.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(todo, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "delete-todo",
  "Delete a todo item",
  {
    id: z.string().describe("The ID of the todo item to delete"),
  },
  async ({ id }) => {
    const response = await fetch(`${apiUrl}/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo with ID ${id}`);
    }
    return {
      content: [
        {
          type: "text",
          text: `Todo with ID ${id} deleted successfully.`,
        },
      ],
    };
  }
);



server.tool(
  "update-todo",
  "Update a todo item",
  {
    id: z.string().describe("The ID of the todo item to update"),
    status: z
      .enum(["todo", "completed"])
      .describe("The new status of the todo item"),
    priority: z
      .enum(["low", "medium", "high"])
      .describe("The new priority of the todo item"),
  },
  async ({ id, status, priority }) => {
    const updateObj: updateObject = {};
    if (status) {
      updateObj.status = status;
    }
    if (priority) {
      updateObj.priority = priority;
    }
    const response = await fetch(`${apiUrl}/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateObj),
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo with ID ${id}`);
    }
    const todo = await response.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(todo, null, 2),
        },
      ],
    };
  }
);

server.tool("get-high-priority-todos", "Get high priority todo items", {}, async () => {
  const response = await fetch(`${apiUrl}/todos`);
  const todos = await response.json();
  const highPriorityTodos = todos.filter((todo: any) => todo.priority === "high");
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(highPriorityTodos, null, 2),
      },
    ],
  };
});

async function main() {
    // Create a transport for the server
    const transport = new StdioServerTransport();
    // Start the server
    await server.connect(transport);
    console.log("Server is running. Press Ctrl+C to stop.");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

