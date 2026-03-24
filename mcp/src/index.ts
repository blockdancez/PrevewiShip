import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { registerTools } from './tools.js';

const server = new McpServer({
  name: 'previewship',
  version: '1.0.0',
});

registerTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
