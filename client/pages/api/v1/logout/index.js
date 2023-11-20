import cookie from "cookie";

export default function handler(req, res) {
  if (req.method === "POST") {
    // Set the cookie to have an empty value and an immediate expiration
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Set to a past date
        path: "/",
      })
    );

    res.status(200).json({ statusCode: 200, message: "Logout successful" });
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
