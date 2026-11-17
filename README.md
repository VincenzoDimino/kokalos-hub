# Kokalos Hub — Piattaforma Culturale e Turistica del Comune di Sciacca

Progetto full-stack sviluppato per il Project Work (CdS L-31 Informatica per le Aziende Digitali - Traccia 22).

## Architettura del Sistema
- **Backend**: Java 17 + Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Spring Security + JWT, BCrypt)
- **Database**: MySQL 8+ (persistente, database `kokalos_hub_db`)
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion (multilingua IT/EN/FR/DE)

## Guida all'Avvio Rapido

### 1. Database MySQL
Assicurati che MySQL sia avviato sulla porta `3306`. 

Opzione 1 (scelta consigliata) - Puoi eseguire lo script `docs/schema_mysql.sql`per l'inizializzazione e popolamento completo del database  

oppure 

(Opzione 2) - lasciare che Spring Boot crei automaticamente il database `kokalos_hub_db` al primo avvio (configurato in `application.properties` con username `root` e password `root` — modificali in base alle tue credenziali locali).

   ## Credenziali Area Amministrativa
  
   - **Username**: `admin`
   - **Password**: `Sciacca2026!`

   ## Credenziali Utente 1 
   (Utente 1 viene creato in automatico se si è scelto l'opzione 1)

   - **Username**: `vinz86`
   - **Password**: `vinz86@`

   ## Credenziali Utente 2 
   (Utente 2 viene creato in automatico se si è scelto l'opzione 1)

   - **Username**: `Salvo89`
   - **Password**: `password`

------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 2. Backend su Spring Tool Suite (STS)
1. Apri Spring Tool Suite -> `File` -> `Import` -> `Maven` -> `Existing Maven Projects`.
2. Seleziona la cartella `kokalos-hub/kokalos-hub-backend`.
3. Attendi il download delle dipendenze Maven.
4. Avvia `KokalosHubApplication.java` come *Spring Boot App* (porta `8080`).

------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 3. Frontend su Visual Studio Code
1. Apri la cartella `kokalos-hub/kokalos-hub-frontend` in Visual Studio Code.
2. Apri il terminale integrato ed esegui:
   ```bash
   npm install
   npm run dev
   ```
3. Apri il browser su `http://localhost:5173`.