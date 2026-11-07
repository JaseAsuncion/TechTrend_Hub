# TechTrend Hub

TechTrend Hub is an e-commerce web application for tech gadgets. A **Spring Boot** REST API manages products, menus, customers, orders and order items in a **MySQL** database, and an **Angular** storefront displays the products by category.

Products are organized into four categories: **Wearables**, **Audio Tech**, **Smart Home** and **Accessories**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 17, Spring Boot 2.7.5, Spring MVC, Spring Data JPA |
| ORM | Hibernate 5.6 (`ddl-auto: update`) |
| Database | MySQL 8.0 |
| Frontend | Angular (TypeScript) |
| Build | Maven |
| Containers | Docker, Docker Compose |
| API testing | Postman |
| Tools | VS Code, MySQL Workbench, Git |

## Project Structure

```
Techtrend_Hub/
├── src/main/java/com/asuncion/
│   ├── controller/     REST controllers
│   ├── entity/         JPA entities (database tables)
│   ├── model/          Plain Java model classes
│   ├── repository/     Spring Data JPA repositories
│   ├── service/        Service interfaces
│   ├── serviceimpl/    Service implementations
│   ├── enums/
│   ├── util/
│   └── Main.java       Application entry point
├── src/main/resources/application.yml
├── exercise/product/   Angular frontend
│   └── public/assets/  Product images (accessories, audio, smart-home, wearables)
├── postman/            Saved Postman requests
├── db/                 MySQL data folder (created by Docker, not committed)
├── init.sql            Startup script for the database container
├── docker-compose.yml
├── Dockerfile
└── pom.xml
```

## REST API

Base URL: `http://localhost:8080`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/product` | List products (supports `?category=`) |
| GET | `/api/product/{id}` | Get one product |
| POST | `/api/product` | Add a product |
| PUT | `/api/product` | Update a product |
| DELETE | `/api/product/{id}` | Delete a product |
| GET | `/api/menu` | Get the navigation menu |
| PUT | `/api/menu` | Update the menu |
| POST | `/api/orders` | Create an order |
| GET | `/api/orderitem` | List order items |
| GET | `/api/orderitem/{customerId}` | Order items for a customer |
| POST | `/api/orderitem` | Add an order item |
| PUT | `/api/orderitem` | Update an order item |
| PUT | `/api/orderitems` | Update order items |

Controllers for app details, categories and customers also exist. See the `postman` folder for example requests.

## Database

Hibernate creates the tables automatically on startup. The entities are:

| Table | Purpose |
|-------|---------|
| `product_data` | Products (name, description, price, category, image) |
| `menu_data` | Navigation menu items |
| `order_data` | Orders |
| `order_item_data` | Order items |
| `orders` | Orders (JPA entity) |
| `order_items` | Order items (JPA entity) |

The database is named `ecom`.

### Product images

Images are stored as files in `exercise/product/public/assets/`. The database stores only the path inside `assets`, and the frontend adds the `assets/` prefix.

Example row:

| name | categoryName | imageFile |
|------|--------------|-----------|
| Apple Watch | Wearables | `wearables/apple-watch.jpg` |

The `categoryName` value must match exactly (including capitals and spaces): `Wearables`, `Audio Tech`, `Smart Home` or `Accessories`.

## Getting Started

### Prerequisites

- Java 17
- Maven
- Docker Desktop
- Node.js and npm

### 1. Configure the database password

Set the same password in two places:

- `docker-compose.yml`, under the `mysqldb` service: `MYSQL_ROOT_PASSWORD`
- `src/main/resources/application.yml`: `spring.datasource.password`

> Do not set `MYSQL_USER: root`. MySQL does not allow it, and the container will stop on first start. Use only `MYSQL_ROOT_PASSWORD` and `MYSQL_DATABASE: ecom`.

### 2. Start the database

```bash
docker compose up -d mysqldb
```

Start only `mysqldb`. Running plain `docker compose up` also tries to start the app and frontend images, which are not published. Wait 20 to 30 seconds for MySQL to be ready.

### 3. Run the backend

```bash
mvn spring-boot:run
```

The API runs at `http://localhost:8080`. You should see `Started Main in ... seconds` in the terminal.

### 4. Run the frontend

In a second terminal:

```bash
cd exercise/product
npm install
npm start
```

Open `http://localhost:4200`.

### 5. Add products

The database starts empty. Add products with MySQL Workbench or Postman. Each product needs a unique `id`, and `customerId`, `orderId`, `productId` and `quantity` must be set (use `0`) because those columns cannot be empty.

```sql
USE ecom;

INSERT INTO product_data
(id, name, description, price, categoryName, unitOfMeasure, imageFile, customerId, orderId, productId, quantity)
VALUES
(1, 'Apple Watch', 'Smartwatch', '25000.00', 'Wearables', 'piece', 'wearables/apple-watch.jpg', 0, 0, 0, 0);
```

## Connecting MySQL Workbench

| Setting | Value |
|---------|-------|
| Hostname | `127.0.0.1` |
| Port | `3306` |
| Username | `root` |
| Password | your `MYSQL_ROOT_PASSWORD` |

## Docker

- `docker-compose.yml` defines a MySQL 8.0 service (`mysql1`) with data stored in `./db` and `init.sql` run on first start.
- The `Dockerfile` packages the built jar (`target/ecommerce-1.0-SNAPSHOT.jar`) on a Java 17 image. Run `mvn package` before building it.
- To reset the database, run `docker compose down`, then empty the `db` folder, then start it again.

## Known Limitations

- Login and signup are not connected to the backend yet (the calls in the Angular auth service are commented out).
- Prices and descriptions of the sample products are placeholders.

## Authors

Jase Miguel R. Asuncion
