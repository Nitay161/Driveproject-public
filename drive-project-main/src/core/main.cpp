#include <string>
#include <map>
#include <limits>
#include <cstdlib>
#include "commands/ICommand.h"
#include "commands/AddCommand.h"
#include "commands/GetCommand.h"
#include "commands/SearchCommand.h"
#include "IMenu.h"
#include "App.cpp"
#include "CLIMenu.cpp"
#include "storage/storageManager.h"

using namespace std;

int main() {    

    //read environment variable
    const char* envPath = getenv("DRIVE_STORAGE_PATH");
    if (!envPath) {
        cerr << "Error: Environment variable DRIVE_STORAGE_PATH not set." << endl;
        return 1;
    }

    //create storage manager instance with the retrieved path
    storageManager* sm = new storageManager(string(envPath));

    // Map of all the commands that can be executed.
    map<string, ICommand*> commands;

    // Add instances of the implemented commands here to the map.
    // The key for the commands should be their exact names.
    ICommand* addCommand = new AddCommand(sm);
    commands["add"] = addCommand;
    ICommand* getCommand = new GetCommand(sm);
    commands["get"] = getCommand;
    ICommand* searchCommand = new SearchCommand(sm);
    commands["search"] = searchCommand;


    // The menu that will get input from the CLI.
    IMenu* menu = new CLIMenu();

    // Creating App instance and running the app.
    App app1(menu, commands);
    app1.run();

    // Delete all the instances of commands here to free the memory.
    delete addCommand;
    delete getCommand;
    delete searchCommand;

    return 0;
}