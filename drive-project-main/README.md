# drive-project-
# Project Setup:
The app starts with the main function that make instances of all the commands and the CLIMenu and run the App with them.

The App class has run function which is being called by the main.
The run function is an infinite loop that calls the nextCommand() function of the IMenu and gets the arguments from the user (in the CLIMenu the user input is from the CLI).
The it tries to run a command from the command map with those arguments.
If it finds the command it calls the execute function with the arguments.
If it fails to execute or such a command does not exist it calls the displayError function (in the CLIMenu it does nothing).
This loop is being repeated forever.

ICommand.h is the interface for the command design pattern that is being implemented by each command.

IMenu.h is the interface for all the types of menues that will be supported. For now it is only implemented by CLIMenu.

CLIMenu is the IMenu for getting user input from the CLI. The nextCommand function reads the user input and seperates it by spaces to get all the arguments for the coommand.

the sub-directory "core" of "src" (src/core) contains all code related to running the app (for example: all menu related, app.cpp, main.cpp ...).

the sub-directory "commands" of "src" (src/commands) contains all command related code (for example: ICommand,addCommand, getCommand ...).

the sub-directory "compression" of "src" (src/compression) contains all compression related code.

the sub-directory "storage" of "src" (src/storage) contains all code related to handling all file operations like saving and creating new file, extracting data out of file... (should be used by the commands like add , get ...).

the class storageManager is responsible for all file related operation in the program, manage a directory where all compressed files are stored.
the load function extract the data from a given file path
the save function creates a file named fileName and write the received data in it
the listFiles function list all files in the storage path and return them as a vector of strings
and the fileExists function checks if a file named fileName exists in the storage path

# Compressor

This RLE compressor have compress and decompress methods to perform the RLE compression.

CompressorTests are tests for this compressor.

The Dockerfile and CMakeLists.txt are necessary to build and run the tests.

# Dockerfiles

You can run all the test files by typing 'docker build -f Dockerfile.tests -t  [some-image-name] .' and then run it with
'docker run [some-image-name]'.
