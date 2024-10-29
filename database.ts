import { DataSource } from 'typeorm';

// Replace these values with your actual database credentials
const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost', // Your database host
    port: 5432, // Default PostgreSQL port
    username: 'admin', // Your PostgreSQL username
    password: 'admin', // Your PostgreSQL password
    database: 'banco_financeiro', // Your PostgreSQL database name
    synchronize: false, // Set to false for migrations
    logging: false, // Enable logging (set to true for debugging)
    entities: [
        // Add your entity classes here
    ],
    migrations: ['src/database/migrations/*{.ts,.js}'], // Add this line
});

export default AppDataSource;
