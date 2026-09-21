# E-commerce
** BACKEND
1. Run Authentication Service:
    * Run MySql for auth-service
    - Open docker desktop
    - Return to the project, open the CMD to 'cd backend'
    - Enter 'docker compose up -d'
    - Enter this command to run data:
        Get-Content .\docker\mysql\auth\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\auth\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    * Run Service
    - Open the IntelliJ IDEA to run java service: should run Registry Service first, then run Auth Service

2. Run Product Service:
    * Run MySql for auth-service
        - Open docker desktop
        - Return to the project, open the CMD to 'cd backend'
        - Enter 'docker compose up -d'
        - Enter this command to run data:
            Get-Content .\docker\mysql\product\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
            Get-Content .\docker\mysql\product\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        * Run Service
        - Open the IntelliJ IDEA to run java service: should run Registry Service -> run Auth Service -> run Product Service

** API GATEWAY
- To run Api Gateway, you should run 'docker compose up -d' and service registry -> auth-service -> product-service
- then run api-gateway and test 'localhost:8080/api/...
    + if test auth-service : localhost:8080/api/auth/**
    + if test product-service : localhost:8080/api/product/**

**NOTE:
- If you have the error about 'ecommerce%...' when run auth-service you should do some steps:
    + return to CMD docker in backend and enter 'docker exec -it ecommerce-mysql mysql -u root -proot'
    + then copy paste all lines into CMD and enter:
        CREATE USER IF NOT EXISTS 'ecommerce'@'%' IDENTIFIED BY 'password123';
        GRANT ALL PRIVILEGES ON ecommerce_auth.* TO 'ecommerce'@'%';
        GRANT ALL PRIVILEGES ON ecommerce_product.* TO 'ecommerce'@'%';
        FLUSH PRIVILEGES;
    + then enter 'exit'
- If you complete all steps, you can return to the auth-service to run and move on to run other service