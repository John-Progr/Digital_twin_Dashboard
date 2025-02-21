# Project Name

This project is designed to run a **React app** and **Grafana** service using Docker Compose. The services are set up with version **3** of Docker Compose.

## Table of Contents

1. [Overview](#overview)
2. [Services](#services)
   - [React App](#react-app)
   - [Grafana](#grafana)
3. [Getting Started](#getting-started)
   - [Building the Services](#building-the-services)
   - [Running the Services](#running-the-services)
4. [Ports & Volumes](#ports--volumes)
5. [Environment Variables](#environment-variables)
6. [Contributing](#contributing)

## Overview

This project uses Docker Compose to run a **React app** and a **Grafana** service. Docker handles the orchestration of these services, allowing easy management and access.

- **React App:** A frontend application built with React.
- **Grafana:** A monitoring and visualization platform used for displaying metrics.

Docker Compose simplifies the process of running and connecting these services, with persistence configured for Grafana data.

## Services

### React App

The React app is built and served through Docker. This service ensures that the app is accessible via the browser.

- **Ports:**
  - Host: `80` → Container: `80` (exposes the React app on port 80)
- **Container Name:** `react_app`
- **Restart Policy:** Always restart the container if it stops.
- **Dependencies:** This service depends on **Grafana**, meaning Grafana will be started first (if used).
  
### Grafana

Grafana is a platform for monitoring and visualization, which connects to various data sources and presents metrics in customizable dashboards.

- **Image:** Uses the official `grafana/grafana:latest` Docker image.
- **Container Name:** `grafana`
- **Ports:**
  - Host: `3000` → Container: `3000` (exposes Grafana's UI on port 3000)
- **Environment Variables:**
  - `GF_SECURITY_ADMIN_USER`: Set the Grafana admin username (`admin` by default).
  - `GF_SECURITY_ADMIN_PASSWORD`: Set the Grafana admin password (`admin` by default).
  - `GF_SECURITY_ALLOW_EMBEDDING`: Enables embedding of Grafana dashboards.
  - `GF_AUTH_ANONYMOUS_ENABLED`: Enables anonymous access to Grafana.
- **Volumes:**
  - `grafana_data` → `/var/lib/grafana` (persists Grafana data to avoid data loss when the container restarts).
- **Restart Policy:** Always restart the container if it stops.

## Getting Started

### Building the Services

Before running the services, build them by executing:

```bash
docker-compose build
