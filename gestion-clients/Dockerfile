FROM openjdk:17-jdk-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates curl
COPY target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]