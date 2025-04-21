# Utiliser une image de base Java 17
FROM openjdk:17-jdk-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier le JAR compilé
COPY target/*.jar app.jar

# Exposer le port
EXPOSE 8088

# Commande pour exécuter
ENTRYPOINT ["java", "-jar", "app.jar"]