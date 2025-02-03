import { data } from "@/constants";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { email }: { email: string }) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response =
      await sql`SELECT users.name FROM users WHERE users.email = ${email}`;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
