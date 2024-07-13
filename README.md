### Text Analyzer Tool
```
This repository contains the implementation of a Text Analyzer Tool designed to read, write, update, and delete texts from/to a database. The application follows proper architecture and design patterns/principles, providing several APIs for text analysis. The tool generates counts of words, characters, sentences, paragraphs, and identifies the longest word in a paragraph.
```

## Table of Contents
- [Clone the Repository](#clone-the-repository)
- [Install Dependencies](#install-dependencies)
- [Environment Setup](#environment-setup)
- [Run Migrations](#run-migrations)
- [Revert Migrations](#revert-migrations)
- [Build the Application](#build-the-application)
- [Start the Application](#start-the-application)
- [Testing](#testing)
  - [Unit Test](#unit-test)
  - [End-to-End Test](#end-to-end-test)
- [Features](#features)
- [Enhancements](#enhancements)
- [Performance Optimization](#performance-optimization)
- [Deployment Recommendations](#deployment-recommendations)


## Clone the Repository

```
git clone https://github.com/srtipu5/Text-Analyzer.git
```

## Install Dependencies

```
cd Text-Analyzer
npm install
```

## .env Setup

```
HTTP_PORT=3000
DB_TYPE=mysql
DB_HOST=sql5.freesqldatabase.com
DB_PORT=3306
DB_USER=sql5719492
DB_PASS=ahyrzcS2g8
DB_NAME=sql5719492
JWT_SECRET=myjwtsecret

```

## Run Migrations

Note: First migrate UserModel then TextModel.If you use my DB credentials then no need to make migration.
```
npm run migrate
```

## Revert Migrations

```
npm run revert

```

## Build The Application

```
npm run build
```

## Start The Application

```
npm start
```

# Testing

```
npm run test:unit
npm run test:e2e
```

## Features

```
API Endpoints:

POST /auth/login                     -- Returns json web token & refresh token.
POST /auth/refresh                   -- Returns new token via refresh token.
POST /auth/logout                    -- Destroy user cache.

POST /user/register                  -- Register a new user.
POST /user/update/:id                -- Update a registered user.
GET  /user/delete/:id                -- Delete a registered user.
GET  /user/list                      -- Returns all registered user.
POST /user/find-by-email             -- Search a registered user.

POST /text/create                    -- Create a new text.
POST /text/update/:id                -- Update a text.
GET  /text/delete/:id                -- Delete a text.
GET  /text/list                      -- Returns all created text.
POST /text/userId                    -- Search a text.

GET  /analysis/word-count/:id        -- Returns the number of words.
GET  /analysis/character-count/:id   -- Returns the number of characters.
GET  /analysis/sentence-count/:id    -- Returns the number of sentences.
GET  /analysis/paragraph-count/:id   -- Returns the number of paragraphs.
GET  /analysis/find/:id              -- Returns full report of single text.
GET  /analysis/all                   -- Returns full report of all text.

```

## Enhancements

```
-- Authorization & authentication.
-- Role based access management.
-- Enable API request throttling.
-- User-specific Report API.
-- Caching implementation & create redis caching service.
-- Implemented both PostgresSQL & MySQL
-- Shared a live DB credentials for MySQL.

```

## Performance Optimization
```
To ensure that the API can respond to requests within less than a second for 1 million records, the following optimizations are recommended:

- **Efficient Database Queries**: Database queries are optimized for performance using indexes, proper query structures, and pagination techniques to handle large datasets.
- **Data Indexing**: Indexes are created on key fields in the PostgreSQL database to speed up query execution times.
- **Horizontal Scaling**: The application can be scaled horizontally by running multiple instances behind a load balancer, distributing incoming requests across the instances.
```
## Load Testing and Monitoring
```
To validate the API's performance and concurrency capabilities, extensive load testing and monitoring should be performed.
```

## Deployment Recommendations
```
For production deployments, consider the following recommendations to maintain high performance and scalability:

- **Use a Load Balancer**: Distribute traffic across multiple instances using a load balancer (e.g., Nginx or AWS ELB).
- **Containerization and Orchestration**: Use Docker for containerization and Kubernetes for orchestration to manage and scale the application efficiently.
- **Cloud Infrastructure**: Deploy on a cloud provider (e.g., AWS, Azure, GCP) with auto-scaling capabilities to handle varying traffic loads.
```
