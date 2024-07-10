# Employee Hierarchy By Position

## Table of Contents
- [Clone the Repository](#clone-the-repository)
- [Install Dependencies](#install-dependencies)
- [Environment Setup](#environment-setup)
- [Run Migrations](#run-migrations)
- [Build the Application](#build-the-application)
- [Start the Application](#start-the-application)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [End-to-End Tests](#end-to-end-tests)
  - [All Tests](#all-tests)
- [High Performance and Scalability](#high-performance-and-scalability)
  - [Concurrency Support](#concurrency-support)
  - [Performance Optimization](#performance-optimization)
  - [Load Testing and Monitoring](#load-testing-and-monitoring)
  - [Deployment Recommendations](#deployment-recommendations)

## Clone the Repository

```
git clone hhttps://github.com/srtipu5/Hierarchy-By-Position.git
```

## Install Dependencies

```
cd Hierarchy-By-Position
npm install
```

## .env Setup

```
HTTP_PORT=your_http-port
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASS=your_redis_password
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
SERVER_BASE_URL=your_server_base_url

```

## Run Migrations

```
npm create_migration:run
npm update_migration:run
```

## Build The Application

```
npm run build
```

## Start The Application

```
npm start
```

# Unit Test

```
npm run test:unit
```

# End To End Test

```
npm run test:e2e
```

# Unit & E2E Test

```
npm run test
```

## High Performance and Scalability

# Concurrency Support
```
The API can handle up to 5000 concurrent calls. This will achieve through the following strategies:

- **Non-blocking I/O with Node.js and Express**: The API leverages the asynchronous, event-driven nature of Node.js and Express to handle multiple requests concurrently without blocking the event loop.
- **Connection Pooling**: The PostgreSQL connection pool, managed by TypeORM, ensures efficient database connection management and reduces the overhead of establishing connections for each request.
- **Caching with Redis**: Frequently accessed data is cached in Redis, reducing the load on the PostgreSQL database and improving response times for repeated queries.
```
# Performance Optimization
```
To ensure that the API can respond to requests within less than a second for 1 million records, the following optimizations are recommended:

- **Efficient Database Queries**: Database queries are optimized for performance using indexes, proper query structures, and pagination techniques to handle large datasets.
- **Data Indexing**: Indexes are created on key fields in the PostgreSQL database to speed up query execution times.
- **Horizontal Scaling**: The application can be scaled horizontally by running multiple instances behind a load balancer, distributing incoming requests across the instances.
```
# Load Testing and Monitoring
```
To validate the API's performance and concurrency capabilities, extensive load testing and monitoring should be performed.
```

# Deployment Recommendations
```
For production deployments, consider the following recommendations to maintain high performance and scalability:

- **Use a Load Balancer**: Distribute traffic across multiple instances using a load balancer (e.g., Nginx or AWS ELB).
- **Containerization and Orchestration**: Use Docker for containerization and Kubernetes for orchestration to manage and scale the application efficiently.
- **Cloud Infrastructure**: Deploy on a cloud provider (e.g., AWS, Azure, GCP) with auto-scaling capabilities to handle varying traffic loads.
```

