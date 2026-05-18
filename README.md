# **mixd.**

**mixd.** is a self-hosted cocktail repository and bar management system designed for enthusiasts to store, share, and discover drink recipes.

[![Docker Image](https://img.shields.io/docker/pulls/frindaddy/mixd?style=flat-square)](https://hub.docker.com/r/frindaddy/mixd)

---

## 🍸 Overview

**mixd.** allows you to manage your personal cocktail library with ease. Beyond just recipes, it tracks ingredients, calculates drink statistics (like ABV and standard units), and helps you find drinks you can make with what's currently in your bar.

## ✨ Key Features

- **Recipe Management**: Store detailed recipes including instructions, garnish, glassware, and footnotes.
- **My Bar**: Track your available ingredients and instantly see which cocktails you can make.
- **Dynamic Statistics**: Automatically calculates ABV and EMU (Standard Drinks) for every recipe based on ingredient volumes and strengths.
- **Custom Menus**: Create and share curated menus for parties or special occasions.
- **Smart Search**: Filter by tags, ingredients, or "strictness" (missing ingredients tolerance).
- **Responsive Design**: Mobile-friendly interface for use at the bar.
- **Social Integration**: Rich meta tags (OpenGraph) allow for beautiful link previews when sharing specific drinks.
- **Self-Hosted**: You own your data. Supports easy deployment via Docker.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v14+ (v20 recommended)
- **MongoDB**: A running instance of MongoDB.
- **NPM**: Package manager (included with Node.js).

### Environment Variables

Configure the following environment variables (or use a `.env` file):

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | The port the server will run on | `5000` |
| `DB_HOST` | MongoDB host address | `127.0.0.1` |
| `DB_PORT` | MongoDB port | `27017` |
| `DB_USER` | MongoDB username | `test-user` |
| `DB_PASS` | MongoDB password | `test-pass` |
| `IMAGE_DIR` | Directory to store uploaded images | `/root/images/` |
| `BACKUP_DIR` | Directory for database backups | `/root/backups/` |
| `IMPORT_JSON` | Path to a JSON file to seed the database | (optional) |

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/frindaddy/mixd.git
    cd mixd
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    cd client && npm install
    cd ..
    ```

3.  **Run in Development Mode:**
    Starts both the Express backend and the React development server.
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    npm start
    ```

## 🐳 Docker Deployment

**mixd.** is optimized for Docker.

### Using Docker Run

```bash
docker run -d \
  -p 5000:5000 \
  -e DB_HOST=your_mongodb_host \
  -e DB_USER=your_db_user \
  -e DB_PASS=your_db_password \
  -v mixd_images:/root/images \
  -v mixd_backups:/root/backups \
  frindaddy/mixd:latest
```

### Docker Deployment (Windows)

For Windows users, helper batch files are provided:
- `Create Docker Image.bat`: Builds the Docker image locally.
- `Create Test Container.bat`: Builds the image and starts a container for testing.

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  mixd:
    image: frindaddy/mixd:latest
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=mongodb
      - DB_USER=mixd_user
      - DB_PASS=mixd_pass
    volumes:
      - mixd_images:/root/images
      - mixd_backups:/root/backups
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mixd_user
      - MONGO_INITDB_ROOT_PASSWORD=mixd_pass
    volumes:
      - mongodb_data:/data/db

volumes:
  mixd_images:
  mixd_backups:
  mongodb_data:
```

## 🔐 Security & Accounts

- **First Run**: On the first start, if no admin account is found, **mixd.** will automatically generate one and print the `user_id` to the console. Use this ID to log in and set up your profile.
- **User IDs**: Users log in using a 5-digit numeric `user_id`.
- **PIN Protection**: Users can optionally set a 4-6 digit PIN for added security.
- **Admin Privileges**: Admins can manage the entire ingredient database, add/remove drinks, and manage other users.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React 18, React Router 7
- **Database**: MongoDB (Mongoose ODM)
- **Image Processing**: Sharp (for auto-resizing and compression)
- **Styling**: Vanilla CSS (Custom components)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
