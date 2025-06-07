// MongoDB initialization script for Docker
db = db.getSiblingDB('pontigramid');

// Create collections
db.createCollection('news');
db.createCollection('users');

// Create indexes for better performance
db.news.createIndex({ "title": "text", "content": "text", "excerpt": "text" });
db.news.createIndex({ "category": 1 });
db.news.createIndex({ "published": 1 });
db.news.createIndex({ "createdAt": -1 });
db.news.createIndex({ "slug": 1 }, { unique: true });

db.users.createIndex({ "email": 1 }, { unique: true });

print('Database initialized successfully!');
