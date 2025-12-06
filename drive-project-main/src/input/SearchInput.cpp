#include "SearchInput.h"
#include <stdexcept>

vector<string> SearchInput::interpret(string input) {
    vector<string> args;
    // Find the first space.
    int pos = input.find(' ');
    // If no spaces then the format is wrong.
    if (pos == string::npos) {
        throw invalid_argument("400 Bad Request");
    }
    args.push_back(input.substr(0, pos));
    args.push_back(input.substr(pos + 1));
    return args;
}
