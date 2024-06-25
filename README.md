# Food Delivery Application

This project is a food delivery application where restaurants can sign in and create new food items to be displayed on their dashboard. Regular users can browse the available food items at various restaurants and place orders. The application is built using a microservices architecture with different services for users, restaurants, emails, and more.

## Table of Contents
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Microservices](#microservices)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Services](#running-the-services)
- [Database Configuration](#database-configuration)
- [License](#license)

## Technology Stack

- **Backend:**
  - Nest.js
  - GraphQL
  - TypeORM
  - MongoDB
  - Prisma

- **Frontend:**
  - Next.js
  - TailwindCSS

- **Monorepo Management:**
  - Nx

## Features

- Email verification
- Authorization handling
- Social authentication (Google)
- Restaurant management
- User management

## Microservices

The project is divided into the following microservices:

1. **API Gateway** (localhost:4000)
2. **API Restaurants** (localhost:4001)
3. **API Users** (localhost:4002)
4. **Client Application** (localhost:3000)
5. **Restaurant Dashboard** (localhost:4200)

## Project Structure

```
apps/
  api-gateway/
  api-restaurants/
  api-users/
  client/
  restaurant-dashboard/
libs/
  common/
  interfaces/
  database/
```

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/dchobarkar/food-delivery.git
cd food-delivery
npm install
```

## Running the Services

To run any of the microservices, use the following command:

```bash
npx nx serve <service-name>
```

For example, to start the API Gateway service:

```bash
npx nx serve api-gateway
```

## Database Configuration

The project uses MongoDB as the database, and connections are managed using Prisma. Ensure that MongoDB is installed and running on your machine. Configure the database connection in the `.env` file for each microservice.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

Contributions to this project are welcome. Follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## Contact

Darshan Chobarkar - [@dchobarkar](https://www.linkedin.com/in/dchobarkar/) - [@barbatos\_\_08](https://twitter.com/barbatos__08) - contact@darshanwebdev.com

Project Link: [https://github.com/dchobarkar/food-delivery](https://github.com/dchobarkar/food-delivery)
