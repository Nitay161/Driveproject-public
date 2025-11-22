#include <gtest/gtest.h>
#include <filesystem>
#include "../src/storage/storageManager.h"

namespace fs = std::filesystem;

class StorageManagerTest : public ::testing::Test {
    protected:
        std::string testPath;
        storageManager* sm;

        //set up a temporary dierectory in the tests folder for testing
        void SetUp() override {
            testPath = "temp_test_storage";

            // clean old & create test directory
            if (fs::exists(testPath)) {
                fs::remove_all(testPath);
            }
            fs::create_directory(testPath);
            // initialize storageManager for the tests
            sm = new storageManager(testPath);
        }


        // clean up the tests directory after tests
        void TearDown() override {
            delete sm;
            fs::remove_all(testPath); 
        }
};


//sanity tests for save, load and fileExists functions
TEST_F(StorageManagerTest, SaveLoadExistsFile){
    std::string fileName = "testfile.txt";
    std::string testData = "awecsu4940j1jd7dmdwi002jdm3";

    sm->save(fileName, testData);
    std::string loadedData = sm->load(fileName);

    EXPECT_EQ(testData, loadedData);
    EXPECT_EQ(sm->fileExists(fileName), true);
}

//sanity test for listFiles function
TEST_F(StorageManagerTest, ListFiles){
    std::vector<std::string> filesNames = {"file1.txt", "file2.txt", "file3.txt"};
    std::string testData = "sampledata12345";

    for(std::string name : filesNames){
        sm->save(name, testData);
    }
    std::vector<std::string> listedFiles = sm->listFiles();

    EXPECT_EQ(listedFiles.size(), filesNames.size());
    EXPECT_EQ(filesNames, listedFiles);
}

//negative test for load function when file does not exist
TEST_F(StorageManagerTest, LoadNonExistentFile){
    std::string nonExistentFile = "nofile.txt";
    EXPECT_THROW(sm->load(nonExistentFile), std::invalid_argument);
}

//negative test for fileExists function when file doesnt exist
TEST_F(StorageManagerTest, FileDoesntExist){
    std::string nonExistentFile = "nofile.txt";
    EXPECT_EQ(sm->fileExists(nonExistentFile), false);
}

//negative test for listFiles function when there are no files
TEST_F(StorageManagerTest, ListFilesWhenNoFiles){
    std::vector<std::string> listedFiles = sm->listFiles();
    EXPECT_EQ(listedFiles.empty(), true);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}