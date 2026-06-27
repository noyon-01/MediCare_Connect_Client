import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MongoDB_URI || "mongodb://localhost:27017/dummy");
const db = client.db("medicareconnect");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "patient",
                input: true
            },
            phone: {
                type: "string",
                required: false,
                input: true
            },
            gender: {
                type: "string",
                required: false,
                input: true
            },
            status: {
                type: "string",
                defaultValue: "active",
                input: true
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        passwordRules: {
            min: 6,
            regex: /^(?=.*[0-9])(?=.*[!@#$%^&*]).*$/,
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7 // 7 days
    }
});
