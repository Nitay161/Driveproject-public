#include "tcp_server.h"
#include "ThreadPerClientDispatcher.h"
#include "../storage/ConstStorageDispatcher.h"
#include "../storage/storageManager.h"
#include "ThreadPoolDispatcher.h"
#include <iostream>

int main(int argc, char** argv) {

    int port;
    
    if (argc == 2) { //port provided as argument
        try {
            port = std::stoi(argv[1]);
        } catch (...) {
            std::cerr << "Invalid port argument. Using default 12345.\n";
            return 1;
        }
    }

    //read storage path environment variable
    const char* envPath = getenv("DRIVE_STORAGE_PATH");
    if (!envPath) {
        cerr << "Error: Environment variable DRIVE_STORAGE_PATH not set." << endl;
        return 1;
    }

    //read thread pool size environment variable
    const char* envPoolSize = getenv("THREAD_POOL_SIZE");
    if (!envPoolSize) {
        cerr << "Error: Environment variable THREAD_POOL_SIZE not set." << endl;
        return 1;
    }
    int poolSize = std::stoi(envPoolSize);


    //create storage manager instance with the retrieved path
    storageManager* globalSm = new storageManager(string(envPath));

    // Create the dispatchers
    IClientDispatcher* clientDispatcher = new ThreadPoolDispatcher(poolSize);
    IStorageDispatcher* storageDispatcher = new ConstStorageDispatcher(globalSm);

    // Create and run server
    TCPServer server(port, clientDispatcher, storageDispatcher);

    try {
        server.start();   // blocking call, infinite loop
    }
    catch (...) {
        std::cerr << "Server crashed unexpectedly.\n";
    }

    // If start() ever returns (normally it never does)
    delete clientDispatcher;
    delete storageDispatcher;

    return 0;
}
