FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Create a start.js file that reads environment variables
RUN echo 'const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");\n\
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");\n\
const { registerPrompts } = require("./prompts");\n\
const { registerTools } = require("./tools");\n\
\n\
// Redirect console.log to stderr to avoid breaking the MCP protocol\n\
console.log = function () {\n\
  console.error.apply(console, arguments);\n\
};\n\
\n\
// Configuration with environment variable support\n\
const config = {\n\
  name: "shm-mcp",\n\
  version: "1.0.0",\n\
  rpcUrl: process.env.RPC_URL || "https://api-testnet.shardeum.org/",\n\
};\n\
\n\
// Initialize the server\n\
async function startServer() {\n\
  try {\n\
    // Create a new MCP server\n\
    const server = new McpServer({\n\
      name: config.name,\n\
      version: config.version,\n\
    });\n\
\n\
    // Register all prompts and tools\n\
    registerPrompts(server);\n\
    registerTools(server, config.rpcUrl);\n\
\n\
    // Connect to the stdio transport\n\
    await server.connect(new StdioServerTransport());\n\
\n\
    console.error(\n\
      `${config.name} MCP Server (v${config.version}) is running...`\n\
    );\n\
    console.error(`Connected to RPC: ${config.rpcUrl}`);\n\
  } catch (err) {\n\
    console.error("Failed to start MCP server:", err);\n\
    process.exit(1);\n\
  }\n\
}\n\
\n\
// Start the server\n\
startServer();' > start.js

# Environment variables
ENV RPC_URL=https://api-testnet.shardeum.org/

# Expose any needed ports (typically not needed for MCP servers)
# EXPOSE 8000

# Run the MCP server
CMD ["node", "start.js"]