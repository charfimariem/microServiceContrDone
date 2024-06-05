# Utiliser une image officielle de Node.js comme image de base
FROM node:14

# Définir le répertoire de travail à /usr/src/app
WORKDIR /usr/src/app

# Copier le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 5050

# Définir la commande pour démarrer l'application
CMD ["node", "app.js"]
