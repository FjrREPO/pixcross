# PixCross Backend API

A TypeScript Express.js backend service for generating and uploading NFT metadata to IPFS. This service provides endpoints to create standardized metadata for popular NFT collections and upload them to IPFS using Pinata.

## 🚀 Features

- **NFT Metadata Generation**: Create standardized NFT metadata for 12 popular collections
- **IPFS Upload**: Seamless integration with Pinata for decentralized storage
- **Bulk Operations**: Support for individual and batch metadata generation
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **CORS Support**: Configurable cross-origin resource sharing
- **Environment-based Configuration**: Flexible deployment configuration

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Supported NFT Collections](#supported-nft-collections)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🛠 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Pinata IPFS account and JWT token

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pixcross/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=*

# Pinata IPFS Configuration (Required)
PINATA_JWT=your_pinata_jwt_token_here

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Blockchain Configuration (Optional)
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address
```

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PINATA_JWT` | Pinata API JWT token for IPFS uploads | ✅ |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `PORT` | Server port number | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### Generate Single NFT Metadata

**POST** `/generate`

Generate IPFS metadata for a specific NFT collection.

**Request Body:**
```json
{
  "name": "bayc"
}
```

**Response:**
```json
{
  "metadataURI": "ipfs://QmYourIPFSHashHere",
  "name": "Bored Ape Yacht Club"
}
```

**Supported Collection Names:**
- `bayc` - Bored Ape Yacht Club
- `pudgy` or `ppg` - Pudgy Penguins
- `azuki` - Azuki
- `cool-cats` or `cool cats` - Cool Cats
- `cryptopunks` - CryptoPunks
- `doodles` - Doodles
- `lazy-lions` or `lazy lions` - Lazy Lions
- `lil-pudgys` or `lil pudgys` - Lil Pudgys
- `mayc` - Mutant Ape Yacht Club
- `milady-maker` or `milady maker` - Milady Maker
- `mocaverse` - Mocaverse
- `moonbirds` - Moonbirds

#### Generate All NFT Metadata

**POST** `/generate-all`

Generate IPFS metadata for all supported NFT collections.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "metadataURI": "ipfs://QmHash1",
      "name": "Bored Ape Yacht Club"
    },
    {
      "metadataURI": "ipfs://QmHash2", 
      "name": "Pudgy Penguins"
    }
    // ... more results
  ]
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "Name is required as a string"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to generate IPFS",
  "message": "Detailed error message"
}
```

**404 Not Found:**
```json
{
  "error": "Not found"
}
```

## 🎨 Supported NFT Collections

The service supports metadata generation for the following popular NFT collections:

| Collection | Identifier | Display Name | Description |
|-----------|------------|--------------|-------------|
| BAYC | `bayc` | Bored Ape Yacht Club | Collection of 10,000 unique Bored Ape NFTs |
| Pudgy Penguins | `pudgy`, `ppg` | Pudgy Penguins | Collection of 8,888 unique penguin NFTs |
| Azuki | `azuki` | Azuki | Collection of 10,000 unique anime-style NFTs |
| Cool Cats | `cool-cats`, `cool cats` | Cool Cats | Collection of 9,999 unique cat NFTs |
| CryptoPunks | `cryptopunks` | CryptoPunks | Collection of 10,000 unique 24x24 pixel art characters |
| Doodles | `doodles` | Doodles | Collection of 10,000 unique hand-drawn NFTs |
| Lazy Lions | `lazy-lions`, `lazy lions` | Lazy Lions | Collection of 6,000 unique lion NFTs |
| Lil Pudgys | `lil-pudgys`, `lil pudgys` | Lil Pudgys | Collection of 6,000 unique baby penguin NFTs |
| MAYC | `mayc` | Mutant Ape Yacht Club | Collection of 20,000 unique mutant apes |
| Milady Maker | `milady-maker`, `milady maker` | Milady Maker | Collection of 10,000 unique anime-style NFTs |
| Mocaverse | `mocaverse` | Mocaverse | Collection of 8,888 unique Mocaverse characters |
| Moonbirds | `moonbirds` | Moonbirds | Collection of 10,000 unique owl NFTs |

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   └── index.ts          # NFT generation controllers
│   ├── images/               # NFT collection images
│   │   ├── BAYC.jpg
│   │   ├── PUDGY.jpg
│   │   └── ...
│   ├── services/             # Business logic
│   │   ├── index.ts         # Service initialization
│   │   ├── cloudinary.ts    # Cloudinary service
│   │   ├── nft.ts          # NFT metadata generation
│   │   └── pinata.ts       # IPFS upload service
│   ├── utils/               # Utility functions
│   │   └── log.ts          # Logging utilities
│   ├── index.ts            # Application entry point
│   ├── routes.ts           # Route definitions
│   └── types.ts            # TypeScript type definitions
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vercel.json           # Vercel deployment config
└── README.md            # This file
```

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run ts.check

# Deploy to Vercel
npm run deploy
```

### Development Workflow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **The server will start on:**
   ```
   http://localhost:3001
   ```

3. **Test the API endpoints using curl or Postman:**
   ```bash
   # Test single generation
   curl -X POST http://localhost:3001/generate \
     -H "Content-Type: application/json" \
     -d '{"name":"bayc"}'

   # Test bulk generation
   curl -X POST http://localhost:3001/generate-all \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

### Adding New NFT Collections

To add support for a new NFT collection:

1. **Add the collection image** to `src/images/` directory
2. **Update the controller** in `src/controllers/index.ts`:
   ```typescript
   } else if (name.toLowerCase() === "new-collection") {
     imagePath = path.join(__dirname, "../images/NEW_COLLECTION.jpg");
     displayName = "New Collection";
     description = "Description of the new collection.";
   ```
3. **Add to the bulk generation list** in `generateAllIPFSController`

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment:

```bash
npm run deploy
```

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Start the production server:**
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

## 🧪 Testing

Test the API endpoints using the provided examples:

### Test Single Generation
```bash
curl -X POST http://localhost:3001/generate \
  -H "Content-Type: application/json" \
  -d '{"name":"bayc"}'
```

### Test Bulk Generation
```bash
curl -X POST http://localhost:3001/generate-all \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting
- Add appropriate error handling
- Include proper logging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the [API Documentation](#api-documentation) for common use cases
- Verify your [environment setup](#environment-setup)

## 🔗 Related Projects

- [PixCross Frontend](../frontend/README.md) - React frontend application
- [PixCross Contracts](../contracts/README.md) - Smart contracts

---

**Made with ❤️ by the PixCross Team**
