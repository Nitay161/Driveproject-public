cmake_minimum_required(VERSION 3.10)

project(DriveProject)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTestsAdd
    tests/AddCommandTests.cpp
    src/storage/storageManager.cpp
    src/commands/AddCommand.cpp
    src/compression/Compressor.cpp
)
add_executable(runTestsGet
    tests/GetCommandTests.cpp
    src/storage/storageManager.cpp
    src/commands/AddCommand.cpp
    src/commands/GetCommand.cpp
    src/compression/Compressor.cpp
)
add_executable(runTestsCompressor
    tests/CompressorTests.cpp
    src/compression/Compressor.cpp
)
add_executable(runTestsStorage
    tests/StorageManagerTests.cpp
    src/storage/storageManager.cpp
)

target_link_libraries(runTestsAdd gtest_main)
target_link_libraries(runTestsGet gtest_main)
target_link_libraries(runTestsCompressor gtest_main)
target_link_libraries(runTestsStorage gtest_main)