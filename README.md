# Roboswarm Web Client

A distributed load testing service designed specifically for WordPress and WooCommerce sites. This repository contains the frontend application that works in conjunction with the [Roboswarm Server](https://github.com/vital101/roboswarm-server).

## Overview

Roboswarm Web Client provides a user interface for:
- Managing load testing configurations
- Monitoring test executions
- Analyzing performance results
- Visualizing test metrics

## Prerequisites

Before setting up the web client, ensure you have:

- [Roboswarm Server](https://github.com/vital101/roboswarm-server) installed and configured
- Node.js runtime environment
- Working knowledge of the Angular framework
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1. Install Node Version Manager (nvm):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. Switch to the project's Node.js version:
   ```bash
   nvm use
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

## Configuration

In order to tell Roboswarm Client where the server is, look at `/src/evironments`. The default environment is for local development and should not require changes. The `.prod.ts` environment will need changes for production deployments.

## Development

To run the development server with hot-reload:

```bash
npm start
```

The application will be available at `http://localhost:4200` by default.

## Production Deployment

1. Build the production-ready application:
   ```bash
   npm run build
   ```

2. The compiled assets will be available in the `dist/` directory

3. Deploy the contents of the `dist/` directory to your web server

## Features

- Real-time test monitoring
- Customizable test configurations
- Performance metrics visualization
- Test history and reporting
- WordPress and WooCommerce-specific testing templates

## Contributing

Submit a pull request

## License

MIT License + Common Clause

## Related Projects

- [Roboswarm Server](https://github.com/vital101/roboswarm-server) - Backend server component