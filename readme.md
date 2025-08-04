## 📦 Project Structure

```
spacetime-chat/
├── client/   # React frontend (Bun + Vite)
├── server/   # Spacetime backend
└── readme.md # You are here!
```

---

## 🚀 Getting Started

### Client Setup

#### Install dependencies

```sh
cd client
bun install
```

#### Start the development server

```sh
bun dev
```

### Server Setup (Spacetime CLI)

#### Install the Spacetime CLI (if you haven't already)

Windows

```sh
iwr https://windows.spacetimedb.com -useb | iex
```

or

Linux

```sh
curl -sSf https://install.spacetimedb.com | sh
```

#### Initialize and run the server

```sh
cd server
spacetime start
```

in a separate terminal:

```sh
spacetime publish server-chat
```

### Update bindings

from root dir

```sh
mkdir -p client/src/module_bindings
spacetime generate --lang typescript --out-dir client/src/module_bindings --project-path server
```
