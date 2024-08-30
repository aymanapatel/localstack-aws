# Localstack - Run AWS Locally


[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/aymanapatel/localstack-aws)



## Running

1. Method 1: Use the Gitpod button to open Gitpod instance with Localstack Docker images installed for your Gitpod account.

2. Method 2: Local docker
    - Step 1: Install Docker locally (or its equivalent like Podman/Colima etc)
    - Step 2: Run [`init.sh`](./bin/init.sh) to pull docker images.
    - Step 3: Run [`start.sh`](./bin/start.sh) to run Localstack using the Docker images downloaded in previous step.
