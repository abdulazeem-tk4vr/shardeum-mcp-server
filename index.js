const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const { registerPrompts } = require("./prompts");
const { registerTools } = require("./tools");

// Redirect console.log to stderr to avoid breaking the MCP protocol
console.log = function () {
  console.error.apply(console, arguments);
};

// Configuration
const config = {
  name: "shm-mcp",
  version: "1.0.0",
  rpcUrl: "https://<add-network-name>.shardeum.org/", // https://localhost:4000
};

// Initialize the server
async function startServer() {
  try {
    // Create a new MCP server
    const server = new McpServer({
      name: config.name,
      version: config.version,
    });

    // Register all prompts and tools
    registerPrompts(server);
    registerTools(server, config.rpcUrl);

    // Connect to the stdio transport
    await server.connect(new StdioServerTransport());

    console.error(
      `${config.name} MCP Server (v${config.version}) is running...`
    );
    console.error(`Connected to RPC: ${config.rpcUrl}`);
  } catch (err) {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
  }
}

// Start the server
startServer();
