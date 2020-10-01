#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["diabloblazor/diabloblazor.csproj", "diabloblazor/"]
COPY ["diablo/diablo.csproj", "diablo/"]
RUN dotnet restore "diablo/diablo.csproj"
COPY . .

RUN apt-get update && apt-get -y install nodejs
WORKDIR "/src/diablo"
RUN dotnet build "diablo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "diablo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "diablo.dll"]