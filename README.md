# LIMTIC — Site Web du Laboratoire de Recherche

Projet fullstack développé dans le cadre du cours IDL — ISI El Manar  
Encadrant : M. Mohamed Sahbi Bahroun

## Stack technique
- **Frontend** : Angular 19 (standalone components, signals, lazy loading)
- **Backend** : Spring Boot 3 + Java 17
- **Base de données** : PostgreSQL 17
- **Authentification** : Sessions HTTP + Cookies HttpOnly
- **Sécurité** : CSRF, Rate Limiting (Bucket4j), HTTPS/TLS

## Structure du projet
limtic-web/
├── limtic-backend/     # API REST Spring Boot
├── limtic-frontend/    # Interface Angular 19
└── database/
└── limtic_backup.sql

## Lancer le projet

### Prérequis
- Java 17+, Maven, Node.js 18+, PostgreSQL 17

### 1. Base de données
```bash
psql -U postgres -c "CREATE DATABASE limtic_db;"
psql -U postgres -d limtic_db -f database/limtic_backup.sql
```

### 2. Backend — HTTPS port 8443
```bash
cd limtic-backend
./mvnw spring-boot:run
```
➡ API sur **https://localhost:8443**  
⚠️ Ouvrir dans le navigateur et accepter le certificat auto-signé

### 3. Frontend — HTTPS port 4200
```bash
cd limtic-frontend
npm install
ng serve --ssl
```
➡ Application sur **https://localhost:4200**  
⚠️ Ouvrir dans le navigateur et accepter le certificat auto-signé

> Accepter les deux certificats avant de tester le login

## Comptes de test
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@limtic.tn | admin123 | ADMIN |
| ben.ali@limtic.tn | pass1 | CHERCHEUR |
| trabelsi@limtic.tn | pass1 | CHERCHEUR |
| jlassi@limtic.tn | pass1 | CHERCHEUR |

## Sécurité implémentée
- ✅ HTTPS avec certificat TLS auto-signé (keystore.p12)
- ✅ Sessions serveur + Cookies HttpOnly (protection XSS)
- ✅ Protection CSRF avec cookie XSRF-TOKEN + intercepteur Angular custom
- ✅ Rate limiting : 10 requêtes/minute par IP sur /api/auth/*
- ✅ Mots de passe hashés avec BCrypt
- ✅ Guards Angular (adminGuard, authGuard, chercheurGuard) via /api/auth/me
- ✅ CORS restreint à localhost:4200

## Fonctionnalités

### Pages publiques
- ✅ Accueil avec statistiques temps réel
- ✅ Chercheurs avec filtres (axe, grade, statut)
- ✅ Page personnelle chercheur avec publications et encadrements cliquables
- ✅ Publications avec recherche, tri, filtres, export BibTeX/CSV, badges classement
- ✅ Événements avec statut automatique à venir/passé
- ✅ Axes de recherche avec membres et publications liées
- ✅ Doctorants et Mastériens avec fiches détaillées
- ✅ Page Directeur du laboratoire
- ✅ Contact avec formulaire sécurisé
- ✅ Réinitialisation mot de passe par email

### Espace Chercheur
- ✅ Dashboard avec statistiques publications
- ✅ Modification du profil (grade, spécialité, liens académiques)
- ✅ Workflow publications : brouillon → soumis → publié
- ✅ Gestion des encadrements (doctorants et mastériens)

### Espace Admin
- ✅ Dashboard avec alertes publications en attente
- ✅ CRUD : chercheurs, publications, événements, axes, doctorants, mastériens
- ✅ Validation/rejet des publications soumises
- ✅ Gestion des comptes utilisateurs et rôles

## API REST
| Méthode | Endpoint | Auth |
|---------|----------|------|
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Auth |
| GET | /api/auth/me | Auth |
| GET | /api/chercheurs | Public |
| PATCH | /api/chercheurs/{id}/profil | Auth |
| GET | /api/publications | Public |
| GET | /api/publications/page | Public |
| PATCH | /api/publications/{id}/statut | Auth |
| GET | /api/evenements | Public |
| GET | /api/axes | Public |
| GET | /api/doctorants | Public |
| GET | /api/masteriens | Public |
| POST | /api/contact | Public |