export default function handler(req, res) {
    const jwt = req.cookies.jwt;
  
    if (jwt) {
      // Validate the jwt with authentication logic
      // For simplicity, we're just checking if the jwt exists
      res.status(200).json({ message: 'Authenticated' });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  }