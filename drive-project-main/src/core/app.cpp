#include "commands/ICommand.h"
#include "IMenu.h"
#include <string>
#include <map>
#include <vector>
#include <iostream>

using namespace std;

class App {
    private:
        IMenu* menu;
        map<string, ICommand*> commands;
    public:
        App(IMenu* menu, map<string, ICommand*> commands) : menu(menu), commands(commands) {}

        void run() {
            while (true) {
                vector<string> argv = menu->nextCommand();
                try {
                    //commands[argv[0]]->execute(argv.size(), argv);
                }
                catch(...){
                    menu->displayError("Sorry, no can do");
                }
            }
        }
};
