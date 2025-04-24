const { z } = require("zod");
const axios = require("axios");

// Default RPC URL (can be overridden when calling functions)
const DEFAULT_RPC_URL = "https://api-testnet.shardeum.org/";

/**
 * Make an RPC call to the blockchain
 * @param {string} method - The RPC method to call
 * @param {Array} params - The parameters for the RPC call
 * @param {string} rpcUrl - The RPC URL to use
 * @returns {Promise<any>} - The result of the RPC call
 */
async function makeRpcCall(method, params = [], rpcUrl = DEFAULT_RPC_URL) {
  try {
    const response = await axios.post(rpcUrl, {
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    });

    if (response.data.error) {
      throw new Error(`RPC Error: ${response.data.error.message}`);
    }

    return response.data.result;
  } catch (error) {
    console.error(`Error making RPC call to ${method}:`, error.message);
    throw error;
  }
}

/**
 * Register all Shardeum-related tools with the MCP server
 * @param {object} server - The MCP server instance
 * @param {string} rpcUrl - The RPC URL to use
 */
function registerTools(server, rpcUrl = DEFAULT_RPC_URL) {
  // Tool for eth_getBalance
  server.tool(
    "eth_getBalance",
    "Retrieves the native token balance of an Ethereum address",
    {
      address: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .describe("The Ethereum address to check balance"),
      blockParameter: z
        .string()
        .optional()
        .default("latest")
        .describe('Block parameter (default: "latest")'),
    },
    async (args) => {
      try {
        console.error(
          `Getting balance for address: ${args.address} at block: ${args.blockParameter}`,
        );

        const balance = await makeRpcCall(
          "eth_getBalance",
          [args.address, args.blockParameter],
          rpcUrl,
        );
        // Convert hex balance to decimal and then to ETH for readability
        const balanceWei = parseInt(balance, 16);
        const balanceEth = balanceWei / 1e18;

        return {
          content: [
            {
              type: "text",
              text: `Balance for ${args.address} at block ${
                args.blockParameter
              }:
- Wei: ${balanceWei}
- ETH: ${balanceEth.toFixed(4)}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get balance. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_blockNumber - Get the current block number
  server.tool(
    "eth_blockNumber",
    "Retrieves the current block number of the blockchain",
    {},
    async () => {
      try {
        console.error("Getting current block number");

        const blockNumber = await makeRpcCall("eth_blockNumber", [], rpcUrl);
        const blockNumberDecimal = parseInt(blockNumber, 16);

        return {
          content: [
            {
              type: "text",
              text: `Current Block Number: ${blockNumberDecimal} (${blockNumber})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get block number. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getTransactionCount - Get transaction count for an address
  server.tool(
    "eth_getTransactionCount",
    "Retrieves the number of transactions sent from an address",
    {
      address: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .describe("The Ethereum address to check transaction count"),
      blockParameter: z
        .string()
        .default("latest")
        .describe('Block parameter (default: "latest")'),
    },
    async (args) => {
      try {
        console.error(`Getting transaction count for address: ${args.address}`);

        const txCount = await makeRpcCall(
          "eth_getTransactionCount",
          [args.address, args.blockParameter],
          rpcUrl,
        );
        const txCountDecimal = parseInt(txCount, 16);

        return {
          content: [
            {
              type: "text",
              text: `Transaction Count for ${args.address} at ${args.blockParameter} block: ${txCountDecimal} (${txCount})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get transaction count. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getBlockTransactionCountByHash
  server.tool(
    "eth_getBlockTransactionCountByHash",
    "Get the number of transactions in a block by block hash",
    {
      blockHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("The block hash to query"),
    },
    async (args) => {
      try {
        console.error(
          `Getting transaction count for block hash: ${args.blockHash}`,
        );

        const txCount = await makeRpcCall(
          "eth_getBlockTransactionCountByHash",
          [args.blockHash],
          rpcUrl,
        );
        const txCountDecimal = parseInt(txCount, 16);

        return {
          content: [
            {
              type: "text",
              text: `Transaction Count for Block Hash ${args.blockHash}: ${txCountDecimal} (${txCount})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get block transaction count. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getBlockTransactionCountByNumber
  server.tool(
    "eth_getBlockTransactionCountByNumber",
    "Get the number of transactions in a block by block number",
    {
      blockNumber: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("The block number in hex format"),
    },
    async (args) => {
      try {
        console.error(
          `Getting transaction count for block number: ${args.blockNumber}`,
        );

        const txCount = await makeRpcCall(
          "eth_getBlockTransactionCountByNumber",
          [args.blockNumber],
          rpcUrl,
        );
        const txCountDecimal = parseInt(txCount, 16);

        return {
          content: [
            {
              type: "text",
              text: `Transaction Count for Block Number ${args.blockNumber}: ${txCountDecimal} (${txCount})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get block transaction count. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_estimateGas
  server.tool(
    "eth_estimateGas",
    "Estimate the gas required for a transaction",
    {
      from: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .optional()
        .describe("Sender address"),
      to: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .optional()
        .describe("Recipient address"),
      value: z.string().optional().describe("Value to send in hex"),
      data: z.string().optional().describe("Input data for contract call"),
    },
    async (args) => {
      try {
        console.error("Estimating gas for transaction");

        const params = {};
        if (args.from) params.from = args.from;
        if (args.to) params.to = args.to;
        if (args.value) params.value = args.value;
        if (args.data) params.data = args.data;

        const gasEstimate = await makeRpcCall(
          "eth_estimateGas",
          [params],
          rpcUrl,
        );
        const gasEstimateDecimal = parseInt(gasEstimate, 16);

        return {
          content: [
            {
              type: "text",
              text: `Estimated Gas Required: ${gasEstimateDecimal} (${gasEstimate})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to estimate gas. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getBlockByHash
  server.tool(
    "eth_getBlockByHash",
    "Get block details by block hash",
    {
      blockHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("The block hash to query"),
      fullTransactions: z
        .boolean()
        .default(false)
        .describe("Whether to return full transaction details"),
    },
    async (args) => {
      try {
        console.error(`Getting block details for hash: ${args.blockHash}`);

        const blockData = await makeRpcCall(
          "eth_getBlockByHash",
          [args.blockHash, args.fullTransactions],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(blockData, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get block by hash. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getBlockByNumber
  server.tool(
    "eth_getBlockByNumber",
    "Get block details by block number",
    {
      blockNumber: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("The block number in hex format"),
      fullTransactions: z
        .boolean()
        .default(false)
        .describe("Whether to return full transaction details"),
    },
    async (args) => {
      try {
        console.error(`Getting block details for number: ${args.blockNumber}`);

        const blockData = await makeRpcCall(
          "eth_getBlockByNumber",
          [args.blockNumber, args.fullTransactions],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(blockData, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get block by number. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getBlockReceipts - Not a standard RPC method, might need custom implementation or omission
  server.tool(
    "eth_getBlockReceipts",
    "Get receipts for all transactions in a block",
    {
      blockNumberOrHash: z
        .string()
        .describe("Block number or hash in hex format"),
    },
    async (args) => {
      try {
        console.error(`Getting block receipts for: ${args.blockNumberOrHash}`);

        const receipts = await makeRpcCall(
          "eth_getBlockReceipts",
          [args.blockNumberOrHash],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(receipts, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get block receipts. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getTransactionByHash
  server.tool(
    "eth_getTransactionByHash",
    "Get transaction details by transaction hash",
    {
      txHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("The transaction hash to query"),
    },
    async (args) => {
      try {
        console.error(`Getting transaction details for hash: ${args.txHash}`);

        const txData = await makeRpcCall(
          "eth_getTransactionByHash",
          [args.txHash],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(txData, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get transaction by hash. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getTransactionByBlockHashAndIndex
  server.tool(
    "eth_getTransactionByBlockHashAndIndex",
    "Get transaction details by block hash and transaction index",
    {
      blockHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("The block hash"),
      transactionIndex: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("Transaction index in hex"),
    },
    async (args) => {
      try {
        console.error(`Getting transaction details for block hash and index`);

        const txData = await makeRpcCall(
          "eth_getTransactionByBlockHashAndIndex",
          [args.blockHash, args.transactionIndex],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(txData, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get transaction by block hash and index. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getTransactionByBlockNumberAndIndex
  server.tool(
    "eth_getTransactionByBlockNumberAndIndex",
    "Get transaction details by block number and transaction index",
    {
      blockNumber: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("The block number in hex format"),
      transactionIndex: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("Transaction index in hex"),
    },
    async (args) => {
      try {
        console.error(`Getting transaction details for block number and index`);

        const txData = await makeRpcCall(
          "eth_getTransactionByBlockNumberAndIndex",
          [args.blockNumber, args.transactionIndex],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(txData, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get transaction by block number and index. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_getTransactionReceipt
  server.tool(
    "eth_getTransactionReceipt",
    "Get transaction receipt by transaction hash",
    {
      txHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("The transaction hash to query"),
    },
    async (args) => {
      try {
        console.error(`Getting transaction receipt for hash: ${args.txHash}`);

        const receiptData = await makeRpcCall(
          "eth_getTransactionReceipt",
          [args.txHash],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(receiptData, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get transaction receipt. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // eth_chainId
  server.tool(
    "eth_chainId",
    "Get the chain ID of the current network",
    {},
    async () => {
      try {
        console.error("Getting chain ID");

        const chainId = await makeRpcCall("eth_chainId", [], rpcUrl);
        const chainIdDecimal = parseInt(chainId, 16);

        return {
          content: [
            {
              type: "text",
              text: `Chain ID: ${chainIdDecimal} (${chainId})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get chain ID. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Shardeum-specific tools

  // shardeum_getNodeList
  server.tool(
    "shardeum_getNodeList",
    "Get a list of Shardeum network nodes",
    {
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for pagination"),
      limit: z
        .number()
        .optional()
        .default(100)
        .describe("Number of nodes per page"),
    },
    async (args) => {
      try {
        console.error("Getting Shardeum node list");

        const nodeList = await makeRpcCall(
          "shardeum_getNodeList",
          [
            {
              page: args.page,
              limit: args.limit,
            },
          ],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(nodeList, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get node list. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // shardeum_getNetworkAccount
  server.tool(
    "shardeum_getNetworkAccount",
    "Get detailed information about the Shardeum network account",
    {},
    async () => {
      try {
        console.error("Getting Shardeum network account information");

        const networkAccount = await makeRpcCall(
          "shardeum_getNetworkAccount",
          [],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(networkAccount, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get network account. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // shardeum_getCycleInfo
  server.tool(
    "shardeum_getCycleInfo",
    "Get information about the current or a specific Shardeum network cycle",
    {
      cycleNumber: z
        .number()
        .optional()
        .describe(
          "Specific cycle number to query. If not provided, returns current cycle.",
        ),
    },
    async (args) => {
      try {
        console.error("Getting Shardeum cycle information");

        const cycleInfo = await makeRpcCall(
          "shardeum_getCycleInfo",
          args.cycleNumber !== undefined ? [args.cycleNumber] : [],
          rpcUrl,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(cycleInfo, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to get cycle information. ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}

module.exports = { registerTools, makeRpcCall };
