import time
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

# In-memory rate limiting for demonstration (use Redis in prod)
# Limits to 100 requests per minute per IP
class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.rate_limit_records = defaultdict(list)
        self.LIMIT = 100
        self.WINDOW = 60 # seconds

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old records
        self.rate_limit_records[client_ip] = [
            t for t in self.rate_limit_records[client_ip] 
            if current_time - t < self.WINDOW
        ]
        
        if len(self.rate_limit_records[client_ip]) >= self.LIMIT:
            raise HTTPException(status_code=429, detail="Too Many Requests")
            
        self.rate_limit_records[client_ip].append(current_time)
        
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response
