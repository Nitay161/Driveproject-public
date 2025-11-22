#include <gtest/gtest.h>
#include <filesystem>
#include <vector>
#include "../src/storage/storageManager.h"
#include "../src/commands/AddCommand.h"
#include "../src/compression/Compressor.h"



namespace fs = std::filesystem;

class AddCommandTest : public ::testing::Test {
    protected:
        std::string testPath;
        storageManager* sm;
        AddCommand* addCmd;

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
        }

        // clean up the tests directory after tests
        void TearDown() override {
            delete sm;
            delete addCmd;
            fs::remove_all(testPath); 
        }
};

//sanity test for AddCommand execute function
TEST_F(AddCommandTest, ExecuteAddCommand){
    std::vector<std::string> arr1 = {"add", "file1.txt", "texaaaat", "anbbbbd", "moccccre"};
    std::vector<std::string> arr2 = {"add", "file2.txt", "thing", "and", "more"};

    addCmd->execute(arr1.size(), arr1);
    addCmd->execute(arr2.size(), arr2);

    EXPECT_EQ(sm->fileExists("file1.txt"), true);
    EXPECT_EQ(sm->load("file1.txt"), compress("texaaaat anbbbbd moccccre"));

    EXPECT_EQ(sm->fileExists("file2.txt"), true);
    EXPECT_EQ(sm->load("file2.txt"), compress("thing and more"));
}

//test adding a file with invalid arguments
TEST_F(AddCommandTest, ExecuteAddCommandInsufficientArgs){
    std::vector<std::string> arr1 = {"add", "file1.txt"};
    std::vector<std::string> arr2 = {"add"};

    addCmd->execute(arr1.size(), arr1);
    addCmd->execute(arr2.size(), arr2);

    EXPECT_EQ(sm->fileExists("file1.txt"), false);
    EXPECT_EQ(sm->listFiles().size(), 0);
}


int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}