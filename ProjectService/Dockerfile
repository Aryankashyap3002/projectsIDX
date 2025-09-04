FROM ubuntu:24.04

RUN useradd -ms /bin/bash sandbox

WORKDIR /home/sandbox

RUN apt update && apt upgrade -y

RUN apt install nano curl -y

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
RUN /bin/bash -c "source ~/.nvm/nvm.sh && nvm install 22 && nvm use 22"

RUN echo "PS1='\w '" >> /home/sandbox/.bashrc

WORKDIR /home/sandbox/app