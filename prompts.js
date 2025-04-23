const { z } = require("zod");

/**
 * Register comprehensive prompts for Shardeum RPC methods
 * @param {object} server The MCP server instance
 */
function registerPrompts(server) {
  // Corresponding Prompt for eth_getBalance
  server.prompt(
    "address_balance",
    {
      address: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .describe("Ethereum address to analyze"),
      blockParameter: z
        .string()
        .optional()
        .default("latest")
        .describe("Block to check balance"),
    },
    ({ address, blockParameter }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getBalance to conduct a comprehensive financial analysis for address ${address} at block ${blockParameter}:

1. Retrieve native token balance
2. Perform in-depth financial investigation:
   - Current balance in native tokens
   - Historical balance trends
   - Wallet activity indicators
   - Potential account type classification

Provide contextual insights into the account's financial status and blockchain interaction patterns.`,
          },
        },
      ],
    })
  );

  // eth_blockNumber - Current Block Number
  server.prompt("block_number", {}, () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Use eth_blockNumber to analyze the current state of the Shardeum blockchain:

1. Retrieve the latest block number
2. Provide context about:
   - Network progression
   - Recent blockchain activity
   - Synchronization status

Highlight the significance of the current block number in the network's timeline.`,
        },
      },
    ],
  }));

  // eth_getTransactionCount - Transaction Count
  server.prompt(
    "transaction_count",
    {
      address: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .describe("Ethereum address to check transaction count"),
      blockParameter: z
        .string()
        .optional()
        .default("latest")
        .describe("Block parameter"),
    },
    ({ address, blockParameter }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getTransactionCount to perform a comprehensive analysis of transaction history for address ${address} at block ${blockParameter}:

1. Retrieve total number of transactions sent
2. Analyze account activity:
   - Transaction frequency
   - Account age and maturity
   - Potential account type (user, contract, exchange)
   - Historical transaction patterns

Provide insights into the account's blockchain interaction and significance.`,
          },
        },
      ],
    })
  );

  // eth_getBlockTransactionCountByHash - Block Transaction Count by Hash
  server.prompt(
    "block_transactions_by_hash",
    {
      blockHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("Block hash to examine"),
    },
    ({ blockHash }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getBlockTransactionCountByHash to conduct a detailed analysis of block transactions for hash ${blockHash}:

1. Retrieve total number of transactions in the block
2. Investigate block characteristics:
   - Transaction density
   - Block utilization
   - Potential network activity indicators
   - Comparison with recent blocks

Provide context about the block's significance and network performance.`,
          },
        },
      ],
    })
  );

  // eth_getBlockTransactionCountByNumber - Block Transaction Count by Number
  server.prompt(
    "block_transactions_by_number",
    {
      blockNumber: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("Block number to examine"),
    },
    ({ blockNumber }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getBlockTransactionCountByNumber to perform an in-depth analysis of block ${blockNumber}:

1. Retrieve the number of transactions in the block
2. Analyze block characteristics:
   - Transaction volume
   - Network activity levels
   - Potential network events or congestion
   - Comparative analysis with network averages

Provide insights into the block's role in the blockchain ecosystem.`,
          },
        },
      ],
    })
  );

  // eth_estimateGas - Gas Estimation
  server.prompt(
    "estimate_gas",
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
      value: z.string().optional().describe("Transaction value"),
      data: z.string().optional().describe("Transaction data"),
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_estimateGas to conduct a comprehensive gas cost analysis for a transaction:

1. Estimate gas requirements
2. Analyze transaction cost factors:
   - Computational complexity
   - Network congestion impact
   - Gas price estimation
   - Potential optimization strategies

Provide detailed insights into transaction economics and efficiency.

Transaction Details:
${args.from ? `- From: ${args.from}` : "No sender specified"}
${args.to ? `- To: ${args.to}` : "No recipient specified"}
${args.value ? `- Value: ${args.value}` : "No value specified"}
${args.data ? "- Custom data present" : "No custom data"}`,
          },
        },
      ],
    })
  );

  // eth_getBlockByHash - Block Details by Hash
  server.prompt(
    "block_by_hash",
    {
      blockHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("Block hash to retrieve"),
      fullTransactions: z
        .boolean()
        .optional()
        .default(false)
        .describe("Include full transaction details"),
    },
    ({ blockHash, fullTransactions }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getBlockByHash to perform a comprehensive analysis of block with hash ${blockHash}:

1. Retrieve block details ${
              fullTransactions
                ? "with full transaction information"
                : "with transaction summaries"
            }
2. Analyze block characteristics:
   - Block structure and metadata
   - Validator/Miner information
   - Transaction composition
   - Network performance indicators

Provide deep insights into the block's role in the blockchain ecosystem.`,
          },
        },
      ],
    })
  );

  // eth_getBlockByNumber - Block Details by Number
  server.prompt(
    "block_by_number",
    {
      blockNumber: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("Block number to retrieve"),
      fullTransactions: z
        .boolean()
        .optional()
        .default(false)
        .describe("Include full transaction details"),
    },
    ({ blockNumber, fullTransactions }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getBlockByNumber to conduct an in-depth analysis of block number ${blockNumber}:

1. Retrieve block details ${
              fullTransactions
                ? "with full transaction information"
                : "with transaction summaries"
            }
2. Investigate block characteristics:
   - Detailed block metadata
   - Transaction composition
   - Network state at block generation
   - Performance and security indicators

Provide comprehensive insights into the block's significance.`,
          },
        },
      ],
    })
  );

  // eth_getBlockReceipts - Block Receipts
  server.prompt(
    "block_receipts",
    {
      blockNumberOrHash: z
        .string()
        .describe("Block number or hash to retrieve receipts"),
    },
    ({ blockNumberOrHash }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getBlockReceipts to analyze the transaction outcomes for block ${blockNumberOrHash}:

1. Retrieve transaction receipts
2. Perform comprehensive receipt analysis:
   - Transaction success rates
   - Gas consumption details
   - Logs and event information
   - Blockchain state changes

Provide forensic insights into the block's transaction execution.`,
          },
        },
      ],
    })
  );

  // eth_getTransactionByHash - Transaction Details
  server.prompt(
    "transaction_by_hash",
    {
      txHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("Transaction hash to retrieve"),
    },
    ({ txHash }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getTransactionByHash to perform a comprehensive forensic analysis of transaction ${txHash}:

1. Retrieve complete transaction details
2. Conduct in-depth transaction investigation:
   - Sender and recipient information
   - Transaction value and type
   - Gas price and consumption
   - Potential smart contract interactions
   - Blockchain context

Provide detailed insights into the transaction's significance and characteristics.`,
          },
        },
      ],
    })
  );

  // eth_getTransactionByBlockHashAndIndex - Transaction by Block Hash and Index
  server.prompt(
    "transaction_by_block_hash_index",
    {
      blockHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("Block hash"),
      transactionIndex: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("Transaction index"),
    },
    ({ blockHash, transactionIndex }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getTransactionByBlockHashAndIndex to analyze the specific transaction at index ${transactionIndex} in block with hash ${blockHash}:

1. Retrieve transaction details
2. Investigate transaction context:
   - Position within block
   - Relationship to other transactions
   - Detailed transaction characteristics
   - Block-level insights

Provide comprehensive analysis of the transaction's role and significance.`,
          },
        },
      ],
    })
  );

  // eth_getTransactionByBlockNumberAndIndex - Transaction by Block Number and Index
  server.prompt(
    "transaction_by_block_number_index",
    {
      blockNumber: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("Block number"),
      transactionIndex: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/)
        .describe("Transaction index"),
    },
    ({ blockNumber, transactionIndex }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getTransactionByBlockNumberAndIndex to perform a detailed analysis of the transaction at index ${transactionIndex} in block number ${blockNumber}:

1. Retrieve transaction details
2. Conduct comprehensive investigation:
   - Transaction positioning
   - Block-level context
   - Detailed transaction characteristics
   - Network state analysis

Provide insights into the transaction's significance within its block.`,
          },
        },
      ],
    })
  );

  // eth_getTransactionReceipt - Transaction Receipt
  server.prompt(
    "transaction_receipt",
    {
      txHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("Transaction hash"),
    },
    ({ txHash }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use eth_getTransactionReceipt to perform a forensic analysis of the transaction receipt for ${txHash}:

1. Retrieve complete transaction receipt
2. Conduct in-depth receipt investigation:
   - Transaction execution status
   - Gas used and actual cost
   - Logs and event details
   - State changes and contract interactions
   - Success or failure indicators

Provide comprehensive insights into the transaction's final outcome.`,
          },
        },
      ],
    })
  );

  // eth_chainId - Chain Identification
  server.prompt("chain_id", {}, () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Use eth_chainId to analyze the network identification and characteristics:

1. Retrieve the chain ID
2. Investigate network details:
   - Unique network identifier
   - Network type (mainnet/testnet)
   - Ecosystem compatibility
   - Potential cross-chain implications

Provide comprehensive insights into the network's identification and context.`,
        },
      },
    ],
  }));

  // Shardeum-specific Prompts

  // shardeum_getNodeList - Node List
  server.prompt(
    "shardeum_node_list",
    {
      page: z.number().optional().default(1).describe("Page number"),
      limit: z
        .number()
        .optional()
        .default(100)
        .describe("Number of nodes per page"),
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use shardeum_getNodeList to perform a comprehensive analysis of Shardeum network nodes:

1. Retrieve node list for page ${args.page} with ${args.limit} nodes per page
2. Investigate network node composition:
   - Node distribution
   - Network health indicators
   - Staking and validator information
   - Network decentralization metrics

Provide detailed insights into the Shardeum network's node ecosystem.`,
          },
        },
      ],
    })
  );

  // shardeum_getNetworkAccount - Network Account
  server.prompt("shardeum_network_account", {}, () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Use shardeum_getNetworkAccount to conduct a comprehensive analysis of the Shardeum network account:

1. Retrieve network account details
2. Investigate network parameters:
   - Network governance information
   - Staking and reward mechanisms
   - Network economic model
   - Cycle and maintenance details

Provide deep insights into the Shardeum network's economic and operational structure.`,
        },
      },
    ],
  }));

  // shardeum_getCycleInfo - Network Cycle Information
  server.prompt(
    "shardeum_cycle_info",
    {
      cycleNumber: z
        .number()
        .optional()
        .describe("Specific cycle number to query"),
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use shardeum_getCycleInfo to analyze ${
              args.cycleNumber
                ? `cycle number ${args.cycleNumber}`
                : "the current network cycle"
            }:

1. Retrieve detailed cycle information
2. Investigate cycle characteristics:
   - Node activity and composition
   - Network synchronization state
   - Performance metrics
   - Validator and staking dynamics

Provide comprehensive insights into the Shardeum network's current operational cycle.`,
          },
        },
      ],
    })
  );
}

module.exports = { registerPrompts };
