FROM gcc:latest

COPY . /usr/src/projectapp
WORKDIR /usr/src/projectapp

RUN g++ -o projectapp src/core/main.cpp src/core/App.cpp src/core/CLIMenu.cpp

CMD ["./projectapp"]