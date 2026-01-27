#ifndef THREADPOOLDISPATCHER_H
#define THREADPOOLDISPATCHER_H

#include "IClientDispatcher.h"
#include "ClientHandler.h"
#include <vector>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <atomic>

class ThreadPoolDispatcher : public IClientDispatcher {
    private:
        std::vector<std::thread> threadPool;
        const int poolSize;
        std::queue<ClientHandler*> taskQueue;
        std::mutex queueMutex;
        std::condition_variable queueCondition;
        std::atomic<bool> quit{false};

    public:
        //constructor
        ThreadPoolDispatcher(int poolSize);
        void clientDispatch(ClientHandler* handler) override ;
        void worker();
        ~ThreadPoolDispatcher();
        void end();
};

#endif  // THREADPOOLDISPATCHER_H