#include "ThreadPoolDispatcher.h"

using namespace std;

//constructor
ThreadPoolDispatcher::ThreadPoolDispatcher(int poolSize) : poolSize(poolSize) {
    for (int i = 0; i < this->poolSize; ++i) {
        threadPool.emplace_back(&ThreadPoolDispatcher::worker, this);
    }
}

void ThreadPoolDispatcher::clientDispatch(ClientHandler* handler) {
    if (handler == nullptr) {
        return;
    }

    {
        lock_guard<mutex> lock(queueMutex);
        taskQueue.push(handler);
    }
    queueCondition.notify_one(); // Notify one worker thread
}

void ThreadPoolDispatcher::worker() {
    while (true) {
        ClientHandler* handler = nullptr;
        {
            unique_lock<mutex> lock(queueMutex);
            queueCondition.wait(lock, [this] { return !taskQueue.empty() || quit; });

            if (quit && taskQueue.empty()) {
                return; // Exit the thread
            }
            if (taskQueue.empty()) {
                continue;
            }

            handler = taskQueue.front();
            taskQueue.pop();
        }
        handler->handle();
        delete handler;
    }
}

ThreadPoolDispatcher::~ThreadPoolDispatcher() {
    end(); // Signal all threads to stop
    for (auto& thread : threadPool) {
        if (thread.joinable()) {
            thread.join();
        }
    }
}

void ThreadPoolDispatcher::end() {
    quit = true;
    queueCondition.notify_all(); // Wake up all worker threads to exit
}