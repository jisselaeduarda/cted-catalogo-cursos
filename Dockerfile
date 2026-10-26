FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/CTED.CatalogoCursos.csproj backend/
RUN dotnet restore backend/CTED.CatalogoCursos.csproj

COPY backend/ backend/
COPY frontend/ frontend/

RUN dotnet publish backend/CTED.CatalogoCursos.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "CTED.CatalogoCursos.dll"]
