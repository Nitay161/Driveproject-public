#include <gtest/gtest.h>
#include <filesystem>
#include <sstream>
#include <iostream>
#include <vector>
#include "../src/storage/storageManager.h"
#include "../src/commands/AddCommand.h"
#include "../src/commands/GetCommand.h"
#include "../src/compression/Compressor.h"



namespace fs = std::filesystem;

class GetCommandTest : public ::testing::Test {
    protected:
        std::string testPath;
        storageManager* sm;
        AddCommand* addCmd;
        GetCommand* getCmd;

        //set up a temporary directory in the tests folder for testing
        void SetUp() override {
            testPath = "temp_test_storage";

            // clean old & create test directory
            if (fs::exists(testPath)) {
                fs::remove_all(testPath);
            }
            fs::create_directory(testPath);
            // initialize storageManager for the tests
            sm = new storageManager(testPath);
            addCmd = new AddCommand(sm);
            getCmd = new GetCommand(sm);
        }

        // clean up the tests directory after tests
        void TearDown() override {
            delete sm;
            delete addCmd;
            delete getCmd;
            fs::remove_all(testPath); 
        }
};

//sanity test for GetCommand execute function
TEST_F(GetCommandTest, ExecuteGetCommand){
    //firstly add file using AddCommand
    std::vector<std::string> arr1 = {"add", "file1.txt", "texaaaat", "anbbbbd", "moccccre"};
    addCmd->execute(arr1.size(), arr1);

    //make argv
    std::vector<std::string> arr = {"get", "file1.txt"};

    //redirect cout
    std::stringstream output;
    std::streambuf* old = std::cout.rdbuf(output.rdbuf());

    getCmd->execute(arr.size(), arr);

    //restore cout
    std::cout.rdbuf(old);

    //verify printed output
    EXPECT_EQ(output.str(), "texaaaat anbbbbd moccccre\n");
}
    
//test getting a file which doesnt exist
TEST_F(GetCommandTest, ExecuteGetCommandInsufficientArgs){
    std::vector<std::string> arr1 = {"get", "file1.txt"};

    // redirect cout
    std::stringstream output;
    std::streambuf* old = std::cout.rdbuf(output.rdbuf());

    getCmd->execute(arr1.size(), arr1);

    //restore cout
    std::cout.rdbuf(old);

    //verify printed output
    EXPECT_EQ(output.str(), "");
}


int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}