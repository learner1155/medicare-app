# Build stage for React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY reactapp1.client/package*.json ./
RUN npm ci
COPY reactapp1.client/ ./
RUN npm run build

# Build stage for .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY ReactApp1.Server/*.csproj ./
RUN dotnet restore
COPY ReactApp1.Server/ ./
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish ./
COPY --from=frontend-build /app/client/dist ./wwwroot
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "ReactApp1.Server.dll"]