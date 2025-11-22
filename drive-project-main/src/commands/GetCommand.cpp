#include "ICommand.h"
#include <vector>
#include <string>
#include <iostream>
#include "../storage/storageManager.h"
#include "GetCommand.h"
#include "../compression/Compressor.h"

using namespace std;

// constructor
GetCommand::GetCommand(storageManager* sm) {
    this->sm = sm;
}

// execute method - this function gets arguments for the command to execute and executes it.
void GetCommand::execute(int argc, vector<string> argv) {
    if (argc != 2) return;

    string fileName = argv[1];
    if (!sm->fileExists(fileName)) return;
    
    string content = decompress(sm->load(fileName));
    cout << content << endl;
}
