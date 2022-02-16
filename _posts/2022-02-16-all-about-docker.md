---
layout: post
title: All About Docker
# permalink: u
published: true
---

> These are my notes from TechWorld with Nana's 3-hour Docker tutorial. 

A CONTAINER is a running environment for an IMAGE. CONTAINER has a port which makes it possible to talk to it. A CONTAINER has a virtual file system.

Everything in Docker Hub are IMAGES.

Containers have names (easy to remember) and ID’s. Both can be used to reference it.

When you don’t specify a version of an image, you get the latest one.


## Commands

```bash
docker run image # start an image
docker run image:version 
docker run --net <NETWORK NAME> image # run on a docker network
docker run -e <VARIABLE NAME>=<VARIABLE VALUE> image # enviornment variables
docker run -d image # run in "detatched mode"
docker run --name cool-name redis # run with a specific name
docker run -p<HOST's PORT>:<CONTAINER's PORT> image

docker ps # show all containers (running)
docker ps -a # show all running AND not running containers

docker stop <CONTAINER ID> # stop specific container
docker start <CONTAINER ID> # restart specific container

docker images # show all locally saved images

docker rm container # delete a container
docker rmi image # delete an image

docker logs <CONTAINER ID> # view a container's logs
docker logs <CONTAINER NAME>
docker logs <CONTAINER ID> # stream the logs live
docker logs <CONTAINER ID> | tail # show just the last part of logs

docker exec -it <CONTAINER ID or CONTAINER NAME> /bin/bash # 'it' means 'interact with terminal' this allows you to use bash on as if you are inside the container's terminal. While inside here, if you execute "env", it prints all the enviornment variables so you can check if things were set correctly. Type "exit" to get out.

# ^^ NOTE: If /bin/bash throws and error, change it to /bin/sh

docker network ls # show already created docker networks
docker network create <NETWORK NAME>

docker-compose -f my_file_name.yaml up # "-f" specifies the file and "up" tells docker to start all the containers in the file
docker-compose -f my_file_name.yaml down # stops all containers in this file.
```

## Ports

To deal with ports, you need to create a binding between the docker port and your laptop’s (or any host’s) ports. You can use the same ports in separate containers but you cannot bind them to the same host port while they’re both running.

You specify the binding of the ports during the run command, like so:
`docker run -p<HOST's PORT>:<CONTAINER's PORT> image`

Example:
`docker run -p6000:6379 redis`


## Docker run v. Docker start

Docker run creates a new container with any attributes you specify and from a specific image.
Docker start restarts a stopped container with all its previous attributes.

## Docker Network

Docker creates an isolated docker network where the containers live. If you deploy two containers in the same docker network, they can talk to each other with just their name. No need for localhost or port numbers. This is because they are in the same network.

Applications outside of the docker network are going to connect to containers within the network using localhost and a port number.

`docker network ls # show already created docker networks`
`docker network create <NETWORK NAME>`


## Local Developing with Containers

Let’s say you are developing an application and need a database. You can just pull a mongodb image and start a container.

`docker pull mongo # get the mongodb image from docker hub`
`docker pull mongo-express # just a UI for the database`

Next step is to create the network where our images will run:
`docker network create mongo-network`

Run our images. We should include some environmental variables to configure some aspects.
```bash
docker run -d \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=password \
--name mongodb \
--net mongo-network \
mongo
```

Let’s now start mongo-express for our UI.
```bash
docker run -d \
-p 8081:8081 \
-e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \ # we set this above
-e ME_CONFIG_MONGODB_ADMINPASSWORD=password \ # we set this above
-e ME_CONFIG_MONGODB_SERVER=mongodb \ # this is the container name
—net mongo-network \
—name mongo-express \
mongo-express
```

To see what’s going on, you can log the mongo-express’s logs:
`docker log <CONTAINER ID>`

Now, if you go to localhost:8081 on your computer, you will see the mongo-express UI. You can create new databases her and interact with things.

Now that your database is up and running, you, naturally, will want to connect it to some application you have. The way to do this is to use the URI of the database: `mongodb://admin:password@localhost:27017`.


## Docker Compose

Typing all these run commands is super tedious. With a compose file, we can take the whole run command with all its configuration, and put it in a file. 

Here is a docker compose file for the previous mongodb example:

*Mongo-docker-compose.yaml*
```yml
version: '3'
services: # list the containers you want to create
    mongodb: # name of container
        image: mongo # name of image
        ports: 
            - 27017:27017
        enviornment: # enviornment variables
            - MONGO_INITDB_ROOT_USERNAME=admin
            - MONGO_INITDB_ROOT_PASSWORD=password

    mongo-express:
        image: mongo-express
        ports:
            - 8081:8081
        enviornment:
            ME_CONFIG_MONGODB_ADMINUSERNAME=admin
            ME_CONFIG_MONGODB_ADMINPASSWORD=password
            ME_CONFIG_MONGODB_SERVER=mongodb 
```

Notice, the network is not specified in the above file^. Docker compose takes care of setting up the network in the background and you can just reference the different containers within this network by their names. In this case mongodb and mongo-express.

The docker compose file is saved as part of the project’s code.

How do you start the docker compose file?
```bash
docker-compose -f my_file_name.yaml up # "-f" specifies the file and "up" tells docker to start all the containers in the file
```

If you scroll through the output this creates, you can see a place where it says “Creating network ‘….’”. This is the name of the network it has created.

If you now want to stop all the containers in the docker compose file, run this:
```bash
docker-compose -f my_file_name.yaml down # stops all containers in this file
```


## Dockerfile

Now that you have built an application, you need to package that very application to be deployable with docker.

When **Jenkins** builds your application, it packages it into a docker image and pushes it to a docker repository. 

A *Dockerfile* is a blueprint for creating docker images. 
**Note**: The file is always named “Dockerfile”.

Here is an abstracted general Dockerfile:
```Dockerfile
FROM <image> # start with some image so you don't have to install manually linux

ENV <ENV_VAR_NAME>=<ENV_VAR_VALUE> <ANOTHER_ENV_VAR_NAME>=<ANOTHER_ENV_VAR_VALUE> # you can do these enviornment variables here or, more preferably, in a Docker compose file. It's easier to change them there.

RUN <ANY LINUX COMMAND> # this can execute any linux command INSIDE of the container

COPY <SOURCE FILE/FOLDER> <TARGET FILE/FOLDER> # this copies files from the host computer to a location on the container's system

CMD ["command", "to", "execute"] # This command is the entrypoint into the application. It works the same way RUN does but you can only have one CMD. See example below.
```

Here is a practical example of the above generalized Dockerfile:
```Dockerfile
FROM node # you can also specify the version 'node:13-alpine'

ENV a=1 \
    b=2

RUN mkdir -p /home/app # this creates a new app folder in the CONTAINER's file system

COPY . /home/app # copy all files to the "/home/app" location on the CONTAINER's file system

# FYI. There is another command like CMD but you can use it multiple times: `ENTRYPOINT ["brew"]`

CMD ["node", "/home/app/server.js"] # This entrypoint command starts the nodejs server in this specific example
```

To actually build the image, you need to run this command.
```docker build -t <IMAGE_NAME>:<VERSION> <DIRECTORY OF DOCKERFILE>```

Practical example:
```bash
docker build -t my-app:1.0 . # I used "." as the directory because the Dockerfile is in the current working directory
```

^If you run this on your computer and then execute “docker images” you will see an image named my-app with a tag of “1.0”.

**Note**: WHENEVER you adjust a Dockerfile, you have to rebuild the image.

What Jenkins does is it takes this Dockerfile and creates an image from it.

We can interact with this file from our terminal.
`docker run my-app:1.0`

Remember you can see the running container with `docker ps`, you can see the logs with `docker logs <ID>`.
And, you can interact with the running container’s terminal with:
`docker exec -it <ID> /bin/sh`

In the Dockerfile, we copied many files that we don’t actually need into the image. The solution is to create an “app” directory inside of your project and instead of copying the whole directory (COPY . /home/app), you JUST copy the contents of the app folder (COPY ./app /home/app).

Flow process to **build** and run: Build an image —> run an image 
To **rebuilt** an image: Delete containers that use image —> delete image —> rebuild

If you have a huge app, you’d want to compress the code and package it into an artifact before making the image.


## Creating Private Repositories

On AWS you use an ECR (Elastic Container Registry)
You will need to log in to docker and AWS and then push your image to the foreign repository.

Image naming in Docker registries: `registryDomain/imageName:tag`
The reason we don’t have to use this full image name when pulling from docker hub is because it shortens it for us. 

When pushing the image up, this is how it looks:
`docker push registryDomain/imageName:tag`

Here’s the flow chart for when you change the code: Build the new image with new tag name —> do the “docker tag image” command —> docker push to the foreign repository.

^^Usually all of the above, Jenkins would do, FYI. That means Jenkins would need your docker or other private repo credentials. Jenkins will also deal with tagging your image.


## Deploying Your App

You need to tell your docker compose file how to connect to the actual app to the services. Here’s how the new docker compose file looks (from the previous example). Please note that you don’t have to specify the registry domain with the mongo and mongo-express images because they reside on docker hub. I’m generalizing the image of your app to be on any private registry. Of course, if you host it on docker hub, you can forgo the registryDomain part of the my-app image name.

*Mongo-docker-compose-UPDATED.yaml*
```yml
version: '3'
services: 
    my-app:
        image: registryDomain/imageName:tag
        ports:
            - 3000:3000 # the container is listening on 3000
    mongodb: 
        image: mongo
        ports: 
            - 27017:27017
        enviornment: 
            - MONGO_INITDB_ROOT_USERNAME=admin
            - MONGO_INITDB_ROOT_PASSWORD=password

    mongo-express:
        image: mongo-express
        ports:
            - 8081:8081
        enviornment:
            ME_CONFIG_MONGODB_ADMINUSERNAME=admin
            ME_CONFIG_MONGODB_ADMINPASSWORD=password
            ME_CONFIG_MONGODB_SERVER=mongodb 
```


Okay, here’s where docker blows your mind. Because you set up the containers with names in the docker compose file, they are set up in a special network. Instead of referencing the mongodb URI in our code like this: `mongodb://admin:password@localhost:27017`, we can do this: `mongodb://admin:password@mongodb`. Docker has set up a network where we can reference the mongodb container by the name we gave it, “mongodb”, and we don’t even have to specify the port because we specified it inside of the docker compose file. Crazy!!


## Docker Volumes

Volumes are used for data persistence in docker containers.
A container has a virtual file system where data is stored, but if you restart a container, the data is gone and it starts fresh. How do we save changes?

This is where docker volumes come up. We plug the physical file system path into the container’s file system path. When a container writes to its file system it gets replicated on the host and vice versa. 

Usually, you create volumes on the run command:
`docker run -v hostFolder:containersFolder`

Or, what you should be using in production are named volumes:
`docker run -v MYNAME:/var/lib/mysql/data`

This is how it would look in a docker compose file:

*Mongo-docker-compose-DB.yaml*
```yml
version: '3'
services: 
    my-app:
        image: registryDomain/imageName:tag
        ports:
            - 3000:3000 # the container is listening on 3000
    mongodb: 
        image: mongo
        ports: 
            - 27017:27017
        volumes:
            - db-data:/var/lib/mysql/data
        enviornment: 
            - MONGO_INITDB_ROOT_USERNAME=admin
            - MONGO_INITDB_ROOT_PASSWORD=password

    mongo-express:
        image: mongo-express
        ports:
            - 8081:8081
        enviornment:
            ME_CONFIG_MONGODB_ADMINUSERNAME=admin
            ME_CONFIG_MONGODB_ADMINPASSWORD=password
            ME_CONFIG_MONGODB_SERVER=mongodb 
volumes:
    db-data
```



That’s it! The basics of Docker! 🥳
