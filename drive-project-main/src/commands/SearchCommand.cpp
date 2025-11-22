#include "SearchCommand.h"
#include <iostream>
#include <vector>
#include <string>
#include "../compression/Compressor.h"

using namespace std;

// Constructor
SearchCommand::SearchCommand(storageManager* sm) {
    this->sm = sm;
}

void SearchCommand::execute(int argc, vector<string> argv) {
    if (argc < 2) return;

    vector<string> files = sm->listFiles();

    for (const string& fileName : files) {
        try {
            string compressedContent = sm->load(fileName);
            
            string originalContent = decompress(compressedContent);

            if (originalContent.find(searchContent) != string::npos) {
                cout << fileName << endl;
            }
        } catch (...) {
            continue;
        }
    }
}