#include "IMenu.h"
#include <iostream>
#include <string>
#include <sstream>
#include <vector>

using namespace std;

class CLIMenu : public IMenu {
    public:
        CLIMenu() {}
        // This function gets the command from the user and return the arguments in array of strings.
        vector<string> nextCommand() {
            // Get input from user.
            string input;
            getline(cin, input);

            // Split it by spaces into a vector<string>.
            vector<string> tokens;
            stringstream stst(input);
            string token;
            while (stst >> token) {
                tokens.push_back(token);
            }
            return tokens;
        }
        // This function displays an error. For the CLI menu it just ignores the error.
        void displayError(const char* text) {
            return;
        }
};
