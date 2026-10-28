# Uber System

A microservices-based ride-hailing system. Client traffic enters through the **Gateway Service**, which routes requests to the appropriate backend service.

## Services

- **Gateway Service** — Routes incoming client requests to the Captain or Ride service.
- **Captain Service** — Handles captain-related operations, such as availability and status.
- **Ride Service** — Manages ride requests and ride status.

## Architecture and Communication

```text
Clients
    |
    v
Gateway Service
    |             \
    v              v
Captain Service  Ride Service
    \              /
     --- RabbitMQ ---
```

- **Request routing:** The gateway acts as the entry point and forwards traffic to the relevant service.
- **Message broker:** Services use RabbitMQ for asynchronous, event-driven communication.
- **Ride updates:** Long polling allows clients to wait for ride status changes over an open request, reducing frequent short-interval polling.

## System Design Topics

- Service responsibilities and boundaries
- Gateway-based request routing
- Asynchronous messaging with RabbitMQ
- Ride request and status-update flows
- Long polling for client updates
- Scalability, reliability, and inter-service communication
