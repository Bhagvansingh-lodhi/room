# Deployment Guide

- Use environment variables securely in Render/Railway.
- Set `NODE_ENV=production`, `COOKIE_SECURE=true`.
- Enable TLS and set CORS origin.
- Use managed MongoDB Atlas; whitelist platform IPs or use VPC peering.
- Use Cloudinary for images; set env vars accordingly.

Render:
- Create a new web service, connect repo, set build command `npm install` and start `npm start`.

Railway:
- Create project, add environment variables, deploy.

Production best practices:
- Use process manager (PM2) if self-hosting.
- Rotate JWT secret and Cloudinary keys.
- Monitor logs and set alerts.
