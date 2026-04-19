# LIMTIC — Site Web du Laboratoire de Recherche

Projet fullstack développé dans le cadre du cours IDL — ISI El Manar  
Encadrant : M. Mohamed Sahbi Bahroun

## Stack technique
- **Frontend** : Angular 19
- **Backend** : Spring Boot 3 + Java
- **Base de données** : PostgreSQL 17
- **Authentification** : JWT (rôles : ADMIN, CHERCHEUR, VISITEUR)

## Structure du projet
limtic-web/
├── limtic-backend/     # API REST Spring Boot
├── limtic-frontend/    # Interface Angular
└── database/
    └── limtic_db.sql   # Script SQL pour recréer la base

## Lancer le projet

### 1. Base de données
```bash
psql -U postgres -c "CREATE DATABASE limtic_db;"
psql -U postgres -d limtic_db -f database/limtic_db.sql
```

### 2. Backend
```bash
cd limtic-backend
./mvnw spring-boot:run
```
API disponible sur http://localhost:8080

### 3. Frontend
```bash
cd limtic-frontend
npm install
ng serve
```
Application disponible sur http://localhost:4200

## Comptes de test
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@limtic.tn | (voir DB) | ADMIN |
| ben.ali@limtic.tn | (voir DB) | CHERCHEUR |
| trabelsi@limtic.tn | (voir DB) | CHERCHEUR |
| jlassi@limtic.tn | (voir DB) | CHERCHEUR |

## Fonctionnalités implémentées
### Pages publiques (Visiteur)
- ✅ Page d'accueil avec stats et accès rapide
- ✅ Liste des chercheurs avec détail
- ✅ Liste des publications
- ✅ Liste des événements
- ✅ Liste des outils

### Espace Chercheur
- ✅ Connexion avec redirection par rôle
- ✅ Dashboard chercheur avec sidebar
- ✅ Voir ses publications
- ✅ Ajouter une publication
- ✅ Déconnexion

### Espace Admin
- ✅ Dashboard admin avec sidebar
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des membres (voir, supprimer)
- ✅ Gestion des publications (CRUD)
- ✅ Gestion des événements (CRUD)
- ✅ Déconnexion

## API REST — Endpoints disponibles
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/chercheurs | Liste tous les chercheurs |
| GET | /api/chercheurs/{id} | Détail d'un chercheur |
| POST | /api/chercheurs | Créer un chercheur |
| DELETE | /api/chercheurs/{id} | Supprimer un chercheur |
| GET | /api/publications | Liste toutes les publications |
| POST | /api/publications | Créer une publication |
| DELETE | /api/publications/{id} | Supprimer une publication |
| GET | /api/evenements | Liste tous les événements |
| POST | /api/evenements | Créer un événement |
| DELETE | /api/evenements/{id} | Supprimer un événement |
| POST | /api/auth/login | Connexion |
| POST | /api/auth/signup | Inscription |