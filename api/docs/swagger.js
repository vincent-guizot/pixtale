/**
 * OpenAPI 3.0 spec ditulis manual (bukan swagger-jsdoc) supaya lebih
 * mudah dikontrol dan tidak bergantung pada parsing komentar JSDoc.
 * Mencakup SEMUA endpoint di aplikasi: Auth, Posts, Categories,
 * Comments, Likes, Profile, dan Notifications.
 */
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Codigram API",
    version: "1.0.0",
    description:
      "REST API media sosial sederhana (seperti Instagram) — Express + Sequelize + PostgreSQL.",
  },
  servers: [{ url: "/", description: "Current server" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      SuccessResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          message: { type: "string", example: "Operation successful" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Unauthorized" },
          details: { type: "string", example: "Invalid token" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "jane" },
          email: { type: "string", example: "jane@codigram.com" },
          role: { type: "string", example: "user" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Profile: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          fullName: { type: "string", example: "Jane Doe" },
          bio: { type: "string", example: "Suka jalan-jalan & fotografi" },
          avatarUrl: {
            type: "string",
            example: "https://example.com/avatar.jpg",
          },
          userId: { type: "integer", example: 1 },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Travel" },
          description: { type: "string", example: "Kategori Travel" },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          caption: { type: "string", example: "Liburan ke Bali 🏝️" },
          imageUrl: {
            type: "string",
            example: "https://example.com/image.jpg",
          },
          userId: { type: "integer", example: 2 },
          categoryId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          likesCount: {
            type: "integer",
            example: 2,
            description: "Total like, selalu ada di list & detail",
          },
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
            },
          },
          Category: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
          Comments: {
            type: "array",
            description:
              "Hanya ada di response GET /posts/{id} (detail), tidak di list",
            items: { $ref: "#/components/schemas/Comment" },
          },
          likedBy: {
            type: "array",
            description:
              "Daftar user yang like post ini. Hanya ada di response GET /posts/{id} (detail), tidak di list",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                username: { type: "string" },
              },
            },
          },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          message: { type: "string", example: "Keren banget!" },
          userId: { type: "integer", example: 3 },
          postId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
            },
          },
        },
      },
      Like: {
        type: "object",
        properties: {
          userId: { type: "integer", example: 3 },
          postId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          type: { type: "string", enum: ["like", "comment"], example: "like" },
          message: { type: "string", example: "john menyukai post kamu" },
          isRead: { type: "boolean", example: false },
          recipientId: { type: "integer", example: 2 },
          actorId: { type: "integer", example: 3 },
          postId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          actor: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
            },
          },
          Post: {
            type: "object",
            properties: {
              id: { type: "integer" },
              caption: { type: "string" },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: "Auth", description: "Register & Login" },
    { name: "Posts", description: "CRUD post" },
    { name: "Categories", description: "Kategori post" },
    { name: "Comments", description: "Comment pada post" },
    { name: "Likes", description: "Like / unlike post" },
    { name: "Profile", description: "Profile milik user yang login" },
    { name: "Notifications", description: "Notifikasi like & comment" },
  ],
  paths: {
    // ===================== AUTH =====================
    "/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user baru",
        description:
          "Membuat user baru sekaligus profile kosong bawaannya (relasi 1-1).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", example: "johndoe" },
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "Validasi gagal (field wajib kosong)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Username/email sudah terpakai",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login berhasil, mengembalikan access_token",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            access_token: {
                              type: "string",
                              example: "eyJhbGciOiJIUzI1NiIs...",
                            },
                            user: { $ref: "#/components/schemas/User" },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Email atau password salah",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ===================== POSTS =====================
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Ambil semua post",
        description:
          "Public endpoint, tidak butuh token. Diurutkan dari post terbaru. likesCount ikut disertakan, tapi Comments/likedBy TIDAK (hanya ada di detail).",
        responses: {
          200: {
            description: "Daftar post",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Post" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Buat post baru",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["categoryId"],
                properties: {
                  caption: { type: "string", example: "Sunset di pantai 🌅" },
                  imageUrl: {
                    type: "string",
                    example: "https://example.com/image.jpg",
                  },
                  categoryId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Post" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "categoryId wajib diisi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Category tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Ambil detail post (beserta Comments & likedBy)",
        description:
          "Berbeda dengan list, response detail ini menyertakan array Comments lengkap dan array likedBy (daftar user yang like post ini).",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Detail post",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Post" },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: {
            description: "Post tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Posts"],
        summary: "Update post (khusus pemilik)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  caption: { type: "string" },
                  imageUrl: { type: "string" },
                  categoryId: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Post berhasil diupdate",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Post" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Bukan pemilik post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Post tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Hapus post (pemilik atau admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Post berhasil dihapus",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Bukan pemilik post / bukan admin",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Post tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ===================== CATEGORIES =====================
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "Ambil semua kategori",
        description: "Public endpoint, tidak butuh token.",
        responses: {
          200: {
            description: "Daftar kategori",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Category" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Buat kategori baru",
        description: "Butuh login (bonus, di luar spec wajib awal).",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Sports" },
                  description: { type: "string", example: "Kategori Sports" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Kategori berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Category" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "name wajib diisi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ===================== COMMENTS =====================
    "/comments": {
      post: {
        tags: ["Comments"],
        summary: "Buat comment baru",
        description:
          "Memicu Notification ke pemilik post (kecuali comment di post sendiri).",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["postId", "message"],
                properties: {
                  postId: { type: "integer", example: 1 },
                  message: { type: "string", example: "Keren banget fotonya!" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Comment" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "postId / message wajib diisi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Post tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/comments/{id}": {
      delete: {
        tags: ["Comments"],
        summary: "Hapus comment (khusus pemilik comment)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Comment berhasil dihapus",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Bukan pemilik comment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Comment tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ===================== LIKES =====================
    "/likes/{postId}": {
      post: {
        tags: ["Likes"],
        summary: "Like sebuah post",
        description:
          "Memicu Notification ke pemilik post (kecuali like post sendiri).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          201: {
            description: "Post berhasil di-like",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Like" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Post tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Sudah pernah like post ini",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Likes"],
        summary: "Unlike sebuah post",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Post berhasil di-unlike",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Like tidak ditemukan (belum pernah like)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ===================== PROFILE =====================
    "/profile": {
      get: {
        tags: ["Profile"],
        summary: "Ambil profile milik user yang login",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Detail profile",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Profile" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Profile tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Profile"],
        summary: "Update profile milik sendiri",
        description:
          "Ownership terjamin: selalu update berdasarkan user dari token, bukan id yang dikirim client.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullName: { type: "string", example: "Jane Doe" },
                  bio: {
                    type: "string",
                    example: "Suka jalan-jalan & fotografi",
                  },
                  avatarUrl: {
                    type: "string",
                    example: "https://example.com/avatar.jpg",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile berhasil diupdate",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Profile" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ===================== NOTIFICATIONS =====================
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Ambil semua notifikasi milik user yang login",
        description:
          "Otomatis terisi tiap ada like/comment ke post kamu (kecuali dari diri sendiri). Diurutkan dari yang terbaru.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Daftar notifikasi",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Notification" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/notifications/{id}/read": {
      put: {
        tags: ["Notifications"],
        summary: "Tandai satu notifikasi sebagai sudah dibaca",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Notifikasi ditandai sudah dibaca",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Notification" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Bukan pemilik notifikasi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Notifikasi tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/notifications/read-all": {
      put: {
        tags: ["Notifications"],
        summary: "Tandai semua notifikasi milik user sebagai sudah dibaca",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Semua notifikasi ditandai sudah dibaca",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
