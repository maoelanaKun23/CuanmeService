const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

app.use(bodyParser.json());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Manajemen Keuangan",
            version: "1.0.0",
            description: "API untuk mengelola pemasukan dan pengeluaran",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["./index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let users = [
    {
        id: 1,
        name: "Heru",
        email: "123@gmail.com",
        password: "pass",
        jenis_kelamin: "Laki-laki",
        nomor_telepon: "089123456789",
        transactions: [
            { id: 1, type: "income", amount: 500000, description: "Gaji" },
            { id: 2, type: "expense", amount: 200000, description: "Belanja" },
        ],
    },
];

let articles = [
    { id: 1, title: "Tips Mengatur Keuangan Pribadi", content: "Pelajari cara mengelola keuangan Anda dengan bijak." },
    { id: 2, title: "Investasi untuk Pemula", content: "Langkah awal untuk memulai investasi yang aman." },
];

// Routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Ambil semua data pengguna
 *     responses:
 *       200:
 *         description: Berhasil mengambil data pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get("/users", (req, res) => {
    res.status(200).json(users);
});

/**
 * @swagger
 * /users/{id}/transactions:
 *   get:
 *     summary: Ambil semua transaksi pengguna
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Berhasil mengambil data transaksi
 */
app.get("/users/:id/transactions", (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send("Pengguna tidak ditemukan");
    res.status(200).json(user.transactions);
});

/**
 * @swagger
 * /users/{id}/transactions:
 *   post:
 *     summary: Tambah transaksi baru untuk pengguna
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaksi berhasil ditambahkan
 */
app.post("/users/:id/transactions", (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send("Pengguna tidak ditemukan");

    const newTransaction = {
        id: user.transactions.length + 1,
        ...req.body,
    };
    user.transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

/**
 * @swagger
 * /users/{userId}/transactions/{transactionId}:
 *   put:
 *     summary: Edit transaksi pengguna
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID transaksi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaksi berhasil diperbarui
 */
app.put("/users/:userId/transactions/:transactionId", (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.userId));
    if (!user) return res.status(404).send("Pengguna tidak ditemukan");

    const transaction = user.transactions.find(
        (t) => t.id === parseInt(req.params.transactionId)
    );
    if (!transaction) return res.status(404).send("Transaksi tidak ditemukan");

    Object.assign(transaction, req.body);
    res.status(200).json(transaction);
});

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Ambil semua artikel tentang keuangan
 *     responses:
 *       200:
 *         description: Berhasil mengambil artikel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 */
app.get("/articles", (req, res) => {
    res.status(200).json(articles);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Swagger docs tersedia di http://localhost:${port}/api-docs`);
});
