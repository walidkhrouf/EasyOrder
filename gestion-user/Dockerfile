FROM node:18-slim
WORKDIR /app
# Copier les fichiers de configuration des dépendances
COPY package.json package-lock.json* ./
# Installer les dépendances, y compris la recompilation de bcrypt
RUN npm install --production
# Copier le reste des fichiers
COPY . .
# Exposer le port
EXPOSE 8086
# Commande de démarrage
CMD ["node", "index.js"]