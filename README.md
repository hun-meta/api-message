# api-auth

## Description
> KP-Medicals 프로젝트의 메인 API 애플리케이션에 통합되어있던 메시징(sms) API를 분리하며 기존 사용하던 프레임워크인 Express에서 NestJS로 Migration하는 프로젝트입니다.
> 
> This project involves separating the messaging API, which was integrated into the main API application of the KP-Medicals project, and migrating from the previously used framework, Express, to NestJS.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## Installation
프로젝트 설치 및 설정 방법입니다.

Instructions on how to install and set up the project. Include any prerequisites.
Need docker, docker-compose

```bash
# Clone the repository
git clone git@github.com:hun-meta/api-message.git

# Navigate into the directory
cd api-message

# set env
export SERVER_PLATFORM=<your platform>
# ex. export SERVER_PLATFORM=linux/amd64

# SET .env & .env.development
vi .env
vi .env.development

# install Make utility
sudo apt update
sudo apt install build-essential

# change branch to dev
git checkout dev

# docker image build 
make build-development
```

## Usage
Information on how to use the project, including examples and code snippets.

```bash
# run project
make start-development

# stop project
make stop-development

# stop & delete volume of project
make delete-development
```

## Contact
Information on how to contact the project maintainers or contributors.

- **Name**: Hun
- **Email**: hun.kim.dev@gmail.com
- **GitHub**: [hun-meta](https://github.com/hun-meta)
