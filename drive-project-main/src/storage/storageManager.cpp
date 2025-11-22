#include "storageManager.h"
#include <fstream>
#include <filesystem>
#include <vector>
#include <cstdio>

using namespace std;
namespace fs = std::filesystem;



//constructor
storageManager::storageManager(string path) {
    storagePath = path;
}

//returns the full path
string storageManager::getFullPath(string fileName) {
    return storagePath + "/" + fileName;
}

//checks if a file exists
bool storageManager::fileExists(string fileName){
    return fs::exists(getFullPath(fileName));
}

//create file and saves data to it
void storageManager::save(string fileName, string data) {
    //if the file already exists then return an error
    if (fileExists(fileName)) { 
        throw invalid_argument("File already exists");
    }

    ofstream outFile(getFullPath(fileName));
    outFile << data;
    outFile.close();
}

//loads data from a file
string storageManager::load(string fileName){

    if (!fileExists(fileName)) { 
        throw invalid_argument("File does not exist");
    }
    
    string data;
    ifstream inFile(getFullPath(fileName));
    if (!inFile) {
        perror("Failed to open file");
        return "";
    }
    getline(inFile, data, '\0'); //reads the whole file

    return data;
}


//lists all files in the storage path
vector<string> storageManager::listFiles() {
    vector<string> files;
    for (fs::directory_entry entry : fs::directory_iterator(storagePath)) {
        files.push_back(entry.path().filename().string());
    }
    return files;
}