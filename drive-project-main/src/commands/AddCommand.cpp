#include "ICommand.h"
#include <vector>
#include <string>
#include <iostream>
#include "../storage/storageManager.h"
#include "AddCommand.h"
#include "../compression/Compressor.h"

// constructor
AddCommand::AddCommand(storageManager* sm) {
    this->sm = sm;
}

// execute method - this function gets arguments for the command to execute and executes it.
void AddCommand::execute(int argc, std::vector<std::string> argv) {
    if (argc < 3) return;

    std::string name = argv[1];
    std::string text;

    for (int i = 2; i < argc; i++) {
        text += argv[i];
        if (i < argc - 1) text += " ";
    }

    sm->save(name, compress(text));
}