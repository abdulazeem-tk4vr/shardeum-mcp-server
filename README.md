# Shardeum MCP Server

Model Context Protocol server for distributed-system inspection and developer workflows on Shardeum.

This project exposes Shardeum network and RPC operations as structured MCP tools so AI agents, IDE assistants, and developer workflows can inspect distributed-system state through validated tool calls instead of ad hoc scripts. It is designed for agent-driven debugging, node/network inspection, and repeatable developer operations.

[![smithery badge](https://smithery.ai/badge/@abdulazeem-tk4vr/shardeum-mcp-server)](https://smithery.ai/server/@abdulazeem-tk4vr/shardeum-mcp-server)
[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/abdulazeem-tk4vr-shardeum-mcp-server-badge.png)](https://mseep.ai/app/abdulazeem-tk4vr-shardeum-mcp-server)
[![Verified on MseeP](https://mseep.ai/badge.svg)](https://mseep.ai/app/090acb1c-c4f6-4b74-8c9f-692c6e7d79f6)

## What It Demonstrates

- MCP server implementation for AI-agent tool use
- Structured tool-call interfaces over distributed-system RPC methods
- Node, cycle, account, block, transaction, and receipt inspection
- IDE integration with Cursor and MCP-compatible clients
- Dockerized deployment path
- Error handling around network and RPC failures
- Security-reviewed MCP server listing through MseeP/Smithery badges

## Architecture

```text
MCP client / AI agent / Cursor
        |
        v
Shardeum MCP Server
        |
        +-- tool schema
        +-- request validation
        +-- RPC adapter
        +-- error handling
        |
        v
Shardeum RPC endpoint
        |
        v
Structured response to agent
```

## Supported Tool Areas

### Network and Node Inspection

- `shardeum_getNodeList`
- `shardeum_getNetworkAccount`
- `shardeum_getCycleInfo`

### Block and Transaction Inspection

- `eth_blockNumber`
- `eth_getBlockByHash`
- `eth_getBlockByNumber`
- `eth_getBlockReceipts`
- `eth_getTransactionByHash`
- `eth_getTransactionReceipt`
- `eth_getTransactionCount`

### Account and Execution Queries

- `eth_getBalance`
- `eth_estimateGas`
- `eth_chainId`

## Cursor Integration

Clone the repo, install dependencies, and register the MCP server:

```bash
npm install
```

Cursor MCP config:

```json
{
  "mcpServers": {
    "shardeum-mcp": {
      "command": "node",
      "args": ["path_to/shardeum-mcp-server/index.js"]
    }
  }
}
```

Example prompts:

```text
What is the current Shardeum block number?
List available network nodes and summarize their state.
Fetch the receipt for this transaction and explain the result.
Inspect this account balance and transaction count.
```

## Configuration

Set the RPC endpoint in the server configuration or update the `rpcUrl` constant for your target environment.

## Docker

```bash
docker build -t shardeum-mcp-server .
docker run --rm shardeum-mcp-server
```

## Why This Is Non-Trivial

MCP servers give agents operational access to external systems. This project converts distributed-system RPC calls into explicit tool schemas, making agent actions easier to validate, debug, and constrain compared with free-form shell or HTTP access.

## Roadmap

- Expand supported network methods
- Add write-safe transaction workflows with explicit confirmation gates
- Improve typed responses and validation
- Add broader distributed-system diagnostics
- Add more deployment examples for MCP-compatible clients
