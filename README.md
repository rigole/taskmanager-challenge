# Task Manager

Application de gestion de tâches full-stack développée dans le cadre d'un test de recrutement. Permet à un utilisateur de créer un compte, se connecter, et gérer ses tâches (créer, modifier, supprimer, filtrer, rechercher) via une interface web.

**Lien déployé** : https://taskmanager-challenge-1.onrender.com

> Note : le backend étant hébergé sur le tier gratuit de Render, il peut mettre 30 à 60 secondes à répondre après une période d'inactivité (mise en veille automatique).

## Stack technique

| Domaine | Technologies |
|---|---|
| Backend | Java 17, Spring Boot 4.1, Spring Security, Spring Data JPA, JWT (jjwt) |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, Three.js (@react-three/fiber) |
| Base de données | MySQL (Aiven, managé) |
| Conteneurisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Déploiement | Render (backend + frontend) |

## Architecture

```
├── backend/          API REST Spring Boot (auth JWT + CRUD tâches)
├── frontend/         Interface React (TSX) + scène 3D d'accueil
├── docker-compose.yml
└── .github/workflows/ci.yml
```

Le backend expose une API REST stateless sécurisée par JWT. Chaque utilisateur ne peut accéder qu'à ses propres tâches (vérification systématique côté service, pas seulement côté UI). Le frontend consomme cette API via Axios et gère l'état d'authentification via un contexte React global.

## Choix techniques notables

- **UUID plutôt qu'ID auto-incrémentés** pour les identifiants d'entités (`User`, `Task`) : évite l'énumération d'IDs par un utilisateur malveillant.
- **JWT stateless** : pas de session serveur, chaque requête s'authentifie via son propre token (`Authorization: Bearer <token>`), stocké côté client en `localStorage`.
- **Vérification d'appartenance systématique** : toute opération sur une tâche (lecture, modification, suppression) vérifie que la tâche appartient bien à l'utilisateur authentifié avant d'agir.
- **Déploiement sur Render plutôt que Google Cloud Run** : Google exige un compte de facturation avec prépaiement de vérification pour activer Cloud Run/Cloud Build, non disponible dans mon contexte. Render offre un déploiement Docker gratuit sans carte bancaire, avec un résultat fonctionnellement équivalent. La configuration Cloud Run (Dockerfiles, variables d'environnement) reste présente dans le repo et fonctionnelle si un compte facturé est disponible.
- **MySQL hébergé sur Aiven** (free tier, sans carte bancaire) plutôt que Cloud SQL, pour la même raison de facturation.

## Fonctionnalités

- Inscription / connexion avec authentification JWT
- Création, modification, suppression de tâches
- Changement de statut (À faire / En cours / Terminé)
- Filtrage par statut et recherche par titre
- Affichage des dates de création, modification et complétion
- Isolation stricte des données par utilisateur

## Installation et exécution

### Prérequis

- Java 17
- Node.js 20+
- MySQL (local) **ou** Docker

### Option 1 — Exécution locale (sans Docker)

**Backend :**

```bash
cd backend
# Créer une base MySQL nommée "taskmanager"
# Configurer src/main/resources/application.properties avec vos identifiants MySQL
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`.

**Frontend :**

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173`.

### Option 2 — Exécution via Docker Compose (recommandé)

Depuis la racine du projet :

```bash
docker-compose up --build
```

Cette commande lance automatiquement MySQL, le backend et le frontend, entièrement conteneurisés. L'application est accessible sur `http://localhost:5173`.

Pour arrêter et supprimer les volumes (repartir de zéro) :

```bash
docker-compose down -v
```

## Variables d'environnement (backend)

| Variable | Description |
|---|---|
| `SPRING_DATASOURCE_URL` | URL JDBC de la base MySQL |
| `SPRING_DATASOURCE_USERNAME` | Nom d'utilisateur MySQL |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe MySQL |
| `JWT_SECRET` | Clé secrète pour la signature des tokens (256 bits minimum) |
| `JWT_EXPIRATION` | Durée de validité du token en millisecondes |

## Variables d'environnement (frontend)

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL de base de l'API backend (ex: `https://backend.onrender.com/api`) |

## Endpoints API

| Méthode | Endpoint | Description | Authentification |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | Non |
| POST | `/api/auth/login` | Se connecter | Non |
| GET | `/api/tasks` | Lister les tâches (filtres `status`, `search`) | Oui |
| POST | `/api/tasks` | Créer une tâche | Oui |
| PUT | `/api/tasks/{id}` | Modifier une tâche | Oui |
| DELETE | `/api/tasks/{id}` | Supprimer une tâche | Oui |

## CI/CD

Un pipeline GitHub Actions (`.github/workflows/ci.yml`) valide à chaque push sur `main` :
- La compilation du backend Java
- La construction de l'image Docker backend
- L'installation et le build du frontend
- La construction de l'image Docker frontend

## Périmètre non traité

- **Application mobile Flutter** : hors périmètre par choix, en raison de la contrainte de temps et d'un manque d'expérience avec ce framework.
