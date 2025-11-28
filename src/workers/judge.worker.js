// Placeholder for Judge Worker
// This worker would process submissions from the queue.

const processSubmission = async (job) => {
    console.log('Processing submission:', job);
    // TODO: Move judgeService.executeBatch logic here when using queues
};

module.exports = {
    processSubmission
};
