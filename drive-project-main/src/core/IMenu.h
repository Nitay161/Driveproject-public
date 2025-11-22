#ifndef IMENU_H
#define IMENU_H

#include <string>
#include <map>
#include <vector>

using namespace std;

class IMenu {
    public:
        // This function gets the command from the user and return the arguments in array of strings.
        virtual vector<string> nextCommand() = 0;
        // This function displays an error.
        virtual void displayError(const char* text) = 0;
        virtual ~IMenu() {}
};

#endif