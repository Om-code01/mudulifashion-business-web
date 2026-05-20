# MongoDB Backend Setup

This site includes a Node.js, Express, and MongoDB backend for saving contact form messages.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```powershell
Copy-Item .env.example .env
```

3. Open `.env` and replace `MONGODB_URI` with your real MongoDB connection string:

```env
MONGODB_URI=your_real_mongodb_connection_string
PORT=5000
```

4. Start the website and API:

```bash
npm run dev
```

5. Open the site:

```text
http://localhost:5000
```

The contact form sends messages to:

```text
POST /api/messages
```

The MongoDB connection string stays on the server in `.env`; it is not exposed in `index.html` or `script.js`.

## Suggested MongoDB Collections

- `messages`: saves contact form messages with `name`, `email`, `message`, and `createdAt`.
- `products`: stores product name, category, price, images, sizes, colors, stock, and featured status.
- `orders`: stores customer details, selected products, order total, order status, payment status, and delivery address.
- `customers`: stores customer name, email, phone, address, order history, and notes.
