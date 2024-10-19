# api-message

## Description
> KP-Medicals 프로젝트의 메인 API 애플리케이션에 통합되어있던 메시징(sms, notification) API를 분리하며 기존 사용하던 프레임워크인 Express에서 NestJS로 Migration하는 프로젝트입니다.
> 
> This project involves separating the messaging API, which was integrated into the main API application of the KP-Medicals project, and migrating from the previously used framework, Express, to NestJS.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Env Settings](#env-settings)
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

# SET .env & .env.development (detail at the bottom)
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

## Env Settings
- .env
    ```
    # Server Settings
    ABORT_ON_ERROR=false
    NODE_ENV=development # development staging production

    # logging
    LOG_DIR=logs
    ```
- .env.development
    ```
    # JWT
    ISSUER=api-auth-development # jwt iss claim for development
    MW=Medical_Wallet # jwt aud claim for Medical Wallet Service
    CC=Chain_Chart # jwt aud clain for Chain Chart Service
    EX_ACCESS=<period> # Access token expiration period
    EX_REFRESH=<period> # Refresh token expiration period
    EX_REGISTER=<period> # Tokens(account, mobile) for register expiration period
    EX_MOBILE_VERIFY=3m # Token for verify mobile number

    # Message Service
    MESSAGE_API_KEY=<create your own key>

    # 네이버 클라우드 플랫폼 SMS [url, service_id, access_key, secret_key]
    NAVER_SMS_URL=<API URL>
    NAVER_SMS_ID=<NCP service ID>
    NAVER_SMS_ACCESS=<NCP access key>
    NAVER_SMS_SECRET=<NCP seceret key>
    SENDER_PHONE=<message sender mobile number>
    ```

## Contact
Information on how to contact the project maintainers or contributors.

- **Name**: Hun
- **Email**: hun.kim.dev@gmail.com
- **GitHub**: [hun-meta](https://github.com/hun-meta)
