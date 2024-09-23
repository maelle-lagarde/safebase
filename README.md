# SafeBase : Backup Management System

# Description
Le Backup Management System est une application permettant de gérer les sauvegardes de bases de données MySQL. Elle permet de lancer des backups de bases de données et de les importer dans une base de données de destination. Les informations relatives aux backups sont également enregistrées dans une base de données pour un suivi des sauvegardes.

# Fonctionnalités
- Création de base de données.
- Lancer une sauvegarde de n'importe quelle base de données MySQL.
- Importer les sauvegardes dans une base de données de destination.
- Visualiser tous les backups enregistrés via une interface utilisateur.
- Enregistrer les informations de backup (chemin, date, base de données source et destination) dans la base de données.

# Technologies Utilisées
- Backend :
    - Fastify - Framework Node.js pour construire des API.
    - MySQL - Système de gestion de base de données relationnelle.
    - Node.js - Environnement d'exécution JavaScript côté serveur.
    - mysqldump - Utilitaire pour exporter des bases de données MySQL.
- Frontend :
    - React Vite JS- Bibliothèque JavaScript pour construire des interfaces utilisateur.

# Prérequis
Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :
- Node.js (v12+ recommandé)
- MySQL (v8+)
- Git pour cloner le projet (optionnel)
- mysqldump et mysql installés et configurés.

# Installation
1. Clonez le dépôt sur votre machine locale : https://github.com/maelle-lagarde/safebase.git 
2. Installez les dépendances pour le backend et le frontend :
npm install
3. Configurez les informations de connexion à la base de données en créant un fichier .env à la racine de /back/src/
4. Démarrez le serveur backend :
cd back
node server.js
5. Démarrez le server frontend :
cd front
npm run dev
6. Accédez à l'application via http://localhost:5173/.

# API Routes
GET / : racine de l'app.
GET /databases : retourne la liste de toutes les bases de données enregistrées dans la table db_info.
POST /database-create : crée une nouvelle base de données dans db_info.
GET /databases/:id : récupère les informations d'une base de données spécifique à partir de son id.
PUT /database/update/:id : met à jour les informations d'une base de données existante.
DELETE /database/delete/:id : supprime une base de données en fonction de son id.
GET /backups : retourne une liste de tous les backups enregistrés dans la base de données.
POST /backup/:id : lance un backup de la base de données identifiée par id et l'importe dans une base de données de destination.

# Structure du projet
safebase/