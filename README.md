# E-commerce
** BACKEND
1. Service Registry:
    - Open the IntelliJ IDEA to run java service: run Registry Service
    - Open the Docker Desktop and CMD to enter 'docker compose up -d'

2. Run Authentication Service:
    * Run MySql for auth-service
    - Enter this command to run data:
        Get-Content .\docker\mysql\auth\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\auth\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service first, then run Auth Service

3. Run Product Service:
    - Enter this command to run data:
        Get-Content .\docker\mysql\product\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\product\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service

4. Run Inventory Service:
    - Enter this command to run data:
        Get-Content .\docker\mysql\inventory\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\inventory\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service -> Inventory Service

5. Run Cart Service:
    - Enter this command to run data:
        Get-Content .\docker\mysql\cart\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\cart\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service -> Inventory Service -> Cart Service

6. Run Order Service:
    - Enter this command to run data:
        Get-Content .\docker\mysql\order\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\order\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service -> Inventory Service -> Cart Service - Order Service

7. Run Payment Service:
    - Enter this command to run data:
        Get-Content .\docker\mysql\payment\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\payment\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service -> Inventory Service -> Cart Service - Order Service

8. Run Promotion Service:
    - Enter this command to run data:
        Get-Content .\docker\mysql\promotion\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\promotion\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service -> Inventory Service -> Cart Service - Order Service

9. Run Review Service:
    - Enter this command to run data:
        Get-Content .\docker\mysql\review\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\review\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service -> Inventory Service -> Cart Service - Order Service -> Review Service

** API GATEWAY
- To run Api Gateway, you should run 'docker compose up -d' and service registry -> auth-service -> product-service
- then run api-gateway and test 'localhost:8080/api/...
    + if test auth-service : localhost:8080/api/auth/**
    + if test product-service : localhost:8080/api/product/**
    + if test inventory-service : localhost:8080/api/inventory/**
    + if test cart-service : localhost:8080/api/cart/**
    + if test order-service : localhost:8080/api/orders/**
    + if test payment-service : localhost:8080/api/payments/**
    + if test promotion-service : localhost:8080/api/promotions/**
    + if test review-service : localhost:8080/api/reviews/**

**NOTE:
- If you have the error about 'ecommerce%...' when run other service you should do some steps:
    + return to CMD docker in backend and enter 'docker exec -it ecommerce-mysql mysql -u root -proot'
    + then copy paste all lines into CMD and enter:
        CREATE USER IF NOT EXISTS 'ecommerce'@'%' IDENTIFIED BY 'password123';
        GRANT ALL PRIVILEGES ON ecommerce_auth.* TO 'ecommerce'@'%';
        GRANT ALL PRIVILEGES ON ecommerce_product.* TO 'ecommerce'@'%';
        GRANT ALL PRIVILEGES ON ecommerce_inventory.* TO 'ecommerce'@'%';
        FLUSH PRIVILEGES;
    + then enter 'exit'
- If you complete all steps, you can return to the this service to run and move on to run other service