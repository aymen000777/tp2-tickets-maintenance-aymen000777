# TP 2 — Gestion des tickets

Application de suivi et de gestion des tickets de support construite avec Vue 3, Vue Router, Axios et JSON Server. Le TP reprend la structure, le service API et les données de démonstration du TP 1.

## Identité

- Nom et prénom : à compléter
- Dépôt GitHub : https://github.com/aymen000777/tp2-tickets-maintenance-aymen000777

## Prérequis et installation

Prérequis : Node.js 22.18+ (ou 24.12+) et npm.

```sh
npm install
```

## Lancement

Ouvrir deux terminaux dans le dossier `tp2`.

Terminal 1 — API REST simulée :

```sh
npx json-server db.json --port 3000
```

Terminal 2 — application Vue :

```sh
npm run dev
```

Ouvrir l’adresse locale affichée par Vite, puis accéder à `/tickets`. L’API utilise `http://localhost:3000` par défaut. Une autre adresse peut être définie avec `VITE_API_URL` dans un fichier `.env.local` non versionné.

## Fonctionnalités

- Liste des tickets avec recherche par titre et filtres combinables par statut et priorité.
- Création, modification et suppression des tickets via POST, PATCH et DELETE.
- Statut initial « Ouvert » et date de création définie automatiquement à la date du jour.
- Progression rapide du statut : Ouvert → En cours → Résolu → Fermé.
- Validation des champs obligatoires, prévention des doubles soumissions et confirmations avant suppression.
- Routes `/tickets`, `/tickets/nouveau` et `/tickets/:id`, avec affichage des détails et gestion des identifiants inexistants.
- Messages d’erreur réseau et interface actualisée après chaque opération.
- Les données sont conservées dans `db.json` par JSON Server.

## Captures d’écran

Les sept captures demandées sont déjà disponibles dans le dossier `captures/` :

1. `01-creation-ticket.png` — formulaire de création renseigné.
2. `02-ticket-dans-la-liste.png` — ticket créé visible dans la liste.
3. `03-modification-ticket.png` — formulaire de modification avec statut mis à jour.
4. `04-detail-ticket.png` — page détail.
5. `05-confirmation-suppression.png` — boîte de confirmation avant suppression.
6. `06-validation-obligatoire.png` — validation d’un champ obligatoire.
7. `07-erreur-api-ou-404.png` — erreur réseau ou ticket inexistant.

## Questions

- **Différence entre POST, PUT et PATCH :** POST crée une ressource (ou déclenche une action) ; PUT remplace généralement la ressource entière ; PATCH modifie seulement les propriétés envoyées. Le service utilise PATCH pour modifier un ticket sans écraser ses autres propriétés.
- **Pourquoi confirmer avant DELETE ?** La suppression est destructive et peut être difficile à annuler ; la confirmation évite les suppressions accidentelles.
- **Rôle de Vue Router :** il associe les URL aux vues de l’application, permet la navigation entre liste, création et détail sans rechargement complet, et gère les routes inconnues.
- **Comment éviter les doublons lors de l’enregistrement ?** Le formulaire désactive son bouton dès le début de la requête et le réactive après sa fin, empêchant les clics répétés pendant l’enregistrement.

## Difficultés rencontrées

À compléter avec les difficultés réellement rencontrées pendant la réalisation.
