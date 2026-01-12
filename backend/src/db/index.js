import pkg from "pg";
const {Pool} = pkg;

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
});

pool.on("connect", () => {
    console.log("backend connected to the db");
})

export default pool;