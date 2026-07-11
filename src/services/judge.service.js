const axios = require('axios');

const { JUDGE0_URL, JUDGE0_AUTH_TOKEN } = require('../config/env');

const JUDGE0_API_URL = JUDGE0_URL;

class JudgeService {
  constructor() {
    const headers = { 'Content-Type': 'application/json' };
    // Authenticate to Judge0 when a token is configured (AUTHN_TOKEN in judge0.conf).
    if (JUDGE0_AUTH_TOKEN) {
      headers['X-Auth-Token'] = JUDGE0_AUTH_TOKEN;
    }
    this.api = axios.create({
      baseURL: JUDGE0_API_URL,
      headers,
    });
  }

  /**
   * Execute code against a single test case
   * @param {string} sourceCode 
   * @param {number} languageId 
   * @param {string} stdin 
   * @param {string} expectedOutput 
   * @returns {Promise<Object>} Submission result
   */
  async execute(sourceCode, languageId, stdin, expectedOutput) {
    try {
      const payload = {
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin
      };
      
      // Only include expected_output if it's not null
      if (expectedOutput !== null && expectedOutput !== undefined) {
        payload.expected_output = expectedOutput;
      }
      
      const response = await this.api.post('/submissions?base64_encoded=true&wait=true', payload);
      return response.data;
    } catch (error) {
      console.error('Judge0 execution error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  /**
   * Execute code against multiple test cases (Batch)
   * @param {Array} submissions - Array of { source_code, language_id, stdin, expected_output }
   * @returns {Promise<Array>} Array of results
   */
  async executeBatch(submissions) {
    try {
      // Judge0 Batch Submission - Loop for MVP simplicity to ensure results
      const results = [];
      for (const sub of submissions) {
        const result = await this.execute(
          Buffer.from(sub.source_code || '').toString('base64'),
          sub.language_id,
          Buffer.from(sub.stdin || '').toString('base64'),
          sub.expected_output != null
            ? Buffer.from(sub.expected_output).toString('base64')
            : null
        );
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Judge0 batch execution error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async getLanguages() {
    try {
      const response = await this.api.get('/languages');
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error.message);
      return [];
    }
  }
}

module.exports = new JudgeService();
