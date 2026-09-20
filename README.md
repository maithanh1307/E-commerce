# E-commerce
** Backend
1. Run Authentication Service:
    * Run MySql for auth-service
    - Open docker desktop
    - Return to the project, open the CMD to 'cd backend'
    - Enter 'docker compose up -d'
    - Enter this command to run data:
        Get-Content .\docker\mysql\auth\schema.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
        Get-Content .\docker\mysql\auth\seedData.sql -Raw | docker exec -i ecommerce-mysql mysql -u root -proot
    - Open the IntelliJ IDEA to run java service: should run Registry Service first, then run Auth Service
