#include "CppClient.h"

using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        perror("Not enough arguments!");
        return 0;
    }

    // Getting server ip and port from command line arguments.
    const char* ip_address = argv[1];
    const int port_no = stoi(argv[2]);

    // Creating socket.
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("Error creating socket!");
        return 0;
    }

    // Connecting the socket to the server.
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port_no);

    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("Error connecting to server!");
        return 0;
    }

    while(true) {
        // Getting input from user.
        string input;
        getline(cin, input);
        int len = strlen(input.c_str());
        // Sending to the server.
        int sent_bytes;
        sendInput(sock, input.c_str(), len, &sent_bytes);
        if (sent_bytes < 0) {
            perror("Error sending input!");
        }

        // Reciving output.
        char buffer[4096];
        int expected_data_len = sizeof(buffer);
        int recived_bytes;
        reciveOutput(sock, buffer, expected_data_len, &recived_bytes);

        if (recived_bytes == 0) {
            perror("Connection closed!");
        }
        else if (recived_bytes < 0) {
            perror("Error reading output!");
        }
        else {
            // Printing output from server.
            cout << buffer << endl;
        }
    }
}