import { ref } from 'vue';
import { getTaskStatusApi } from '@/api/tasks';

/**
 * Composable to poll a task until it completes or fails.
 * @returns {Object} - Polling state and start function.
 */
export function useTaskPolling() {
    const isProcessing = ref(false);
    const taskStatus = ref(null); // 'pending', 'processing', 'completed', 'failed'
    const taskResult = ref(null);
    const taskError = ref(null);
    const progress = ref(0);

    let pollInterval = null;

    const startPolling = async (taskId, options = { interval: 10000, maxRetries: 100 }) => {
        isProcessing.value = true;
        taskStatus.value = 'pending';
        taskResult.value = null;
        taskError.value = null;
        progress.value = 0;

        return new Promise((resolve, reject) => {
            pollInterval = setInterval(async () => {
                try {
                    const task = await getTaskStatusApi(taskId);
                    taskStatus.value = task.status;
                    progress.value = task.progress || 0;

                    if (task.status === 'completed') {
                        clearInterval(pollInterval);
                        taskResult.value = task.result;
                        isProcessing.value = false;
                        resolve(task.result);
                    } else if (task.status === 'failed') {
                        clearInterval(pollInterval);
                        taskError.value = task.error || 'Task failed';
                        isProcessing.value = false;
                        reject(new Error(task.error || 'Task failed'));
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                    // We don't stop on single API error, might be network glitch
                }
            }, options.interval);
        });
    };

    const stopPolling = () => {
        if (pollInterval) {
            clearInterval(pollInterval);
            isProcessing.value = false;
        }
    };

    return {
        isProcessing,
        taskStatus,
        taskResult,
        taskError,
        progress,
        startPolling,
        stopPolling
    };
}
