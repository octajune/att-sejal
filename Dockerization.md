# Docker Support

## Why I used Containerization and CI/CD?
My mentor mentioned in on of our meetings that he would be really surprised if he sees someone implement CI/CD in the project. I studied more about CI/CD and my search led me to containers. As per my understanding, a docker container is like a new machine which can be configured from scratch. 
<br />
Once I understood the concept behind dockers, it was relatively easy find suitable Dockerfiles for my project and then configure my application to run with them. I used the `docker` extension in VSCode for my testing.

## Frontend Docker file

```
### STAGE 1: Build ###
FROM node:12.20-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
# Replace the environment.ts with environment.prod.ts for GitHub Actions Deployment
RUN rm /usr/src/app/src/environments/environment.ts
RUN cp /usr/src/app/src/environments/environment.prod.ts /usr/src/app/src/environments/environment.ts
RUN npm run build -- --prod
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/notus-angular /usr/share/nginx/html
```

## Backend Docker file
```
FROM python:3.6-slim-buster
COPY requirements.txt 
# The following command is needed for "pip install dlib" to work
RUN apt-get update && apt-get install build-essential cmake libgtk-3-dev libboost-all-dev -y
RUN mkdir /etc/profiles && mkdir /etc/temp
RUN pip install --default-timeout=10000000 -r requirements.txt
COPY . .
EXPOSE 443
CMD ["flask", "run", "--host=0.0.0.0", "--port=443"]
```

## Docker Compose file (Only for local setup)
```
version: '3.9'

services:
  angularapp:
    container_name: angularapp
    image: angularapp
    build:
      context: ./attd-sejal-frontend
      dockerfile: ./DockerfileDev
    ports:
      - "80:80"
    depends_on:
      - pythonapp
    environment:
      - BACKEND_URL=http://localhost:5000/api/v1/
    networks:
      vpcbr:
        ipv4_address: 10.5.0.7
  pythonapp:
    container_name: pythonapp
    image: pythonapp
    build:
      context: ./attd-sejal-backend
      dockerfile: ./DockerfileDev
    ports:
      - "5000:5000"
    networks:
      vpcbr:
        ipv4_address: 10.5.0.6
    environment:
      - DATABASE_URL=postgresql://sejal:sejalmsengage@10.5.0.8/attd_db
    depends_on:
      - db_postgres
  db_postgres:
    container_name: db_postgres
    image: 'postgres:12'
    ports:
      - "5432:5432"
    networks:
      vpcbr:
        ipv4_address: 10.5.0.8
    environment:
      - POSTGRES_PASSWORD=sejalmsengage
      - POSTGRES_USER=sejal
      - POSTGRES_DB=attd_db
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata: {}

networks:
  vpcbr:
    driver: bridge
    ipam:
     config:
       - subnet: 10.5.0.0/16
         gateway: 10.5.0.1
```

## License
- Licensed under [MIT](https://github.com/octajune/att-sejal/blob/main/LICENSE)

## Thank you Microsoft
I can't be more thankful to Microsoft for offering me this opportunity. I learnt a lot from the past 4 weeks.

<hr /><br />
<center>Made with ❤️ by Sejal</center>
