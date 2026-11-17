# --- FASE 1: Build del progetto con Maven ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia i file di configurazione e le dipendenze
COPY pom.xml .
COPY src ./src

# Esegue il package pulito saltando i test per velocità
RUN mvn clean package -DskipTests

# --- FASE 2: Esecuzione dell'applicazione ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia il file .jar generato dalla fase precedente
COPY --from=build /app/target/*.jar app.jar

# Espone la porta standard di Spring Boot
EXPOSE 8080

# Avvia l'applicazione applicando il limite di memoria JVM ottimale per Northflank
ENTRYPOINT ["java", "-Xmx350m", "-jar", "app.jar"]