FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm ci

ENV VITE_API_URL=http://localhost:5278/api

RUN npx vite build
CMD npx vite preview --host --port 5173 --strictPort
